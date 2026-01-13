require('dotenv').config();
const apiKey = process.env.YOUTUBE_API_KEY;
const express = require('express');
const cors = require('cors');
const db = require('./db');


const CONFIG = {
    SEARCH_CACHE_SIZE: 20,
    MINIMUM_DURATION: 180,
    VIDEOS_PER_TOPIC: 5,
    MAX_TOPICS: 10

}

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Server is running');
});

function parseDuration(duration) {
    if (!duration) return 0;

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);


    if (!match) return 0;

    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return (hours * 3600) + (minutes * 60) + seconds;
}

const axios = require('axios');

async function searchYouTube(topic) {
    // search call
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${CONFIG.SEARCH_CACHE_SIZE}&q=${topic}&type=video&key=${apiKey}`;
    const searchResponse = await axios.get(searchUrl);
    if (searchResponse.data.items.length === 0) {
        return [];
    }
    // extract video ids
    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

    // extra call for details not in search (list)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
    const detailsResponse = await axios.get(detailsUrl);

    // map & filter
    const validVideos = detailsResponse.data.items.map(item => {
        const durationSec = parseDuration(item.contentDetails.duration);

        return {
            title: item.snippet.title,
            videoId: item.id,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            durationSeconds: durationSec,
            viewCount: parseInt(item.statistics.viewCount) || 0,
            likeCount: parseInt(item.statistics.likeCount) || 0
        };
    })
        .filter(video => video.durationSeconds > CONFIG.MINIMUM_DURATION); // keep only videos longer than this many seconds

    // return only the top n videos (top VIDEOS_PER_TOPIC videos)
    return validVideos.slice(0, CONFIG.VIDEOS_PER_TOPIC);
}
async function saveVideosToDB(videos) {
    for (const video of videos) {
        const query = `
      INSERT INTO videos (youtube_id, title, thumbnail_url, channel_title, duration_seconds, view_count, like_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (youtube_id) DO UPDATE SET
        view_count = EXCLUDED.view_count,
        like_count = EXCLUDED.like_count;
    `;

        const values = [
            video.videoId,
            video.title,
            video.thumbnail,
            video.channelTitle,
            video.durationSeconds,
            video.viewCount,
            video.likeCount
        ];

        try {
            await db.query(query, values);
        } catch (err) {
            console.error("Error saving video:", video.title, err.message);
        }
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/api/generate-playlist', async (req, res) => {

    const rawTopics = req.body.topics;

    if (rawTopics.length > CONFIG.MAX_TOPICS) {
        return res.status(400).json({
            error: `Too many topics! Max allowed is ${CONFIG.MAX_TOPICS}`
        });
    }

    console.log("Received:", rawTopics);

    let upperTopics = [];
    for (let i = 0; i < rawTopics.length; i++) {
        upperTopics.push(rawTopics[i].toUpperCase());
    }
    const cleanedTopics = [...new Set(upperTopics)];

    console.log(cleanedTopics);
    try {
        console.log("Fetching videos for:", cleanedTopics);

        const promiseList = cleanedTopics.map(topic => searchYouTube(topic));
        const results = await Promise.all(promiseList);

        const allVideos = results.flat();
        console.log(`Caching ${allVideos.length} videos to database...`);
        await saveVideosToDB(allVideos);
        console.log("Cache Complete");
        const responseData = cleanedTopics.map((topic, index) => ({
            topic: topic,
            candidates: results[index] 
        }));

        res.json(responseData);

    } catch (error) {
        console.error("Error fetching from YouTube:", error.message);
        res.status(500).json({ error: "Failed to fetch videos" });
    }


});
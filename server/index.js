require('dotenv').config();
const apiKey = process.env.YOUTUBE_API_KEY;
const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Server is running');
});


const axios = require('axios');

async function searchYouTube(topic) {

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${topic}&type=video&key=${apiKey}`;
  
  const response = await axios.get(url);
  

  return response.data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    thumbnail: item.snippet.thumbnails.high.url
  }));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/api/generate-playlist', async (req, res) => {

    const rawTopics = req.body.topics;
    console.log("Received:", rawTopics);
    
    let upperTopics = [];
    for(let i = 0; i<rawTopics.length;i++){
    upperTopics.push(rawTopics[i].toUpperCase());
    }
    const cleanedTopics = [...new Set(upperTopics)];
    
    console.log(cleanedTopics);
    try {
        console.log("Fetching videos for:", cleanedTopics);

        const promiseList = cleanedTopics.map(topic => searchYouTube(topic));

        const results = await Promise.all(promiseList);


        const finalPlaylist = results.flat();

        res.json(finalPlaylist);

    } catch (error) {
        console.error("Error fetching from YouTube:", error.message);
        res.status(500).json({ error: "Failed to fetch videos" });
    }

    
    });
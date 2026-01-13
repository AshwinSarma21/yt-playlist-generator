const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;

};
const formatViews = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
};

function VideoCard({ video }) {
    return (
        <div className="video-card">
            <div className="thumbnail-container">
                <img src={video.thumbnail} alt={video.title} />
                <span className="duration-badge">{formatTime(video.durationSeconds)}</span>
            </div>

            <div className="video-info">
                <h3>
                    <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                        {video.title}
                    </a>
                </h3>
                <p className="channel-name">{video.channelTitle}</p>
                <div className="meta-data">
                    <span>Views {formatViews(video.viewCount)}</span>
                    <span>Likes {formatViews(video.likeCount)}</span>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
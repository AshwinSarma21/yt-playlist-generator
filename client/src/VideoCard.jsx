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

function VideoCard({
    topicLabel,
    video,
    currentIndex,
    totalCandidates,
    isLocked,
    onNext,
    onPrevious,
    onToggleLock,
}) {
    return (
        <div className="video-card">
            <div className="thumbnail-container">
                <img src={video.thumbnail} alt={video.title} />
                <span className="duration-badge">{formatTime(video.durationSeconds)}</span>
            </div>

            <div className="video-info">
                <div className="video-card-header">
                    <div className="topic-pill">Topic: {topicLabel}</div>
                    <div className="card-state-row">
                        <span className="selection-count">
                            {currentIndex + 1} of {totalCandidates}
                        </span>
                        <button className={`lock-btn ${isLocked ? 'locked' : ''}`} onClick={onToggleLock}>
                            {isLocked ? 'Locked' : 'Unlocked'}
                        </button>
                    </div>
                </div>

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

                <div className="card-controls">
                    <button className="nav-btn" onClick={onPrevious} disabled={isLocked}>
                        Previous
                    </button>
                    <button className="nav-btn" onClick={onNext} disabled={isLocked}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
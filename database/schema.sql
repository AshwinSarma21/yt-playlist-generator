-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Videos Table
CREATE TABLE videos (
    youtube_id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INT NOT NULL,
    channel_title VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Playlists Table
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    topic VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Playlist_Videos (The Junction Table)
CREATE TABLE playlist_videos (
    playlist_id INT REFERENCES playlists(id) ON DELETE CASCADE,
    video_id VARCHAR(20) REFERENCES videos(youtube_id),
    position INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (playlist_id, video_id)
);
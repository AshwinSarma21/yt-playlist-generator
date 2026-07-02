import { useState } from 'react';
import logoReact from './assets/react.svg';
import VideoCard from './VideoCard';
import './App.css';

//covert seconds to a readable time
const formatTotalTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const formatTopicLabel = (topic) => {
  return topic
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const normalizeVideos = (groups) => {
  return groups.map((group) => ({
    ...group,
    selectedIndex: 0,
    isLocked: false,
  }));
};


// main app function 
function App() {
  const [textInput, setTextInput] = useState(""); //for handling user text input
  const [videos, setVideos] = useState([]); // to handle videos retreived from the back end
  const [splitByComma, setSplitByComma] = useState(true);//sanitizing user text input
  const [loading, setLoading] = useState(false); //to handle loading of the generate button 

  async function handleGenerate() { //handles the generation of videos
    setLoading(true); //sets button to loading
    try {
      const splitPattern = splitByComma ? /[,\n]+/ : /\n+/;
      const topicsArray = textInput
        .split(splitPattern)
        .map(topic => topic.trim())
        .filter(topic => topic !== "");
      console.log(topicsArray);   // splits user input into individual topics by new lines or commas 
      // stores each topic as an item in an array

      const response = await fetch('http://localhost:3000/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics: topicsArray }),
      }); //sends list of topics to backend as a JSON using POST


      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      } // if backend sends error report error

      const data = await response.json();
      setVideos(normalizeVideos(data));
      console.log("Server response:", data); // if response wasn't error set the data to setVideos, then print the data

    } catch (error) {
      console.error("Error sending data:", error); // if error in sending data report error
    } finally {
      setLoading(false); // once it is all done release the button from loading 
    }

  }

  const updateVideoGroup = (groupIndex, updater) => {
    setVideos((currentVideos) =>
      currentVideos.map((group, index) => {
        if (index !== groupIndex) return group;
        return updater(group);
      })
    );
  };

  const handleNextVideo = (groupIndex) => {
    updateVideoGroup(groupIndex, (group) => {
      if (group.isLocked || !group.candidates?.length) return group;
      return {
        ...group,
        selectedIndex: (group.selectedIndex + 1) % group.candidates.length,
      };
    });
  };

  const handlePreviousVideo = (groupIndex) => {
    updateVideoGroup(groupIndex, (group) => {
      if (group.isLocked || !group.candidates?.length) return group;
      const nextIndex = (group.selectedIndex - 1 + group.candidates.length) % group.candidates.length;
      return {
        ...group,
        selectedIndex: nextIndex,
      };
    });
  };

  const handleToggleLock = (groupIndex) => {
    updateVideoGroup(groupIndex, (group) => ({
      ...group,
      isLocked: !group.isLocked,
    }));
  };

  const totalSeconds = videos.reduce((acc, group) => {  //return the total length of all the videos selected in the playlist
    if (!group.candidates || group.candidates.length === 0) return acc;
    const selectedVideo = group.candidates[group.selectedIndex] || group.candidates[0];
    return acc + selectedVideo.durationSeconds;
  }, 0);
  
  return ( //html
    <>
      <div className="app-container">

        <nav>
          <div className="nav-brand">
            <a href="/">
              <img src={logoReact} alt="Logo" className="logo" />
            </a>
            <h1>Playlist Creator</h1>
          </div>
        </nav>

        <div className="header-section">
          <h2>Enter your topics and generate a playlist of videos</h2>
          <p>
            Enter a list of topics seperating with a new line or comma (if selected):
          </p>
        </div>

        <div className="input-group">
          <div className="controls">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={splitByComma}
                onChange={(e) => setSplitByComma(e.target.checked)}
              />
              <span>Split by commas too?</span>
            </label>
          </div>

          <textarea
            className="topic-input"
            placeholder="First Topic
Second Topic
Third Topic
...
Last Topic
=============================
(Or if comma splitting)
=============================
First Topic,Second Topic
Third Topic
Fourth Topic, Fifth Topic
Sixth Topic,..., Last Topic"
            rows={8}
            onChange={(e) => setTextInput(e.target.value)}
          ></textarea>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Searching YouTube...' : 'Generate Playlist'}
          </button>
        </div>

        <div className="results-section">
          {videos.length > 0 && (
            <>
              <div className="playlist-header">
                <h3 className="results-title">Your Playlist ({videos.length} videos)</h3>

                <div className="stats-bar">
                  <div className="stat-item main-stat">
                    <span className="label">Total Time:</span>
                    <span className="value">{formatTotalTime(totalSeconds)}</span>
                  </div>

                  <div className="speed-stats">
                    <div className="stat-item" title="Save time by watching faster!">
                      <span className="label">1.5x</span>
                      <span className="value">{formatTotalTime(totalSeconds / 1.5)}</span>
                    </div>
                    <div className="stat-item" title="Save time by watching even faster!">
                      <span className="label">2.0x</span>
                      <span className="value">{formatTotalTime(totalSeconds / 2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="video-list"> 
                {videos.map((group, index) => {
                  if (!group.candidates || group.candidates.length === 0) return null;
                  const selectedVideo = group.candidates[group.selectedIndex] || group.candidates[0];
                  return (
                    <VideoCard
                      key={group.topic}
                      topicLabel={formatTopicLabel(group.topic)}
                      video={selectedVideo}
                      currentIndex={group.selectedIndex}
                      totalCandidates={group.candidates.length}
                      isLocked={group.isLocked}
                      onNext={() => handleNextVideo(index)}
                      onPrevious={() => handlePreviousVideo(index)}
                      onToggleLock={() => handleToggleLock(index)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default App;
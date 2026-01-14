import { useState } from 'react';
import logoReact from './assets/react.svg';
import VideoCard from './VideoCard';
import './App.css';

function App() {
  const [textInput, setTextInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [splitByComma, setSplitByComma] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const splitPattern = splitByComma ? /[,\n]+/ : /\n+/;
      const topicsArray = textInput
        .split(splitPattern)
        .map(topic => topic.trim())
        .filter(topic => topic !== "");
      console.log(topicsArray);

      const response = await fetch('http://localhost:3000/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics: topicsArray }),
      });


      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return; 
      }

      const data = await response.json();
      setVideos(data);
      console.log("Server response:", data);

    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  }
return (
    <>
      {/* Added "app-container" for centering */}
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

(Or if comma splitting)

First Topic, Second Topic
Third topic
Fourth Topic, Fifth Topic
..., 
Last Topic"
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
          {videos.length > 0 && <h3 className="results-title">Your Playlist ({videos.length} videos)</h3>}
          
          <div className="video-list">
            {videos.map((group) => {
              if (!group.candidates || group.candidates.length === 0) return null;
              const topVideo = group.candidates[0]; 
              return (
                <VideoCard 
                  key={group.topic} 
                  video={topVideo} 
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
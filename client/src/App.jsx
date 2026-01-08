import { useState } from 'react';
import logoReact from './assets/react.svg';
import './App.css';

function App() {
  const [textInput, setTextInput] = useState("");
  const [splitByComma, setSplitByComma] = useState(true);
async function handleGenerate() {
   
    const splitPattern = splitByComma ? /[,\n]+/ : /\n+/;
    const topicsArray = textInput
      .split(splitPattern)
      .map(topic => topic.trim())
      .filter(topic => topic !== "");
      console.log(topicsArray);
   
    try {
      const response = await fetch('http://localhost:3000/api/generate-playlist', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify({ topics: topicsArray }), 
      });

 
      const data = await response.json();
      console.log("Server response:", data);
      
    } catch (error) {
      console.error("Error sending data:", error);
    }
  }
  return (
   <>
   <div>
    
    <nav>
      <div>
        <a href="">
          <img src={logoReact} alt="Homepage" />

        </a>
        <p> Youtube Playlist Creator </p>
      </div>
    </nav>

    <div>
      <h2>
        Enter your topics and generate a playlist of videos
      </h2> 
      <p>
        Enter a list of topics seperating with a new line or comma (if selected):<br />
      </p>
      </div>
      <div className="controls">
        <label>
          <input 
            type="checkbox" 
            checked={splitByComma} 
            onChange={(e) => setSplitByComma(e.target.checked)} 
          />
          Split by commas too?
        </label>
      </div>
      <div>
      <textarea 
      placeholder='First Topic
Second Topic
Third Topic
...
Last Topic

(Or if comma splitting)

First Topic, Second Topic
Third topic
Fourth Topic, Fifth Topic
..., 
Last Topic' 
      rows={10} 
      onChange={(e) => setTextInput(e.target.value)}>
      </textarea>
      <button onClick={handleGenerate}>Generate Playlist</button>
    </div>
   </div>
   </>
 );
}
export default App;
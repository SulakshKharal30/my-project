import React, { useEffect, useState } from "react";
import "./App.css";

function App() { 
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

 
  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.log("Error fetching songs:", err));
  }, []);

  
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase()) ||
    song.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1> Music Playlist</h1>

   
      <input
        type="text"
        placeholder="Search by title, artist, or album"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

    
      <div className="song-list">
        {filteredSongs.map((song) => (
          <div key={song.id} className="song-item">
            <h3>{song.title}</h3>
            <p>Artist: {song.artist}</p>
            <p>Album: {song.album}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

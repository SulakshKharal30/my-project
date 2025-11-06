import React, { useState } from "react";
import "./App.css";

function App() {
  // Sample songs array
  const [songs] = useState([
    { id: 1, title: "Shape of You", artist: "Ed Sheeran", album: "Divide" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia" },
    { id: 4, title: "Perfect", artist: "Ed Sheeran", album: "Divide" },
    { id: 5, title: "Senorita", artist: "Shawn Mendes & Camila Cabello", album: "Single" },
    { id: 6, title: "Someone Like You", artist: "Adele", album: "21" },
    { id: 7, title: "Peaches", artist: "Justin Bieber", album: "Justice" },
    { id: 8, title: "Believer", artist: "Imagine Dragons", album: "Evolve" },
    { id: 9, title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep" },
    { id: 10, title: "Rolling in the Deep", artist: "Adele", album: "21" },
  ]);

  const [search, setSearch] = useState("");

  // Filter songs by title, artist, or album
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase()) ||
    song.album.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🎵 Music Playlist</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title, artist, or album"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Songs List */}
      <div className="song-list">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song) => (
            <div key={song.id} className="song-item">
              <h3>{song.title}</h3>
              <p><strong>Artist:</strong> {song.artist}</p>
              <p><strong>Album:</strong> {song.album}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No songs found</p>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './MusicPlayer.css';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);

  const playlist = [
    { id: 1, name: 'Focus Deep Work', artist: 'Study Beats', duration: '3:45' },
    { id: 2, name: 'Calm Concentration', artist: 'Ambient Focus', duration: '4:12' },
    { id: 3, name: 'Productive Flow', artist: 'Lo-Fi Masters', duration: '3:28' },
    { id: 4, name: 'Zen Mode', artist: 'Meditation Sounds', duration: '5:03' },
    { id: 5, name: 'Brain Power', artist: 'Neural Beats', duration: '4:45' }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const selectTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  return (
    <div className="music-player card">
      <h3 className="card-title">🎧 Music Player</h3>

      <div className="current-track">
        <div className="track-cover">
          <div className={`vinyl ${isPlaying ? 'spinning' : ''}`}>
            🎵
          </div>
        </div>
        <div className="track-info">
          <div className="track-name">{playlist[currentTrack].name}</div>
          <div className="track-artist">{playlist[currentTrack].artist}</div>
          <div className="track-duration">{playlist[currentTrack].duration}</div>
        </div>
      </div>

      <div className="player-controls">
        <button className="control-btn" onClick={previousTrack}>
          ⏮️
        </button>
        <button className="control-btn control-btn-main" onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="control-btn" onClick={nextTrack}>
          ⏭️
        </button>
      </div>

      <div className="volume-control-main">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="volume-slider-main"
          style={{
            background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`
          }}
        />
        <span className="volume-value">{volume}%</span>
      </div>

      <div className="playlist">
        <div className="playlist-header">Playlist</div>
        <div className="playlist-tracks">
          {playlist.map((track, index) => (
            <div
              key={track.id}
              className={`playlist-track ${currentTrack === index ? 'active' : ''}`}
              onClick={() => selectTrack(index)}
            >
              <span className="track-number">{index + 1}</span>
              <div className="track-details">
                <div className="track-title">{track.name}</div>
                <div className="track-subtitle">{track.artist}</div>
              </div>
              <span className="track-time">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;

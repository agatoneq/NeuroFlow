import React, { useState } from 'react';
import './AmbientSounds.css';

function AmbientSounds() {
  const [activeSounds, setActiveSounds] = useState({});
  
  const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', color: '#4a90e2' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', color: '#2196f3' },
    { id: 'forest', name: 'Forest', icon: '🌲', color: '#4caf50' },
    { id: 'fire', name: 'Fire', icon: '🔥', color: '#ff5722' },
    { id: 'wind', name: 'Wind', icon: '💨', color: '#607d8b' },
    { id: 'thunder', name: 'Thunderstorm', icon: '⛈️', color: '#9c27b0' },
    { id: 'birds', name: 'Birds', icon: '🐦', color: '#8bc34a' },
    { id: 'cafe', name: 'Coffee Shop', icon: '☕', color: '#795548' }
  ];

  const toggleSound = (soundId) => {
    setActiveSounds(prev => ({
      ...prev,
      [soundId]: {
        active: !prev[soundId]?.active,
        volume: prev[soundId]?.volume || 50
      }
    }));
  };

  const changeVolume = (soundId, volume) => {
    setActiveSounds(prev => ({
      ...prev,
      [soundId]: {
        ...prev[soundId],
        volume: volume
      }
    }));
  };

  return (
    <div className="ambient-sounds card">
      <h3 className="card-title">🎵 Ambient Sounds</h3>
      
      <div className="sounds-grid">
        {sounds.map(sound => (
          <div 
            key={sound.id}
            className={`sound-item ${activeSounds[sound.id]?.active ? 'active' : ''}`}
            style={{
              borderColor: activeSounds[sound.id]?.active ? sound.color : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <button 
              className="sound-button"
              onClick={() => toggleSound(sound.id)}
              style={{
                background: activeSounds[sound.id]?.active 
                  ? `linear-gradient(135deg, ${sound.color}dd, ${sound.color}88)` 
                  : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <span className="sound-icon">{sound.icon}</span>
              <span className="sound-name">{sound.name}</span>
            </button>
            
            {activeSounds[sound.id]?.active && (
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeSounds[sound.id]?.volume || 50}
                  onChange={(e) => changeVolume(sound.id, e.target.value)}
                  className="volume-slider"
                  style={{
                    background: `linear-gradient(to right, ${sound.color} 0%, ${sound.color} ${activeSounds[sound.id]?.volume}%, rgba(255,255,255,0.1) ${activeSounds[sound.id]?.volume}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <span className="volume-label">{activeSounds[sound.id]?.volume}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveSounds({})}
        >
          🔇 Mute All
        </button>
      </div>
    </div>
  );
}

export default AmbientSounds;

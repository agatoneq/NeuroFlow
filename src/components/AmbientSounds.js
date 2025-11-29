import React, { useState } from 'react';
import './AmbientSounds.css';

function AmbientSounds() {
  const [activeSounds, setActiveSounds] = useState({});
  const [volumes, setVolumes] = useState({});

  const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', file: '/sounds/rain.mp3', color: '#4a90e2' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', file: '/sounds/ocean.mp3', color: '#2196f3' },
    { id: 'forest', name: 'Forest', icon: '🌲', file: '/sounds/forest.mp3', color: '#4caf50' },
    { id: 'fire', name: 'Fire', icon: '🔥', file: '/sounds/fire.mp3', color: '#ff5722' },
    { id: 'wind', name: 'Wind', icon: '💨', file: '/sounds/wind.mp3', color: '#90a4ae' },
    { id: 'thunder', name: 'Thunderstorm', icon: '⛈️', file: '/sounds/thunder.mp3', color: '#9c27b0' },
    { id: 'birds', name: 'Birds', icon: '🐦', file: '/sounds/birds.mp3', color: '#8bc34a' },
    { id: 'cafe', name: 'Coffee Shop', icon: '☕', file: '/sounds/cafe.mp3', color: '#795548' },
  ];

  const toggleSound = (sound) => {
    const updated = { ...activeSounds };
    const updatedVolumes = { ...volumes };

    if (updated[sound.id]) {
      updated[sound.id].pause();
      updated[sound.id].currentTime = 0;
      delete updated[sound.id];
      delete updatedVolumes[sound.id];
    } else {
      const audio = new Audio(sound.file);
      audio.loop = true;
      audio.volume = updatedVolumes[sound.id] || 0.7;
      audio.play();

      updated[sound.id] = audio;
      updatedVolumes[sound.id] = audio.volume;
    }

    setActiveSounds(updated);
    setVolumes(updatedVolumes);
  };

  const changeVolume = (id, value) => {
    const updatedVolumes = { ...volumes, [id]: value };
    setVolumes(updatedVolumes);

    if (activeSounds[id]) {
      activeSounds[id].volume = value;
    }
  };

  const muteAll = () => {
    Object.values(activeSounds).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    setActiveSounds({});
    setVolumes({});
  };

  return (
    <div className="ambient-sounds">

      <div className="sounds-grid">
        {sounds.map(sound => {
          const isActive = activeSounds[sound.id];

          return (
            <div
              key={sound.id}
              className={`sound-item ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? sound.color : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? `0 0 12px ${sound.color}` : 'none'
              }}
              onClick={() => toggleSound(sound)}
            >
              <div className="sound-icon">{sound.icon}</div>
              <div className="sound-name">{sound.name}</div>

              {isActive && (
                <div className="sound-wave" style={{ background: sound.color }} />
              )}

              {isActive && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volumes[sound.id] || 0.7}
                  onChange={(e) => changeVolume(sound.id, parseFloat(e.target.value))}
                  className="volume-slider"
                />
              )}
            </div>
          );
        })}
      </div>

      <button className="mute-btn" onClick={muteAll}>
        🔇 Mute All
      </button>
    </div>
  );
}

export default AmbientSounds;

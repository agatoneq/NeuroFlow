import React, { useState, useCallback } from 'react';
import spotifyService from '../services/spotifyService';
import { AMBIENT_SOUND_PLAYLISTS } from '../config/spotifyConfig';
import SpotifyAuth from './SpotifyAuth';
import './AmbientSounds.css';

function AmbientSoundsSpotify() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSounds, setActiveSounds] = useState({});

  const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️', color: '#4a90e2', playlistId: AMBIENT_SOUND_PLAYLISTS.rain },
    { id: 'ocean', name: 'Ocean', icon: '🌊', color: '#2196f3', playlistId: AMBIENT_SOUND_PLAYLISTS.ocean },
    { id: 'forest', name: 'Forest', icon: '🌲', color: '#4caf50', playlistId: AMBIENT_SOUND_PLAYLISTS.nature },
    { id: 'thunder', name: 'Thunderstorm', icon: '⛈️', color: '#9c27b0', playlistId: AMBIENT_SOUND_PLAYLISTS.thunder },
    { id: 'cafe', name: 'Coffee Shop', icon: '☕', color: '#795548', playlistId: AMBIENT_SOUND_PLAYLISTS.cafe },
    { id: 'meditation', name: 'Meditation', icon: '🧘', color: '#ff9800', playlistId: AMBIENT_SOUND_PLAYLISTS.meditation },
    { id: 'whitenoise', name: 'White Noise', icon: '💨', color: '#607d8b', playlistId: AMBIENT_SOUND_PLAYLISTS.whitenoise }
  ];

  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const toggleSound = async (sound) => {
    const isActive = activeSounds[sound.id]?.active;
    
    if (!isActive) {
      try {
        await spotifyService.playContext(sound.playlistId.uri);
        
        setActiveSounds(prev => ({
          ...prev,
          [sound.id]: {
            active: true,
            volume: prev[sound.id]?.volume || 50
          }
        }));
      } catch (error) {
        alert(
          '⚠️ NO ACTIVE SPOTIFY DEVICE DETECTED\n\n' +
          '1. Open Spotify Desktop OR open.spotify.com\n' +
          '2. Play any song for a moment\n' +
          '3. Return to NeuroFocus and try again\n\n' +
          'Spotify Web API requires an active device to play audio.'
        );
      }
    } else {
      try {
        await spotifyService.pause();
        setActiveSounds(prev => ({
          ...prev,
          [sound.id]: {
            ...prev[sound.id],
            active: false
          }
        }));
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  const changeVolume = async (soundId, volume) => {
    setActiveSounds(prev => ({
      ...prev,
      [soundId]: {
        ...prev[soundId],
        volume: volume
      }
    }));

    if (activeSounds[soundId]?.active) {
      try {
        await spotifyService.setVolume(volume);
      } catch (error) {
        console.log('Volume control requires active playback');
      }
    }
  };

  const muteAll = async () => {
    try {
      await spotifyService.pause();
      setActiveSounds({});
    } catch (error) {
      console.error('Error muting all:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="ambient-sounds card">
        <h3 className="card-title">🎵 Ambient Sounds</h3>
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="ambient-sounds card">
      <h3 className="card-title">🎵 Spotify Ambient Sounds</h3>
      
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
              onClick={() => toggleSound(sound)}
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
                  onChange={(e) => changeVolume(sound.id, Number(e.target.value))}
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
          onClick={muteAll}
        >
          🔇 Mute All
        </button>
      </div>

      <div className="spotify-notice-small">
        💡 Spotify audio requires an active Spotify device
      </div>
    </div>
  );
}

export default AmbientSoundsSpotify;

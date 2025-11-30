import React, { useState, useEffect, useCallback } from 'react';
import spotifyService from '../services/spotifyService';
import { FOCUS_PLAYLISTS } from '../config/spotifyConfig';
import SpotifyAuth from './SpotifyAuth';
import './MusicPlayer.css';

function MusicPlayer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('deepFocus');
  const [volume, setVolume] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceWarning, setDeviceWarning] = useState(false);

  const playlists = [
    { id: 'deepFocus', name: 'Deep Focus', spotifyId: FOCUS_PLAYLISTS.deepFocus },
    { id: 'lofiBeats', name: 'Lo-Fi Beats', spotifyId: FOCUS_PLAYLISTS.lofiBeats },
    { id: 'peaceful', name: 'Peaceful Piano', spotifyId: FOCUS_PLAYLISTS.peaceful },
    { id: 'concentration', name: 'Concentration', spotifyId: FOCUS_PLAYLISTS.concentration },
    { id: 'studyMusic', name: 'Study Music', spotifyId: FOCUS_PLAYLISTS.studyMusic }
  ];

  const loadPlaylist = useCallback(async (playlistId) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const playlistTracks = await spotifyService.getPlaylistTracks(playlistId.id);
      setTracks(playlistTracks);
      if (playlistTracks.length > 0) {
        setCurrentTrack(playlistTracks[0]);
      }
    } catch (error) {
      if (error.status === 404) {
        setError('❌ Cannot load tracks (404). Try "▶️ Play directly" instead.');
      } else if (error.status === 401) {
        setError('Token expired. Please log in again.');
        spotifyService.logout();
        setIsAuthenticated(false);
      } else {
        setError('Playlist loading error: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const playPlaylistDirectly = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const playlist = playlists.find(p => p.id === selectedPlaylist);
      if (!playlist) return;

      await spotifyService.playContext(playlist.spotifyId.uri);
      setIsPlaying(true);
      setDeviceWarning(false);
    } catch (error) {
      if (error.status === 404) {
        alert(
          '⚠️ NO ACTIVE SPOTIFY DEVICE\n\n' +
          '1. Open Spotify Desktop or open.spotify.com\n' +
          '2. Play ANY track for 1 second\n' +
          '3. Return here and try again\n\n' +
          'Spotify Web API requires an active device.'
        );
        setDeviceWarning(true);
      } else {
        setError('Playback error: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedPlaylist, playlists]);

  useEffect(() => {
    if (isAuthenticated && volume >= 0) {
      spotifyService.setVolume(volume).catch(() =>
        console.log('Volume control requires active playback.')
      );
    }
  }, [volume, isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const togglePlay = async () => {
    try {
      setError(null);

      if (isPlaying) {
        await spotifyService.pause();
        setIsPlaying(false);
      } else {
        if (currentTrack && tracks.length > 0) {
          const uris = tracks.map(t => t.uri);
          const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);

          await spotifyService.play({
            uris: uris,
            offset: { position: currentIndex }
          });
        } else {
          await spotifyService.resume();
        }

        setIsPlaying(true);
        setDeviceWarning(false);
      }
    } catch (error) {
      setError('Playback error');
      setDeviceWarning(true);

      if (error.status === 404) {
        alert(
          '⚠️ NO ACTIVE SPOTIFY DEVICE\n\n' +
          '1. Open Spotify Desktop or open.spotify.com\n' +
          '2. Play any track\n' +
          '3. Try again'
        );
      }
    }
  };

  const nextTrack = async () => {
    try {
      await spotifyService.skipToNext();

      setTimeout(async () => {
        const playback = await spotifyService.getCurrentPlayback();
        if (playback?.item) {
          const newTrack = tracks.find(t => t.id === playback.item.id);
          if (newTrack) setCurrentTrack(newTrack);
        }
      }, 500);
    } catch (error) {
      console.error('Error skipping next:', error);
    }
  };

  const previousTrack = async () => {
    try {
      await spotifyService.skipToPrevious();

      setTimeout(async () => {
        const playback = await spotifyService.getCurrentPlayback();
        if (playback?.item) {
          const newTrack = tracks.find(t => t.id === playback.item.id);
          if (newTrack) setCurrentTrack(newTrack);
        }
      }, 500);
    } catch (error) {
      console.error('Error skipping previous:', error);
    }
  };

  const selectTrack = async (track) => {
    const trackIndex = tracks.findIndex(t => t.id === track.id);
    try {
      await spotifyService.play({
        uris: tracks.map(t => t.uri),
        offset: { position: trackIndex }
      });
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      alert('Make sure Spotify is open on your device.');
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="music-player card">
        <h3 className="card-title">🎧 Music Player</h3>
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="music-player card">
      <h3 className="card-title">🎧 Spotify Music Player</h3>

      {error && (
        <div className="error-box">
          ⚠️ {error}
        </div>
      )}

      {deviceWarning && (
        <div className="device-warning">
          ⚠️ Open Spotify Desktop or open.spotify.com and play any track.
        </div>
      )}

      <div className="info-box">
        <strong>💡 Many Spotify playlists are region-locked (404 errors)</strong>
        <br />
        • Open Spotify Desktop  
        <br />
        • Start any playlist there  
        <br />
        • Use the controls below to manage playback  
      </div>

      <div className="playlist-selector">
        <label>Select playlist:</label>
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          className="playlist-dropdown"
        >
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>

        <button
          onClick={playPlaylistDirectly}
          disabled={isLoading}
          className="btn-direct"
        >
          {isLoading ? '⏳ Loading...' : '▶️ Play directly (NO 404!)'}
        </button>

        <button
          onClick={() => {
            const playlist = playlists.find((p) => p.id === selectedPlaylist);
            if (playlist) loadPlaylist(playlist.spotifyId);
          }}
          disabled={isLoading}
          className="btn-load"
        >
          📥 Load tracks (may fail with 404)
        </button>
      </div>

      <div className="player-controls-wrapper">
        <div className="controls-title">🎮 Spotify Desktop Controls</div>

        <div className="player-controls">
          <button className="control-btn" onClick={previousTrack}>⏮️</button>
          <button className="control-btn control-btn-main" onClick={togglePlay}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="control-btn" onClick={nextTrack}>⏭️</button>
        </div>

        <div className="control-caption">
          {currentTrack ? `Now playing: ${currentTrack.name}` : 'Control your Spotify Desktop playback'}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading playlist...</p>
        </div>
      ) : currentTrack ? (
        <>
          <div className="current-track">
            <div className="track-cover">
              <div className={`vinyl ${isPlaying ? 'spinning' : ''}`}>
                🎵
              </div>
            </div>

            <div className="track-info">
              <div className="track-name">{currentTrack.name}</div>
              <div className="track-artist">{currentTrack.artist}</div>
              <div className="track-duration">{formatDuration(currentTrack.duration)}</div>
            </div>
          </div>

          <div className="player-controls">
            <button className="control-btn" onClick={previousTrack}>⏮️</button>
            <button className="control-btn control-btn-main" onClick={togglePlay}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="control-btn" onClick={nextTrack}>⏭️</button>
          </div>

          <div className="volume-control-main">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="volume-slider-main"
              style={{
                background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <span className="volume-value">{volume}%</span>
          </div>

          <div className="playlist">
            <div className="playlist-header">
              Playlist ({tracks.length} tracks)
            </div>

            <div className="playlist-tracks">
              {tracks.slice(0, 10).map((track) => (
                <div
                  key={track.id}
                  className={`playlist-track ${currentTrack?.id === track.id ? 'active' : ''}`}
                  onClick={() => selectTrack(track)}
                >
                  <span className="track-number">
                    {tracks.indexOf(track) + 1}
                  </span>

                  <div className="track-details">
                    <div className="track-title">{track.name}</div>
                    <div className="track-subtitle">{track.artist}</div>
                  </div>

                  <span className="track-time">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="spotify-notice">
            💡 Make sure Spotify is open on your device
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Select a playlist to start playing</p>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;

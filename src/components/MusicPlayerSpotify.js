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
      console.log('📥 Loading playlist:', playlistId);
      const playlistTracks = await spotifyService.getPlaylistTracks(playlistId.id);
      console.log('✅ Playlist loaded:', playlistTracks.length, 'tracks');
      setTracks(playlistTracks);
      if (playlistTracks.length > 0) {
        setCurrentTrack(playlistTracks[0]);
      }
    } catch (error) {
      console.error('❌ Error loading playlist:', error);
      console.error('Error status:', error.status);
      
      // Obsługa błędów
      if (error.status === 404) {
        setError('❌ Nie można załadować tracków (404). Użyj przycisku "▶️ Odtwórz bezpośrednio" zamiast tego!');
        // NIE POKAZUJ alertu automatycznie - tylko ustaw error state
      } else if (error.status === 401) {
        setError('Token wygasł. Zaloguj się ponownie.');
        spotifyService.logout();
        setIsAuthenticated(false);
      } else {
        setError('Błąd ładowania playlisty: ' + (error.message || 'Nieznany błąd'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Odtwarzaj bezpośrednio przez URI - omija problem z 404 na tracklist
  const playPlaylistDirectly = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const playlist = playlists.find(p => p.id === selectedPlaylist);
      if (!playlist) return;
      
      console.log('🎵 Playing playlist directly via URI:', playlist.spotifyId.uri);
      await spotifyService.playContext(playlist.spotifyId.uri);
      setIsPlaying(true);
      console.log('✅ Playlist started!');
    } catch (error) {
      console.error('❌ Error playing playlist:', error);
      
      if (error.status === 404) {
        alert('⚠️ BRAK AKTYWNEGO URZĄDZENIA SPOTIFY\n\n' +
              '1. Otwórz Spotify Desktop lub open.spotify.com\n' +
              '2. Włącz dowolny utwór (nawet na chwilę)\n' +
              '3. Wróć do NeuroFocus i spróbuj ponownie\n\n' +
              'Spotify Web API wymaga aktywnego urządzenia.');
        setDeviceWarning(true);
      } else {
        setError('Błąd odtwarzania: ' + (error.message || 'Nieznany błąd'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, selectedPlaylist, playlists]);

  // WYŁĄCZONE - nie ładuj playlist automatycznie przy zmianie dropdown
  // Użytkownik musi kliknąć przycisk "Załaduj playlistę"
  /*
  useEffect(() => {
    if (isAuthenticated) {
      const playlist = playlists.find(p => p.id === selectedPlaylist);
      if (playlist) {
        loadPlaylist(playlist.spotifyId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaylist, isAuthenticated, loadPlaylist]);
  */

  useEffect(() => {
    if (isAuthenticated && volume >= 0) {
      spotifyService.setVolume(volume).catch(err => 
        console.log('Volume control requires active playback')
      );
    }
  }, [volume, isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    
    // NIE ŁADUJ automatycznie playlisty - użytkownik wybierze sam
    // Wiele playlist Spotify nie działa regionalnie (404)
  };

  const togglePlay = async () => {
    console.log('🎵 Toggle play clicked');
    console.log('Current track:', currentTrack);
    console.log('Tracks length:', tracks.length);
    console.log('Is authenticated:', isAuthenticated);
    
    try {
      setError(null);
      if (isPlaying) {
        console.log('🎵 Pausing...');
        await spotifyService.pause();
        setIsPlaying(false);
      } else {
        console.log('🎵 Playing/Resuming...');
        
        // Jeśli mamy załadowaną playlistę, użyj jej
        if (currentTrack && tracks.length > 0) {
          const uris = tracks.map(t => t.uri);
          const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
          console.log('URIs:', uris.length, 'Current index:', currentIndex);
          
          await spotifyService.play({
            uris: uris,
            offset: { position: currentIndex }
          });
        } else {
          // Jeśli nie ma playlisty, po prostu wznów to co gra w Spotify
          console.log('No playlist loaded, resuming current playback...');
          await spotifyService.resume();
        }
        
        console.log('✅ Play command sent successfully');
        setIsPlaying(true);
        setDeviceWarning(false);
      }
    } catch (error) {
      console.error('❌ Error toggling play:', error);
      console.error('Error status:', error.status);
      console.error('Error message:', error.message);
      setError('Błąd odtwarzania');
      setDeviceWarning(true);
      
      // Pokaż instrukcję tylko jeśli brak urządzenia
      if (error.status === 404) {
        alert('⚠️ BRAK AKTYWNEGO URZĄDZENIA\n\n' +
              '1. Otwórz aplikację Spotify Desktop LUB\n' +
              '2. Otwórz Spotify Web Player (open.spotify.com)\n' +
              '3. Włącz jakikolwiek utwór tam\n' +
              '4. Wróć do NeuroFocus i spróbuj ponownie\n\n' +
              'Spotify Web API wymaga aktywnego urządzenia do odtwarzania.');
      }
    }
  };

  const nextTrack = async () => {
    try {
      await spotifyService.skipToNext();
      setTimeout(async () => {
        const playback = await spotifyService.getCurrentPlayback();
        if (playback && playback.item) {
          const newTrack = tracks.find(t => t.id === playback.item.id);
          if (newTrack) setCurrentTrack(newTrack);
        }
      }, 500);
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const previousTrack = async () => {
    try {
      await spotifyService.skipToPrevious();
      setTimeout(async () => {
        const playback = await spotifyService.getCurrentPlayback();
        if (playback && playback.item) {
          const newTrack = tracks.find(t => t.id === playback.item.id);
          if (newTrack) setCurrentTrack(newTrack);
        }
      }, 500);
    } catch (error) {
      console.error('Error skipping to previous:', error);
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
      console.error('Error playing track:', error);
      alert('Upewnij się, że masz otwartą aplikację Spotify na swoim urządzeniu.');
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
        <h3 className="card-title">🎧 Odtwarzacz Muzyki</h3>
        <SpotifyAuth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="music-player card">
      <h3 className="card-title">🎧 Odtwarzacz Muzyki Spotify</h3>

      {error && (
        <div style={{
          background: 'rgba(255, 75, 43, 0.2)',
          border: '1px solid #ff4b2b',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#ff6b6b'
        }}>
          ⚠️ {error}
        </div>
      )}

      {deviceWarning && (
        <div style={{
          background: 'rgba(255, 152, 0, 0.2)',
          border: '1px solid #ff9800',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '15px',
          fontSize: '12px',
          color: '#ffa726'
        }}>
          ⚠️ <strong>Otwórz Spotify Desktop</strong> lub <strong>open.spotify.com</strong> i włącz dowolny utwór, aby aktywować urządzenie.
        </div>
      )}

      {/* Informacja o playlistach 404 */}
      <div style={{
        background: 'rgba(33, 150, 243, 0.15)',
        border: '1px solid #2196f3',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '15px',
        fontSize: '13px',
        lineHeight: '1.6'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#42a5f5' }}>
          💡 Wiele playlist Spotify nie działa w Polsce (błąd 404)
        </div>
        <div style={{ color: '#90caf9', fontSize: '12px' }}>
          <strong>Rozwiązanie:</strong><br/>
          1. Otwórz Spotify Desktop<br/>
          2. Włącz swoją ulubioną playlistę tam<br/>
          3. Użyj przycisków poniżej do kontroli odtwarzania
        </div>
      </div>

      <div className="playlist-selector">
        <label>Wybierz playlistę:</label>
        <select 
          value={selectedPlaylist} 
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          className="playlist-dropdown"
        >
          {playlists.map(playlist => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
        
        {/* NOWA OPCJA - Odtwarzaj bezpośrednio przez URI (OMIJA 404!) */}
        <button 
          onClick={playPlaylistDirectly}
          disabled={isLoading}
          style={{
            marginTop: '10px',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #1db954, #1ed760)',
            border: 'none',
            borderRadius: '20px',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            width: '100%',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(29, 185, 84, 0.3)'
          }}
        >
          {isLoading ? '⏳ Ładowanie...' : '▶️ Odtwórz bezpośrednio (BEZ 404!)'}
        </button>
        
        {/* Stara opcja - ładowanie tracków (często 404) */}
        <button 
          onClick={() => {
            const playlist = playlists.find(p => p.id === selectedPlaylist);
            if (playlist) loadPlaylist(playlist.spotifyId);
          }}
          disabled={isLoading}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: '#aaa',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'normal',
            width: '100%',
            fontSize: '12px'
          }}
        >
          📥 Załaduj tracki (może być 404)
        </button>
      </div>

      {/* Proste przyciski sterujące - działają bez ładowania playlisty */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(29, 185, 84, 0.1)',
        borderRadius: '8px',
        border: '1px solid #1db954'
      }}>
        <div style={{ marginBottom: '10px', fontSize: '13px', color: '#1db954', fontWeight: 'bold' }}>
          🎮 Sterowanie Spotify Desktop
        </div>
        <div className="player-controls">
          <button className="control-btn" onClick={previousTrack} title="Poprzedni utwór">
            ⏮️
          </button>
          <button className="control-btn control-btn-main" onClick={togglePlay} title={isPlaying ? 'Pauza' : 'Play'}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="control-btn" onClick={nextTrack} title="Następny utwór">
            ⏭️
          </button>
        </div>
        <div style={{ fontSize: '11px', color: '#90caf9', marginTop: '10px', textAlign: 'center' }}>
          {currentTrack ? `Odtwarzanie: ${currentTrack.name}` : 'Steruj tym co gra w Spotify Desktop'}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Ładowanie playlisty...</p>
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

          <div className="player-controls" style={{ marginTop: '15px' }}>
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
              Playlista ({tracks.length} utworów)
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
            💡 Upewnij się, że aplikacja Spotify jest otwarta na Twoim urządzeniu
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Wybierz playlistę, aby rozpocząć odtwarzanie</p>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;

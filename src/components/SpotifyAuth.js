import React, { useState, useEffect } from 'react';
import { SPOTIFY_AUTH_URL } from '../config/spotifyConfig';
import spotifyService from '../services/spotifyService';
import './SpotifyAuth.css';

function SpotifyAuth({ onAuthSuccess }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔐 Checking Spotify authentication...');
      // Sprawdź czy token jest już w localStorage
      if (spotifyService.isTokenValid()) {
        console.log('✅ Valid token found in localStorage');
        await handleAuthSuccess();
      } else {
        console.log('❌ No valid token in localStorage');
        // Sprawdź czy jesteśmy po przekierowaniu z autoryzacji
        const token = spotifyService.getTokenFromUrl();
        console.log('Token from URL:', token);
        if (token.access_token) {
          console.log('✅ Access token found in URL, setting...');
          spotifyService.setAccessToken(token.access_token);
          await handleAuthSuccess();
        } else {
          console.log('❌ No access token in URL');
          setIsLoading(false);
        }
      }
    };
    
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthSuccess = async () => {
    try {
      console.log('🎉 Authenticating user...');
      const userData = await spotifyService.getUserProfile();
      console.log('✅ User profile retrieved:', userData.display_name);
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      if (onAuthSuccess) onAuthSuccess(userData);
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    console.log('🔗 Redirecting to Spotify auth:', SPOTIFY_AUTH_URL);
    // W Electron otwórz w tym samym oknie (dla localhost callback)
    window.location.href = SPOTIFY_AUTH_URL;
  };

  const handleLogout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="spotify-auth loading">
        <div className="loader"></div>
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="spotify-auth">
        <div className="spotify-login-card">
          <div className="spotify-logo">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h2>Połącz ze Spotify</h2>
          <p>Zaloguj się do Spotify, aby odtwarzać muzykę i dźwięki otoczenia bezpośrednio z aplikacji.</p>
          <button className="btn btn-spotify" onClick={handleLogin}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Zaloguj przez Spotify
          </button>
          <div className="spotify-info">
            <p>⚠️ <strong>Potrzebujesz Spotify Premium</strong> do odtwarzania muzyki przez API</p>
            <p>💡 Jeśli nie masz konta, możesz zarejestrować się na <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">spotify.com</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-auth authenticated">
      <div className="user-info">
        {user?.images?.[0] && (
          <img src={user.images[0].url} alt={user.display_name} className="user-avatar" />
        )}
        <div className="user-details">
          <span className="user-name">{user?.display_name}</span>
          <span className="spotify-badge">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
          </span>
        </div>
        <button className="btn btn-logout" onClick={handleLogout}>
          Wyloguj
        </button>
      </div>
    </div>
  );
}

export default SpotifyAuth;

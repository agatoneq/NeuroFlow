import SpotifyWebApi from 'spotify-web-api-js';

class SpotifyService {
  constructor() {
    this.spotifyApi = new SpotifyWebApi();
    this.token = null;
    this.expirationTime = null;
  }

  getTokenFromUrl() {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    window.location.hash = '';
    return hash;
  }

  setAccessToken(token) {
    this.token = token;
    this.spotifyApi.setAccessToken(token);
    this.expirationTime = Date.now() + 3600000;
    localStorage.setItem('spotify_token', token);
    localStorage.setItem('spotify_token_expiration', this.expirationTime);
  }

  isTokenValid() {
    const savedToken = localStorage.getItem('spotify_token');
    const savedExpiration = localStorage.getItem('spotify_token_expiration');

    if (savedToken && savedExpiration) {
      if (Date.now() < parseInt(savedExpiration)) {
        this.setAccessToken(savedToken);
        return true;
      }
    }
    return false;
  }

  logout() {
    this.token = null;
    this.expirationTime = null;
    this.spotifyApi.setAccessToken(null);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiration');
  }

  async getPlaylist(playlistId) {
    try {
      return await this.spotifyApi.getPlaylist(playlistId);
    } catch (error) {
      throw error;
    }
  }

  async getUserPlaylists(limit = 20) {
    try {
      const data = await this.spotifyApi.getUserPlaylists({ limit });
      return data.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        tracks: playlist.tracks.total,
        uri: playlist.uri,
        images: playlist.images
      }));
    } catch (error) {
      throw error;
    }
  }

  async getPlaylistTracks(playlistId, limit = 50) {
    try {
      const data = await this.spotifyApi.getPlaylistTracks(playlistId, { limit });
      return data.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        duration: item.track.duration_ms,
        uri: item.track.uri,
        preview_url: item.track.preview_url
      }));
    } catch (error) {
      if (error.status === 404) {
        return await this.getAlbumTracks(playlistId, limit);
      }
      throw error;
    }
  }

  async getAlbumTracks(albumId, limit = 50) {
    try {
      const data = await this.spotifyApi.getAlbumTracks(albumId, { limit });
      return data.items.map(item => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: albumId,
        duration: item.duration_ms,
        uri: item.uri,
        preview_url: item.preview_url
      }));
    } catch (error) {
      throw error;
    }
  }

  async play(options) {
    try {
      await this.spotifyApi.play(options);
      return true;
    } catch (error) {
      if (error.message?.includes('JSON')) return true;
      throw error;
    }
  }

  async playContext(contextUri) {
    try {
      await this.spotifyApi.play({ context_uri: contextUri });
      return true;
    } catch (error) {
      if (error.message?.includes('JSON')) return true;
      throw error;
    }
  }

  async resume() {
    try {
      await this.spotifyApi.play();
      return true;
    } catch (error) {
      if (error.message?.includes('JSON')) return true;
      throw error;
    }
  }

  async pause() {
    try {
      await this.spotifyApi.pause();
      return true;
    } catch (error) {
      if (error.message?.includes('JSON')) return true;
      throw error;
    }
  }

  async skipToNext() {
    try {
      await this.spotifyApi.skipToNext();
      return true;
    } catch (error) {
      if (error.message?.includes('JSON')) return true;
      throw error;
    }
  }

  async skipToPrevious() {
    try {
      await this.spotifyApi.skipToPrevious();
      return true;
    } catch (error) {
      if (error.message?.includes('JSON')) return true;
      throw error;
    }
  }

  async setVolume(volume) {
    try {
      await this.spotifyApi.setVolume(volume);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentPlayback() {
    try {
      return await this.spotifyApi.getMyCurrentPlaybackState();
    } catch (error) {
      throw error;
    }
  }

  async getDevices() {
    try {
      const data = await this.spotifyApi.getMyDevices();
      return data.devices;
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile() {
    try {
      return await this.spotifyApi.getMe();
    } catch (error) {
      throw error;
    }
  }

  async search(query, types = ['track', 'playlist'], limit = 20) {
    try {
      return await this.spotifyApi.search(query, types, { limit });
    } catch (error) {
      throw error;
    }
  }
}

const spotifyService = new SpotifyService();
export default spotifyService;

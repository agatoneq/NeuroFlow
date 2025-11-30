export const SPOTIFY_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID || '88fb4b331f304f33a835529c4c4792fa',
  REDIRECT_URI: process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'https://www.groupmta.com/NeuroFlow-callback/token.php',
  SCOPES: [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ')
};

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(
  SPOTIFY_CONFIG.REDIRECT_URI
)}&scope=${encodeURIComponent(SPOTIFY_CONFIG.SCOPES)}&response_type=code&show_dialog=true`;

export const FOCUS_PLAYLISTS = {
  deepFocus: { id: '37i9dQZF1DXakrXW5YU9SI', uri: 'spotify:playlist:37i9dQZF1DXakrXW5YU9SI', name: 'Deep Focus' },
  lofiBeats: { id: '37i9dQZF1EIfw0z95mTj2m', uri: 'spotify:playlist:37i9dQZF1EIfw0z95mTj2m', name: 'Lo-Fi Beats' },
  peaceful: { id: '34pF0wOGswprAZCsI8A1Fs', uri: 'spotify:album:34pF0wOGswprAZCsI8A1Fs', name: 'Peaceful Piano' },
  concentration: { id: '37i9dQZF1DX3PFzdbtx1Us', uri: 'spotify:playlist:37i9dQZF1DX3PFzdbtx1Us', name: 'Concentration' },
  studyMusic: { id: '37i9dQZF1DX8NTLI2TtZa6', uri: 'spotify:playlist:37i9dQZF1DX8NTLI2TtZa6', name: 'Study Music' }
};

export const AMBIENT_SOUND_PLAYLISTS = {
  rain: { id: '54vGSK50oe08qxz2xXECEC', uri: 'spotify:album:54vGSK50oe08qxz2xXECEC', name: 'Rain' },
  ocean: { id: '37i9dQZF1DWV90ZWj21ygB', uri: 'spotify:playlist:37i9dQZF1DWV90ZWj21ygB', name: 'Ocean Waves' },
  forest: { id: '37i9dQZF1DXdzGIPNRTvyN', uri: 'spotify:playlist:37i9dQZF1DXdzGIPNRTvyN', name: 'Forest Sounds' },
  thunder: { id: '6wx6zQaEaQ7pWj7e0CIM3S', uri: 'spotify:playlist:6wx6zQaEaQ7pWj7e0CIM3S', name: 'Thunderstorm' },
  nature: { id: '37i9dQZF1DXdzGIPNRTvyN', uri: 'spotify:playlist:37i9dQZF1DXdzGIPNRTvyN', name: 'Nature' },
  whitenoise: { id: '37i9dQZF1DX6iSJxWbeWLf', uri: 'spotify:playlist:37i9dQZF1DX6iSJxWbeWLf', name: 'White Noise' },
  cafe: { id: '37i9dQZF1DWWvvyNmW9V9a', uri: 'spotify:playlist:37i9dQZF1DWWvvyNmW9V9a', name: 'Coffee Shop Ambience' },
  meditation: { id: '37i9dQZF1DWZqd5JICZI0u', uri: 'spotify:playlist:37i9dQZF1DWZqd5JICZI0u', name: 'Meditation' }
};

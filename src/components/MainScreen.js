import React from 'react';
import './MainScreen.css';
import FocusBar from './FocusBar';
import PomodoroTimer from './PomodoroTimer';
import AmbientSounds from './AmbientSounds';
import MusicPlayerSpotify from './MusicPlayerSpotify';

function MainScreen({ focusScore, onRecalibrate }) {
  return (
    <div className="main-screen">

      <button className="recalibrate-btn" onClick={onRecalibrate}>
        Recalibrate
      </button>

      <div className="section">
        <h2>Focus Level</h2>
        <FocusBar score={focusScore} />
      </div>

      <div className="section">
        <h2>Pomodoro</h2>
        <PomodoroTimer lockWhenDistracted={focusScore < 40} />
      </div>

      <div className="section">
        <h2>Ambient Sounds</h2>
        <AmbientSounds />
      </div>

      <div className="section">
        <h2>Spotify Player</h2>
        <MusicPlayerSpotify />
      </div>

    </div>
  );
}

export default MainScreen;

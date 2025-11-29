import React, { useState } from 'react';
import './App.css';

import Header from './components/Header';
import PomodoroTimer from './components/PomodoroTimer';
import AmbientSoundsSpotify from './components/AmbientSoundsSpotify';
import MusicPlayerSpotify from './components/MusicPlayerSpotify';
import FocusDetector from './components/FocusDetector';
import StatsPanel from './components/StatsPanel';
import BreathingExercise from './components/BreathingExercise';
import StartScreen from './components/StartScreen';
import CalibrationScreen from './components/CalibrationScreen';
import PostCalibrationScreen from './components/PostCalibrationScreen';
import FocusBar from './components/FocusBar';

function App() {
  const [started, setStarted] = useState(false);
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [showPostCalibration, setShowPostCalibration] = useState(false);
  const [focusScore, setFocusScore] = useState(100);
  const [showBreathing, setShowBreathing] = useState(false);
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    pomodorosCompleted: 0,
    averageFocus: 85
  });

  const handleFocusChange = (score) => {
    setFocusScore(score);
    if (score < 50 && !showBreathing) {
      setShowBreathing(true);
    }
  };

  const handlePomodoroComplete = () => {
    setStats(prev => ({
      ...prev,
      pomodorosCompleted: prev.pomodorosCompleted + 1,
      totalFocusTime: prev.totalFocusTime + 25
    }));
  };

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  if (!calibrationDone) {
    return (
      <CalibrationScreen
        onComplete={() => {
          setCalibrationDone(true);
          setShowPostCalibration(true);
        }}
      />
    );
  }

  if (showPostCalibration) {
    return (
      <PostCalibrationScreen
        onContinue={() => setShowPostCalibration(false)}
      />
    );
  }

  return (
    <div className="App">
      <Header focusScore={focusScore} />
      <FocusBar focusScore={focusScore} />

      <div className="main-container">
        <div className="left-panel">
          <FocusDetector onFocusChange={handleFocusChange} />
          <StatsPanel stats={stats} />
        </div>

        <div className="center-panel">
          <PomodoroTimer onComplete={handlePomodoroComplete} />
          {showBreathing && (
            <BreathingExercise onClose={() => setShowBreathing(false)} />
          )}
        </div>

        <div className="right-panel">
          <AmbientSoundsSpotify />
          <MusicPlayerSpotify />
        </div>
      </div>
    </div>
  );
}

export default App;

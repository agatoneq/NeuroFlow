import React, { useState } from 'react';
import './App.css';

import Header from './components/Header';
import StartScreen from './components/StartScreen';
import CalibrationScreen from './components/CalibrationScreen';
import PostCalibrationScreen from './components/PostCalibrationScreen';
import MainScreen from './components/MainScreen';
import BreathingExercise from './components/BreathingExercise';

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
      <PostCalibrationScreen onContinue={() => setShowPostCalibration(false)} />
    );
  }

  return (
    <div className="App">
      <Header focusScore={focusScore} />

      <MainScreen
        focusScore={focusScore}
        stats={stats}
        onPomodoroComplete={handlePomodoroComplete}
        onRecalibrate={() => {
          setCalibrationDone(false);
          setShowPostCalibration(false);
        }}
        showBreathing={showBreathing}
        BreathingExercise={BreathingExercise}
        onCloseBreathing={() => setShowBreathing(false)}
      />
    </div>
  );
}

export default App;

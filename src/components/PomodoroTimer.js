import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './PomodoroTimer.css';

function PomodoroTimer({ onComplete }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const modes = useMemo(() => ({
    work: { duration: 25, label: 'Work' },
    shortBreak: { duration: 5, label: 'Short Break' },
    longBreak: { duration: 15, label: 'Long Break' }
  }), []);

  const playNotificationSound = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS36+ehUBELTKXh8LJnHwhAnM/xxxwUDkKZ2fPCciYGLYDO8tmJNwgZaLvt559NEAxPpuPwtmMcBjiP1/PMeS4EI3fH8N+PPwkVXrTp66hVFApGnt/yvmwhBSuAzvLZiTYJGGS36+ehUBELTKXh8LJnHwg+nM/xxxwUDkGZ2fPCciYGLYDO8tmJNwgZZ7zt559NEAtOpePxtmIcBjiQ1/PMeS4EI3fH8N+PPwkVXrTp66hVFApGnt/yvmwhBSuAzvLZiTYJGGS36+ehUBELTKXh8LJnHwg+nM/xxxwUDkGZ2fPCciYGLYDO8tmJNwgZZ7zt559NEAtOpePxtmIcBjiQ1/PMeS4EI3fH8N+PPwkVXrTp66hVFApGnt/yvmwhBSuAzvLZiTYJGGS36+ehUBELTKXh8LJnHwg+nM/xxxwUDkGZ2fPCciYGLYDO8tmJNwgZZ7zt559NEAtOpePxtmIcBjiQ1/PMeS4EI3fH8N+PPwkVXrTp66hVFApGnt/yvmwhBSuAzvLZiTYJGGS36+ehUBELTKXh8LJnHwg+nM/xxxwUDkGZ2fPCciYGLYDO8tmJNwgZZ7zt55');
    audio.play().catch(e => console.log('Cannot play sound'));
  }, []);

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setMinutes(modes[newMode].duration);
    setSeconds(0);
  }, [modes]);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    const { ipcRenderer } = window.require('electron');

    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      if (onComplete) onComplete();

      if (newSessionsCompleted % 4 === 0) {
        switchMode('longBreak');
        ipcRenderer.send('show-window', {
          title: '🎉 Session complete!',
          body: 'You finished 4 sessions. Time for a long break (15 min).'
        });
      } else {
        switchMode('shortBreak');
        ipcRenderer.send('show-window', {
          title: '✅ Session complete!',
          body: 'Good job! Time for a short break (5 min).'
        });
      }

      playNotificationSound();
    } else {
      switchMode('work');
      ipcRenderer.send('show-window', {
        title: '🔔 Break finished!',
        body: 'Time to get back to work (25 min).'
      });
    }
  }, [mode, sessionsCompleted, onComplete, switchMode, playNotificationSound]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [isActive, minutes, seconds, handleTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(modes[mode].duration);
    setSeconds(0);
  }, [mode, modes]);

  const progress = ((modes[mode].duration * 60 - (minutes * 60 + seconds)) / (modes[mode].duration * 60)) * 100;

  return (
    <div className="pomodoro-timer card fade-in">
      <h2 className="card-title">⏱️ Pomodoro Timer</h2>

      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
          onClick={() => !isActive && switchMode('work')}
          disabled={isActive}
        >
          Work
        </button>
        <button
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => !isActive && switchMode('shortBreak')}
          disabled={isActive}
        >
          Short Break
        </button>
        <button
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => !isActive && switchMode('longBreak')}
          disabled={isActive}
        >
          Long Break
        </button>
      </div>

      <div className="timer-display">
        <svg className="progress-ring" width="200" height="200">
          <circle className="progress-ring-circle-bg" cx="100" cy="100" r="93" />
          <circle
            className="progress-ring-circle"
            cx="100"
            cy="100"
            r="93"
            style={{
              strokeDasharray: `${2 * Math.PI * 93}`,
              strokeDashoffset: `${2 * Math.PI * 93 * (1 - progress / 100)}`
            }}
          />
        </svg>

        <div className="timer-text">
          <div className="timer-time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="timer-mode">{modes[mode].label}</div>
        </div>
      </div>

      <div className="timer-controls">
        <button
          className={`btn ${isActive ? 'btn-danger' : 'btn-primary'}`}
          onClick={toggleTimer}
        >
          {isActive ? '⏸ Pause' : '▶ Start'}
        </button>

        <button className="btn btn-secondary" onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>

      <div className="sessions-completed">
        Sessions completed: {sessionsCompleted} 🍅
      </div>
    </div>
  );
}

export default PomodoroTimer;

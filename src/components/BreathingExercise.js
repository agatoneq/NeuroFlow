import React, { useState, useEffect } from 'react';
import './BreathingExercise.css';

function BreathingExercise({ onClose }) {
  const [phase, setPhase] = useState('inhale');
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const phases = React.useMemo(() => ({
    inhale: { duration: 4, next: 'hold', label: 'Inhale', color: '#00d4ff' },
    hold: { duration: 4, next: 'exhale', label: 'Hold', color: '#0099ff' },
    exhale: { duration: 4, next: 'rest', label: 'Exhale', color: '#00ff88' },
    rest: { duration: 2, next: 'inhale', label: 'Rest', color: '#4caf50' }
  }), []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          const currentPhase = phases[phase];
          setPhase(currentPhase.next);
          
          if (phase === 'rest') {
            setCyclesCompleted(c => c + 1);
          }
          
          return phases[currentPhase.next].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, phases]);

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = React.useCallback(() => {
    setPhase('inhale');
    setSeconds(4);
    setCyclesCompleted(0);
    setIsActive(false);
  }, []);

  const currentPhase = phases[phase];
  const progress = ((currentPhase.duration - seconds) / currentPhase.duration) * 100;

  return (
    <div className="breathing-overlay">
      <div className="breathing-exercise card">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <h2 className="card-title">🧘‍♂️ Breathing Exercise</h2>
        
        <div className="breathing-instruction">
          The 4-4-4-2 breathing technique helps you relax and regain focus.
        </div>

        <div className="breathing-visualization">
          <div 
            className="breathing-circle"
            style={{
              transform: `scale(${phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 0.8})`,
              background: `radial-gradient(circle, ${currentPhase.color}66, ${currentPhase.color}22)`,
              boxShadow: `0 0 ${phase === 'hold' ? 80 : 40}px ${currentPhase.color}`
            }}
          >
            <div className="breathing-phase">{currentPhase.label}</div>
            <div className="breathing-count">{seconds}</div>
          </div>
        </div>

        <div className="breathing-progress">
          <div 
            className="breathing-progress-bar"
            style={{ 
              width: `${progress}%`,
              background: currentPhase.color
            }}
          />
        </div>

        <div className="phase-indicators">
          {Object.keys(phases).map(p => (
            <div 
              key={p}
              className={`phase-indicator ${phase === p ? 'active' : ''}`}
              style={{ 
                background: phase === p ? phases[p].color : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {phases[p].label}
            </div>
          ))}
        </div>

        <div className="breathing-controls">
          <button 
            className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
            onClick={toggleExercise}
          >
            {isActive ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={resetExercise}
          >
            🔄 Reset
          </button>
        </div>

        <div className="cycles-info">
          Completed cycles: {cyclesCompleted} 🌟
        </div>

        <div className="breathing-tips">
          <div className="tip-title">💡 Tips:</div>
          <ul className="tip-list">
            <li>Breathe through your nose slowly and deeply</li>
            <li>Focus on the movement of your chest</li>
            <li>Try to complete at least 3 full cycles</li>
            <li>Close your eyes for a better effect</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BreathingExercise;

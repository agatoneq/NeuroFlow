import React, { useState, useEffect } from 'react';
import './CalibrationScreen.css';
import SudokuGrid from './SudokuGrid';

function CalibrationScreen({ onComplete }) {
  const PHASE_DURATION = 0.5; 
  const BREAK_DURATION = 0.5;

  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATION);
  const [breakTime, setBreakTime] = useState(0);

  const playBeep = () => {
    const audio = new Audio(process.env.PUBLIC_URL + '/sounds/mixkit-positive-notification-951.wav');
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (breakTime > 0) {
        setBreakTime(b => (b > 1 ? b - 1 : 0));
        return;
      }

      setTimeLeft(t => {
        if (t > 1) return t - 1;

        playBeep();
        setBreakTime(BREAK_DURATION);

        if (stage === 2) {
          setTimeout(() => onComplete(), 500);
          return 0;
        }

        setStage(s => s + 1);
        return PHASE_DURATION;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, breakTime, onComplete]);

  const getStageText = () => {
    if (breakTime > 0) return 'Get ready for the next phase...';
    if (stage === 0) return 'Close your eyes. Relax and breathe calmly.';
    if (stage === 1) return 'Keep your eyes open. Try not to think.';
    return 'Stay focused and try to solve the sudoku.';
  };

  return (
    <div className="calibration-screen">
      <div className="calibration-card">
        <h2>
          {breakTime > 0
            ? 'Next phase incoming'
            : stage === 0
            ? 'Eyes Closed'
            : stage === 1
            ? 'Clear Your Mind'
            : 'Focus Task'}
        </h2>

        <p>{getStageText()}</p>

        {stage === 2 && breakTime === 0 && (
          <div className="task-box">
            <SudokuGrid />
          </div>
        )}

        <div className="timer">
          {breakTime > 0 ? `${breakTime}s` : `${timeLeft}s`}
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                ((stage * (PHASE_DURATION + BREAK_DURATION) +
                  (PHASE_DURATION - timeLeft)) /
                  (3 * (PHASE_DURATION + BREAK_DURATION))) *
                100
              }%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CalibrationScreen;

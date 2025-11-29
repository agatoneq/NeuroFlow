import React from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-card">
        <h1 className="title">NeuroFocus</h1>
        <p className="subtitle">Prepare your EEG headset</p>

        <div className="instructions">
          <h3 className="instructions-title">Calibration steps:</h3>

          <ul className="instructions-list">
            <li>
              <span className="number">1</span>
              For the first <strong>60 seconds</strong>, close your eyes and relax.
            </li>

            <li>
              <span className="number">2</span>
              For the next <strong>60 seconds</strong>, keep your eyes open and try not to think.
            </li>

            <li>
              <span className="number">3</span>
              For the final <strong>60 seconds</strong>, stay focused and solve simple tasks.
            </li>
          </ul>
        </div>

        <button className="start-btn" onClick={onStart}>
          Start Calibration
        </button>

        <p className="footer-info">
          Total time: <strong>3 minutes</strong>
        </p>
      </div>
    </div>
  );
}

export default StartScreen;

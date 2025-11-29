import React, { useState, useEffect } from 'react';
import './FocusDetector.css';

function FocusDetector({ onFocusChange }) {
  const [focusLevel, setFocusLevel] = useState(100);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionData, setDetectionData] = useState({
    mouseActivity: 100,
    keyboardActivity: 100,
    idleTime: 0,
    tabSwitches: 0
  });

  useEffect(() => {
    if (isDetecting) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [isDetecting]);

  useEffect(() => {
    const calculatedFocus = Math.max(
      0,
      Math.min(
        100,
        (detectionData.mouseActivity * 0.3 +
          detectionData.keyboardActivity * 0.4 +
          (100 - Math.min(detectionData.idleTime * 2, 100)) * 0.2 +
          (100 - Math.min(detectionData.tabSwitches * 5, 100)) * 0.1)
      )
    );
    
    setFocusLevel(Math.round(calculatedFocus));
    onFocusChange(Math.round(calculatedFocus));
  }, [detectionData, onFocusChange]);

  const startDetection = () => {
    let mouseMovements = 0;
    let keyPresses = 0;
    let lastActivity = Date.now();
    let tabSwitchCount = 0;

    const handleMouseMove = () => {
      mouseMovements++;
      lastActivity = Date.now();
    };

    const handleKeyPress = () => {
      keyPresses++;
      lastActivity = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keypress', handleKeyPress);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      const now = Date.now();
      const idleSeconds = Math.floor((now - lastActivity) / 1000);

      setDetectionData({
        mouseActivity: Math.min(100, mouseMovements * 2),
        keyboardActivity: Math.min(100, keyPresses * 5),
        idleTime: Math.min(30, idleSeconds),
        tabSwitches: tabSwitchCount
      });

      mouseMovements = Math.max(0, mouseMovements - 20);
      keyPresses = Math.max(0, keyPresses - 10);
      if (tabSwitchCount > 0) tabSwitchCount = Math.max(0, tabSwitchCount - 1);
    }, 5000);

    window._focusDetectorCleanup = () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  };

  const stopDetection = () => {
    if (window._focusDetectorCleanup) {
      window._focusDetectorCleanup();
      window._focusDetectorCleanup = null;
    }
  };

  const getFocusMessage = () => {
    if (focusLevel >= 80) return 'Great job! Your focus level is high. 🎯';
    if (focusLevel >= 60) return 'Good work! Keep maintaining your focus. 💪';
    if (focusLevel >= 40) return 'Attention! Your focus is starting to drop. ⚠️';
    return 'Time for a break! Try a breathing exercise or rest. 🧘‍♂️';
  };

  return (
    <div className="focus-detector card">
      <h3 className="card-title">🧠 Focus Detector</h3>

      <div className="detection-toggle">
        <button
          className={`btn ${isDetecting ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => setIsDetecting(!isDetecting)}
        >
          {isDetecting ? '⏸ Stop Detection' : '▶ Start Detection'}
        </button>
      </div>

      {isDetecting && (
        <>
          <div className="focus-visualization">
            <div className="focus-circle">
              <svg width="150" height="150">
                <circle
                  cx="75"
                  cy="75"
                  r="65"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="10"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="65"
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 65}`}
                  strokeDashoffset={`${2 * Math.PI * 65 * (1 - focusLevel / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div className="focus-percentage">{focusLevel}%</div>
            </div>
          </div>

          <div className="focus-message">
            {getFocusMessage()}
          </div>

          <div className="detection-metrics">
            <div className="metric">
              <span className="metric-icon">🖱️</span>
              <div className="metric-info">
                <div className="metric-label">Mouse Activity</div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${detectionData.mouseActivity}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="metric">
              <span className="metric-icon">⌨️</span>
              <div className="metric-info">
                <div className="metric-label">Keyboard Activity</div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ width: `${detectionData.keyboardActivity}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="metric">
              <span className="metric-icon">⏱️</span>
              <div className="metric-info">
                <div className="metric-label">Idle Time</div>
                <div className="metric-value">{detectionData.idleTime}s</div>
              </div>
            </div>

            <div className="metric">
              <span className="metric-icon">🔄</span>
              <div className="metric-info">
                <div className="metric-label">Tab Switches</div>
                <div className="metric-value">{detectionData.tabSwitches}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FocusDetector;

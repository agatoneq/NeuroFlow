import React from 'react';
import './Header.css';

function Header({ focusScore }) {
  const getFocusStatus = () => {
    if (focusScore >= 80) return { text: 'Excellent Focus', color: '#00ff88' };
    if (focusScore >= 60) return { text: 'Good Focus', color: '#00d4ff' };
    if (focusScore >= 40) return { text: 'Average Focus', color: '#ffaa00' };
    return { text: 'Low Focus', color: '#ff4b2b' };
  };

  const status = getFocusStatus();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">🧠 NeuroFocus</h1>
      </div>
      
      <div className="header-center">
        <div className="focus-indicator">
          <div className="focus-bar-container">
            <div 
              className="focus-bar" 
              style={{ 
                width: `${focusScore}%`,
                background: `linear-gradient(90deg, ${status.color}, ${status.color}aa)`
              }}
            />
          </div>
          <span className="focus-status" style={{ color: status.color }}>
            {status.text}
          </span>
          <span className="focus-score">{focusScore}%</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

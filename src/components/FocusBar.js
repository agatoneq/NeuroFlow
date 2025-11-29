import React from 'react';
import './FocusBar.css';

function FocusBar({ score }) {
  const getColor = () => {
    if (score >= 60) return '#00ff88';     // green
    if (score >= 40) return '#ffaa00';     // yellow
    return '#ff4b2b';                      // red
  };

  const getLabel = () => {
    if (score >= 60) return 'Focused';
    if (score >= 40) return 'Distracted';
    return 'Unfocused';
  };

  return (
    <div className="focusbar-container">
      <div className="focusbar-bar" style={{ background: getColor() }}></div>

      <div className="focusbar-label">
        {getLabel()}
      </div>
    </div>
  );
}

export default FocusBar;

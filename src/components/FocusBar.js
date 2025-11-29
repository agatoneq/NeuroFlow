import React from 'react';
import './FocusBar.css';

function FocusBar({ focusScore }) {
  const level =
    focusScore >= 70 ? 'good' :
    focusScore >= 40 ? 'medium' :
    'low';

  const label =
    level === 'good' ? 'Focused' :
    level === 'medium' ? 'Slightly distracted' :
    'Overloaded – time for a break';

  return (
    <div className="focusbar-wrapper">
      <div className="focusbar-header">
        <span className="focusbar-title">Brain Focus Level</span>
        <span className={`focusbar-label ${level}`}>{label}</span>
      </div>

      <div className="focusbar-track">
        <div
          className={`focusbar-fill ${level}`}
          style={{ width: `${Math.max(0, Math.min(focusScore, 100))}%` }}
        />
      </div>

      <div className="focusbar-score">
        {Math.round(focusScore)}%
      </div>
    </div>
  );
}

export default FocusBar;

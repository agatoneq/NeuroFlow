import React, { useEffect, useState } from "react";
import "./MiniSidebar.css";

function MiniSidebar({ focusScore, pomodoroState, intervention }) {
  const getColor = () => {
    if (focusScore >= 80) return "#00ff88";
    if (focusScore >= 60) return "#00d4ff";
    if (focusScore >= 40) return "#ffaa00";
    return "#ff4b2b";
  };

  return (
    <div className="mini-sidebar">
      <h3 className="mini-title">NeuroFocus</h3>

      <div className="mini-section">
        <div className="mini-label">Focus</div>
        <div className="mini-focus-bar">
          <div
            className="mini-focus-fill"
            style={{ width: `${focusScore}%`, background: getColor() }}
          />
        </div>
        <div className="mini-focus-status" style={{ color: getColor() }}>
          {focusScore < 40 ? "Low" : focusScore < 60 ? "Average" : focusScore < 80 ? "Good" : "Excellent"}
        </div>
      </div>

      <div className="mini-section">
        <div className="mini-label">Pomodoro</div>
        <div className="mini-timer">
          {pomodoroState}
        </div>
      </div>

      {intervention && (
        <div className="mini-intervention">
          {intervention}
        </div>
      )}
    </div>
  );
}

export default MiniSidebar;

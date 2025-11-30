import React from "react";
import "./FocusBar.css";

function FocusBar({ eeg }) {
  let color = "#00ff88";
  let text = "High Focus";

  if (eeg === -1) {
    color = "#ff3b3b";
    text = "Low Focus";
  } else if (eeg === 0) {
    color = "#ffcc00";
    text = "Medium Focus";
  } else if (eeg === 1) {
    color = "#00ff88";
    text = "High Focus";
  } else {
    color = "#555";
    text = "Waiting for data...";
  }

  return (
    <div className="focusbar-container">
      <div className="focusbar-bar" style={{ background: color }} />
      <div className="focusbar-label">{text}</div>
    </div>
  );
}

export default FocusBar;

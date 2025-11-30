import React from "react";
import "./InterventionBubble.css";

function InterventionBubble({ message, level }) {
  if (!message) return null;

  return (
    <div className={`bubble bubble-${level}`}>
      <p>{message}</p>
    </div>
  );
}

export default InterventionBubble;

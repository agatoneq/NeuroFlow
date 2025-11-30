import React from "react";
import "./InterventionPopup.css";

function InterventionPopup({ message, onClose }) {
  return (
    <div className="intervention-popup">
      <div className="popup-content">
        <p>{message}</p>
        <button className="popup-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default InterventionPopup;

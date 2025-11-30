import React from "react";
import "./DeepIntervention.css";

function DeepIntervention({ active }) {
  if (!active) return null;

  return (
    <div className="intervention-overlay">
      <div className="intervention-box">
        <h1 className="intervention-title">
          You need a reset 🧘‍♀️
        </h1>

        <p className="intervention-text">
          You are exhausted. Take 60 seconds to breathe and reset your mind.
        </p>

        <div className="cat-wrapper">
          <video
            src="../public/breathing_cat.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="cat-video"
          />
        </div>

        <p className="breathing-guide">
          Inhale 4s – Hold 4s – Exhale 4s  
        </p>
      </div>
    </div>
  );
}

export default DeepIntervention;

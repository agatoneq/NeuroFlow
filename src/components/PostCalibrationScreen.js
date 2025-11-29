import React from "react";
import "./PostCalibrationScreen.css";

function PostCalibrationScreen({ onContinue }) {
  return (
    <div className="postcal-screen">
      <div className="postcal-card fade-in">
        <h1 className="postcal-title">Calibration Complete</h1>

        <p className="postcal-text">
          Your brain activity profile has been successfully calibrated.
        </p>

        <p className="postcal-text">
          From now on, we will continuously monitor:<br/>
          <strong>• focus</strong>, <strong>• stress levels</strong>, <strong>• mind wandering</strong><br/>
          to help you stay in the optimal mental state.
        </p>

        <p className="postcal-slogan">
          Enjoy your work - we'll take care of your concentration.
        </p>

        <button className="postcal-btn" onClick={onContinue}>
          Start Working
        </button>
      </div>
    </div>
  );
}

export default PostCalibrationScreen;

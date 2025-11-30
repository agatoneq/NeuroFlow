import React, { useEffect, useState, useRef } from "react";
import "./DesktopWidget.css";
import FocusBar from "./FocusBar";
import PomodoroTimer from "./PomodoroTimer";

function DesktopWidget() {
  const [eyeState, setEyeState] = useState(null);
  const [message, setMessage] = useState("");
  const lastIntervention = useRef(0);
  const flip = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/state_eye.json?ts=" + Date.now())
        .then(res => res.json())
        .then(data => setEyeState(data))
        .catch(() => {});
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!eyeState) return;
    const now = Date.now();
    if (eyeState.eye === 0 && now - lastIntervention.current >= 15000) {
      lastIntervention.current = now;
      if (flip.current === 0) {
        setMessage("Hey! Let's get back to the task 👀");
        flip.current = 1;
      } else {
        setMessage("Look at a distant object for 20 seconds.");
        flip.current = 0;
      }
    }
  }, [eyeState]);

  return (
    <div className="widget">
      <h3 className="widget-title">NeuroFlow</h3>

      <div className="widget-section">
        <h4>Focus</h4>
        <FocusBar score={eyeState?.eye === 0 ? 20 : 80} />
      </div>

      <div className="widget-section">
        <h4>Pomodoro</h4>
        <PomodoroTimer compactMode={true} />
      </div>

      {message && (
        <div className="widget-message">
          {message}
        </div>
      )}
    </div>
  );
}

export default DesktopWidget;

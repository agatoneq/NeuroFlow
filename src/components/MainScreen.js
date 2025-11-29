import React, { useEffect, useState, useRef } from "react";
import "./MainScreen.css";
import FocusBar from "./FocusBar";
import PomodoroTimer from "./PomodoroTimer";
import AmbientSounds from "./AmbientSounds";
import MusicPlayerSpotify from "./MusicPlayerSpotify";

function MainScreen({ focusScore, onRecalibrate }) {
  const [brainState, setBrainState] = useState(null);
  const lastInterventionRef = useRef(0);
  const flipRef = useRef(0); // 0 → typ 1, 1 → typ 2

  // 🔥 Fetch brain state every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/state.json?ts=" + Date.now())
        .then((res) => res.json())
        .then((data) => setBrainState(data))
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 💥 Micro-intervention system
  useEffect(() => {
    if (!brainState) return;

    const now = Date.now();
    const MIN_DELAY = 15000; // 15 seconds

    // condition to trigger intervention
    if (brainState.eye === 0 && now - lastInterventionRef.current > MIN_DELAY) {
      lastInterventionRef.current = now; // spam lock

      if (flipRef.current === 0) {
        showNotification("Hej! Wracamy do zadania.");
        flipRef.current = 1;
      } else {
        showNotification("Odpływasz. Spójrz na daleki obiekt na 20 sekund.");
        flipRef.current = 0;
      }
    }
  }, [brainState]);

  // 🔔 Notification (browser or fallback)
  const showNotification = (msg) => {
    if (Notification.permission === "granted") {
      new Notification("NeuroFocus", { body: msg });
    } else {
      alert(msg);
    }
  };

  return (
    <div className="main-screen">
      <button className="recalibrate-btn" onClick={onRecalibrate}>
        Recalibrate
      </button>

      {/* Focus Level Section */}
      <div className="section">
        <h2>Focus Level</h2>
        <FocusBar score={focusScore} />
      </div>

      {/* Horizontal row: Pomodoro, Ambient Sounds, Spotify */}
      <div className="section-row">
        <div className="section">
          <h2>Pomodoro</h2>
          <PomodoroTimer lockWhenDistracted={focusScore < 40} />
        </div>

        <div className="section">
          <h2>Ambient Sounds</h2>
          <AmbientSounds />
        </div>

        <div className="section">
          <h2>Spotify Player</h2>
          <MusicPlayerSpotify />
        </div>
      </div>
    </div>
  );
}

export default MainScreen;

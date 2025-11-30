import React, { useEffect, useState, useRef } from "react";
import "./MainScreen.css";
import FocusBar from "./FocusBar";
import PomodoroTimer from "./PomodoroTimer";
import AmbientSounds from "./AmbientSounds";
import MusicPlayerSpotify from "./MusicPlayerSpotify";

function MainScreen({ onRecalibrate }) {
  const [brainData, setBrainData] = useState({ eeg: 1 });
  const [eyeState, setEyeState] = useState({ eye: 1 });

  const lastIntervention = useRef(0);
  const flip = useRef(0);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/state", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          console.log("EEG:", data);
          setBrainData(data);
        });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3001/state_eye", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
          console.log("EYE:", data);
          setEyeState(data);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!eyeState) return;
    const now = Date.now();
    if (eyeState.eye === 0 && now - lastIntervention.current >= 5000) {
      lastIntervention.current = now;
      if (flip.current === 0) {
        showNotification("Hey! Let's get back to the task 👀");
        flip.current = 1;
      } else {
        showNotification("You're drifting. Look at a distant object for 20 seconds.");
        flip.current = 0;
      }
    }
  }, [eyeState]);

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

      <div className="section">
        <h2>Focus Level</h2>
        <FocusBar eeg={brainData.eeg} />
      </div>

      <div className="section-row">
        <div className="section">
          <h2>Pomodoro</h2>
          <PomodoroTimer lockWhenDistracted={brainData.eeg === -1} />
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

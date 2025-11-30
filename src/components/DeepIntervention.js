import React, { useEffect, useState } from "react";
import "./DeepIntervention.css";

function DeepIntervention({ active }) {
  const [phase, setPhase] = useState("inhale"); 
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    if (!active) return;

    let interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          setPhase(p => {
            if (p === "inhale") return "hold";
            if (p === "hold") return "exhale";
            return "inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="intervention-overlay">
      <div className="intervention-box">

        <h1 className="intervention-title">Deep Reset 🧘‍♀️</h1>

        <p className="intervention-text">
          Breathe along with the cat. This is a full 60-second reset for your nervous system.
        </p>

        <div className="cat-wrapper">
          <video
            src="/breathing_cat.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="cat-video"
          />
        </div>

        <p className="breathing-phase">
          {phase === "inhale" && "Inhale – 4s"}
          {phase === "hold" && "Hold – 4s"}
          {phase === "exhale" && "Exhale – 4s"}
        </p>

        <div className="breathing-progress">
          <div
            className="breathing-progress-fill"
            style={{ width: `${(timer / 4) * 100}%` }}
          ></div>
        </div>

      </div>
    </div>
  );
}

export default DeepIntervention;

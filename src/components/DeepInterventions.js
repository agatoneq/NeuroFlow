import React, { useEffect, useState } from "react";
import "./DeepIntervention.css";

function DeepIntervention({ active }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!active) return;

    setTimeLeft(60);

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="deep-overlay">
      <div className="deep-box">
        <h1 className="deep-title">You need a break.</h1>
        <p className="deep-desc">
          Your brain is overstressed.  
          Do a 60-second reset with calm breathing.
        </p>

        <video 
          src="/breathing_cat.mp4"
          autoPlay
          loop
          muted
          className="deep-video"
        />

        <div className="deep-timer">{timeLeft}s</div>
      </div>
    </div>
  );
}

export default DeepIntervention;

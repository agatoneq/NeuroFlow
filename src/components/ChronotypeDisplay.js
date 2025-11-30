import React from "react";
import "./ChronotypeDisplay.css";
import Owl from "./Owl";

function ChronotypeDisplay() {
  const chronotype = "Owl";
  const suggestedHours = "3 PM – 11 PM";

  return (
    <div className="chronotype-panel">
      <div className="owl-box">
        <Owl width={80} height={80} />
      </div>

      <div className="chrono-text">
        <h3 className="chrono-title">{chronotype}</h3>
        <p className="chrono-desc">
          Based on your patterns, your chronotype is an <strong>{chronotype}</strong>.
        </p>
        <p className="chrono-hours">
          Optimal productivity hours: <strong>{suggestedHours}</strong>
        </p>
      </div>
    </div>
  );
}

export default ChronotypeDisplay;

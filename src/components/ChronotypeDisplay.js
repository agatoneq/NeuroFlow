import React from "react";
import "./ChronotypeDisplay.css";

function ChronotypeDisplay() {
  // Hardcoded placeholder data
  const chronotype = {
    animal: "🦉", // we can change to SVG later
    type: "Owl",
    message: "Your chronotype is an Owl!"
  };

  return (
    <div className="chronotype-container">
      <div className="chronotype-animal">{chronotype.animal}</div>
      <div className="chronotype-message">{chronotype.message}</div>
    </div>
  );
}

export default ChronotypeDisplay;

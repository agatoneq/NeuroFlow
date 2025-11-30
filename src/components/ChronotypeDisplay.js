import React from "react";
import Owl from "./Owl"; // import the SVG component
import "./ChronotypeDisplay.css";

function ChronotypeDisplay() {
  return (
    <div className="chronotype-container">
      <Owl width={100} height={100} />
      <div className="chronotype-message">Your chronotype is an Owl!</div>
    </div>
  );
}

export default ChronotypeDisplay;

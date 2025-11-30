import React from "react";
import Owl from "../assets/owl.svg"; // path to your SVG
import "./ChronotypeDisplay.css";

function ChronotypeDisplay() {
  return (
    <div className="chronotype-container">
      <img src={Owl} alt="Owl" className="chronotype-owl" />
      <div className="chronotype-message">Your chronotype is an Owl!</div>
    </div>
  );
}

export default ChronotypeDisplay;

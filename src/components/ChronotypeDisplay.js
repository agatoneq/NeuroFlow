import React from "react";
import Owl from "./Owl";
import "./ChronotypeDisplay.css";

function ChronotypeDisplay() {
  const chronotype = "owl";

  const TYPES = {
    owl: {
      title: "Your chronotype: Owl",
      desc: "You tend to feel most focused later in the day.",
      hours: "Best working hours: 14:00–22:00"
    },
    lark: {
      title: "Your chronotype: Lark",
      desc: "You feel most productive early in the morning.",
      hours: "Best working hours: 06:00–12:00"
    },
    bear: {
      title: "Your chronotype: Bear",
      desc: "Your energy follows the natural daylight cycle.",
      hours: "Best working hours: 09:00–17:00"
    },
    dolphin: {
      title: "Your chronotype: Dolphin",
      desc: "Your focus comes in shorter bursts throughout the day.",
      hours: "Best working hours: 10:00–16:00"
    }
  };

  const data = TYPES[chronotype] || TYPES.owl;

  return (
    <div className="chronotype-panel">
      <div className="owl-box">
        <Owl width={70} height={70} />
      </div>

      <div className="chrono-text">
        <div className="chrono-title">{data.title}</div>
        <div className="chrono-desc">{data.desc}</div>
        <div className="chrono-hours">{data.hours}</div>
      </div>
    </div>
  );
}

export default ChronotypeDisplay;

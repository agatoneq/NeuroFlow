import React from "react";

function Owl({ width = 100, height = 100 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 64 64"
    >
      <ellipse cx="32" cy="40" rx="20" ry="24" fill="#3b4a6b" />

      <ellipse cx="32" cy="46" rx="12" ry="16" fill="#56688a" />

      <ellipse cx="12" cy="40" rx="6" ry="14" fill="#2f3a58" />
      <ellipse cx="52" cy="40" rx="6" ry="14" fill="#2f3a58" />

      <circle cx="32" cy="24" r="16" fill="#4d6085" />

      <circle cx="24" cy="24" r="6" fill="#ffffff" />
      <circle cx="40" cy="24" r="6" fill="#ffffff" />

      <circle cx="24" cy="24" r="3" fill="#001020" />
      <circle cx="40" cy="24" r="3" fill="#001020" />

      <circle cx="23" cy="23" r="1.2" fill="#ffffff" />
      <circle cx="39" cy="23" r="1.2" fill="#ffffff" />

      <polygon points="32,28 28,34 36,34" fill="#00d4ff" />

      <polygon points="20,12 24,2 28,12" fill="#3b4a6b" />
      <polygon points="36,12 40,2 44,12" fill="#3b4a6b" />

      <circle cx="20" cy="32" r="2.5" fill="#ff8fa2" opacity="0.8" />
      <circle cx="44" cy="32" r="2.5" fill="#ff8fa2" opacity="0.8" />

      <path d="M22 45 q10 10 20 0"
        stroke="#3b4a6b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 50 q10 10 20 0"
        stroke="#3b4a6b" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default Owl;

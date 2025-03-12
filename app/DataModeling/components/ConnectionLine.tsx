import React from "react";

interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isActive: boolean;
  onClick: () => void;
}

const ConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  isActive,
  onClick,
}: ConnectionLineProps) => {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  const path = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  return (
    <g onClick={onClick} className="cursor-pointer">
      {/* Main connection line */}
      <path
        d={path}
        fill="none"
        stroke={isActive ? "#3b82f6" : "#94a3b8"}
        strokeWidth={isActive ? 2 : 1.5}
        strokeDasharray={isActive ? "none" : "4,4"}
      />

      {/* Start point */}
      <circle
        cx={fromX}
        cy={fromY}
        r={4}
        fill="white"
        stroke={isActive ? "#3b82f6" : "#94a3b8"}
        strokeWidth={1.5}
      />

      {/* End point */}
      <circle
        cx={toX}
        cy={toY}
        r={4}
        fill="white"
        stroke={isActive ? "#3b82f6" : "#94a3b8"}
        strokeWidth={1.5}
      />

      {/* Invisible wider path for easier clicking */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={10}
        className="opacity-0"
      />
    </g>
  );
};

export default ConnectionLine;

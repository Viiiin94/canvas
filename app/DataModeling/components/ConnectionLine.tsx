interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isActive?: boolean;
  onClick?: () => void;
}

const ConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
  isActive = false,
  onClick,
}: ConnectionLineProps) => {
  // Calculate control points for a curved line
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Adjust curve based on distance
  const curveFactor = Math.min(0.3, 100 / distance);

  // Create control points for a curved path
  const controlX1 = fromX + dx * curveFactor;
  const controlY1 = fromY + dy * 0.1;
  const controlX2 = toX - dx * curveFactor;
  const controlY2 = toY - dy * 0.1;

  // Create a curved path
  const path = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;

  return (
    <g onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
      {/* Main connection line */}
      <path
        d={path}
        fill="none"
        stroke={isActive ? "#3b82f6" : "#94a3b8"}
        strokeWidth={isActive ? 2 : 1.5}
        strokeDasharray={isActive ? "none" : "4,4"}
        pointerEvents="stroke"
      />

      {/* Invisible wider path for easier clicking */}
      {onClick && (
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={10}
          className="opacity-0"
          pointerEvents="stroke"
        />
      )}
    </g>
  );
};

export default ConnectionLine;

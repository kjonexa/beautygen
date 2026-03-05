// Shared decorative SVG elements for beauty content templates

interface DecProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

// 4-pointed sparkle star
export function Sparkle({ size = 18, color = "#C2185B", opacity = 0.35, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }} className={className}>
      <path d="M10 0 L11.2 8.2 L20 10 L11.2 11.8 L10 20 L8.8 11.8 L0 10 L8.8 8.2 Z" fill={color} />
    </svg>
  );
}

// Small 4-pointed sparkle (for clusters)
export function SparkleSmall({ size = 10, color = "#C2185B", opacity = 0.4, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }} className={className}>
      <path d="M10 0 L11.2 8.2 L20 10 L11.2 11.8 L10 20 L8.8 11.8 L0 10 L8.8 8.2 Z" fill={color} />
    </svg>
  );
}

// 5-petal flower
export function Floral({ size = 26, color = "#F8BBD9", opacity = 0.75, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} className={className}>
      <ellipse cx="20" cy="10" rx="5" ry="10" fill={color} />
      <ellipse cx="20" cy="10" rx="5" ry="10" transform="rotate(72 20 20)" fill={color} />
      <ellipse cx="20" cy="10" rx="5" ry="10" transform="rotate(144 20 20)" fill={color} />
      <ellipse cx="20" cy="10" rx="5" ry="10" transform="rotate(216 20 20)" fill={color} />
      <ellipse cx="20" cy="10" rx="5" ry="10" transform="rotate(288 20 20)" fill={color} />
      <circle cx="20" cy="20" r="5" fill={color} />
    </svg>
  );
}

// Simple 6-petal blossom
export function Blossom({ size = 30, color = "#F8BBD9", opacity = 0.6, className }: DecProps) {
  const petals = Array.from({ length: 6 }, (_, i) => i * 60);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} className={className}>
      {petals.map((angle, i) => (
        <ellipse key={i} cx="20" cy="12" rx="4" ry="9" fill={color} transform={`rotate(${angle} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="5" fill={color} />
    </svg>
  );
}

// Dot cluster (3x3)
export function Dots({ size = 28, color = "#C2185B", opacity = 0.2, className }: DecProps) {
  const positions = [0, 8, 16];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }} className={className}>
      {positions.map((x) =>
        positions.map((y) => <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="2" fill={color} />)
      )}
    </svg>
  );
}

// Wavy line
export function Wave({ width = 50, height = 12, color = "#C2185B", opacity = 0.3, className }: DecProps & { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ opacity }} className={className}>
      <path
        d={`M0 ${height / 2} Q${width / 6} 0 ${width / 3} ${height / 2} Q${(width * 2) / 3} ${height} ${(width * 5) / 6} ${height / 2} Q${width} ${height / 4} ${width} ${height / 2}`}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Leaf / botanical
export function Leaf({ size = 22, color = "#3A6B48", opacity = 0.45, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }} className={className}>
      <path d="M15 28 C15 28 2 20 2 10 C2 4 8 2 15 2 C22 2 28 4 28 10 C28 20 15 28 15 28Z" fill={color} />
      <path d="M15 28 L15 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 16 L10 12" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <path d="M15 20 L20 16" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Heart
export function Heart({ size = 18, color = "#E91E8C", opacity = 0.4, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }} className={className}>
      <path d="M12 21 C12 21 2 14 2 7.5 C2 4.5 4.5 2 7.5 2 C9.5 2 11.5 3.5 12 5 C12.5 3.5 14.5 2 16.5 2 C19.5 2 22 4.5 22 7.5 C22 14 12 21 12 21Z" fill={color} />
    </svg>
  );
}

// Diamond / rhombus
export function Diamond({ size = 14, color = "#C2185B", opacity = 0.35, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }} className={className}>
      <path d="M10 0 L20 10 L10 20 L0 10 Z" fill={color} />
    </svg>
  );
}

// Lipstick (simplified)
export function LipstickIcon({ size = 24, color = "#C2185B", opacity = 0.4, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 40" fill="none" style={{ opacity }} className={className}>
      <rect x="7" y="18" width="10" height="18" rx="1" fill={color} />
      <path d="M7 18 L17 18 L14 8 Q12 4 12 4 Q12 4 10 8 Z" fill={color} />
      <rect x="5" y="30" width="14" height="8" rx="2" fill={color} opacity="0.6" />
    </svg>
  );
}

// Abstract circle ring
export function Ring({ size = 28, color = "#C2185B", opacity = 0.2, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} className={className}>
      <circle cx="20" cy="20" r="17" stroke={color} strokeWidth="6" />
    </svg>
  );
}

// Corner sparkle cluster
export function SparkleCluster({ size = 40, color = "#C2185B", opacity = 0.35, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} className={className}>
      <path d="M30 5 L31.5 12 L38 13.5 L31.5 15 L30 22 L28.5 15 L22 13.5 L28.5 12 Z" fill={color} />
      <path d="M12 25 L13 29 L17 30 L13 31 L12 35 L11 31 L7 30 L11 29 Z" fill={color} />
      <circle cx="8" cy="10" r="2.5" fill={color} />
    </svg>
  );
}

// Arc / half circle decoration
export function Arc({ size = 36, color = "#F8BBD9", opacity = 0.5, className }: DecProps) {
  return (
    <svg width={size} height={size / 2} viewBox="0 0 60 30" fill="none" style={{ opacity }} className={className}>
      <path d="M0 30 Q30 0 60 30" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Ingredient / molecule dots
export function Molecule({ size = 32, color = "#3A6B48", opacity = 0.3, className }: DecProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }} className={className}>
      <circle cx="20" cy="20" r="5" fill={color} />
      <circle cx="8" cy="12" r="4" fill={color} />
      <circle cx="32" cy="12" r="4" fill={color} />
      <circle cx="8" cy="28" r="3" fill={color} />
      <circle cx="32" cy="28" r="3" fill={color} />
      <line x1="20" y1="20" x2="8" y2="12" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="20" x2="32" y2="12" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="20" x2="8" y2="28" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="20" x2="32" y2="28" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

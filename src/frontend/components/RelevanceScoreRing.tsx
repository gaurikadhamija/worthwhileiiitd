import React from 'react';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const RelevanceScoreRing: React.FC<Props> = ({
  score,
  size = 'md',
  showLabel = true,
  onClick
}) => {
  const radius = size === 'lg' ? 28 : size === 'md' ? 20 : 14;
  const stroke = size === 'lg' ? 4.5 : size === 'md' ? 3.5 : 2.5;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimension = radius * 2 + 4;

  // Determine accent color based on score tier
  const ringColor = score >= 90 ? '#6B1E23' : score >= 80 ? '#8B2C33' : '#B99A6B';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex items-center gap-2 ${onClick ? 'cursor-pointer group' : ''}`}
      title={onClick ? 'Click to inspect score breakdown' : undefined}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg height={dimension} width={dimension} className="transform -rotate-90">
          <circle
            stroke="#E8DCC8"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
          <circle
            stroke={ringColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={dimension / 2}
            cy={dimension / 2}
          />
        </svg>
        <span
          className={`absolute font-bold tabular-nums text-[#2C0F12] ${
            size === 'lg' ? 'text-base' : size === 'md' ? 'text-xs' : 'text-[10px]'
          }`}
        >
          {score}
        </span>
      </div>

      {showLabel && (
        <div className="text-left leading-tight">
          <div className="text-[10px] tracking-wider uppercase font-semibold text-[#6B1E23] group-hover:underline">
            Match
          </div>
          <div className="text-[11px] font-medium text-[#5A3828]">
            {score >= 90 ? 'High Fit' : score >= 80 ? 'Good Fit' : 'Moderate'}
          </div>
        </div>
      )}
    </div>
  );
};

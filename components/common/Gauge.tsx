import React from 'react';

interface GaugeProps {
  value: number; // 0-100
  label: string;
  color: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, label, color }) => {
  const circumference = 30 * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full">
        <svg className="w-16 h-16">
          <circle
            className="text-border"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r="30"
            cx="32"
            cy="32"
          />
          <circle
            className={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="30"
            cx="32"
            cy="32"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
        <span className="absolute text-xl font-bold text-text-primary">{value}</span>
      </div>
      <span className="text-xs text-text-secondary mt-1">{label}</span>
    </div>
  );
};

export default Gauge;

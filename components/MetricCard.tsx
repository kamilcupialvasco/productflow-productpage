
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, onClick }) => {
  const isClickable = !!onClick;
  return (
    <div 
        className={`bg-vasco-dark-card p-6 rounded-lg border border-vasco-dark-border transition-all duration-200 ${isClickable ? 'cursor-pointer hover:border-vasco-primary hover:shadow-lg' : ''}`}
        onClick={onClick}
    >
      <h3 className="text-sm font-medium text-vasco-text-secondary">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-vasco-text-primary">{value}</p>
    </div>
  );
};

export default MetricCard;

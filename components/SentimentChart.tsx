
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Insight, Sentiment } from '../types';

interface SentimentChartProps {
  data: Insight[];
  onSliceClick: (sentiment: Sentiment) => void;
}

const COLORS = {
  [Sentiment.Positive]: '#22c55e', // green
  [Sentiment.Negative]: '#ef4444', // red
  [Sentiment.Neutral]: '#64748b',  // slate
};

const SentimentChart: React.FC<SentimentChartProps> = ({ data, onSliceClick }) => {
  const sentimentCounts = data.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<Sentiment, number>);

  const chartData = Object.entries(sentimentCounts).map(([name, value]) => ({
    name: name as Sentiment,
    value,
  }));

  return (
    <div className="bg-vasco-dark-card p-6 rounded-lg border border-vasco-dark-border h-full">
      <h3 className="text-lg font-semibold text-vasco-text-primary mb-4">Sentiment Analysis</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              onClick={(data) => onSliceClick(data.name as Sentiment)}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1a202c', 
                    borderColor: '#4a5568',
                    borderRadius: '0.5rem'
                }}
            />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentChart;

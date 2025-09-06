
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Insight } from '../types';

interface CategoryBreakdownChartProps {
  data: Insight[];
  onBarClick: (category: string) => void;
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data, onBarClick }) => {
  const categoryCounts = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  })).sort((a,b) => b.count - a.count);

  return (
    <div className="bg-vasco-dark-card p-6 rounded-lg border border-vasco-dark-border h-full">
      <h3 className="text-lg font-semibold text-vasco-text-primary mb-4">Insights by Category</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis type="number" stroke="#a0aec0" />
            <YAxis dataKey="name" type="category" stroke="#a0aec0" width={100} tick={{fontSize: 12}} />
            <Tooltip
                cursor={{fill: '#2d3748'}}
                contentStyle={{ 
                    backgroundColor: '#1a202c', 
                    borderColor: '#4a5568',
                    borderRadius: '0.5rem'
                }}
            />
            <Legend />
            <Bar 
                dataKey="count" 
                name="Insight Count" 
                fill="#4f46e5" 
                barSize={20} 
                onClick={(data) => onBarClick(data.name)}
                className="cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;

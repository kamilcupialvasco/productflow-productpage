import React from 'react';

interface HeatmapProps {
  data: Record<string, Record<string, number>>;
  rows: string[];
  cols: string[];
  rowLabel: string;
  colLabel: string;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, rows, cols, rowLabel, colLabel }) => {
  const maxValue = Math.max(1, ...Object.values(data).flatMap(row => Object.values(row)));

  const getColor = (value: number) => {
    if (value === 0) return 'bg-zinc-800/50';
    const intensity = Math.min(100, Math.floor((value / maxValue) * 100));
    // HSL for blue scale: H(220), S(80%), L(variable)
    return `hsl(220, 80%, ${90 - intensity * 0.5}%)`;
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-center border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="px-2 py-2 text-left text-xs font-normal text-text-secondary">{rowLabel} \ {colLabel}</th>
            {cols.map(col => (
              <th key={col} className="p-2 text-xs font-normal text-text-secondary whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(rowKey => (
            <tr key={rowKey} className="border-b border-border/50">
              <td className="p-2 font-medium text-left text-text-primary whitespace-nowrap">{rowKey}</td>
              {cols.map(colKey => {
                const value = data[rowKey]?.[colKey] || 0;
                return (
                  <td key={colKey} className="p-0.5">
                    <div
                      className="w-full h-10 flex items-center justify-center rounded-md font-bold text-black"
                      style={{ backgroundColor: getColor(value) }}
                      title={`${rowKey} & ${colKey}: ${value}`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Heatmap;

import React from 'react';
import type { MetricEntry, MetricType } from '../../types';
import { METRIC_DEFINITIONS } from './MetricsConfig';

type MetricsChartProps = {
  entries: MetricEntry[];
  type: MetricType;
};

function MetricsChart({ entries, type }: MetricsChartProps) {
  const metric = METRIC_DEFINITIONS[type];
  
  const sortedEntries = entries
    .filter(entry => entry.type === type)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sortedEntries.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        No data available for {metric.label.toLowerCase()}
      </div>
    );
  }

  if (sortedEntries.length < 2) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        Need at least two data points to show trend
      </div>
    );
  }

  // Calculate chart dimensions and scales
  const maxValue = Math.max(...sortedEntries.map(e => e.value));
  const minValue = Math.min(...sortedEntries.map(e => e.value));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  const dates = sortedEntries.map(e => new Date(e.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dateRange = maxDate - minDate;

  // Calculate trend direction and percentage change
  const firstValue = sortedEntries[0].value;
  const lastValue = sortedEntries[sortedEntries.length - 1].value;
  const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
  const trendDirection = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{metric.label} Trend</h3>
          <div className={`text-sm ${
            trendDirection === 'up' ? 'text-green-600' :
            trendDirection === 'down' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {Math.abs(percentageChange).toFixed(1)}% {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→'}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Latest: {lastValue} {metric.unit}
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{Math.ceil(maxValue + padding)}</span>
          <span>{Math.floor(minValue - padding)}</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-8 border-l border-b border-gray-200">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${i * 25}%` }}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full border-l border-gray-100"
                style={{ left: `${i * 20}%` }}
              />
            ))}
          </div>

          {/* SVG for line connecting points */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <polyline
              points={sortedEntries.map((entry, index) => {
                const x = (index / (sortedEntries.length - 1)) * 100;
                const y = 100 - (((entry.value - (minValue - padding)) / ((maxValue + padding) - (minValue - padding))) * 100);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke={trendDirection === 'up' ? '#059669' : trendDirection === 'down' ? '#DC2626' : '#6B7280'}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Data points */}
          {sortedEntries.map((entry, index) => {
            const x = (index / (sortedEntries.length - 1)) * 100;
            const y = ((entry.value - (minValue - padding)) / ((maxValue + padding) - (minValue - padding))) * 100;
            
            return (
              <div
                key={index}
                className="absolute group"
                style={{
                  left: `${x}%`,
                  top: `${100 - y}%`,
                  transform: 'translate(-50%, 50%)',
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-150 ${
                    index === sortedEntries.length - 1 ? 'bg-green-500' : 'bg-indigo-600'
                  }`}
                />
                
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition-opacity z-10">
                  {entry.value} {metric.unit}
                  <br />
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis dates */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-gray-500">
          {sortedEntries.map((entry, index) => (
            <div
              key={index}
              className="transform -rotate-45 origin-top-left whitespace-nowrap"
              style={{ marginLeft: '8px' }}
            >
              {new Date(entry.date).toLocaleDateString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MetricsChart;
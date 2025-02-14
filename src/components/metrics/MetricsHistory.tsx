import React from 'react';
import { Trash2 } from 'lucide-react';
import type { MetricEntry } from '../../types';
import { METRIC_DEFINITIONS } from './MetricsConfig';

type MetricsHistoryProps = {
  entries: MetricEntry[];
  onDeleteEntry?: (id: string) => void;
};

function MetricsHistory({ entries, onDeleteEntry }: MetricsHistoryProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Metrics History</h3>
      </div>
      
      <div className="divide-y">
        {sortedEntries.map((entry) => {
          const metric = METRIC_DEFINITIONS[entry.type];
          return (
            <div
              key={entry.id}
              className="p-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{metric.label}</div>
                <div className="text-sm text-gray-600">
                  {entry.value} {metric.unit} on{' '}
                  {new Date(entry.date).toLocaleDateString()}
                </div>
                {entry.notes && (
                  <div className="text-sm text-gray-500 mt-1">{entry.notes}</div>
                )}
              </div>
              {onDeleteEntry && (
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-2 hover:bg-red-100 rounded-full text-red-600"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
        
        {entries.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No metrics recorded yet
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricsHistory;
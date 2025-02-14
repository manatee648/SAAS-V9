import React from 'react';
import type { MetricEntry, User } from '../../types';
import { METRIC_DEFINITIONS } from './MetricsConfig';
import MetricsEntry from './MetricsEntry';
import MetricsChart from './MetricsChart';
import MetricsHistory from './MetricsHistory';

// Mock metrics data with proper dates and values
const MOCK_METRICS: MetricEntry[] = [
  // Weight tracking over time
  {
    id: '1',
    athleteId: '2',
    type: 'weight',
    value: 180,
    date: new Date('2024-01-01'),
  },
  {
    id: '2',
    athleteId: '2',
    type: 'weight',
    value: 178,
    date: new Date('2024-01-08'),
  },
  {
    id: '3',
    athleteId: '2',
    type: 'weight',
    value: 176,
    date: new Date('2024-01-15'),
  },
  {
    id: '4',
    athleteId: '2',
    type: 'weight',
    value: 175,
    date: new Date('2024-01-22'),
  },

  // Bench Press progression
  {
    id: '5',
    athleteId: '2',
    type: 'benchPress',
    value: 225,
    date: new Date('2024-01-01'),
  },
  {
    id: '6',
    athleteId: '2',
    type: 'benchPress',
    value: 230,
    date: new Date('2024-01-08'),
  },
  {
    id: '7',
    athleteId: '2',
    type: 'benchPress',
    value: 235,
    date: new Date('2024-01-15'),
  },
  {
    id: '8',
    athleteId: '2',
    type: 'benchPress',
    value: 240,
    date: new Date('2024-01-22'),
  },

  // Squat progression
  {
    id: '9',
    athleteId: '2',
    type: 'squat',
    value: 275,
    date: new Date('2024-01-01'),
  },
  {
    id: '10',
    athleteId: '2',
    type: 'squat',
    value: 285,
    date: new Date('2024-01-08'),
  },
  {
    id: '11',
    athleteId: '2',
    type: 'squat',
    value: 295,
    date: new Date('2024-01-15'),
  },
  {
    id: '12',
    athleteId: '2',
    type: 'squat',
    value: 305,
    date: new Date('2024-01-22'),
  },

  // Deadlift progression
  {
    id: '13',
    athleteId: '2',
    type: 'deadlift',
    value: 315,
    date: new Date('2024-01-01'),
  },
  {
    id: '14',
    athleteId: '2',
    type: 'deadlift',
    value: 325,
    date: new Date('2024-01-08'),
  },
  {
    id: '15',
    athleteId: '2',
    type: 'deadlift',
    value: 335,
    date: new Date('2024-01-15'),
  },
  {
    id: '16',
    athleteId: '2',
    type: 'deadlift',
    value: 345,
    date: new Date('2024-01-22'),
  },

  // Body Fat percentage
  {
    id: '17',
    athleteId: '2',
    type: 'bodyFat',
    value: 18,
    date: new Date('2024-01-01'),
  },
  {
    id: '18',
    athleteId: '2',
    type: 'bodyFat',
    value: 17.5,
    date: new Date('2024-01-08'),
  },
  {
    id: '19',
    athleteId: '2',
    type: 'bodyFat',
    value: 17,
    date: new Date('2024-01-15'),
  },
  {
    id: '20',
    athleteId: '2',
    type: 'bodyFat',
    value: 16.5,
    date: new Date('2024-01-22'),
  },
];

type MetricsDashboardProps = {
  user: User;
  athleteId?: string; // Only needed for coach view
  readOnly?: boolean; // True for coach view
};

function MetricsDashboard({ user, athleteId, readOnly = false }: MetricsDashboardProps) {
  const [metrics, setMetrics] = React.useState<MetricEntry[]>(
    MOCK_METRICS.filter(m => m.athleteId === (athleteId || user.id))
  );

  const handleAddMetric = (entry: Omit<MetricEntry, 'id'>) => {
    const newMetric: MetricEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setMetrics([...metrics, newMetric]);
  };

  const handleDeleteMetric = (id: string) => {
    setMetrics(metrics.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8">
      {!readOnly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MetricsEntry user={user} onAddMetric={handleAddMetric} />
          <MetricsHistory
            entries={metrics}
            onDeleteEntry={handleDeleteMetric}
          />
        </div>
      )}

      <div className="space-y-8">
        <h3 className="text-xl font-semibold text-gray-800">Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.keys(METRIC_DEFINITIONS).map((type) => (
            <MetricsChart
              key={type}
              entries={metrics.filter(m => m.type === type)}
              type={type as keyof typeof METRIC_DEFINITIONS}
            />
          ))}
        </div>
      </div>

      {readOnly && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
          <MetricsHistory entries={metrics} />
        </div>
      )}
    </div>
  );
}

export default MetricsDashboard;
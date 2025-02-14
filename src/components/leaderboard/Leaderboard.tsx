import React, { useState } from 'react';
import { Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import type { User, MetricType } from '../../types';
import { METRIC_DEFINITIONS } from '../metrics/MetricsConfig';

// Mock leaderboard data (in a real app, this would come from your backend)
const MOCK_LEADERBOARD_DATA = {
  benchPress: [
    { athleteId: '2', value: 235 },
    { athleteId: '3', value: 215 },
  ],
  squat: [
    { athleteId: '3', value: 315 },
    { athleteId: '2', value: 285 },
  ],
  deadlift: [
    { athleteId: '2', value: 365 },
    { athleteId: '3', value: 345 },
  ],
};

type LeaderboardProps = {
  athletes: User[];
};

function Leaderboard({ athletes }: LeaderboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('benchPress');

  const getAthleteById = (id: string) => athletes.find(a => a.id === id);

  const leaderboardData = MOCK_LEADERBOARD_DATA[selectedMetric] || [];
  const sortedData = [...leaderboardData].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Leaderboard
          </h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="p-2 border rounded-lg"
          >
            {Object.entries(METRIC_DEFINITIONS)
              .filter(([key]) => ['benchPress', 'squat', 'deadlift'].includes(key))
              .map(([key, metric]) => (
                <option key={key} value={key}>
                  {metric.label}
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-4">
          {sortedData.map((entry, index) => {
            const athlete = getAthleteById(entry.athleteId);
            if (!athlete) return null;

            const isImproving = Math.random() > 0.5; // In a real app, calculate this from historical data

            return (
              <div
                key={athlete.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{athlete.name}</div>
                    <div className="text-sm text-gray-600">
                      {entry.value} {METRIC_DEFINITIONS[selectedMetric].unit}
                    </div>
                  </div>
                </div>
                {isImproving ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">Improving</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-sm">Declining</span>
                  </div>
                )}
              </div>
            );
          })}

          {sortedData.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No data available for this metric
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
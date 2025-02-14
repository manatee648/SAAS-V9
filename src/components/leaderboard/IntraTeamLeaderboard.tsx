import React, { useState } from 'react';
import { Trophy, Medal, ArrowUp, ArrowDown } from 'lucide-react';
import type { User, MetricType } from '../../types';
import { METRIC_DEFINITIONS } from '../metrics/MetricsConfig';

// Mock athlete performance data (in a real app, this would come from your backend)
const MOCK_ATHLETE_PERFORMANCE = {
  benchPress: [
    { athleteId: '2', value: 235, improvement: 10, personalBest: true },
    { athleteId: '3', value: 215, improvement: -5, personalBest: false },
  ],
  squat: [
    { athleteId: '3', value: 315, improvement: 15, personalBest: true },
    { athleteId: '2', value: 285, improvement: 5, personalBest: false },
  ],
  deadlift: [
    { athleteId: '2', value: 365, improvement: 20, personalBest: true },
    { athleteId: '3', value: 345, improvement: 10, personalBest: false },
  ],
};

type IntraTeamLeaderboardProps = {
  teamName: string;
  teammates: User[];
  currentUser: User;
};

function IntraTeamLeaderboard({ teamName, teammates, currentUser }: IntraTeamLeaderboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('benchPress');

  const leaderboardData = MOCK_ATHLETE_PERFORMANCE[selectedMetric] || [];
  const sortedData = [...leaderboardData].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">{teamName} Rankings</h2>
          </div>
          <p className="text-gray-600 text-sm">Compete with your teammates!</p>
        </div>
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
          const athlete = teammates.find(t => t.id === entry.athleteId);
          if (!athlete) return null;

          const isCurrentUser = athlete.id === currentUser.id;
          const isImproving = entry.improvement > 0;

          return (
            <div
              key={athlete.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                isCurrentUser ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-amber-600' :
                  'bg-indigo-600'
                } text-white font-bold`}>
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {athlete.name}
                      {isCurrentUser && " (You)"}
                    </span>
                    {entry.personalBest && (
                      <div className="flex items-center gap-1 text-yellow-600 text-sm">
                        <Medal className="w-4 h-4" />
                        <span>PB</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">{entry.value} <span className="font-bold">{METRIC_DEFINITIONS[selectedMetric].unit}</span></span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-2 ${isImproving ? 'text-green-600' : 'text-red-600'}`}>
                {isImproving ? (
                  <>
                    <ArrowUp className="w-4 h-4" />
                    <span>+<span className="font-bold">{entry.improvement}</span> from last month</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4" />
                    <span><span className="font-bold">{entry.improvement}</span> from last month</span>
                  </>
                )}
              </div>
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
  );
}

export default IntraTeamLeaderboard;
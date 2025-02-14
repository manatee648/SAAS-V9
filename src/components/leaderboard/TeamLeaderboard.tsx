import React, { useState } from 'react';
import { Trophy, Users, ArrowUp, ArrowDown } from 'lucide-react';
import type { Team, MetricType } from '../../types';
import { METRIC_DEFINITIONS } from '../metrics/MetricsConfig';

// Mock team performance data (in a real app, this would come from your backend)
const MOCK_TEAM_PERFORMANCE = {
  benchPress: [
    { teamId: '1', averageValue: 225, improvement: 15 },
    { teamId: '2', averageValue: 205, improvement: -5 },
  ],
  squat: [
    { teamId: '1', averageValue: 295, improvement: 25 },
    { teamId: '2', averageValue: 315, improvement: 30 },
  ],
  deadlift: [
    { teamId: '1', averageValue: 355, improvement: 20 },
    { teamId: '2', averageValue: 335, improvement: 15 },
  ],
};

type TeamLeaderboardProps = {
  teams: Team[];
};

function TeamLeaderboard({ teams }: TeamLeaderboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('benchPress');

  const getTeamById = (id: string) => teams.find(t => t.id === id);

  const leaderboardData = MOCK_TEAM_PERFORMANCE[selectedMetric] || [];
  const sortedData = [...leaderboardData].sort((a, b) => b.averageValue - a.averageValue);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Team Rankings</h2>
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
          const team = getTeamById(entry.teamId);
          if (!team) return null;

          const isImproving = entry.improvement > 0;

          return (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{team.name}</span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{team.athletes.length}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Team Average: <span className="font-bold">{entry.averageValue} <span className="font-bold">{METRIC_DEFINITIONS[selectedMetric].unit}</span></span>
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
            No team data available for this metric
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamLeaderboard;
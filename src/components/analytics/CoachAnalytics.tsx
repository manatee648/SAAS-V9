import React, { useState } from 'react';
import { BarChart3, Calendar, Users, TrendingUp, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import type { User, Habit, WorkoutCompletion, HabitCompletion } from '../../types';
import { MOCK_ATHLETES } from '../../data/mockData';

type TimeRange = 'week' | 'month' | 'year';
type ActivityType = 'all' | 'workouts' | 'habits';
type ActivityStatus = 'all' | 'completed' | 'missed';

type CompletionStats = {
  total: number;
  completed: number;
  missed: number;
  completionRate: number;
};

type AthleteStats = {
  athlete: User;
  workouts: CompletionStats;
  habits: CompletionStats;
};

// Mock activity data (in a real app, this would come from your backend)
const MOCK_ACTIVITIES = [
  {
    id: '1',
    athleteId: '2',
    type: 'workout',
    name: 'Full Body Strength',
    status: 'missed',
    date: new Date('2024-02-20'),
    details: 'Missed all sets',
  },
  {
    id: '2',
    athleteId: '2',
    type: 'habit',
    name: 'Morning Stretching',
    status: 'missed',
    date: new Date('2024-02-21'),
    details: 'Not completed',
  },
  {
    id: '3',
    athleteId: '3',
    type: 'workout',
    name: 'Cardio Session',
    status: 'completed',
    date: new Date('2024-02-21'),
    details: 'Completed all exercises',
  },
  {
    id: '4',
    athleteId: '3',
    type: 'habit',
    name: 'Meal Prep Sunday',
    status: 'missed',
    date: new Date('2024-02-18'),
    details: 'Not completed',
  },
];

function CoachAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedAthlete, setSelectedAthlete] = useState<string>('all');
  const [activityType, setActivityType] = useState<ActivityType>('all');
  const [activityStatus, setActivityStatus] = useState<ActivityStatus>('all');

  // Mock data - in a real app, this would come from your backend
  const getWorkoutStats = (athleteId: string): CompletionStats => {
    // Simulate different stats for different athletes
    const baseStats = {
      total: 20,
      completed: 15,
      missed: 5,
      completionRate: 75,
    };

    if (athleteId === 'all') return baseStats;
    return {
      ...baseStats,
      completed: 15 + Math.floor(Math.random() * 5),
      missed: 5 - Math.floor(Math.random() * 3),
      completionRate: 75 + Math.floor(Math.random() * 15),
    };
  };

  const getHabitStats = (athleteId: string): CompletionStats => {
    // Simulate different stats for different athletes
    const baseStats = {
      total: 30,
      completed: 25,
      missed: 5,
      completionRate: 83,
    };

    if (athleteId === 'all') return baseStats;
    return {
      ...baseStats,
      completed: 25 + Math.floor(Math.random() * 5),
      missed: 5 - Math.floor(Math.random() * 3),
      completionRate: 83 + Math.floor(Math.random() * 12),
    };
  };

  const getAthleteStats = (): AthleteStats[] => {
    if (selectedAthlete === 'all') {
      return MOCK_ATHLETES.map(athlete => ({
        athlete,
        workouts: getWorkoutStats(athlete.id),
        habits: getHabitStats(athlete.id),
      }));
    }
    const athlete = MOCK_ATHLETES.find(a => a.id === selectedAthlete);
    return athlete ? [{
      athlete,
      workouts: getWorkoutStats(athlete.id),
      habits: getHabitStats(athlete.id),
    }] : [];
  };

  const stats = getAthleteStats();
  const overallWorkoutStats = getWorkoutStats('all');
  const overallHabitStats = getHabitStats('all');

  // Filter activities based on selected filters
  const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
    if (selectedAthlete !== 'all' && activity.athleteId !== selectedAthlete) return false;
    if (activityType !== 'all' && activity.type !== activityType) return false;
    if (activityStatus !== 'all' && activity.status !== activityStatus) return false;
    return true;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const getAthleteById = (id: string) => MOCK_ATHLETES.find(a => a.id === id);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-gray-600">Track athlete progress and completion rates</p>
          </div>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="p-2 border rounded-lg"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Athletes</option>
              {MOCK_ATHLETES.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Workout Stats */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-semibold">Workout Completion</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {overallWorkoutStats.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {overallWorkoutStats.completed}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {overallWorkoutStats.missed}
                </div>
                <div className="text-sm text-gray-600">Missed</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${overallWorkoutStats.completionRate}%` }}
                />
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {overallWorkoutStats.completionRate}% Completion Rate
              </div>
            </div>
          </div>

          {/* Habit Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">Habit Completion</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {overallHabitStats.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {overallHabitStats.completed}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {overallHabitStats.missed}
                </div>
                <div className="text-sm text-gray-600">Missed</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${overallHabitStats.completionRate}%` }}
                />
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                {overallHabitStats.completionRate}% Completion Rate
              </div>
            </div>
          </div>
        </div>

        {/* Individual Athlete Stats */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-semibold">Athlete Performance</h3>
          </div>
          <div className="space-y-4">
            {stats.map(({ athlete, workouts, habits }) => (
              <div key={athlete.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{athlete.name}</h4>
                    <p className="text-gray-600 text-sm">{athlete.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium text-indigo-600">Workouts</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{workouts.completionRate}% completed</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-purple-600">Habits</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{habits.completionRate}% completed</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Workout Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Workouts ({workouts.completed}/{workouts.total})</span>
                      <span>{workouts.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${workouts.completionRate}%` }}
                      />
                    </div>
                  </div>
                  {/* Habits Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Habits ({habits.completed}/{habits.total})</span>
                      <span>{habits.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${habits.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-semibold">Activity Log</h3>
            </div>
            <div className="flex gap-4">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as ActivityType)}
                className="p-2 border rounded-lg"
              >
                <option value="all">All Activities</option>
                <option value="workouts">Workouts Only</option>
                <option value="habits">Habits Only</option>
              </select>
              <select
                value={activityStatus}
                onChange={(e) => setActivityStatus(e.target.value as ActivityStatus)}
                className="p-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const athlete = getAthleteById(activity.athleteId);
              if (!athlete) return null;

              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border ${
                    activity.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        {activity.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <h4 className="font-semibold">{activity.name}</h4>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {athlete.name} • {activity.type === 'workout' ? 'Workout' : 'Habit'}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {activity.details}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.date.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredActivities.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No activities found matching your filters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachAnalytics;
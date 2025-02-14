import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, MessageCircle, LineChart, Users, Timer, Calendar } from 'lucide-react';
import type { User, WorkoutProgram, Team, WorkoutCompletion } from '../types';
import ChatInterface from './ChatInterface';
import MetricsDashboard from './metrics/MetricsDashboard';
import TeamPage from './team/TeamPage';
import WorkoutPage from './workout/WorkoutPage';
import HabitsDashboard from './habits/HabitsDashboard';

// Mock programs (in a real app, this would come from your backend)
const MOCK_PROGRAMS: WorkoutProgram[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'A comprehensive full body workout focusing on major muscle groups',
    exercises: [
      {
        id: '1',
        name: 'Squats',
        sets: [
          { id: '1-1', reps: 8, weight: 135, weightType: 'absolute' },
          { id: '1-2', reps: 8, weight: 135, weightType: 'absolute' },
          { id: '1-3', reps: 8, weight: 135, weightType: 'absolute' },
          { id: '1-4', reps: 8, weight: 135, weightType: 'absolute' },
        ],
      },
    ],
    assignedTo: ['2'],
    assignedTeams: ['1'],
  },
];

// Mock teams (in a real app, this would come from your backend)
const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Strength Team',
    description: 'Focus on strength training',
    athletes: ['2'],
  },
];

type Timer = {
  startTime: number;
  duration: number;
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function AthleteDashboard({ user }: { user: User }) {
  // Get teams the athlete belongs to
  const athleteTeams = MOCK_TEAMS.filter(team => 
    team.athletes.includes(user.id)
  );

  // Get programs assigned directly to athlete or to their teams
  const assignedPrograms = MOCK_PROGRAMS.filter(program => 
    program.assignedTo.includes(user.id) || 
    program.assignedTeams.some(teamId => 
      athleteTeams.some(team => team.id === teamId)
    )
  );

  const [activeWorkouts, setActiveWorkouts] = useState<string[]>([]);
  const [workoutTimers, setWorkoutTimers] = useState<Record<string, Timer>>({});
  const [completedWorkouts, setCompletedWorkouts] = useState<WorkoutCompletion[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'workouts' | 'metrics' | 'habits'>('workouts');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutProgram | null>(null);

  // Update timers every second
  useEffect(() => {
    if (activeWorkouts.length === 0) return;

    const interval = setInterval(() => {
      setWorkoutTimers(prevTimers => {
        const updatedTimers: Record<string, Timer> = {};
        for (const [programId, timer] of Object.entries(prevTimers)) {
          updatedTimers[programId] = {
            ...timer,
            duration: Math.floor((Date.now() - timer.startTime) / 1000),
          };
        }
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkouts]);

  const toggleWorkoutActive = (programId: string) => {
    setActiveWorkouts(prev => {
      const isActive = prev.includes(programId);
      if (isActive) {
        // End workout - save completion
        const timer = workoutTimers[programId];
        if (timer) {
          const completion: WorkoutCompletion = {
            id: Date.now().toString(),
            programId,
            athleteId: user.id,
            startTime: timer.startTime,
            endTime: Date.now(),
            duration: timer.duration,
          };
          setCompletedWorkouts(prev => [...prev, completion]);
        }
        // Remove timer
        setWorkoutTimers(prevTimers => {
          const { [programId]: removed, ...rest } = prevTimers;
          return rest;
        });
        return prev.filter(id => id !== programId);
      } else {
        // Start workout - add timer
        setWorkoutTimers(prevTimers => ({
          ...prevTimers,
          [programId]: {
            startTime: Date.now(),
            duration: 0,
          },
        }));
        return [...prev, programId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Athlete Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('workouts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'workouts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Workouts
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'metrics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LineChart className="w-5 h-5" />
                Metrics
              </button>
              <button
                onClick={() => setActiveTab('habits')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'habits' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Habits
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </button>
            </div>
          </div>

          {activeTab === 'workouts' && (
            selectedWorkout ? (
              <div>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ChevronUp className="w-5 h-5" />
                  Back to Workouts
                </button>
                <WorkoutPage
                  program={selectedWorkout}
                  user={user}
                  onBack={() => setSelectedWorkout(null)}
                  isActive={activeWorkouts.includes(selectedWorkout.id)}
                  startTime={workoutTimers[selectedWorkout.id]?.startTime}
                  duration={workoutTimers[selectedWorkout.id]?.duration}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {assignedPrograms.map(program => (
                  <div key={program.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{program.name}</h3>
                        <p className="text-gray-600">{program.description}</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setSelectedWorkout(program)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => toggleWorkoutActive(program.id)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            activeWorkouts.includes(program.id)
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {activeWorkouts.includes(program.id) ? 'End Workout' : 'Start Workout'}
                        </button>
                      </div>
                    </div>
                    {activeWorkouts.includes(program.id) && workoutTimers[program.id] && (
                      <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Timer className="w-5 h-5 text-indigo-600 animate-pulse" />
                          <div>
                            <div className="text-lg font-semibold text-indigo-600">
                              {formatDuration(workoutTimers[program.id].duration)}
                            </div>
                            <div className="text-sm text-indigo-600">
                              Started at {new Date(workoutTimers[program.id].startTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'metrics' && (
            <MetricsDashboard
              user={user}
            />
          )}

          {activeTab === 'habits' && (
            <HabitsDashboard user={user} />
          )}

          {selectedTeam && (
            <TeamPage
              team={selectedTeam}
              teammates={[]}
              currentUser={user}
              onBack={() => setSelectedTeam(null)}
            />
          )}
        </div>

        {showChat && (
          <div className="fixed bottom-4 right-4 w-96">
            <ChatInterface
              currentUser={user}
              otherUser={{
                id: '1',
                email: 'coach@example.com',
                name: 'AI Coach',
                role: 'coach',
                organizationId: user.organizationId,
              }}
              onClose={() => setShowChat(false)}
              isModal
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AthleteDashboard;
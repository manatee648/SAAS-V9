import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash2, Users, UserPlus, MessageCircle, LineChart, Edit, Search, Youtube, Copy } from 'lucide-react';
import type { User, WorkoutProgram, Team, Exercise } from '../types';
import ChatInterface from './ChatInterface';
import MetricsDashboard from './metrics/MetricsDashboard';
import { ProgramForm } from './program/ProgramForm';

// Mock athletes list (in a real app, this would come from your backend)
const MOCK_ATHLETES = [
  { id: '2', name: 'Jane Athlete', email: 'athlete@example.com', role: 'athlete' as const },
  { id: '3', name: 'Bob Athlete', email: 'athlete2@example.com', role: 'athlete' as const },
];

// Mock teams (in a real app, this would come from your backend)
const INITIAL_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Strength Team',
    description: 'Focus on strength training',
    athletes: ['2'],
  },
  {
    id: '2',
    name: 'Endurance Team',
    description: 'Focus on endurance training',
    athletes: ['3'],
  },
];

type CoachDashboardProps = {
  user: User;
};

function CoachDashboard({ user }: CoachDashboardProps) {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([
    {
      id: '1',
      name: 'Full Body Strength',
      description: 'A comprehensive full body workout focusing on major muscle groups',
      exercises: [
        {
          id: '1',
          name: 'Squats',
          sets: [
            { id: '1-1', reps: 8, weight: 135 },
            { id: '1-2', reps: 8, weight: 135 },
            { id: '1-3', reps: 8, weight: 135 },
            { id: '1-4', reps: 8, weight: 135 },
          ],
        },
      ],
      assignedTo: [],
      assignedTeams: [],
    },
  ]);

  // State for modals and UI
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<User | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [selectedAthleteForMetrics, setSelectedAthleteForMetrics] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');

  // State for new team
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    athletes: [] as string[],
  });

  // Filter athletes based on search query
  const filteredAthletes = MOCK_ATHLETES.filter(athlete => 
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter athletes based on team search query
  const filteredTeamAthletes = MOCK_ATHLETES.filter(athlete => 
    athlete.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  // Team Management Functions
  const addTeam = () => {
    if (newTeam.name) {
      setTeams([
        ...teams,
        {
          id: Date.now().toString(),
          ...newTeam,
        },
      ]);
      setNewTeam({ name: '', description: '', athletes: [] });
      setShowNewTeamModal(false);
    }
  };

  const toggleAthleteInTeam = (teamId: string, athleteId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const isInTeam = team.athletes.includes(athleteId);
        return {
          ...team,
          athletes: isInTeam
            ? team.athletes.filter(id => id !== athleteId)
            : [...team.athletes, athleteId],
        };
      }
      return team;
    }));
  };

  const deleteTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    // Remove team assignments from programs
    setPrograms(programs.map(program => ({
      ...program,
      assignedTeams: program.assignedTeams.filter(id => id !== teamId),
    })));
  };

  // Program Management Functions
  const handleSaveProgram = (programData: Omit<WorkoutProgram, 'id' | 'assignedTo' | 'assignedTeams'>) => {
    if (selectedProgramId) {
      // Update existing program
      setPrograms(programs.map(program => 
        program.id === selectedProgramId
          ? {
              ...program,
              ...programData,
            }
          : program
      ));
    } else {
      // Add new program
      setPrograms([
        ...programs,
        {
          id: Date.now().toString(),
          ...programData,
          assignedTo: [],
          assignedTeams: [],
        },
      ]);
    }
    setShowNewProgram(false);
    setSelectedProgramId(null);
  };

  const editProgram = (program: WorkoutProgram) => {
    setSelectedProgramId(program.id);
    setShowNewProgram(true);
  };

  const deleteProgram = (id: string) => {
    setPrograms(programs.filter((program) => program.id !== id));
  };

  const duplicateProgram = (program: WorkoutProgram) => {
    const newProgram: WorkoutProgram = {
      ...program,
      id: Date.now().toString(),
      name: `${program.name} (Copy)`,
      assignedTo: [], // Reset assignments for the new copy
      assignedTeams: [], // Reset assignments for the new copy
      exercises: program.exercises.map(exercise => ({
        ...exercise,
        id: Date.now().toString() + Math.random(),
        sets: exercise.sets.map(set => ({
          ...set,
          id: Date.now().toString() + Math.random(),
        })),
      })),
    };
    setPrograms([...programs, newProgram]);
  };

  const openAssignModal = (programId: string) => {
    setSelectedProgramId(programId);
    setShowAssignModal(true);
  };

  const toggleAthleteAssignment = (athleteId: string) => {
    if (!selectedProgramId) return;

    setPrograms(programs.map(program => {
      if (program.id === selectedProgramId) {
        const isAssigned = program.assignedTo.includes(athleteId);
        return {
          ...program,
          assignedTo: isAssigned
            ? program.assignedTo.filter(id => id !== athleteId)
            : [...program.assignedTo, athleteId]
        };
      }
      return program;
    }));
  };

  const toggleTeamAssignment = (teamId: string) => {
    if (!selectedProgramId) return;

    setPrograms(programs.map(program => {
      if (program.id === selectedProgramId) {
        const isAssigned = program.assignedTeams.includes(teamId);
        return {
          ...program,
          assignedTeams: isAssigned
            ? program.assignedTeams.filter(id => id !== teamId)
            : [...program.assignedTeams, teamId]
        };
      }
      return program;
    }));
  };

  const openChat = (athlete: User) => {
    setSelectedAthlete(athlete);
    setShowChat(true);
  };

  const openMetrics = (athlete: User) => {
    setSelectedAthleteForMetrics(athlete);
    setShowMetrics(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Program and Team buttons */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Manage Programs</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowNewTeamModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            New Team
          </button>
          <button
            onClick={() => {
              setSelectedProgramId(null);
              setShowNewProgram(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Program
          </button>
        </div>
      </div>

      {/* Search Athletes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Quick Athlete Search</h3>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
        {searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAthletes.map(athlete => (
              <div key={athlete.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-lg">{athlete.name}</h4>
                    <p className="text-gray-600 text-sm">{athlete.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openChat(athlete)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => openMetrics(athlete)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <LineChart className="w-4 h-4" />
                    Metrics
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Teams Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{team.name}</h4>
                  <p className="text-gray-600 text-sm">{team.description}</p>
                </div>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="p-1 hover:bg-red-100 rounded-full text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {team.athletes.length} athletes
              </div>
              <button
                onClick={() => {
                  setShowTeamModal(true);
                  setSelectedProgramId(team.id);
                  setTeamSearchQuery('');
                }}
                className="mt-2 w-full text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
              >
                Manage Athletes
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Programs Section */}
      <div className="space-y-4">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {program.name}
                </h3>
                <p className="text-gray-600">{program.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Assigned to: {program.assignedTo.length} athletes, {program.assignedTeams.length} teams
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateProgram(program)}
                  className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                  title="Duplicate program"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => editProgram(program)}
                  className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                  title="Edit program"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openAssignModal(program.id)}
                  className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                  title="Assign to athletes or teams"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteProgram(program.id)}
                  className="p-2 hover:bg-red-100 rounded-full"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4">
              {program.exercises.map((exercise) => (
                <div key={exercise.id} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{exercise.name}</h4>
                    {exercise.demoUrl && (
                      <a
                        href={exercise.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                      >
                        <Youtube className="w-5 h-5" />
                        Watch Demo
                      </a>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 mb-2 text-sm font-medium text-gray-600">
                      <div>Set</div>
                      <div>Reps</div>
                      <div>Weight (lbs)</div>
                    </div>
                    {exercise.sets.map((set, index) => (
                      <div key={set.id} className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200 first:border-0">
                        <div>{index + 1}</div>
                        <div>{set.reps}</div>
                        <div>{set.weight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Program Form Modal */}
      {showNewProgram && (
        <ProgramForm
          onClose={() => {
            setShowNewProgram(false);
            setSelectedProgramId(null);
          }}
          onSave={handleSaveProgram}
          initialProgram={selectedProgramId ? programs.find(p => p.id === selectedProgramId) : undefined}
        />
      )}

      {/* Team Athletes Modal */}
      {showTeamModal && selectedProgramId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Team Athletes</h2>
              <button
                onClick={() => {
                  setShowTeamModal(false);
                  setTeamSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search athletes..."
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-4">
              {filteredTeamAthletes.map((athlete) => {
                const team = teams.find(t => t.id === selectedProgramId);
                const isInTeam = team?.athletes.includes(athlete.id);

                return (
                  <div
                    key={athlete.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{athlete.name}</div>
                      <div className="text-sm text-gray-600">{athlete.email}</div>
                    </div>
                    <button
                      onClick={() => toggleAthleteInTeam(selectedProgramId, athlete.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isInTeam
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {isInTeam ? 'Remove' : 'Add'}
                    </button>
                  </div>
                );
              })}

              {teamSearchQuery && filteredTeamAthletes.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No athletes found matching your search
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowTeamModal(false);
                  setTeamSearchQuery('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Team Modal */}
      {showNewTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create New Team</h2>
              <button
                onClick={() => setShowNewTeamModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  placeholder="Enter team description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Athletes
                </label>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search athletes..."
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredTeamAthletes.map((athlete) => {
                    const isSelected = newTeam.athletes.includes(athlete.id);
                    return (
                      <div
                        key={athlete.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{athlete.name}</div>
                          <div className="text-sm text-gray-600">{athlete.email}</div>
                        </div>
                        <button
                          onClick={() => {
                            setNewTeam(prev => ({
                              ...prev,
                              athletes: isSelected
                                ? prev.athletes.filter(id => id !== athlete.id)
                                : [...prev.athletes, athlete.id]
                            }));
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            isSelected
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    );
                  })}

                  {teamSearchQuery && filteredTeamAthletes.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No athletes found matching your search
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowNewTeamModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addTeam}
                  disabled={!newTeam.name}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Program Modal */}
      {showAssignModal && selectedProgramId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Assign Program</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Teams Section */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Teams</h3>
                <div className="space-y-2">
                  {teams.map((team) => {
                    const program = programs.find(p => p.id === selectedProgramId);
                    const isAssigned = program?.assignedTeams.includes(team.id);

                    return (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-gray-600">
                            {team.athletes.length} athletes
                          </div>
                        </div>
                        <button
                          onClick={() => toggleTeamAssignment(team.id)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            isAssigned
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isAssigned ? 'Assigned' : 'Assign'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Athletes Section */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Individual Athletes</h3>
                <div className="space-y-2">
                  {filteredAthletes.map((athlete) => {
                    const program = programs.find(p => p.id === selectedProgramId);
                    const isAssigned = program?.assignedTo.includes(athlete.id);

                    return (
                      <div
                        key={athlete.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{athlete.name}</div>
                          <div className="text-sm text-gray-600">{athlete.email}</div>
                        </div>
                        <button
                          onClick={() => toggleAthleteAssignment(athlete.id)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            isAssigned
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {isAssigned ? 'Assigned' : 'Assign'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && selectedAthlete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <ChatInterface
              currentUser={user}
              otherUser={selectedAthlete}
              onClose={() => setShowChat(false)}
              isModal
            />
          </div>
        </div>
      )}

      {/* Metrics Modal */}
      {showMetrics && selectedAthleteForMetrics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-6xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Metrics for {selectedAthleteForMetrics.name}
              </h2>
              <button
                onClick={() => setShowMetrics(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <MetricsDashboard
              user={selectedAthleteForMetrics}
              athleteId={selectedAthleteForMetrics.id}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CoachDashboard;


import React, { useState } from 'react';
import { Search, X, Timer, CheckCircle2 } from 'lucide-react';
import type { WorkoutProgram, Team, User, WorkoutCompletion } from '../../../types';

// Mock workout completions (in a real app, this would come from your backend)
const MOCK_COMPLETIONS: WorkoutCompletion[] = [];

type AssignProgramModalProps = {
  program: WorkoutProgram;
  teams: Team[];
  athletes: User[];
  onClose: () => void;
  onUpdateProgram: (program: WorkoutProgram) => void;
};

export function AssignProgramModal({
  program,
  teams,
  athletes,
  onClose,
  onUpdateProgram,
}: AssignProgramModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'assign' | 'history'>('assign');

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTeam = (teamId: string) => {
    const isAssigned = program.assignedTeams.includes(teamId);
    const updatedProgram = {
      ...program,
      assignedTeams: isAssigned
        ? program.assignedTeams.filter(id => id !== teamId)
        : [...program.assignedTeams, teamId],
    };
    onUpdateProgram(updatedProgram);
  };

  const toggleAthlete = (athleteId: string) => {
    const isAssigned = program.assignedTo.includes(athleteId);
    const updatedProgram = {
      ...program,
      assignedTo: isAssigned
        ? program.assignedTo.filter(id => id !== athleteId)
        : [...program.assignedTo, athleteId],
    };
    onUpdateProgram(updatedProgram);
  };

  const getAthleteCompletions = (athleteId: string) => {
    return MOCK_COMPLETIONS.filter(
      completion => completion.athleteId === athleteId && completion.programId === program.id
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Program Details</h2>
            <p className="text-gray-600 mt-1">"{program.name}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'assign'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Assign
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completion History
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search athletes by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
            />
            <Search className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {activeTab === 'assign' ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Teams Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Teams</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {teams.map((team) => {
                  const isAssigned = program.assignedTeams.includes(team.id);

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
                        onClick={() => toggleTeam(team.id)}
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

                {teams.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No teams available
                  </div>
                )}
              </div>
            </div>

            {/* Individual Athletes Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Individual Athletes</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredAthletes.map((athlete) => {
                  const isAssigned = program.assignedTo.includes(athlete.id);

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
                        onClick={() => toggleAthlete(athlete.id)}
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

                {searchQuery && filteredAthletes.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No athletes found matching your search
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAthletes.map((athlete) => {
              const completions = getAthleteCompletions(athlete.id);
              if (completions.length === 0) return null;

              return (
                <div key={athlete.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-lg mb-2">{athlete.name}</div>
                  <div className="space-y-2">
                    {completions.map((completion) => (
                      <div
                        key={completion.id}
                        className="bg-white rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Completed on {formatDate(completion.endTime)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Timer className="w-4 h-4" />
                            Duration: {formatDuration(completion.duration)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredAthletes.every(athlete => getAthleteCompletions(athlete.id).length === 0) && (
              <div className="text-center text-gray-500 py-8">
                No workout completions found
                {searchQuery && ' matching your search'}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
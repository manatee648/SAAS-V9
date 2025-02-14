import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { User } from '../../../types';

type NewTeamModalProps = {
  athletes: User[];
  onClose: () => void;
  onCreateTeam: (team: { name: string; description: string; athletes: string[] }) => void;
};

export function NewTeamModal({ athletes, onClose, onCreateTeam }: NewTeamModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    athletes: [] as string[],
  });

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAthlete = (athleteId: string) => {
    const isSelected = teamData.athletes.includes(athleteId);
    setTeamData({
      ...teamData,
      athletes: isSelected
        ? teamData.athletes.filter(id => id !== athleteId)
        : [...teamData.athletes, athleteId],
    });
  };

  const handleSubmit = () => {
    if (teamData.name.trim()) {
      onCreateTeam(teamData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Team</h2>
          <button
            onClick={onClose}
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
              value={teamData.name}
              onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={teamData.description}
              onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredAthletes.map((athlete) => {
                const isSelected = teamData.athletes.includes(athlete.id);
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

              {searchQuery && filteredAthletes.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No athletes found matching your search
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!teamData.name}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
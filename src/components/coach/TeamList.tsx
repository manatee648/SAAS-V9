import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Team } from '../../types';

type TeamListProps = {
  teams: Team[];
  onDeleteTeam: (id: string) => void;
  onManageTeam: (id: string) => void;
};

export function TeamList({ teams, onDeleteTeam, onManageTeam }: TeamListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map(team => (
        <div key={team.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-lg">{team.name}</h4>
              <p className="text-gray-600 text-sm">{team.description}</p>
            </div>
            <button
              onClick={() => onDeleteTeam(team.id)}
              className="p-1 hover:bg-red-100 rounded-full text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {team.athletes.length} athletes
          </div>
          <button
            onClick={() => onManageTeam(team.id)}
            className="mt-2 w-full text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
          >
            Manage Athletes
          </button>
        </div>
      ))}
    </div>
  );
}
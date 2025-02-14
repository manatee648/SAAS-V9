import React from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import type { Team, User } from '../../types';
import IntraTeamLeaderboard from '../leaderboard/IntraTeamLeaderboard';

type TeamPageProps = {
  team: Team;
  teammates: User[];
  currentUser: User;
  onBack: () => void;
};

function TeamPage({ team, teammates, currentUser, onBack }: TeamPageProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
          <p className="text-gray-600">{team.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Roster */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Team Roster</h2>
            </div>
            <div className="space-y-4">
              {teammates.map(teammate => (
                <div
                  key={teammate.id}
                  className={`p-4 rounded-lg ${
                    teammate.id === currentUser.id
                      ? 'bg-indigo-50 border border-indigo-100'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="font-medium">
                    {teammate.name}
                    {teammate.id === currentUser.id && " (You)"}
                  </div>
                  <div className="text-sm text-gray-600">{teammate.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="lg:col-span-2">
          <IntraTeamLeaderboard
            teamName={team.name}
            teammates={teammates}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamPage
import React from 'react';
import { MessageCircle, LineChart, Ruler } from 'lucide-react';
import type { User } from '../../types';

type AthleteListProps = {
  athletes: User[];
  searchQuery: string;
  onOpenChat: (athlete: User) => void;
  onOpenMetrics: (athlete: User) => void;
  onAddMetrics: (athlete: User) => void;
};

export function AthleteList({
  athletes,
  searchQuery,
  onOpenChat,
  onOpenMetrics,
  onAddMetrics,
}: AthleteListProps) {
  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
              onClick={() => onOpenChat(athlete)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => onOpenMetrics(athlete)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
            >
              <LineChart className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => onAddMetrics(athlete)}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Ruler className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      ))}
      
      {filteredAthletes.length === 0 && (
        <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery ? 'No athletes found matching your search' : 'No athletes available'}
          </p>
        </div>
      )}
    </div>
  );
}
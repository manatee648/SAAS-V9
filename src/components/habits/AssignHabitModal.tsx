import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Habit, User } from '../../types';

type AssignHabitModalProps = {
  habit: Habit;
  athletes: User[];
  onClose: () => void;
  onUpdateHabit: (habit: Habit) => void;
};

export function AssignHabitModal({
  habit,
  athletes,
  onClose,
  onUpdateHabit,
}: AssignHabitModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAthlete = (athleteId: string) => {
    const isAssigned = habit.assignedTo.includes(athleteId);
    const updatedHabit = {
      ...habit,
      assignedTo: isAssigned
        ? habit.assignedTo.filter(id => id !== athleteId)
        : [...habit.assignedTo, athleteId],
    };
    onUpdateHabit(updatedHabit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Assign Habit</h2>
            <p className="text-gray-600">"{habit.name}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
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

        <div className="space-y-4">
          {filteredAthletes.map((athlete) => {
            const isAssigned = habit.assignedTo.includes(athlete.id);

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
                      ? 'bg-green-100 text-green-700'
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
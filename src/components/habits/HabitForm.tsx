import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User, Habit, HabitFrequency } from '../../types';

type HabitFormProps = {
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'completions'>) => void;
  user: User;
  initialHabit?: Habit;
};

function HabitForm({ onClose, onSave, user, initialHabit }: HabitFormProps) {
  const [habitData, setHabitData] = useState({
    name: initialHabit?.name || '',
    description: initialHabit?.description || '',
    frequency: initialHabit?.frequency || 'daily' as HabitFrequency,
    startDate: initialHabit?.startDate || new Date(),
    endDate: initialHabit?.endDate,
    assignedTo: initialHabit?.assignedTo || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitData.name) return;

    onSave({
      ...habitData,
      createdBy: user.id,
      organizationId: user.organizationId,
      isCustom: user.role === 'athlete',
      assignedTo: user.role === 'athlete' ? [user.id] : habitData.assignedTo,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {user.role === 'coach' ? 'Assign New Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habit Name
            </label>
            <input
              type="text"
              value={habitData.name}
              onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Morning Stretching"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={habitData.description}
              onChange={(e) => setHabitData({ ...habitData, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Describe the habit and any specific instructions"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={habitData.frequency}
              onChange={(e) => setHabitData({ ...habitData, frequency: e.target.value as HabitFrequency })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={habitData.startDate.toISOString().split('T')[0]}
                onChange={(e) => setHabitData({ ...habitData, startDate: new Date(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={habitData.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setHabitData({ ...habitData, endDate: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-full p-2 border rounded-lg"
                min={habitData.startDate.toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {user.role === 'coach' ? 'Assign Habit' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitForm;
import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import type { User, Habit, HabitCompletion } from '../../types';
import HabitForm from './HabitForm';
import HabitsList from './HabitsList';
import { AssignHabitModal } from './AssignHabitModal';
import { MOCK_ATHLETES } from '../../data/mockData';

// Mock habits data (in a real app, this would come from your backend)
const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Morning Stretching',
    description: 'Spend 10 minutes stretching after waking up',
    frequency: 'daily',
    createdBy: '1', // coach
    assignedTo: ['2', '3'],
    organizationId: '1',
    startDate: new Date(),
    completions: [],
  },
  {
    id: '2',
    name: 'Meal Prep Sunday',
    description: 'Prepare meals for the week ahead',
    frequency: 'weekly',
    createdBy: '1',
    assignedTo: ['2'],
    organizationId: '1',
    startDate: new Date(),
    completions: [],
  },
];

type HabitsDashboardProps = {
  user: User;
};

function HabitsDashboard({ user }: HabitsDashboardProps) {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const isCoach = user.role === 'coach';

  const handleAddHabit = (habit: Omit<Habit, 'id' | 'completions'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completions: [],
    };
    setHabits([...habits, newHabit]);
    setShowHabitForm(false);
  };

  const handleCompleteHabit = (habitId: string, status: 'completed' | 'missed') => {
    const completion: HabitCompletion = {
      id: Date.now().toString(),
      habitId,
      userId: user.id,
      date: selectedDate,
      status,
    };

    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          completions: [...habit.completions, completion],
        };
      }
      return habit;
    }));
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
  };

  const userHabits = habits.filter(habit => 
    isCoach || habit.assignedTo.includes(user.id) || habit.createdBy === user.id
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Habits Tracking</h2>
          <button
            onClick={() => setShowHabitForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {isCoach ? 'Create New Habit' : 'Create Personal Habit'}
          </button>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="w-5 h-5" />
            <span>Select Date</span>
          </div>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="p-2 border rounded-lg"
          />
        </div>

        {/* Habits List */}
        <HabitsList
          habits={userHabits}
          selectedDate={selectedDate}
          currentUser={user}
          onComplete={handleCompleteHabit}
          onAssign={isCoach ? (habit) => setSelectedHabit(habit) : undefined}
        />
      </div>

      {/* Habit Form Modal */}
      {showHabitForm && (
        <HabitForm
          onClose={() => setShowHabitForm(false)}
          onSave={handleAddHabit}
          user={user}
        />
      )}

      {/* Assign Habit Modal */}
      {selectedHabit && (
        <AssignHabitModal
          habit={selectedHabit}
          athletes={MOCK_ATHLETES}
          onClose={() => setSelectedHabit(null)}
          onUpdateHabit={(updatedHabit) => {
            handleUpdateHabit(updatedHabit);
            setSelectedHabit(null);
          }}
        />
      )}
    </div>
  );
}

export default HabitsDashboard;
import React from 'react';
import { CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import type { User, Habit, HabitStatus } from '../../types';

type HabitsListProps = {
  habits: Habit[];
  selectedDate: Date;
  currentUser: User;
  onComplete: (habitId: string, status: 'completed' | 'missed') => void;
  onAssign?: (habit: Habit) => void;
};

function HabitsList({ habits, selectedDate, currentUser, onComplete, onAssign }: HabitsListProps) {
  const getHabitStatus = (habit: Habit): HabitStatus => {
    const completion = habit.completions.find(
      c => 
        c.userId === currentUser.id &&
        new Date(c.date).toDateString() === selectedDate.toDateString()
    );
    return completion?.status || 'pending';
  };

  const isDateInRange = (habit: Habit, date: Date) => {
    const startDate = new Date(habit.startDate);
    const endDate = habit.endDate ? new Date(habit.endDate) : new Date(2100, 0, 1);
    return date >= startDate && date <= endDate;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const status = getHabitStatus(habit);
        const inRange = isDateInRange(habit, selectedDate);

        return (
          <div
            key={habit.id}
            className={`p-4 rounded-lg ${
              status === 'completed'
                ? 'bg-green-50 border border-green-200'
                : status === 'missed'
                ? 'bg-red-50 border border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{habit.name}</h3>
                {habit.description && (
                  <p className="text-gray-600 text-sm">{habit.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{habit.frequency}</span>
                  </div>
                  {onAssign && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{habit.assignedTo.length} athletes</span>
                    </div>
                  )}
                  {habit.endDate && (
                    <div className="text-sm text-gray-500">
                      Until {formatDate(habit.endDate)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {onAssign && (
                  <button
                    onClick={() => onAssign(habit)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    Assign
                  </button>
                )}
                {inRange && status === 'pending' && !onAssign && (
                  <>
                    <button
                      onClick={() => onComplete(habit.id, 'completed')}
                      className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      title="Mark as completed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onComplete(habit.id, 'missed')}
                      className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      title="Mark as missed"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {!inRange && !onAssign && (
              <div className="text-sm text-gray-500 mt-2">
                Not scheduled for this date
              </div>
            )}
            {inRange && status !== 'pending' && !onAssign && (
              <div className={`flex items-center gap-2 mt-2 ${
                status === 'completed' ? 'text-green-600' : 'text-red-600'
              }`}>
                {status === 'completed' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Missed</span>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {habits.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No habits found for this date
        </div>
      )}
    </div>
  );
}

export default HabitsList;
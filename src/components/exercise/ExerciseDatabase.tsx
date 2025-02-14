import React, { useState } from 'react';
import { Plus, Search, Trash2, Youtube, X } from 'lucide-react';
import type { Exercise, MeasurementType } from '../../types';

type ExerciseDatabaseProps = {
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
};

// Mock exercise database (in a real app, this would come from your backend)
const INITIAL_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Squat',
    sets: [],
    demoUrl: 'https://youtube.com/watch?v=...',
    description: 'A compound exercise that targets the lower body muscles.',
    category: 'legs',
    measurementType: 'weight',
  },
  {
    id: '2',
    name: 'Bench Press',
    sets: [],
    demoUrl: 'https://youtube.com/watch?v=...',
    description: 'A compound exercise for chest, shoulders, and triceps.',
    category: 'chest',
    measurementType: 'weight',
  },
  {
    id: '3',
    name: 'Plank',
    sets: [],
    description: 'Core stability exercise.',
    category: 'core',
    measurementType: 'time',
  },
  {
    id: '4',
    name: 'Running',
    sets: [],
    description: 'Cardiovascular exercise.',
    category: 'cardio',
    measurementType: 'distance',
  },
  {
    id: '5',
    name: 'Push-ups',
    sets: [],
    description: 'Bodyweight exercise for chest and triceps.',
    category: 'chest',
    measurementType: 'count',
  },
];

export function ExerciseDatabase({ onClose, onSelectExercise }: ExerciseDatabaseProps) {
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    category: '',
    demoUrl: '',
    measurementType: 'weight' as MeasurementType,
  });

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(
    exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = () => {
    if (newExercise.name) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newExercise.name,
        description: newExercise.description,
        category: newExercise.category,
        demoUrl: newExercise.demoUrl || undefined,
        sets: [],
        measurementType: newExercise.measurementType,
      };

      setExercises([...exercises, exercise]);
      setNewExercise({ name: '', description: '', category: '', demoUrl: '', measurementType: 'weight' });
      setShowAddForm(false);
    }
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Exercise Database</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Search and Add Button */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Exercise
            </button>
          </div>

          {/* Exercise List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    {exercise.category && (
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {exercise.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {exercise.demoUrl && (
                      <a
                        href={exercise.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-indigo-100 rounded-full text-indigo-600"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="p-1 hover:bg-red-100 rounded-full text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {exercise.description && (
                  <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
                )}
                <button
                  onClick={() => onSelectExercise(exercise)}
                  className="w-full bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Add to Program
                </button>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No exercises found matching your search
            </div>
          )}
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Exercise</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newExercise.category}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, category: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., chest, legs, back"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Measurement Type
                </label>
                <select
                  value={newExercise.measurementType}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, measurementType: e.target.value as MeasurementType })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="weight">Weight</option>
                  <option value="time">Time</option>
                  <option value="distance">Distance</option>
                  <option value="count">Count/Reps</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newExercise.description}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demo Video URL (optional)
                </label>
                <input
                  type="url"
                  value={newExercise.demoUrl}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, demoUrl: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExercise}
                  disabled={!newExercise.name}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
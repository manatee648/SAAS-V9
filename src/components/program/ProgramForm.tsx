import React, { useState } from 'react';
import { Plus, X, Trash2, Youtube } from 'lucide-react';
import type { Exercise, WorkoutProgram, WeightType, MeasurementType } from '../../types';
import { ExerciseDatabase } from '../exercise/ExerciseDatabase';
import { MEASUREMENT_UNITS } from '../metrics/MetricsConfig';

type ProgramFormProps = {
  onClose: () => void;
  onSave: (program: Omit<WorkoutProgram, 'id' | 'assignedTo' | 'assignedTeams'>) => void;
  initialProgram?: WorkoutProgram;
};

export function ProgramForm({ onClose, onSave, initialProgram }: ProgramFormProps) {
  const [program, setProgram] = useState({
    name: initialProgram?.name || '',
    description: initialProgram?.description || '',
    exercises: initialProgram?.exercises || [],
  });
  const [showExerciseDb, setShowExerciseDb] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [newSet, setNewSet] = useState({
    reps: '',
    measurement: {
      type: 'weight' as MeasurementType,
      value: '',
      unit: MEASUREMENT_UNITS.weight[0].value,
    },
    weightType: 'absolute' as WeightType,
  });

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise({ ...exercise, sets: [] });
    setNewSet({
      ...newSet,
      measurement: {
        type: exercise.measurementType,
        value: '',
        unit: MEASUREMENT_UNITS[exercise.measurementType][0].value,
      },
    });
    setShowExerciseDb(false);
  };

  const addSet = () => {
    if (!selectedExercise) return;

    const reps = parseInt(newSet.reps);
    const measurementValue = parseFloat(newSet.measurement.value);

    if (!isNaN(reps) && reps > 0 && !isNaN(measurementValue)) {
      setSelectedExercise({
        ...selectedExercise,
        sets: [
          ...selectedExercise.sets,
          {
            id: Date.now().toString(),
            reps,
            measurement: {
              type: newSet.measurement.type,
              value: measurementValue,
              unit: newSet.measurement.unit,
            },
            weightType: newSet.weightType,
          },
        ],
      });
      setNewSet({
        ...newSet,
        reps: '',
        measurement: {
          ...newSet.measurement,
          value: '',
        },
      });
    }
  };

  const removeSet = (setId: string) => {
    if (!selectedExercise) return;

    setSelectedExercise({
      ...selectedExercise,
      sets: selectedExercise.sets.filter((set) => set.id !== setId),
    });
  };

  const addExerciseToProgram = () => {
    if (!selectedExercise || selectedExercise.sets.length === 0) return;

    setProgram({
      ...program,
      exercises: [...program.exercises, selectedExercise],
    });
    setSelectedExercise(null);
  };

  const removeExercise = (exerciseId: string) => {
    setProgram({
      ...program,
      exercises: program.exercises.filter((ex) => ex.id !== exerciseId),
    });
  };

  const handleSave = () => {
    if (program.name && program.exercises.length > 0) {
      onSave(program);
    }
  };

  const getMeasurementLabel = (type: MeasurementType, unit: string) => {
    const unitConfig = MEASUREMENT_UNITS[type].find(u => u.value === unit);
    return unitConfig ? unitConfig.label : unit;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {initialProgram ? 'Edit Program' : 'Create New Program'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Program Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) =>
                    setProgram({ ...program, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={program.description}
                  onChange={(e) =>
                    setProgram({ ...program, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            {/* Exercise Selection */}
            <div>
              <button
                onClick={() => setShowExerciseDb(true)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Exercise from Database
              </button>
            </div>

            {/* Selected Exercise */}
            {selectedExercise && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Configure {selectedExercise.name}
                </h3>
                
                {/* Add Set Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newSet.reps}
                        onChange={(e) =>
                          setNewSet({
                            ...newSet,
                            reps: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={newSet.measurement.unit}
                        onChange={(e) =>
                          setNewSet({
                            ...newSet,
                            measurement: {
                              ...newSet.measurement,
                              unit: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      >
                        {MEASUREMENT_UNITS[selectedExercise.measurementType].map((unit) => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newSet.measurement.value}
                        onChange={(e) =>
                          setNewSet({
                            ...newSet,
                            measurement: {
                              ...newSet.measurement,
                              value: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addSet}
                    className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Add Set
                  </button>
                </div>

                {/* Sets List */}
                {selectedExercise.sets.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-2">
                      Sets ({selectedExercise.sets.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedExercise.sets.map((set, index) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between py-2 px-3 bg-white rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500">Set {index + 1}</span>
                            <span>
                              {set.reps} reps @ {set.measurement.value} {getMeasurementLabel(set.measurement.type, set.measurement.unit)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeSet(set.id)}
                            className="p-1 hover:bg-red-100 rounded-full text-red-600"
                            title="Delete set"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={addExerciseToProgram}
                  disabled={selectedExercise.sets.length === 0}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Program
                </button>
              </div>
            )}

            {/* Program Exercises */}
            {program.exercises.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Program Exercises ({program.exercises.length})
                </h3>
                <div className="space-y-4">
                  {program.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
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
                            onClick={() => removeExercise(exercise.id)}
                            className="p-1 hover:bg-red-100 rounded-full text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {exercise.sets.length} sets
                      </div>
                      <div className="mt-2 space-y-1">
                        {exercise.sets.map((set, index) => (
                          <div key={set.id} className="text-sm text-gray-600">
                            Set {index + 1}: {set.reps} reps @ {set.measurement.value} {getMeasurementLabel(set.measurement.type, set.measurement.unit)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!program.name || program.exercises.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialProgram ? 'Save Changes' : 'Create Program'}
            </button>
          </div>
        </div>

        {/* Exercise Database Modal */}
        {showExerciseDb && (
          <ExerciseDatabase
            onClose={() => setShowExerciseDb(false)}
            onSelectExercise={handleSelectExercise}
          />
        )}
      </div>
    </div>
  );
}
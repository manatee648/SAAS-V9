import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Youtube, MessageSquare, Plus, X, Timer } from 'lucide-react';
import type { WorkoutProgram, User, Set, SetNote } from '../../types';
import { MEASUREMENT_UNITS } from '../metrics/MetricsConfig';

type WorkoutPageProps = {
  program: WorkoutProgram;
  user: User;
  onBack: () => void;
  isActive?: boolean;
  startTime?: number;
  duration?: number;
};

function WorkoutPage({ program, user, onBack, isActive, startTime, duration }: WorkoutPageProps) {
  const [completedSets, setCompletedSets] = useState<string[]>([]);
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const toggleSetCompletion = (setId: string) => {
    setCompletedSets((prev) =>
      prev.includes(setId)
        ? prev.filter((id) => id !== setId)
        : [...prev, setId]
    );
  };

  const addNote = (set: Set) => {
    if (!newNote.trim()) return;

    const note: SetNote = {
      id: Date.now().toString(),
      userId: user.id,
      content: newNote.trim(),
      timestamp: Date.now(),
    };

    set.notes = [...(set.notes || []), note];
    setNewNote('');
    setShowNotes(null);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getMeasurementLabel = (type: string, unit: string) => {
    const unitConfig = MEASUREMENT_UNITS[type]?.find(u => u.value === unit);
    return unitConfig ? unitConfig.label : unit;
  };

  const totalSets = program.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completionPercentage = Math.round((completedSets.length / totalSets) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{program.name}</h1>
        <p className="text-gray-600 mt-2">{program.description}</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {program.exercises.length}
            </div>
            <div className="text-sm text-gray-600">Exercises</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {totalSets}
            </div>
            <div className="text-sm text-gray-600">Total Sets</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {completedSets.length}
            </div>
            <div className="text-sm text-gray-600">Sets Completed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
        </div>

        {/* Timer */}
        {isActive && startTime && duration !== undefined && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Timer className="w-6 h-6 text-indigo-600 animate-pulse" />
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatDuration(duration)}
                </div>
                <div className="text-sm text-indigo-600">
                  Started at {new Date(startTime).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-6">
        {program.exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{exercise.name}</h3>
                {exercise.demoUrl && (
                  <a
                    href={exercise.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <Youtube className="w-5 h-5" />
                    Watch Demo
                  </a>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-gray-600">
                  <div className="col-span-1">Set</div>
                  <div className="col-span-2">Reps</div>
                  <div className="col-span-2">Measurement</div>
                  <div className="col-span-4">Status</div>
                  <div className="col-span-3">Notes</div>
                </div>
                {exercise.sets.map((set, index) => (
                  <div
                    key={set.id}
                    className="grid grid-cols-12 gap-4 py-3 border-t border-gray-200 first:border-0"
                  >
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-2">{set.reps}</div>
                    <div className="col-span-2">
                      {set.measurement?.value} {getMeasurementLabel(set.measurement?.type || exercise.measurementType, set.measurement?.unit || 'reps')}
                    </div>
                    <div className="col-span-4">
                      <button
                        onClick={() => toggleSetCompletion(set.id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          completedSets.includes(set.id)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {completedSets.includes(set.id) ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                    <div className="col-span-3">
                      <button
                        onClick={() => setShowNotes(showNotes === set.id ? null : set.id)}
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {(set.notes?.length || 0) > 0 ? `${set.notes!.length} notes` : 'Add note'}
                      </button>

                      {showNotes === set.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">
                                Set {index + 1} Notes
                              </h3>
                              <button
                                onClick={() => setShowNotes(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Existing Notes */}
                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                              {set.notes?.map((note) => (
                                <div
                                  key={note.id}
                                  className={`p-3 rounded-lg ${
                                    note.userId === user.id
                                      ? 'bg-indigo-50 ml-4'
                                      : 'bg-gray-50 mr-4'
                                  }`}
                                >
                                  <div className="text-sm font-medium mb-1">
                                    {note.userId === user.id ? 'You' : 'Coach'}
                                  </div>
                                  <div className="text-gray-700">{note.content}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatTimestamp(note.timestamp)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Add New Note */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a note..."
                                className="flex-1 p-2 border rounded-lg"
                              />
                              <button
                                onClick={() => addNote(set)}
                                disabled={!newNote.trim()}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutPage;
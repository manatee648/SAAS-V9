import React from 'react';
import { Edit, Users, X, Copy, Youtube } from 'lucide-react';
import type { WorkoutProgram } from '../../types';

type ProgramListProps = {
  programs: WorkoutProgram[];
  onEditProgram: (program: WorkoutProgram) => void;
  onDuplicateProgram: (program: WorkoutProgram) => void;
  onAssignProgram: (id: string) => void;
  onDeleteProgram: (id: string) => void;
};

export function ProgramList({
  programs,
  onEditProgram,
  onDuplicateProgram,
  onAssignProgram,
  onDeleteProgram,
}: ProgramListProps) {
  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <div
          key={program.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {program.name}
              </h3>
              <p className="text-gray-600">{program.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Assigned to: {program.assignedTo.length} athletes, {program.assignedTeams.length} teams
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDuplicateProgram(program)}
                className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                title="Duplicate program"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEditProgram(program)}
                className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                title="Edit program"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onAssignProgram(program.id)}
                className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600"
                title="Assign to athletes or teams"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDeleteProgram(program.id)}
                className="p-2 hover:bg-red-100 rounded-full"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4">
            {program.exercises.map((exercise) => (
              <div key={exercise.id} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{exercise.name}</h4>
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
                  <div className="grid grid-cols-3 gap-4 mb-2 text-sm font-medium text-gray-600">
                    <div>Set</div>
                    <div>Reps</div>
                    <div>Weight</div>
                  </div>
                  {exercise.sets.map((set, index) => (
                    <div key={set.id} className="grid grid-cols-3 gap-4 py-2 border-t border-gray-200 first:border-0">
                      <div>{index + 1}</div>
                      <div>{set.reps}</div>
                      <div>
                        {set.weight}
                        {set.weightType === 'percentage' ? '% 1RM' : 'lbs'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
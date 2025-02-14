import type { User, Team, WorkoutProgram } from '../types';

export const MOCK_ATHLETES: User[] = [
  { id: '2', name: 'Jane Athlete', email: 'athlete@example.com', role: 'athlete', organizationId: '1' },
  { id: '3', name: 'Bob Athlete', email: 'athlete2@example.com', role: 'athlete', organizationId: '1' },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Strength Team',
    description: 'Focus on strength training',
    athletes: ['2'],
  },
  {
    id: '2',
    name: 'Endurance Team',
    description: 'Focus on endurance training',
    athletes: ['3'],
  },
];

export const INITIAL_PROGRAMS: WorkoutProgram[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'A comprehensive full body workout focusing on major muscle groups',
    exercises: [
      {
        id: '1',
        name: 'Squats',
        measurementType: 'weight',
        sets: [
          { 
            id: '1-1', 
            reps: 8, 
            measurement: {
              type: 'weight',
              value: 135,
              unit: 'lbs'
            }
          },
          { 
            id: '1-2', 
            reps: 8, 
            measurement: {
              type: 'weight',
              value: 135,
              unit: 'lbs'
            }
          },
          { 
            id: '1-3', 
            reps: 8, 
            measurement: {
              type: 'weight',
              value: 135,
              unit: 'lbs'
            }
          },
          { 
            id: '1-4', 
            reps: 8, 
            measurement: {
              type: 'weight',
              value: 135,
              unit: 'lbs'
            }
          },
        ],
      },
      {
        id: '2',
        name: 'Plank',
        measurementType: 'time',
        sets: [
          {
            id: '2-1',
            reps: 1,
            measurement: {
              type: 'time',
              value: 60,
              unit: 'seconds'
            }
          },
          {
            id: '2-2',
            reps: 1,
            measurement: {
              type: 'time',
              value: 60,
              unit: 'seconds'
            }
          }
        ]
      },
      {
        id: '3',
        name: 'Push-ups',
        measurementType: 'count',
        sets: [
          {
            id: '3-1',
            reps: 1,
            measurement: {
              type: 'count',
              value: 20,
              unit: 'reps'
            }
          },
          {
            id: '3-2',
            reps: 1,
            measurement: {
              type: 'count',
              value: 20,
              unit: 'reps'
            }
          }
        ]
      }
    ],
    assignedTo: [],
    assignedTeams: [],
  },
];
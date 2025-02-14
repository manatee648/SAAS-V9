import type { User } from './types';

// Existing types...

export type HabitFrequency = 'daily' | 'weekly';

export type HabitStatus = 'pending' | 'completed' | 'missed';

export type HabitCompletion = {
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  status: HabitStatus;
  notes?: string;
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  createdBy: string; // userId
  assignedTo: string[]; // userIds
  organizationId: string;
  isCustom?: boolean; // true if created by athlete, false if created by coach
  startDate: Date;
  endDate?: Date;
  completions: HabitCompletion[];
};
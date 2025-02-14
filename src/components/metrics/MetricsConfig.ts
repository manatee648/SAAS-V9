import type { MetricDefinition, MeasurementUnit } from '../../types';

const TIME_UNITS: MeasurementUnit[] = [
  { type: 'time', value: 'seconds', label: 'Seconds', conversion: (v) => v },
  { type: 'time', value: 'minutes', label: 'Minutes', conversion: (v) => v * 60 },
  { type: 'time', value: 'hours', label: 'Hours', conversion: (v) => v * 3600 },
];

const DISTANCE_UNITS: MeasurementUnit[] = [
  { type: 'distance', value: 'meters', label: 'Meters', conversion: (v) => v },
  { type: 'distance', value: 'kilometers', label: 'Kilometers', conversion: (v) => v * 1000 },
  { type: 'distance', value: 'miles', label: 'Miles', conversion: (v) => v * 1609.34 },
  { type: 'distance', value: 'yards', label: 'Yards', conversion: (v) => v * 0.9144 },
];

const WEIGHT_UNITS: MeasurementUnit[] = [
  { type: 'weight', value: 'lbs', label: 'Pounds (lbs)', conversion: (v) => v },
  { type: 'weight', value: 'kg', label: 'Kilograms (kg)', conversion: (v) => v * 2.20462 },
];

const PERCENTAGE_UNITS: MeasurementUnit[] = [
  { type: 'percentage', value: '%', label: 'Percentage (%)', conversion: (v) => v },
];

const COUNT_UNITS: MeasurementUnit[] = [
  { type: 'count', value: 'reps', label: 'Repetitions', conversion: (v) => v },
  { type: 'count', value: 'laps', label: 'Laps', conversion: (v) => v },
];

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  weight: {
    type: 'weight',
    label: 'Body Weight',
    unit: 'lbs',
    description: 'Track your body weight over time',
    color: '#4F46E5', // indigo-600
    availableUnits: WEIGHT_UNITS,
  },
  bodyFat: {
    type: 'bodyFat',
    label: 'Body Fat',
    unit: '%',
    description: 'Track your body fat percentage',
    color: '#DC2626', // red-600
    availableUnits: PERCENTAGE_UNITS,
  },
  benchPress: {
    type: 'benchPress',
    label: 'Bench Press 1RM',
    unit: 'lbs',
    description: 'Track your bench press one-rep maximum',
    color: '#2563EB', // blue-600
    availableUnits: WEIGHT_UNITS,
  },
  squat: {
    type: 'squat',
    label: 'Squat 1RM',
    unit: 'lbs',
    description: 'Track your squat one-rep maximum',
    color: '#7C3AED', // purple-600
    availableUnits: WEIGHT_UNITS,
  },
  deadlift: {
    type: 'deadlift',
    label: 'Deadlift 1RM',
    unit: 'lbs',
    description: 'Track your deadlift one-rep maximum',
    color: '#059669', // emerald-600
    availableUnits: WEIGHT_UNITS,
  },
  runningDistance: {
    type: 'distance',
    label: 'Running Distance',
    unit: 'meters',
    description: 'Track your running distance',
    color: '#0891B2', // cyan-600
    availableUnits: DISTANCE_UNITS,
  },
  runningTime: {
    type: 'time',
    label: 'Running Time',
    unit: 'minutes',
    description: 'Track your running time',
    color: '#EA580C', // orange-600
    availableUnits: TIME_UNITS,
  },
  swimming: {
    type: 'distance',
    label: 'Swimming Distance',
    unit: 'meters',
    description: 'Track your swimming distance',
    color: '#0EA5E9', // sky-600
    availableUnits: DISTANCE_UNITS,
  },
  pushUps: {
    type: 'count',
    label: 'Push-ups',
    unit: 'reps',
    description: 'Track your push-up count',
    color: '#84CC16', // lime-600
    availableUnits: COUNT_UNITS,
  },
};

export const MEASUREMENT_UNITS = {
  time: TIME_UNITS,
  distance: DISTANCE_UNITS,
  weight: WEIGHT_UNITS,
  percentage: PERCENTAGE_UNITS,
  count: COUNT_UNITS,
};
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { User, MetricType, MetricEntry } from '../../../types';
import { METRIC_DEFINITIONS } from '../../metrics/MetricsConfig';

type AthleteMetricsModalProps = {
  athlete: User;
  onClose: () => void;
  onAddMetric: (entry: Omit<MetricEntry, 'id'>) => void;
};

type UnitOption = {
  value: string;
  label: string;
  conversion: (value: number) => number;
};

const UNIT_OPTIONS: Record<MetricType, UnitOption[]> = {
  weight: [
    { value: 'lbs', label: 'Pounds (lbs)', conversion: (v) => v },
    { value: 'kg', label: 'Kilograms (kg)', conversion: (v) => v * 2.20462 },
  ],
  bodyFat: [
    { value: '%', label: 'Percentage (%)', conversion: (v) => v },
  ],
  benchPress: [
    { value: 'lbs', label: 'Pounds (lbs)', conversion: (v) => v },
    { value: 'kg', label: 'Kilograms (kg)', conversion: (v) => v * 2.20462 },
  ],
  squat: [
    { value: 'lbs', label: 'Pounds (lbs)', conversion: (v) => v },
    { value: 'kg', label: 'Kilograms (kg)', conversion: (v) => v * 2.20462 },
  ],
  deadlift: [
    { value: 'lbs', label: 'Pounds (lbs)', conversion: (v) => v },
    { value: 'kg', label: 'Kilograms (kg)', conversion: (v) => v * 2.20462 },
  ],
};

export function AthleteMetricsModal({ athlete, onClose, onAddMetric }: AthleteMetricsModalProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [value, setValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(UNIT_OPTIONS[selectedMetric][0].value);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    // Convert value to standard unit (lbs for weight metrics)
    const unitOption = UNIT_OPTIONS[selectedMetric].find(u => u.value === selectedUnit);
    if (!unitOption) return;

    const convertedValue = unitOption.conversion(numericValue);

    onAddMetric({
      athleteId: athlete.id,
      type: selectedMetric,
      value: convertedValue,
      date: new Date(),
      notes: notes.trim() || undefined,
    });

    setValue('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Record Metrics</h2>
            <p className="text-gray-600">for {athlete.name}</p>
          </div>
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
              Metric Type
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => {
                const newMetric = e.target.value as MetricType;
                setSelectedMetric(newMetric);
                setSelectedUnit(UNIT_OPTIONS[newMetric][0].value);
              }}
              className="w-full p-2 border rounded-lg"
            >
              {Object.entries(METRIC_DEFINITIONS).map(([key, metric]) => (
                <option key={key} value={key}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter value"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {UNIT_OPTIONS[selectedMetric].map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={2}
              placeholder="Add any additional notes..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Record Metric
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { CustomMetric, MetricUnit, User } from '../../../types';

type CustomMetricModalProps = {
  onClose: () => void;
  onSave: (metric: Omit<CustomMetric, 'id'>) => void;
  user: User;
};

const UNIT_TYPES = [
  { value: 'number', label: 'Number' },
  { value: 'percentage', label: 'Percentage' },
  { value: 'time', label: 'Time' },
  { value: 'distance', label: 'Distance' },
] as const;

const DEFAULT_UNITS: Record<string, MetricUnit[]> = {
  number: [
    { id: 'count', name: 'Count', abbreviation: '', type: 'number' },
    { id: 'reps', name: 'Repetitions', abbreviation: 'reps', type: 'number' },
  ],
  percentage: [
    { id: 'percent', name: 'Percentage', abbreviation: '%', type: 'percentage' },
  ],
  time: [
    { id: 'seconds', name: 'Seconds', abbreviation: 's', type: 'time', baseUnit: 'seconds', conversionFactor: 1 },
    { id: 'minutes', name: 'Minutes', abbreviation: 'min', type: 'time', baseUnit: 'seconds', conversionFactor: 60 },
  ],
  distance: [
    { id: 'meters', name: 'Meters', abbreviation: 'm', type: 'distance', baseUnit: 'meters', conversionFactor: 1 },
    { id: 'kilometers', name: 'Kilometers', abbreviation: 'km', type: 'distance', baseUnit: 'meters', conversionFactor: 1000 },
    { id: 'feet', name: 'Feet', abbreviation: 'ft', type: 'distance', baseUnit: 'meters', conversionFactor: 0.3048 },
    { id: 'miles', name: 'Miles', abbreviation: 'mi', type: 'distance', baseUnit: 'meters', conversionFactor: 1609.34 },
  ],
};

export function CustomMetricModal({ onClose, onSave, user }: CustomMetricModalProps) {
  const [metricData, setMetricData] = useState({
    name: '',
    description: '',
    unitType: 'number' as typeof UNIT_TYPES[number]['value'],
    unit: DEFAULT_UNITS.number[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricData.name) return;

    onSave({
      name: metricData.name,
      description: metricData.description,
      unit: metricData.unit,
      createdBy: user.id,
      organizationId: user.organizationId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Custom Metric</h2>
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
              Metric Name
            </label>
            <input
              type="text"
              value={metricData.name}
              onChange={(e) => setMetricData({ ...metricData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Vertical Jump, Sprint Time"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={metricData.description}
              onChange={(e) => setMetricData({ ...metricData, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Describe what this metric measures and how it should be recorded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Type
            </label>
            <select
              value={metricData.unitType}
              onChange={(e) => {
                const newUnitType = e.target.value as typeof UNIT_TYPES[number]['value'];
                setMetricData({
                  ...metricData,
                  unitType: newUnitType,
                  unit: DEFAULT_UNITS[newUnitType][0],
                });
              }}
              className="w-full p-2 border rounded-lg"
            >
              {UNIT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              value={metricData.unit.id}
              onChange={(e) => {
                const selectedUnit = DEFAULT_UNITS[metricData.unitType].find(
                  u => u.id === e.target.value
                );
                if (selectedUnit) {
                  setMetricData({ ...metricData, unit: selectedUnit });
                }
              }}
              className="w-full p-2 border rounded-lg"
            >
              {DEFAULT_UNITS[metricData.unitType].map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({unit.abbreviation})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Metric
          </button>
        </form>
      </div>
    </div>
  );
}
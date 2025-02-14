import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { User, MetricEntry, MetricType } from '../../types';
import { METRIC_DEFINITIONS } from './MetricsConfig';

type MetricsEntryProps = {
  user: User;
  onAddMetric: (entry: Omit<MetricEntry, 'id'>) => void;
};

function MetricsEntry({ user, onAddMetric }: MetricsEntryProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  const [value, setValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(METRIC_DEFINITIONS[selectedMetric].availableUnits[0].value);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    // Convert value to base unit
    const unitConfig = METRIC_DEFINITIONS[selectedMetric].availableUnits.find(u => u.value === selectedUnit);
    if (!unitConfig) return;

    const convertedValue = unitConfig.conversion ? unitConfig.conversion(numericValue) : numericValue;

    onAddMetric({
      athleteId: user.id,
      type: selectedMetric,
      value: convertedValue,
      unit: selectedUnit,
      date: new Date(),
      notes: notes.trim() || undefined,
    });

    setValue('');
    setNotes('');
  };

  const handleMetricChange = (newMetric: MetricType) => {
    setSelectedMetric(newMetric);
    setSelectedUnit(METRIC_DEFINITIONS[newMetric].availableUnits[0].value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Record New Metric</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metric Type
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => handleMetricChange(e.target.value as MetricType)}
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
              placeholder={`Enter ${METRIC_DEFINITIONS[selectedMetric].label.toLowerCase()}`}
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
              {METRIC_DEFINITIONS[selectedMetric].availableUnits.map((unit) => (
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
      </div>
    </form>
  );
}

export default MetricsEntry;
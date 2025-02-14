import React, { useState } from 'react';
import { Save } from 'lucide-react';
import type { User, MetricType } from '../../types';
import { METRIC_DEFINITIONS } from '../metrics/MetricsConfig';

type Settings = {
  enableLeaderboard: boolean;
  visibleMetrics: MetricType[];
  notifyOnNewRecords: boolean;
  notifyOnDeclines: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  enableLeaderboard: true,
  visibleMetrics: ['benchPress', 'squat', 'deadlift'],
  notifyOnNewRecords: true,
  notifyOnDeclines: true,
};

type CoachSettingsProps = {
  user: User;
};

function CoachSettings({ user }: CoachSettingsProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  const handleMetricToggle = (metric: MetricType) => {
    setSettings(prev => ({
      ...prev,
      visibleMetrics: prev.visibleMetrics.includes(metric)
        ? prev.visibleMetrics.filter(m => m !== metric)
        : [...prev.visibleMetrics, metric],
    }));
  };

  const handleSave = () => {
    // In a real app, save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Coach Settings</h2>

        <div className="space-y-6">
          {/* Leaderboard Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enableLeaderboard}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      enableLeaderboard: e.target.checked,
                    }))
                  }
                  className="rounded text-indigo-600"
                />
                <span>Enable Leaderboard</span>
              </label>

              <div className="pl-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Visible Metrics
                </p>
                <div className="space-y-2">
                  {Object.entries(METRIC_DEFINITIONS)
                    .filter(([key]) => ['benchPress', 'squat', 'deadlift'].includes(key))
                    .map(([key, metric]) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.visibleMetrics.includes(key as MetricType)}
                          onChange={() => handleMetricToggle(key as MetricType)}
                          disabled={!settings.enableLeaderboard}
                          className="rounded text-indigo-600"
                        />
                        <span className={!settings.enableLeaderboard ? 'text-gray-400' : ''}>
                          {metric.label}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notifyOnNewRecords}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      notifyOnNewRecords: e.target.checked,
                    }))
                  }
                  className="rounded text-indigo-600"
                />
                <span>Notify me when athletes set new records</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.notifyOnDeclines}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      notifyOnDeclines: e.target.checked,
                    }))
                  }
                  className="rounded text-indigo-600"
                />
                <span>Notify me when athletes show significant decline</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoachSettings;
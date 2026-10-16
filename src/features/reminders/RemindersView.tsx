import React, { useState } from 'react';
import { ReminderSettings, ReminderType } from '@shared/types';
import { api } from '../../services/api';
import {
  Droplet,
  Move,
  Eye,
  Activity,
  Check,
  AlertCircle,
  Clock,
  Volume2,
  VolumeX,
  Moon,
} from 'lucide-react';

interface RemindersViewProps {
  reminders: ReminderSettings[];
  onRefresh: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ reminders, onRefresh }) => {
  const [selectedType, setSelectedType] = useState<ReminderType>('water');
  const [editingSettings, setEditingSettings] = useState<Record<ReminderType, ReminderSettings>>(
    () => {
      const map: any = {};
      reminders.forEach((r) => {
        map[r.id] = { ...r };
      });
      return map;
    }
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const current = editingSettings[selectedType] || reminders.find((r) => r.id === selectedType);

  const updateCurrent = (updates: Partial<ReminderSettings>) => {
    setEditingSettings((prev) => ({
      ...prev,
      [selectedType]: {
        ...prev[selectedType],
        ...updates,
      },
    }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    if (!current) return;
    setErrorMessage(null);

    // Validation
    if (current.intervalMinutes < 1 || current.intervalMinutes > 1440) {
      setErrorMessage('Interval must be between 1 and 1440 minutes (24h).');
      return;
    }
    if (current.snoozeMinutes < 1 || current.snoozeMinutes > 120) {
      setErrorMessage('Snooze duration must be between 1 and 120 minutes.');
      return;
    }
    if (current.workingHours.activeDays.length === 0) {
      setErrorMessage('At least one active working day must be selected.');
      return;
    }

    try {
      await api.updateReminderSettings(current);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update reminder settings.');
    }
  };

  const getIcon = (type: ReminderType) => {
    switch (type) {
      case 'water':
        return <Droplet size={18} className="text-sky-500" />;
      case 'standing':
        return <Move size={18} className="text-amber-500" />;
      case 'eye_rest':
        return <Eye size={18} className="text-emerald-500" />;
      case 'stretching':
        return <Activity size={18} className="text-purple-500" />;
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (dayIndex: number) => {
    const curDays = current.workingHours.activeDays;
    let newDays: number[];
    if (curDays.includes(dayIndex)) {
      newDays = curDays.filter((d: number) => d !== dayIndex);
    } else {
      newDays = [...curDays, dayIndex].sort();
    }
    updateCurrent({
      workingHours: {
        ...current.workingHours,
        activeDays: newDays,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Reminder Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        {reminders.map((r) => {
          const isSelected = r.id === selectedType;
          return (
            <button
              key={r.id}
              onClick={() => {
                setSelectedType(r.id);
                setSavedSuccess(false);
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {getIcon(r.id)}
              <span>{r.name}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  r.enabled ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>

      {current && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-6">
          {/* Header & Enable Toggle */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {getIcon(current.id)} {current.name} Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure frequency, schedule, and alert preferences.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {current.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <div
                onClick={() => updateCurrent({ enabled: !current.enabled })}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  current.enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    current.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} /> {errorMessage}
            </div>
          )}
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check size={16} /> Reminder settings saved successfully and schedule updated!
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interval & Snooze Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Reminder Interval (Minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="180"
                    step="5"
                    value={current.intervalMinutes}
                    onChange={(e) => updateCurrent({ intervalMinutes: parseInt(e.target.value, 10) })}
                    className="flex-1 accent-teal-600"
                  />
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={current.intervalMinutes}
                    onChange={(e) =>
                      updateCurrent({ intervalMinutes: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-20 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm font-bold text-center"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Triggers every {current.intervalMinutes} minutes during working hours.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Snooze Duration (Minutes)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 5, 10, 15].map((m) => (
                    <button
                      key={m}
                      onClick={() => updateCurrent({ snoozeMinutes: m })}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        current.snoozeMinutes === m
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Notification Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div className="flex items-center gap-2">
                  {current.soundEnabled ? (
                    <Volume2 size={16} className="text-teal-600" />
                  ) : (
                    <VolumeX size={16} className="text-slate-400" />
                  )}
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Play Notification Sound
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={current.soundEnabled}
                  onChange={(e) => updateCurrent({ soundEnabled: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Working Hours & Quiet Hours Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Clock size={14} /> Working Hours Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Start Time</span>
                    <input
                      type="time"
                      value={current.workingHours.startTime}
                      onChange={(e) =>
                        updateCurrent({
                          workingHours: { ...current.workingHours, startTime: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">End Time</span>
                    <input
                      type="time"
                      value={current.workingHours.endTime}
                      onChange={(e) =>
                        updateCurrent({
                          workingHours: { ...current.workingHours, endTime: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Active Days */}
                <span className="text-[10px] text-slate-400 block mt-2.5 mb-1">Active Days</span>
                <div className="flex items-center gap-1.5">
                  {dayLabels.map((lbl, idx) => {
                    const active = current.workingHours.activeDays.includes(idx);
                    return (
                      <button
                        key={lbl}
                        onClick={() => toggleDay(idx)}
                        className={`flex-1 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                          active
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-200 dark:border-slate-600 text-slate-400'
                        }`}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Moon size={14} className="text-indigo-500" /> Quiet Hours (Mute Window)
                  </span>
                  <input
                    type="checkbox"
                    checked={current.quietHours.enabled}
                    onChange={(e) =>
                      updateCurrent({
                        quietHours: { ...current.quietHours, enabled: e.target.checked },
                      })
                    }
                    className="rounded text-teal-600"
                  />
                </div>

                {current.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Quiet From</span>
                      <input
                        type="time"
                        value={current.quietHours.startTime}
                        onChange={(e) =>
                          updateCurrent({
                            quietHours: { ...current.quietHours, startTime: e.target.value },
                          })
                        }
                        className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Quiet Until</span>
                      <input
                        type="time"
                        value={current.quietHours.endTime}
                        onChange={(e) =>
                          updateCurrent({
                            quietHours: { ...current.quietHours, endTime: e.target.value },
                          })
                        }
                        className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all transform active:scale-95 flex items-center gap-1.5"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

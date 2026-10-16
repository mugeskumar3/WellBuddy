import React, { useState } from 'react';
import {
  DailyProgressSummary,
  NextReminderInfo,
  ReminderSettings,
  ReminderType,
  UserPreferences,
} from '@shared/types';
import { api } from '../../services/api';
import {
  Droplet,
  Move,
  Eye,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface OverviewViewProps {
  progress: DailyProgressSummary | null;
  reminders: ReminderSettings[];
  nextReminders: NextReminderInfo[];
  prefs: UserPreferences | null;
  onNavigateTab: (tab: string) => void;
  onRefresh: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  progress,
  reminders,
  nextReminders,
  prefs,
  onNavigateTab,
  onRefresh,
}) => {
  const [loggingWater, setLoggingWater] = useState(false);
  const [quickDoneLoading, setQuickDoneLoading] = useState<string | null>(null);

  const waterTotal = progress?.waterTotalMl || 0;
  const waterGoal = progress?.waterGoalMl || 2000;
  const waterPercent = Math.min(100, Math.round((waterTotal / waterGoal) * 100));

  const handleQuickAddWater = async (amount: number) => {
    setLoggingWater(true);
    try {
      await api.logWater(amount);
      onRefresh();
    } finally {
      setLoggingWater(false);
    }
  };

  const handleCompleteNext = async (type: ReminderType, occurrenceId: string) => {
    setQuickDoneLoading(type);
    try {
      await api.completeReminder(occurrenceId, type);
      onRefresh();
    } finally {
      setQuickDoneLoading(null);
    }
  };

  const getIcon = (type: ReminderType) => {
    switch (type) {
      case 'water':
        return <Droplet className="text-sky-500" size={20} />;
      case 'standing':
        return <Move className="text-amber-500" size={20} />;
      case 'eye_rest':
        return <Eye className="text-emerald-500" size={20} />;
      case 'stretching':
        return <Activity className="text-purple-500" size={20} />;
    }
  };

  const nextUpcoming = nextReminders[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Next Upcoming Reminder */}
      {nextUpcoming && !prefs?.remindersPaused ? (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                Next Upcoming Activity
              </div>
              <h2 className="text-xl font-bold">{nextUpcoming.name}</h2>
              <p className="text-sm text-teal-50 flex items-center gap-1.5 mt-0.5">
                <Clock size={14} />
                Due in {Math.max(0, Math.round((nextUpcoming.dueAt - Date.now()) / 60000))} minutes
              </p>
            </div>
          </div>
          <button
            onClick={() => handleCompleteNext(nextUpcoming.type, nextUpcoming.occurrenceId)}
            disabled={quickDoneLoading === nextUpcoming.type}
            className="bg-white text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} />
            {quickDoneLoading === nextUpcoming.type ? 'Marking...' : 'Complete Early'}
          </button>
        </div>
      ) : prefs?.remindersPaused ? (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-600" />
            <div>
              <p className="font-semibold text-sm">All reminders are currently paused</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                You can resume them from the top bar or system tray.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              api.resumeReminders();
              onRefresh();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            Resume Now
          </button>
        </div>
      ) : null}

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hydration Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-100 dark:bg-sky-900/40 rounded-xl">
                <Droplet className="text-sky-600 dark:text-sky-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Water Intake</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily Target: {waterGoal} ml</p>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">
              {waterPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden my-2">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>{waterTotal} ml logged</span>
            <span>{Math.max(0, waterGoal - waterTotal)} ml remaining</span>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={() => handleQuickAddWater(250)}
              disabled={loggingWater}
              className="flex-1 py-1.5 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus size={14} /> 250 ml
            </button>
            <button
              onClick={() => handleQuickAddWater(500)}
              disabled={loggingWater}
              className="flex-1 py-1.5 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus size={14} /> 500 ml
            </button>
            <button
              onClick={() => onNavigateTab('water')}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Open Water Tracker"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Wellness Score Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Completed Activities</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Today's healthy habits</p>
              </div>
            </div>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {progress?.completedActivities || 0}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-2">
            <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
              <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {progress?.completedActivities || 0}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Completed</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
              <span className="block text-lg font-bold text-amber-600 dark:text-amber-400">
                {progress?.snoozedActivities || 0}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Snoozed</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
              <span className="block text-lg font-bold text-slate-500 dark:text-slate-400">
                {progress?.skippedActivities || 0}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Skipped</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
            <span>Keep your streak going!</span>
            <button
              onClick={() => onNavigateTab('wellness')}
              className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
            >
              Take a stretch break <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Reminders Status Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Your Active Reminders</h3>
          <button
            onClick={() => onNavigateTab('reminders')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            Configure All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reminders.map((rem) => {
            const nextInfo = nextReminders.find((n) => n.type === rem.id);
            const dueInMin = nextInfo
              ? Math.max(0, Math.round((nextInfo.dueAt - Date.now()) / 60000))
              : null;

            return (
              <div
                key={rem.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      {getIcon(rem.id)}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        rem.enabled
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {rem.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{rem.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Every {rem.intervalMinutes} min
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {rem.enabled && dueInMin !== null ? `Due in ${dueInMin}m` : 'Off'}
                  </span>
                  {rem.enabled && nextInfo && (
                    <button
                      onClick={() => handleCompleteNext(rem.id, nextInfo.occurrenceId)}
                      disabled={quickDoneLoading === rem.id}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-0.5"
                    >
                      <CheckCircle2 size={12} /> Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

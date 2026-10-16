import React from 'react';
import { UserPreferences } from '@shared/types';
import { api } from '../../services/api';
import {
  Moon,
  Sun,
  Laptop,
  Volume2,
  Bell,
  Power,
  ShieldCheck,
  Minimize2,
  LogOut,
} from 'lucide-react';

interface GeneralSettingsViewProps {
  prefs: UserPreferences | null;
  onRefresh: () => void;
}

export const GeneralSettingsView: React.FC<GeneralSettingsViewProps> = ({ prefs, onRefresh }) => {
  const updatePref = async (updates: Partial<UserPreferences>) => {
    await api.updatePreferences(updates);
    onRefresh();
  };

  const handleStartupToggle = async (enable: boolean) => {
    await api.setStartAtLogin(enable);
    await updatePref({ startAtLogin: enable });
  };

  const handleExitApp = async () => {
    await api.exitApp();
  };

  return (
    <div className="space-y-6">
      {/* Theme Preference */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sun size={16} className="text-amber-500" /> Interface Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your visual appearance preference for WellBuddy.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = prefs?.theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => updatePref({ theme: item.id as any })}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-colors ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications & System Audio */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Bell size={16} className="text-teal-500" /> Notifications & Sound
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-teal-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Native Desktop Notifications
                </span>
                <span className="text-[11px] text-slate-400">
                  Deliver Windows native notification toasts for wellness reminders
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs?.notificationsEnabled ?? true}
              onChange={(e) => updatePref({ notificationsEnabled: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-teal-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Audio Chimes & Sound Effects
                </span>
                <span className="text-[11px] text-slate-400">
                  Play gentle auditory cues when reminders and break timers fire
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs?.soundEnabled ?? true}
              onChange={(e) => updatePref({ soundEnabled: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Windows Integration & Startup */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Power size={16} className="text-sky-500" /> Windows System Integration
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Power size={18} className="text-sky-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Launch on Windows Startup
                </span>
                <span className="text-[11px] text-slate-400">
                  Starts WellBuddy automatically when you boot or log into Windows (recommended)
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs?.startAtLogin ?? true}
              onChange={(e) => handleStartupToggle(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Minimize2 size={18} className="text-sky-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Start Minimized to System Tray
                </span>
                <span className="text-[11px] text-slate-400">
                  Silently launch in background tray on boot without opening the main window
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs?.startMinimized ?? false}
              onChange={(e) => updatePref({ startMinimized: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy and Local Persistence Notice */}
      <div className="bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 rounded-2xl p-5 flex items-start gap-3.5">
        <ShieldCheck size={22} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <h4 className="font-bold text-teal-800 dark:text-teal-200 mb-0.5">
            100% Local & Private by Design
          </h4>
          <p>
            WellBuddy stores your habits, water logs, and reminder schedules exclusively on your computer
            in a local SQLite database located in Electron's secure AppData directory. No cloud accounts,
            no telemetry, and no remote data transfers.
          </p>
        </div>
      </div>

      {/* Exit App Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleExitApp}
          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <LogOut size={14} /> Exit WellBuddy Completely
        </button>
      </div>
    </div>
  );
};

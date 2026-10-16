import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import {
  DailyProgressSummary,
  NextReminderInfo,
  ReminderSettings,
  UserPreferences,
  AvatarInfo,
} from '@shared/types';
import { OverviewView } from '../features/dashboard/OverviewView';
import { WaterView } from '../features/water/WaterView';
import { RemindersView } from '../features/reminders/RemindersView';
import { WellnessView } from '../features/wellness/WellnessView';
import { AvatarSettingsView } from '../features/avatars/AvatarSettingsView';
import { GeneralSettingsView } from '../features/settings/GeneralSettingsView';
import {
  LayoutDashboard,
  Droplet,
  Bell,
  HeartPulse,
  Smile,
  Settings,
  Pause,
  Play,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Minus,
} from 'lucide-react';

export const DashboardApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [reminders, setReminders] = useState<ReminderSettings[]>([]);
  const [nextReminders, setNextReminders] = useState<NextReminderInfo[]>([]);
  const [progress, setProgress] = useState<DailyProgressSummary | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedPrefs, fetchedReminders, fetchedNext, fetchedProg, fetchedAvatars] =
        await Promise.all([
          api.getPreferences(),
          api.getReminderSettings(),
          api.getNextReminders(),
          api.getDailyProgress(),
          api.getAvatars(),
        ]);
      setPrefs(fetchedPrefs);
      setReminders(fetchedReminders);
      setNextReminders(fetchedNext);
      setProgress(fetchedProg);
      setAvatars(fetchedAvatars);

      // Apply theme to html root
      if (fetchedPrefs.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (fetchedPrefs.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Listen to main process broadcasts
    const unsubProg = api.onProgressUpdated(() => {
      refreshData();
    });

    const unsubPrefs = api.onPreferencesUpdated((updated) => {
      setPrefs(updated);
      refreshData();
    });

    return () => {
      unsubProg();
      unsubPrefs();
    };
  }, [refreshData]);

  const togglePause = async () => {
    if (prefs?.remindersPaused) {
      await api.resumeReminders();
    } else {
      await api.pauseReminders(60); // Pause for 1 hour by default
    }
    refreshData();
  };

  const toggleCompanion = async () => {
    if (prefs?.companionVisible) {
      await api.hideCompanion();
    } else {
      await api.showCompanion();
    }
    refreshData();
  };

  const toggleTheme = async () => {
    const nextTheme = prefs?.theme === 'dark' ? 'light' : 'dark';
    await api.updatePreferences({ theme: nextTheme });
    refreshData();
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'water', label: 'Hydration', icon: Droplet },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'wellness', label: 'Wellness Breaks', icon: HeartPulse },
    { id: 'companion', label: 'Companion', icon: Smile },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between p-4 z-10">
        <div>
          {/* Logo & App Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-sm font-black text-lg">
              W
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                WellBuddy
              </h1>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold tracking-wide uppercase">
                Desktop Companion
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 shadow-xs border-l-4 border-teal-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Companion Status Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
              <Smile size={18} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Companion
              </span>
              <span className="text-[10px] text-slate-400">
                {prefs?.companionVisible ? 'Visible on screen' : 'Hidden'}
              </span>
            </div>
          </div>
          <button
            onClick={toggleCompanion}
            className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors"
            title={prefs?.companionVisible ? 'Hide companion' : 'Show companion'}
          >
            {prefs?.companionVisible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 px-6 flex items-center justify-between z-10">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {currentDateStr}
            </div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h2>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Pause / Resume Button */}
            <button
              onClick={togglePause}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                prefs?.remindersPaused
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              }`}
              title={prefs?.remindersPaused ? 'Resume scheduled reminders' : 'Pause reminders for 1 hour'}
            >
              {prefs?.remindersPaused ? <Play size={13} /> : <Pause size={13} />}
              <span>{prefs?.remindersPaused ? 'Reminders Paused' : 'Pause (1h)'}</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {prefs?.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Minimize to Tray */}
            <button
              onClick={() => api.closeDashboard()}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Minimize to System Tray"
            >
              <Minus size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <OverviewView
              progress={progress}
              reminders={reminders}
              nextReminders={nextReminders}
              prefs={prefs}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'water' && <WaterView onRefresh={refreshData} />}

          {activeTab === 'reminders' && (
            <RemindersView reminders={reminders} onRefresh={refreshData} />
          )}

          {activeTab === 'wellness' && <WellnessView onRefresh={refreshData} />}

          {activeTab === 'companion' && (
            <AvatarSettingsView avatars={avatars} prefs={prefs} onRefresh={refreshData} />
          )}

          {activeTab === 'settings' && (
            <GeneralSettingsView prefs={prefs} onRefresh={refreshData} />
          )}
        </main>
      </div>
    </div>
  );
};

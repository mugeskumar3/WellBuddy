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
import { VoiceStudioView } from '../features/voice/VoiceStudioView';
import { GeneralSettingsView } from '../features/settings/GeneralSettingsView';
import { applyTheme } from '../utils/theme';
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
  Star,
  Volume2,
  VolumeX,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface NavGroup {
  title: string;
  titleTa: string;
  items: {
    id: string;
    label: string;
    labelTa: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const DashboardApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [reminders, setReminders] = useState<ReminderSettings[]>([]);
  const [nextReminders, setNextReminders] = useState<NextReminderInfo[]>([]);
  const [progress, setProgress] = useState<DailyProgressSummary | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>([]);
  const [quickWaterLoading, setQuickWaterLoading] = useState(false);

  const isTamil = prefs?.language === 'ta';

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

      applyTheme(fetchedPrefs.theme);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    if (prefs?.theme) {
      return applyTheme(prefs.theme);
    }
  }, [prefs?.theme]);

  useEffect(() => {
    refreshData();

    const unsubProg = api.onProgressUpdated(() => refreshData());
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
      await api.pauseReminders(60);
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

  const toggleSound = async () => {
    const nextVal = prefs?.soundEnabled === false;
    await api.updatePreferences({ soundEnabled: nextVal });
    refreshData();
  };

  const toggleTheme = async () => {
    const nextTheme = prefs?.theme === 'dark' ? 'light' : 'dark';
    await api.updatePreferences({ theme: nextTheme });
    refreshData();
  };

  const handleQuickAddWater = async (amount: number = 250) => {
    setQuickWaterLoading(true);
    try {
      await api.logWater(amount);
      refreshData();
    } finally {
      setQuickWaterLoading(false);
    }
  };

  // Product-Tier Grouped Navigation Hierarchy
  const navGroups: NavGroup[] = [
    {
      title: 'Wellness & Tracking',
      titleTa: 'ஆரோக்கிய கண்காணிப்பு',
      items: [
        {
          id: 'overview',
          label: 'Executive Overview',
          labelTa: 'முக்கிய பலகை',
          icon: LayoutDashboard,
        },
        {
          id: 'water',
          label: 'Hydration Tracker',
          labelTa: 'தண்ணீர் பதிவு',
          icon: Droplet,
        },
        {
          id: 'wellness',
          label: 'Habits & Breaks',
          labelTa: 'உடற்பயிற்சி & ஓய்வு',
          icon: HeartPulse,
        },
      ],
    },
    {
      title: 'Mascot & Automation',
      titleTa: '3D தோழன் & நினைவூட்டல்',
      items: [
        {
          id: 'reminders',
          label: 'Smart Reminders',
          labelTa: 'நினைவூட்டல்கள்',
          icon: Bell,
        },
        {
          id: 'companion',
          label: '3D Companions',
          labelTa: '3D தோழர்கள்',
          icon: Smile,
          badge: '3D Walk',
          badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        },
      ],
    },
    {
      title: 'Studio & Preferences',
      titleTa: 'ஸ்டுடியோ & அமைப்புகள்',
      items: [
        {
          id: 'voice',
          label: 'Celebrity Voice Studio',
          labelTa: 'பிரபல குரல் ஸ்டுடியோ',
          icon: Star,
          badge: 'Trisha & Sam',
          badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300/40 dark:border-rose-700/40',
        },
        {
          id: 'settings',
          label: 'App Preferences',
          labelTa: 'அமைப்புகள்',
          icon: Settings,
        },
      ],
    },
  ];

  const activeAvatar = avatars.find((a) => a.id === (prefs?.selectedAvatarId || 'water-drop'));

  const currentDateStr = new Date().toLocaleDateString(isTamil ? 'ta-IN' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between p-4 z-20 select-none">
        <div className="space-y-5">
          {/* Logo & Product Brand Header */}
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-md ring-2 ring-teal-500/30 flex-shrink-0 group">
              <img
                src="./logo.png"
                alt="WellBuddy Logo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                  WellBuddy
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-teal-500 text-white shadow-xs">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold tracking-wide uppercase truncate block mt-0.5">
                {isTamil ? 'டெஸ்க்டாப் தோழன்' : 'Desktop Wellness OS'}
              </span>
            </div>
          </div>

          {/* Grouped Product Navigation Links */}
          <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500 block">
                  {isTamil ? group.titleTa : group.title}
                </span>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 shadow-xs border-l-4 border-teal-600 dark:border-teal-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            size={16}
                            className={
                              isActive
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }
                          />
                          <span className="truncate">{isTamil ? item.labelTa : item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-tight flex-shrink-0 ${
                              item.badgeColor || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Active Companion Mini-Widget */}
        <div className="pt-2">
          <div className="p-3 bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-slate-700/50 dark:to-teal-950/20 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center flex-shrink-0">
                  <Smile size={18} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {activeAvatar?.name || 'Companion'}
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        prefs?.companionVisible ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    {prefs?.companionVisible
                      ? (isTamil ? 'திரையில் உள்ளது' : 'On Screen')
                      : (isTamil ? 'மறைக்கப்பட்டுள்ளது' : 'Hidden')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleCompanion}
                className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors cursor-pointer"
                title={prefs?.companionVisible ? 'Hide mascot' : 'Show mascot'}
              >
                {prefs?.companionVisible ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Product Header Bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/80 px-6 flex items-center justify-between z-10 select-none">
          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {currentDateStr}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 capitalize">
              {(() => {
                for (const g of navGroups) {
                  const match = g.items.find((i) => i.id === activeTab);
                  if (match) return isTamil ? match.labelTa : match.label;
                }
                return activeTab;
              })()}
            </span>
          </div>

          {/* Product Quick-Action Toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Quick 250ml Water Logger */}
            <button
              type="button"
              onClick={() => handleQuickAddWater(250)}
              disabled={quickWaterLoading}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Quickly log 250ml water"
            >
              <Plus size={13} className="text-sky-600" />
              <span>{quickWaterLoading ? 'Adding...' : '+250ml'}</span>
            </button>

            {/* Voice Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                prefs?.soundEnabled !== false
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
              title={prefs?.soundEnabled !== false ? 'Sound Muted' : 'Sound Active'}
            >
              {prefs?.soundEnabled !== false ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Pause / Resume Button */}
            <button
              type="button"
              onClick={togglePause}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                prefs?.remindersPaused
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ring-2 ring-amber-400/20'
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              }`}
              title={prefs?.remindersPaused ? 'Resume scheduled reminders' : 'Pause reminders for 1 hour'}
            >
              {prefs?.remindersPaused ? <Play size={13} /> : <Pause size={13} />}
              <span>{prefs?.remindersPaused ? (isTamil ? 'மீண்டும் தொடங்கு' : 'Paused') : (isTamil ? 'ஓய்வு (1h)' : 'Pause (1h)')}</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Toggle Dark / Light Theme"
            >
              {prefs?.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Refresh Data */}
            <button
              type="button"
              onClick={() => refreshData()}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Refresh Dashboard"
            >
              <RefreshCw size={15} />
            </button>

            {/* Minimize to Tray */}
            <button
              type="button"
              onClick={() => api.closeDashboard()}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Minimize to System Tray"
            >
              <Minus size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
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

          {activeTab === 'voice' && (
            <VoiceStudioView prefs={prefs} onRefresh={refreshData} />
          )}

          {activeTab === 'settings' && (
            <GeneralSettingsView prefs={prefs} onRefresh={refreshData} />
          )}
        </main>
      </div>
    </div>
  );
};

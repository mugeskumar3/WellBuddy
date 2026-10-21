import React, { useState } from 'react';
import {
  DailyProgressSummary,
  NextReminderInfo,
  ReminderSettings,
  ReminderType,
  UserPreferences,
} from '@shared/types';
import { api } from '../../services/api';
import type { LadyVoiceProfile } from '../../services/audio/types';
import { LADY_VOICE_PROFILES } from '../../services/audio/voice-profiles';
import { voiceAudioService } from '../../services/audio/VoiceAudioService';
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
  Star,
  Radio,
  Play,
  Square,
  Flame,
  Zap,
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
  const [voicePlaying, setVoicePlaying] = useState(false);

  const isTamil = prefs?.language === 'ta';
  const waterTotal = progress?.waterTotalMl || 0;
  const waterGoal = progress?.waterGoalMl || 2000;
  const waterPercent = Math.min(100, Math.round((waterTotal / waterGoal) * 100));

  const activeVoiceProfile =
    LADY_VOICE_PROFILES.find((p: LadyVoiceProfile) => p.id === (prefs?.ladyVoiceId || 'trisha_classic')) ||
    LADY_VOICE_PROFILES[0];

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

  const handlePlayVoicePreview = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (voicePlaying) {
      voiceAudioService.stop();
      setVoicePlaying(false);
      return;
    }

    const textToSpeak = isTamil
      ? activeVoiceProfile.previewTextTa
      : activeVoiceProfile.previewTextEn;

    voiceAudioService
      .play(textToSpeak, {
        lang: isTamil ? 'ta' : 'en',
        ladyVoiceId: activeVoiceProfile.id,
        promptAction: 'preview',
        voiceName: prefs?.selectedVoiceName,
        onStart: () => setVoicePlaying(true),
        onEnd: () => setVoicePlaying(false),
      })
      .catch(() => setVoicePlaying(false));
  };

  const getIcon = (type: ReminderType) => {
    switch (type) {
      case 'water':
        return <Droplet className="text-sky-500" size={18} />;
      case 'standing':
        return <Move className="text-amber-500" size={18} />;
      case 'eye_rest':
        return <Eye className="text-emerald-500" size={18} />;
      case 'stretching':
        return <Activity className="text-purple-500" size={18} />;
    }
  };

  const nextUpcoming = nextReminders[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Executive Welcome & Streak Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-100 text-xs font-bold tracking-wide uppercase">
              <Zap size={14} className="text-amber-300" />
              <span>{isTamil ? 'இன்றைய ஆரோக்கிய நிலை' : 'Daily Wellness Score'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isTamil ? 'வணக்கம்! ஆரோக்கியமாக இருங்கள்.' : 'Welcome to WellBuddy'}
            </h1>
            <p className="text-sm text-teal-100/90 max-w-xl">
              {isTamil
                ? 'உங்கள் ஆரோக்கிய நினைவூட்டல்கள் சீராக இயங்குகின்றன. இன்று நீங்கள் செய்த ஆரோக்கிய செயல்பாடுகளை இங்கே பார்க்கலாம்.'
                : 'Your desktop companion is keeping you hydrated, rested, and active throughout your workday.'}
            </p>
          </div>

          {/* Quick Streak Card */}
          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <Flame size={24} className="text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="block text-xl font-black leading-none">
                  {Math.max(1, progress?.completedActivities || 1)}
                </span>
                <span className="text-[10px] text-teal-100/80 font-bold uppercase tracking-wider">
                  {isTamil ? 'நாள் தொடர்ச்சி' : 'Habit Streak'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="text-right">
              <span className="block text-xl font-black text-amber-300 leading-none">
                {waterPercent}%
              </span>
              <span className="text-[10px] text-teal-100/80 font-bold uppercase tracking-wider">
                {isTamil ? 'ஹைட்ரேஷன்' : 'Hydration'}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient decorative glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Flagship Voice Studio Spotlight Card */}
      <div className="rounded-3xl p-5 md:p-6 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-pink-500/10 dark:from-rose-950/40 dark:via-amber-950/20 dark:to-pink-950/30 border-2 border-rose-400/60 dark:border-rose-500/60 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${activeVoiceProfile.avatarColor} p-1 shadow-md flex items-center justify-center text-white font-black text-xl flex-shrink-0`}>
            {activeVoiceProfile.name[0]}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-700/40 flex items-center gap-1">
                <Star size={11} className="fill-current text-amber-500" />
                <span>{isTamil ? 'செயலில் உள்ள குரல் மாடல்' : 'Active Voice Model'}</span>
              </span>

              {activeVoiceProfile.hasPreRecordedAudio && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-300/40 flex items-center gap-1">
                  <Radio size={10} className="text-rose-500" />
                  <span>{isTamil ? 'நேரடி ஸ்டுடியோ ஆடியோ' : 'Studio Master Audio'}</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
              {isTamil ? activeVoiceProfile.tamilName : activeVoiceProfile.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-lg">
              {isTamil ? activeVoiceProfile.tamilTagline : activeVoiceProfile.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          <button
            type="button"
            onClick={handlePlayVoicePreview}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              voicePlaying
                ? 'bg-rose-500 text-white'
                : 'bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300'
            }`}
          >
            {voicePlaying ? <Square size={13} className="fill-current" /> : <Play size={13} className="fill-current text-rose-500" />}
            <span>{voicePlaying ? (isTamil ? 'ஒலிக்கிறது...' : 'Playing...') : (isTamil ? 'குரல் மாதிரி' : 'Listen Tone')}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('voice')}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>{isTamil ? 'குரல் ஸ்டுடியோ' : 'Voice Studio'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 3. Next Upcoming Activity Banner */}
      {nextUpcoming && !prefs?.remindersPaused ? (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                {isTamil ? 'அடுத்த நினைவூட்டல்' : 'Next Upcoming Activity'}
              </div>
              <h2 className="text-lg font-bold">{nextUpcoming.name}</h2>
              <p className="text-xs text-teal-50 flex items-center gap-1.5 mt-0.5">
                <Clock size={13} />
                {isTamil
                  ? `${Math.max(0, Math.round((nextUpcoming.dueAt - Date.now()) / 60000))} நிமிடங்களில் நினைவூட்டப்படும்`
                  : `Due in ${Math.max(0, Math.round((nextUpcoming.dueAt - Date.now()) / 60000))} minutes`}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCompleteNext(nextUpcoming.type, nextUpcoming.occurrenceId)}
            disabled={quickDoneLoading === nextUpcoming.type}
            className="w-full sm:w-auto bg-white text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={15} />
            <span>{quickDoneLoading === nextUpcoming.type ? 'Marking...' : (isTamil ? 'முடித்தேன்' : 'Complete Early')}</span>
          </button>
        </div>
      ) : prefs?.remindersPaused ? (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-600" />
            <div>
              <p className="font-semibold text-sm">{isTamil ? 'நினைவூட்டல்கள் தற்காலிகமாக நிறுத்தப்பட்டுள்ளன' : 'Reminders are currently paused'}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                {isTamil ? 'மீண்டும் தொடங்க "தொடங்கு" பொத்தானை அழுத்தவும்.' : 'Click Resume to receive regular voice reminders.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              api.resumeReminders();
              onRefresh();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            {isTamil ? 'மீண்டும் தொடங்கு' : 'Resume Now'}
          </button>
        </div>
      ) : null}

      {/* 4. Core Wellness Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hydration Hub */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-100 dark:bg-sky-900/40 rounded-2xl">
                  <Droplet className="text-sky-600 dark:text-sky-400" size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                    {isTamil ? 'தண்ணீர் குடிக்கும் அளவு' : 'Water Intake'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isTamil ? `இலக்கு: ${waterGoal} மி.லி` : `Daily Target: ${waterGoal} ml`}
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {waterPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden my-3">
              <div
                className="bg-gradient-to-r from-sky-400 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{waterTotal} ml logged</span>
              <span>{Math.max(0, waterGoal - waterTotal)} ml remaining</span>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={() => handleQuickAddWater(250)}
              disabled={loggingWater}
              className="flex-1 py-2 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> 250 ml
            </button>
            <button
              onClick={() => handleQuickAddWater(500)}
              disabled={loggingWater}
              className="flex-1 py-2 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> 500 ml
            </button>
            <button
              onClick={() => onNavigateTab('water')}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              title="Open Water Tracker"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Completed Activities Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl">
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                    {isTamil ? 'முடிக்கப்பட்ட பழக்கங்கள்' : 'Completed Activities'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isTamil ? 'இன்றைய ஆரோக்கிய வெற்றிகள்' : "Today's healthy activities"}
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {progress?.completedActivities || 0}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-2xl">
                <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {progress?.completedActivities || 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  {isTamil ? 'முடித்தவை' : 'Done'}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-2xl">
                <span className="block text-lg font-black text-amber-600 dark:text-amber-400">
                  {progress?.snoozedActivities || 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  {isTamil ? 'தாமதம்' : 'Snoozed'}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-2xl">
                <span className="block text-lg font-black text-slate-500 dark:text-slate-400">
                  {progress?.skippedActivities || 0}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  {isTamil ? 'தவிர்த்தவை' : 'Skipped'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
            <span>{isTamil ? 'நல்ல பழக்கங்களை தொடருங்கள்!' : 'Keep your momentum active!'}</span>
            <button
              onClick={() => onNavigateTab('wellness')}
              className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>{isTamil ? 'உடற்பயிற்சி செய்ய' : 'Take a stretch break'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Active Reminders Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider">
            {isTamil ? 'இயங்கும் நினைவூட்டல் அட்டவணை' : 'Active Reminder Schedules'}
          </h3>
          <button
            onClick={() => onNavigateTab('reminders')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isTamil ? 'அனைத்தையும் மாற்றியமைக்க' : 'Configure Reminders'}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reminders.map((rem) => {
            const nextInfo = nextReminders.find((n) => n.type === rem.id);
            const dueInMin = nextInfo
              ? Math.max(0, Math.round((nextInfo.dueAt - Date.now()) / 60000))
              : null;

            return (
              <div
                key={rem.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                      {getIcon(rem.id)}
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        rem.enabled
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {rem.enabled ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{rem.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Every {rem.intervalMinutes} min
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {rem.enabled && dueInMin !== null ? `Due in ${dueInMin}m` : 'Off'}
                  </span>
                  {rem.enabled && nextInfo && (
                    <button
                      onClick={() => handleCompleteNext(rem.id, nextInfo.occurrenceId)}
                      disabled={quickDoneLoading === rem.id}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
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

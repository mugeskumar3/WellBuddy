import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ActivePromptInfo, AvatarInfo, UserPreferences } from '@shared/types';
import { BUILT_IN_AVATARS } from '@shared/built-in-avatars';
import { Check, Clock, X, ExternalLink, EyeOff } from 'lucide-react';

export const CompanionApp: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>(BUILT_IN_AVATARS);
  const [activePrompt, setActivePrompt] = useState<ActivePromptInfo | null>(null);
  const [speechText, setSpeechText] = useState<string>('Stay refreshed!');
  const [isWaving, setIsWaving] = useState<boolean>(false);

  useEffect(() => {
    // Initial fetch
    api.getPreferences().then(setPrefs);
    api.getAvatars().then(setAvatars);

    // Listen for reminder triggers
    const unsubReminder = api.onReminderTriggered((prompt) => {
      setActivePrompt(prompt);
      setSpeechText(prompt.title);
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3000);
    });

    // Listen for preference updates
    const unsubPrefs = api.onPreferencesUpdated((updated) => {
      setPrefs(updated);
    });

    return () => {
      unsubReminder();
      unsubPrefs();
    };
  }, []);

  const currentAvatar =
    avatars.find((a) => a.id === prefs?.selectedAvatarId) || BUILT_IN_AVATARS[0];

  const handleDone = async () => {
    if (!activePrompt) return;
    await api.completeReminder(activePrompt.occurrenceId, activePrompt.type);
    setSpeechText('Great job! 🎉');
    setActivePrompt(null);
    setTimeout(() => setSpeechText('Keep it up!'), 2500);
  };

  const handleSnooze = async () => {
    if (!activePrompt) return;
    await api.snoozeReminder(activePrompt.occurrenceId, activePrompt.type, 5);
    setSpeechText('Snoozed for 5m ⏱️');
    setActivePrompt(null);
    setTimeout(() => setSpeechText(''), 2500);
  };

  const handleSkip = async () => {
    if (!activePrompt) return;
    await api.skipReminder(activePrompt.occurrenceId, activePrompt.type);
    setSpeechText('Skipped for now 👍');
    setActivePrompt(null);
    setTimeout(() => setSpeechText(''), 2500);
  };

  const handleMascotClick = () => {
    setIsWaving(true);
    const funQuotes = [
      'Take a deep breath! 🌿',
      'Hydration is key! 💧',
      'You are doing great! ⭐',
      'Remember your posture! 🧘',
      'Blink and rest those eyes! 👀',
    ];
    setSpeechText(funQuotes[Math.floor(Math.random() * funQuotes.length)]);
    setTimeout(() => setIsWaving(false), 2000);
  };

  const size = prefs?.companionSize || 'standard';
  const sizeClasses = {
    compact: 'w-16 h-16',
    standard: 'w-20 h-20',
    large: 'w-24 h-24',
  }[size];

  return (
    <div className="w-full h-full flex flex-col items-center justify-end p-2 select-none overflow-hidden font-sans">
      {/* Speech / Alert Bubble */}
      {(activePrompt || speechText) && (
        <div
          className={`no-drag-region mb-2 max-w-[240px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-teal-100 dark:border-slate-700 transition-all duration-300 transform ${
            activePrompt ? 'scale-100 ring-2 ring-teal-400' : 'scale-95'
          }`}
        >
          {activePrompt ? (
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-teal-700 dark:text-teal-400 flex items-center justify-between">
                <span>{activePrompt.title}</span>
                <span className="text-[10px] bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Reminder
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-[11px] leading-tight">
                {activePrompt.message}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={handleDone}
                  title="Mark as completed"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-1 px-2 text-[11px] font-medium flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  <Check size={12} strokeWidth={3} /> Done
                </button>
                <button
                  onClick={handleSnooze}
                  title="Snooze 5 minutes"
                  className="bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-lg py-1 px-2 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <Clock size={12} /> 5m
                </button>
                <button
                  onClick={handleSkip}
                  title="Skip"
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 rounded-lg py-1 px-1.5 text-[11px] transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center py-0.5">
              {speechText}
            </div>
          )}

          {/* Bubble Arrow */}
          <div className="w-2.5 h-2.5 bg-white/95 dark:bg-slate-800/95 border-r border-b border-teal-100 dark:border-slate-700 transform rotate-45 mx-auto -mb-3.5 mt-1" />
        </div>
      )}

      {/* Mascot & Controls Container */}
      <div className="relative group flex flex-col items-center">
        {/* Floating Controls Bar (Appears on hover) */}
        <div className="no-drag-region absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] shadow-lg">
          <button
            onClick={() => api.openDashboard()}
            title="Open Dashboard"
            className="hover:text-teal-300 flex items-center gap-0.5 px-1 py-0.5"
          >
            <ExternalLink size={10} /> App
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => api.hideCompanion()}
            title="Hide Companion"
            className="hover:text-rose-300 flex items-center gap-0.5 px-1 py-0.5"
          >
            <EyeOff size={10} /> Hide
          </button>
        </div>

        {/* Mascot Avatar (Draggable) */}
        <div
          onClick={handleMascotClick}
          className={`drag-region cursor-grab active:cursor-grabbing transition-transform duration-300 rounded-2xl filter drop-shadow-lg ${sizeClasses} ${
            isWaving ? 'scale-110 rotate-6' : 'hover:scale-105'
          }`}
        >
          <img
            src={currentAvatar.src}
            alt={currentAvatar.name}
            className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

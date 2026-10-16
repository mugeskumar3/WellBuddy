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
  const [isWalking, setIsWalking] = useState<boolean>(true);

  // Select a natural female / lady voice
  const getLadyVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Female voice names common across Windows, Mac, and Chromium
    const femaleKeywords = [
      'zira',
      'jenny',
      'aria',
      'samantha',
      'victoria',
      'karen',
      'susan',
      'female',
      'woman',
      'eva',
      'hazel',
      'catherine',
      'serena',
      'amy',
      'fiona',
    ];

    // Priority 1: English female voice (e.g. Microsoft Zira on Windows)
    const englishFemale = voices.find((v) => {
      const name = v.name.toLowerCase();
      const isEnglish = v.lang.toLowerCase().startsWith('en');
      return isEnglish && femaleKeywords.some((keyword) => name.includes(keyword));
    });
    if (englishFemale) return englishFemale;

    // Priority 2: Any available female voice
    const anyFemale = voices.find((v) => {
      const name = v.name.toLowerCase();
      return femaleKeywords.some((keyword) => name.includes(keyword));
    });
    if (anyFemale) return anyFemale;

    // Priority 3: First English voice
    const englishVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    return englishVoice || voices[0] || null;
  };

  // Friendly Lady Text-to-Speech synthesis
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (prefs && prefs.soundEnabled === false) return;
    try {
      window.speechSynthesis.cancel();
      // Remove emojis from speech text for clean pronunciation
      const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const ladyVoice = getLadyVoice();
      if (ladyVoice) {
        utterance.voice = ladyVoice;
      }
      utterance.pitch = 1.35; // gentle, melodious female companion tone
      utterance.rate = 1.0;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis silent fallback
    }
  };

  // Pre-load synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoices);
      };
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    api.getPreferences().then(setPrefs);
    api.getAvatars().then(setAvatars);

    // Initial greeting speech
    speakText('Stay refreshed!');
    const greetingTimer = setTimeout(() => {
      setSpeechText('');
    }, 4500);

    // Listen for reminder triggers
    const unsubReminder = api.onReminderTriggered((prompt) => {
      setActivePrompt(prompt);
      setSpeechText(prompt.title);
      speakText(`${prompt.title}. ${prompt.message}`);
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3000);
    });

    // Listen for preference updates
    const unsubPrefs = api.onPreferencesUpdated((updated) => {
      setPrefs(updated);
    });

    return () => {
      clearTimeout(greetingTimer);
      unsubReminder();
      unsubPrefs();
    };
  }, []);

  // Pass mouse clicks through transparent surrounding areas to windows underneath
  useEffect(() => {
    let isIgnoring = true;

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest('.interactive-area') ||
        target.closest('button') ||
        target.closest('.drag-region') ||
        target.closest('.no-drag-region')
      );

      if (isInteractive) {
        if (isIgnoring) {
          isIgnoring = false;
          api.setIgnoreMouseEvents(false);
        }
      } else {
        if (!isIgnoring) {
          isIgnoring = true;
          api.setIgnoreMouseEvents(true, true);
        }
      }
    };

    const handleMouseLeave = () => {
      if (!isIgnoring) {
        isIgnoring = true;
        api.setIgnoreMouseEvents(true, true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const currentAvatar =
    avatars.find((a) => a.id === prefs?.selectedAvatarId) || BUILT_IN_AVATARS[0];

  const handleDone = async () => {
    if (!activePrompt) return;
    await api.completeReminder(activePrompt.occurrenceId, activePrompt.type);
    setSpeechText('Great job! 🎉');
    speakText('Great job!');
    setActivePrompt(null);
    setTimeout(() => {
      setSpeechText('Keep it up!');
      setTimeout(() => setSpeechText(''), 3000);
    }, 2000);
  };

  const handleSnooze = async () => {
    if (!activePrompt) return;
    await api.snoozeReminder(activePrompt.occurrenceId, activePrompt.type, 5);
    setSpeechText('Snoozed for 5m ⏱️');
    speakText('Snoozed for 5 minutes');
    setActivePrompt(null);
    setTimeout(() => setSpeechText(''), 3000);
  };

  const handleSkip = async () => {
    if (!activePrompt) return;
    await api.skipReminder(activePrompt.occurrenceId, activePrompt.type);
    setSpeechText('Skipped for now 👍');
    speakText('Skipped for now');
    setActivePrompt(null);
    setTimeout(() => setSpeechText(''), 3000);
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
    const quote = funQuotes[Math.floor(Math.random() * funQuotes.length)];
    setSpeechText(quote);
    speakText(quote);
    setTimeout(() => setIsWaving(false), 2000);
    setTimeout(() => setSpeechText(''), 4500);
  };

  const isSpeaking = Boolean(activePrompt || speechText);

  const size = prefs?.companionSize || 'standard';
  const sizeClasses = {
    compact: 'w-16 h-16',
    standard: 'w-20 h-20',
    large: 'w-24 h-24',
  }[size];

  return (
    <div className="w-full h-full flex flex-col items-center justify-end p-2 select-none overflow-hidden font-sans bg-transparent pointer-events-none">
      {/* Speech / Alert Bubble with Talking Waves */}
      {(activePrompt || speechText) && (
        <div
          className={`interactive-area pointer-events-auto no-drag-region mb-2 max-w-[240px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-teal-100 dark:border-slate-700 transition-all duration-300 transform ${
            activePrompt ? 'scale-100 ring-2 ring-teal-400' : 'scale-95'
          }`}
        >
          {activePrompt ? (
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-teal-700 dark:text-teal-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>{activePrompt.title}</span>
                  {/* Equalizer Speaking Waves */}
                  <span className="inline-flex items-center gap-0.5 h-3 px-1 bg-teal-50 dark:bg-teal-900/50 rounded" title="Talking">
                    <span className="w-0.5 bg-teal-500 rounded-full voice-wave-1" />
                    <span className="w-0.5 bg-teal-500 rounded-full voice-wave-2" />
                    <span className="w-0.5 bg-teal-500 rounded-full voice-wave-3" />
                    <span className="w-0.5 bg-teal-500 rounded-full voice-wave-4" />
                  </span>
                </span>
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
            <div className="text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 py-0.5">
              <span>{speechText}</span>
              {/* Equalizer Speaking Waves */}
              <span className="inline-flex items-center gap-0.5 h-3 px-1 bg-teal-50 dark:bg-teal-900/50 rounded" title="Talking">
                <span className="w-0.5 bg-teal-500 rounded-full voice-wave-1" />
                <span className="w-0.5 bg-teal-500 rounded-full voice-wave-2" />
                <span className="w-0.5 bg-teal-500 rounded-full voice-wave-3" />
                <span className="w-0.5 bg-teal-500 rounded-full voice-wave-4" />
              </span>
            </div>
          )}

          {/* Bubble Arrow */}
          <div className="w-2.5 h-2.5 bg-white/95 dark:bg-slate-800/95 border-r border-b border-teal-100 dark:border-slate-700 transform rotate-45 mx-auto -mb-3.5 mt-1" />
        </div>
      )}

      {/* Mascot & Controls Container */}
      <div className="interactive-area pointer-events-auto relative group flex flex-col items-center">
        {/* Floating Controls Bar (Appears on hover) */}
        <div className="no-drag-region absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-slate-900/85 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] shadow-lg">
          <button
            onClick={() => setIsWalking(!isWalking)}
            title={isWalking ? 'Switch to Stationary' : 'Switch to Walking'}
            className="hover:text-amber-300 flex items-center gap-0.5 px-1 py-0.5 font-medium transition-colors"
          >
            {isWalking ? '🚶 Walk' : '⏸️ Stay'}
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => api.openDashboard()}
            title="Open Dashboard"
            className="hover:text-teal-300 flex items-center gap-0.5 px-1 py-0.5 transition-colors"
          >
            <ExternalLink size={10} /> App
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => api.hideCompanion()}
            title="Hide Companion"
            className="hover:text-rose-300 flex items-center gap-0.5 px-1 py-0.5 transition-colors"
          >
            <EyeOff size={10} /> Hide
          </button>
        </div>

        {/* Mascot Avatar Container (Walkable & Draggable) */}
        <div className={`transition-transform duration-500 ${isWalking && !isWaving ? 'animate-companion-walk' : ''}`}>
          <div
            onClick={handleMascotClick}
            className={`drag-region cursor-grab active:cursor-grabbing transition-all duration-300 rounded-2xl filter drop-shadow-lg ${sizeClasses} ${
              isWaving
                ? 'animate-mascot-celebrate'
                : isSpeaking
                ? 'animate-talking-speech'
                : 'hover:scale-105'
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
    </div>
  );
};

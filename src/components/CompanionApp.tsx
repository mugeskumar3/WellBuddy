import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ActivePromptInfo, AvatarInfo, UserPreferences } from '@shared/types';
import { BUILT_IN_AVATARS } from '@shared/built-in-avatars';
import { Check, Clock, X, ExternalLink, EyeOff } from 'lucide-react';
import { speakText } from '../utils/speech';
import { applyTheme } from '../utils/theme';

const getSvgMarkup = (src: string): string | null => {
  if (!src || !src.startsWith('data:image/svg+xml')) return null;
  const commaIdx = src.indexOf(',');
  if (commaIdx === -1) return null;
  try {
    return decodeURIComponent(src.substring(commaIdx + 1));
  } catch {
    return null;
  }
};

interface LanguageStrings {
  greeting: string;
  done: string;
  keepItUp: string;
  snoozed: string;
  skipped: string;
  btnDone: string;
  btnSnooze: string;
  btnSkip: string;
  btnWalk: string;
  btnStay: string;
  btnApp: string;
  btnHide: string;
  reminderTag: string;
  funQuotes: string[];
  reminderMap: Record<string, { title: string; message: string }>;
}

const STRINGS: Record<'en' | 'ta', LanguageStrings> = {
  en: {
    greeting: 'Stay refreshed! 💧',
    done: 'Great job! 🎉',
    keepItUp: 'Keep it up! ⭐',
    snoozed: 'Snoozed for 5m ⏱️',
    skipped: 'Skipped for now 👍',
    btnDone: 'Done',
    btnSnooze: '5m',
    btnSkip: 'Skip',
    btnWalk: '🚶 Walk',
    btnStay: '⏸️ Stay',
    btnApp: 'App',
    btnHide: 'Hide',
    reminderTag: 'Reminder',
    funQuotes: [
      'Take a deep breath! 🌿',
      'Hydration is key! 💧',
      'You are doing great! ⭐',
      'Remember your posture! 🧘',
      'Blink and rest those eyes! 👀',
      'Time for some water! 🥤',
      'Stretch and refresh! ✨',
    ],
    reminderMap: {
      water: {
        title: 'Hydration Break',
        message: 'Drink a glass of water to stay fresh and hydrated.',
      },
      standing: {
        title: 'Stand & Move',
        message: 'Stand up and take a quick walk to boost your circulation.',
      },
      eye_rest: {
        title: '20-20-20 Eye Rest',
        message: 'Look at an object 20 feet away for 20 seconds.',
      },
      stretching: {
        title: 'Quick Stretch',
        message: 'Gently stretch your neck, shoulders, and back.',
      },
    },
  },
  ta: {
    greeting: 'ஆரோக்கியமாக இருங்கள்! 💧',
    done: 'அருமை! நன்று செய்தீர்கள்! 🎉',
    keepItUp: 'தொடர்ந்து செய்யுங்கள்! ⭐',
    snoozed: '5 நிமிடம் தள்ளிவைக்கப்பட்டது ⏱️',
    skipped: 'இப்போது தவிர்க்கப்பட்டது 👍',
    btnDone: 'முடிந்தது',
    btnSnooze: '5நி',
    btnSkip: 'தவிர்',
    btnWalk: '🚶 நடை',
    btnStay: '⏸️ நில்',
    btnApp: 'செயலி',
    btnHide: 'மறை',
    reminderTag: 'நினைவூட்டல்',
    funQuotes: [
      'ஆழமாக சுவாசியுங்கள்! 🌿',
      'தண்ணீர் குடிக்க மறக்காதீர்கள்! 💧',
      'மிகச் சிறப்பாக செய்கிறீர்கள்! ⭐',
      'நேராக அமர்ந்து வேலை செய்யுங்கள்! 🧘',
      'கண்களுக்கு சிறிது ஓய்வு கொடுங்கள்! 👀',
      'கொஞ்சம் தண்ணீர் குடியுங்கள்! 🥤',
      'தோள்பட்டையை தளர்த்தி புத்துணர்ச்சி பெறுங்கள்! ✨',
    ],
    reminderMap: {
      water: {
        title: 'தண்ணீர் குடிக்கும் நேரம்',
        message: 'உடலை புத்துணர்ச்சியாக வைத்திருக்க ஒரு டம்ளர் தண்ணீர் குடியுங்கள்.',
      },
      standing: {
        title: 'எழுந்து நடக்கும் நேரம்',
        message: 'ரத்த ஓட்டம் சீராக ஒரு நிமிடம் எழுந்து நடந்து வாருங்கள்.',
      },
      eye_rest: {
        title: 'கண்களுக்கு ஓய்வு நேரம்',
        message: '20 விநாடிகள் தூரத்திலுள்ள பொருளைப் பார்த்து கண்களுக்கு ஓய்வு கொடுங்கள்.',
      },
      stretching: {
        title: 'உடற்பயிற்சி / ஸ்ட்ரெட்ச்',
        message: 'கழுத்து, தோள்பட்டை மற்றும் முதுகை மெதுவாக நீட்டி பயிற்சி செய்யுங்கள்.',
      },
    },
  },
};

export const CompanionApp: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [avatars, setAvatars] = useState<AvatarInfo[]>(BUILT_IN_AVATARS);
  const [activePrompt, setActivePrompt] = useState<ActivePromptInfo | null>(null);
  const [speechText, setSpeechText] = useState<string>('Stay refreshed!');
  const [isWaving, setIsWaving] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(true);

  const lang: 'en' | 'ta' = prefs?.language === 'ta' ? 'ta' : 'en';
  const t = STRINGS[lang];

  const [speechActive, setSpeechActive] = useState<boolean>(false);

  // Friendly Bilingual Text-to-Speech synthesis with selected Lady voice
  const playSpeech = (
    text: string,
    targetLang?: 'en' | 'ta',
    customPrefs?: UserPreferences | null
  ) => {
    const activePrefs = customPrefs !== undefined ? customPrefs : prefs;
    if (activePrefs && activePrefs.soundEnabled === false) return;
    speakText(text, {
      lang: targetLang || (activePrefs?.language === 'ta' ? 'ta' : 'en'),
      ladyVoiceId: activePrefs?.ladyVoiceId,
      voiceName: activePrefs?.selectedVoiceName,
      onStart: () => setSpeechActive(true),
      onEnd: () => setSpeechActive(false),
    });
  };

  // Sync light / dark / system theme
  useEffect(() => {
    if (prefs?.theme) {
      return applyTheme(prefs.theme);
    }
  }, [prefs?.theme]);

  useEffect(() => {
    // Initial fetch
    api.getPreferences().then((loadedPrefs) => {
      setPrefs(loadedPrefs);
      const currentLang = loadedPrefs?.language === 'ta' ? 'ta' : 'en';
      const initialGreeting = STRINGS[currentLang].greeting;
      setSpeechText(initialGreeting);
      playSpeech(initialGreeting, currentLang, loadedPrefs);
    });
    api.getAvatars().then(setAvatars);

    const greetingTimer = setTimeout(() => {
      setSpeechText('');
    }, 4500);

    // Listen for reminder triggers
    const unsubReminder = api.onReminderTriggered((prompt) => {
      api.getPreferences().then((currentPrefs) => {
        const currentL = currentPrefs?.language === 'ta' ? 'ta' : 'en';
        const str = STRINGS[currentL];
        const title = currentL === 'ta' ? (str.reminderMap[prompt.type]?.title || prompt.title) : prompt.title;
        const message = currentL === 'ta' ? (str.reminderMap[prompt.type]?.message || prompt.message) : prompt.message;

        setActivePrompt({
          ...prompt,
          title,
          message,
        });
        setSpeechText(title);
        playSpeech(`${title}. ${message}`, currentL, currentPrefs);
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 3000);
      });
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
  const svgMarkup = getSvgMarkup(currentAvatar.src);

  const handleDone = async () => {
    if (!activePrompt) return;
    await api.completeReminder(activePrompt.occurrenceId, activePrompt.type);
    setSpeechText(t.done);
    playSpeech(t.done);
    setActivePrompt(null);
    setTimeout(() => {
      setSpeechText(t.keepItUp);
      setTimeout(() => setSpeechText(''), 3000);
    }, 2000);
  };

  const handleSnooze = async () => {
    if (!activePrompt) return;
    await api.snoozeReminder(activePrompt.occurrenceId, activePrompt.type, 5);
    setSpeechText(t.snoozed);
    playSpeech(t.snoozed);
    setActivePrompt(null);
    setTimeout(() => setSpeechText(''), 3000);
  };

  const handleSkip = async () => {
    if (!activePrompt) return;
    await api.skipReminder(activePrompt.occurrenceId, activePrompt.type);
    setSpeechText(t.skipped);
    playSpeech(t.skipped);
    setActivePrompt(null);
    setTimeout(() => setSpeechText(''), 3000);
  };

  const handleMascotClick = () => {
    setIsWaving(true);
    const quotes = t.funQuotes;
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeechText(quote);
    playSpeech(quote);
    setTimeout(() => setIsWaving(false), 2000);
    setTimeout(() => setSpeechText(''), 4500);
  };

  const toggleLanguage = async () => {
    const nextLang: 'en' | 'ta' = lang === 'en' ? 'ta' : 'en';
    const updated = await api.updatePreferences({ language: nextLang });
    setPrefs(updated);
    const greet = STRINGS[nextLang].greeting;
    setSpeechText(greet);
    playSpeech(greet, nextLang);
    setTimeout(() => setSpeechText(''), 4000);
  };

  const isSpeaking = Boolean(activePrompt || speechText || speechActive);

  const size = prefs?.companionSize || 'standard';
  const sizeClasses = {
    compact: 'w-20 h-20',
    standard: 'w-28 h-28',
    large: 'w-36 h-36',
  }[size];

  return (
    <div className="w-full h-full flex flex-col items-center justify-end p-2 select-none overflow-hidden font-sans bg-transparent pointer-events-none">
      {/* Speech / Alert Bubble with Talking Waves */}
      {(activePrompt || speechText) && (
        <div
          className={`interactive-area pointer-events-auto no-drag-region mb-2 w-[240px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 transform ${
            activePrompt ? 'scale-100 ring-2 ring-emerald-400/50' : 'scale-95'
          }`}
        >
          {activePrompt ? (
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-semibold">
                  <span>{activePrompt.title}</span>
                  {/* Equalizer Speaking Waves */}
                  <span className="inline-flex items-center gap-0.5 h-3 px-1 bg-sky-50 dark:bg-sky-900/50 rounded" title="Talking">
                    <span className="w-0.5 bg-sky-500 rounded-full voice-wave-1" />
                    <span className="w-0.5 bg-sky-500 rounded-full voice-wave-2" />
                    <span className="w-0.5 bg-sky-500 rounded-full voice-wave-3" />
                    <span className="w-0.5 bg-sky-500 rounded-full voice-wave-4" />
                  </span>
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {t.reminderTag}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[12px] leading-relaxed font-medium">
                {activePrompt.message}
              </p>

              {/* Action Buttons styled like video */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleDone}
                  title="Done"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full py-1.5 px-3 text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Check size={12} strokeWidth={3} />
                  <span>{lang === 'ta' ? 'ஆம், குடித்துவிட்டேன் 💧' : 'Yes, I drank 💧'}</span>
                  <span className="sr-only">Done</span>
                </button>
                <button
                  onClick={handleSnooze}
                  title="Snooze"
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full py-1.5 px-2.5 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Clock size={11} />
                  <span>{lang === 'ta' ? 'பிறகு (10 நி)' : 'Not now (10m)'}</span>
                  <span className="sr-only">5m</span>
                </button>
                <button
                  onClick={handleSkip}
                  title="Skip"
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full p-1.5 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 py-1">
              <span>{speechText}</span>
              {/* Equalizer Speaking Waves */}
              <span className="inline-flex items-center gap-0.5 h-3 px-1 bg-sky-50 dark:bg-sky-900/50 rounded" title="Talking">
                <span className="w-0.5 bg-sky-500 rounded-full voice-wave-1" />
                <span className="w-0.5 bg-sky-500 rounded-full voice-wave-2" />
                <span className="w-0.5 bg-sky-500 rounded-full voice-wave-3" />
                <span className="w-0.5 bg-sky-500 rounded-full voice-wave-4" />
              </span>
            </div>
          )}

          {/* Bubble Arrow */}
          <div className="w-2.5 h-2.5 bg-white/95 dark:bg-slate-900/95 border-r border-b border-slate-100 dark:border-slate-800 transform rotate-45 mx-auto -mb-4 mt-1.5" />
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
            {isWalking ? t.btnWalk : t.btnStay}
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={toggleLanguage}
            title={lang === 'en' ? 'Switch to தமிழ்' : 'Switch to English'}
            className="hover:text-emerald-300 flex items-center gap-0.5 px-1 py-0.5 font-bold transition-colors"
          >
            🌐 {lang === 'en' ? 'தமிழ்' : 'EN'}
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => api.openDashboard()}
            title="Open Dashboard"
            className="hover:text-teal-300 flex items-center gap-0.5 px-1 py-0.5 transition-colors"
          >
            <ExternalLink size={10} /> {t.btnApp}
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => api.hideCompanion()}
            title="Hide Companion"
            className="hover:text-rose-300 flex items-center gap-0.5 px-1 py-0.5 transition-colors"
          >
            <EyeOff size={10} /> {t.btnHide}
          </button>
        </div>

        {/* Mascot Avatar Container (Walkable & Draggable) */}
        <div className={`transition-transform duration-500 ${isWalking && !isWaving ? 'animate-companion-walk' : ''}`}>
          <div
            onClick={handleMascotClick}
            className={`drag-region cursor-grab active:cursor-grabbing transition-all duration-300 rounded-2xl filter drop-shadow-xl flex items-center justify-center ${sizeClasses} ${
              isWaving
                ? 'animate-mascot-celebrate'
                : isSpeaking
                ? 'animate-talking-speech'
                : 'hover:scale-105'
            }`}
          >
            {/* Realtime hardware-accelerated animated inline SVG */}
            {svgMarkup ? (
              <div
                className={`w-full h-full flex items-center justify-center select-none pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible ${
                  !isWalking ? 'avatar-stationary-pose' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            ) : (
              <img
                src={currentAvatar.src}
                alt={currentAvatar.name}
                className={`w-full h-full object-contain pointer-events-none drop-shadow-md select-none ${
                  !isWalking ? 'avatar-stationary-pose' : ''
                }`}
                draggable={false}
              />
            )}
            {/* Accessible screen-reader & test fixture img element */}
            <img
              src={currentAvatar.src}
              alt={currentAvatar.name}
              className="sr-only"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

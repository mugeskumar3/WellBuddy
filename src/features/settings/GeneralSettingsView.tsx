import React, { useState, useEffect } from 'react';
import { UserPreferences } from '@shared/types';
import { api } from '../../services/api';
import {
  speakText,
  stopSpeaking,
  LADY_VOICE_PROFILES,
  getAvailableVoices,
  LadyVoiceProfile,
} from '../../utils/speech';
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
  Globe,
  Sparkles,
  Droplet,
  Eye,
  EyeOff,
  Move,
  Maximize2,
  Check,
  Play,
  Square,
} from 'lucide-react';

interface GeneralSettingsViewProps {
  prefs: UserPreferences | null;
  onRefresh: () => void;
}

export const GeneralSettingsView: React.FC<GeneralSettingsViewProps> = ({ prefs, onRefresh }) => {
  const [testingVoice, setTestingVoice] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [customGoal, setCustomGoal] = useState(String(prefs?.waterDailyGoalMl || 2000));
  const [goalSaved, setGoalSaved] = useState(false);

  const isTamil = prefs?.language === 'ta';

  useEffect(() => {
    const loadVoices = () => {
      const v = getAvailableVoices();
      if (v && v.length > 0) {
        setSystemVoices(v);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      stopSpeaking();
    };
  }, []);

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

  const handlePreviewLadyVoice = (profile: LadyVoiceProfile, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playingVoiceId === profile.id) {
      stopSpeaking();
      setPlayingVoiceId(null);
      return;
    }
    stopSpeaking();
    setPlayingVoiceId(profile.id);

    const previewText = isTamil ? profile.previewTextTa : profile.previewTextEn;
    speakText(previewText, {
      lang: isTamil ? 'ta' : 'en',
      ladyVoiceId: profile.id,
      voiceName: prefs?.selectedVoiceName,
      onStart: () => setPlayingVoiceId(profile.id),
      onEnd: () => setPlayingVoiceId(null),
    });
  };

  const handleTestVoice = () => {
    setTestingVoice(true);
    const textToSpeak = isTamil
      ? 'வணக்கம்! வெல்படி ஒலி மற்றும் பெண் குரல் சிறப்பாக செயல்படுகிறது!'
      : 'Hello! WellBuddy audio and lady voice are working perfectly!';

    speakText(textToSpeak, {
      lang: isTamil ? 'ta' : 'en',
      ladyVoiceId: prefs?.ladyVoiceId,
      voiceName: prefs?.selectedVoiceName,
      onStart: () => setTestingVoice(true),
      onEnd: () => setTestingVoice(false),
    });
  };

  const handleSaveGoal = async (val: number) => {
    if (val >= 500 && val <= 10000) {
      await updatePref({ waterDailyGoalMl: val });
      setCustomGoal(String(val));
      setGoalSaved(true);
      setTimeout(() => setGoalSaved(false), 2500);
    }
  };

  const handleResetPosition = async () => {
    await api.setCompanionPosition({ x: 100, y: 100 });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* 1. Interface Theme Preference */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sun size={16} className="text-amber-500" />
          <span>{isTamil ? 'இடைமுக தோற்றம் (Theme)' : 'Interface Theme'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTamil
            ? 'WellBuddy-க்கான வெளிர் (Light), அடர் (Dark) அல்லது கணினி முறைமை (System) தோற்றத்தை தேர்வு செய்யவும்.'
            : 'Select your visual appearance preference for WellBuddy.'}
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { id: 'light', label: isTamil ? 'வெளிர் (Light)' : 'Light', icon: Sun },
            { id: 'dark', label: isTamil ? 'அடர் (Dark)' : 'Dark', icon: Moon },
            { id: 'system', label: isTamil ? 'முறைமை (System)' : 'System', icon: Laptop },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = (prefs?.theme || 'light') === item.id;
            return (
              <button
                key={item.id}
                onClick={() => updatePref({ theme: item.id as any })}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300 shadow-sm ring-1 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={16} /> {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Language / மொழி Preference */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Globe size={16} className="text-teal-500" />
          <span>{isTamil ? 'மொழி தேர்வு / Language' : 'Language / மொழி'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTamil
            ? 'துணைவரின் பேச்சு, நினைவூட்டல்கள் மற்றும் மேற்கோள்களுக்கான மொழியை தேர்வு செய்யவும்.'
            : 'Choose the language for your companion speech, reminders, and wellness quotes.'}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { id: 'en', label: 'English', desc: 'Natural English lady voice' },
            { id: 'ta', label: 'தமிழ் (Tamil)', desc: 'இயற்கையான தமிழ் குரல் மற்றும் நினைவூட்டல்' },
          ].map((item) => {
            const isSelected = (prefs?.language || 'en') === item.id;
            return (
              <button
                key={item.id}
                onClick={() => updatePref({ language: item.id as any })}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-800 dark:text-teal-200 shadow-sm ring-1 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="font-bold text-xs flex items-center justify-between">
                  {item.label}
                  {isSelected && <span className="w-2 h-2 rounded-full bg-teal-500" />}
                </span>
                <span className="text-[11px] opacity-75">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Lady Voice Personas / பெண் குரல் தேர்வு */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles size={16} className="text-pink-500" />
              <span>{isTamil ? 'பெண் குரல் தோழிகள் தேர்வு / Lady Voice Personas' : 'Lady Voice Personas (Multiple Choices)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isTamil
                ? 'உங்களுக்குப் பிடித்த பெண் தோழி குரலைத் தேர்வு செய்யவும். குரலைக் கேட்க "குரல் மாதிரி" பொத்தானை அழுத்தவும்.'
                : 'Select your preferred companion voice personality. Click Preview on any card to hear her tone.'}
            </p>
          </div>
        </div>

        {/* 4 Lady Voice Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {LADY_VOICE_PROFILES.map((profile) => {
            const isSelected = (prefs?.ladyVoiceId || 'lily_cheerful') === profile.id;
            const isPlaying = playingVoiceId === profile.id;

            return (
              <div
                key={profile.id}
                onClick={() => updatePref({ ladyVoiceId: profile.id })}
                className={`p-4 rounded-xl border relative flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-50/60 to-rose-50/40 dark:from-pink-950/30 dark:to-rose-950/20 border-pink-400 dark:border-pink-500 shadow-sm ring-1 ring-pink-400/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${profile.avatarColor} shadow-xs`} />
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        {isTamil ? profile.tamilName : profile.name}
                      </span>
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-100/70 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                        <Check size={12} /> {isTamil ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isTamil ? 'தேர்வு செய்' : 'Select'}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isTamil ? profile.tamilTagline : profile.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400">
                    {profile.id === 'lily_cheerful'
                      ? (isTamil ? 'மகிழ்ச்சி & உற்சாகம்' : 'Sweet & Cheerful')
                      : profile.id === 'maya_gentle'
                      ? (isTamil ? 'மென்மை & இதம்' : 'Soft & Soothing')
                      : profile.id === 'chloe_energetic'
                      ? (isTamil ? 'வேகம் & ஊக்கம்' : 'High Energy Coach')
                      : (isTamil ? 'தியானம் & அமைதி' : 'Mindful & Relaxed')}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handlePreviewLadyVoice(profile, e)}
                    disabled={prefs?.soundEnabled === false}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isPlaying
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 text-slate-700 dark:text-slate-200'
                    }`}
                    title={isTamil ? 'குரல் மாதிரியைக் கேட்கவும்' : 'Play voice preview audio'}
                  >
                    {isPlaying ? (
                      <>
                        <Square size={11} className="fill-current" />
                        <span>{isTamil ? 'ஒலிக்கிறது...' : 'Playing...'}</span>
                      </>
                    ) : (
                      <>
                        <Play size={11} className="fill-current text-pink-500" />
                        <span>{isTamil ? 'குரல் மாதிரி' : 'Preview'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Windows System Voice selection (if system has multiple voices installed) */}
        {systemVoices.length > 0 && (
          <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1.5 mt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {isTamil ? 'விண்டோஸ் கணினி குரல் தேர்வு (விருப்பப்படி)' : 'Windows System Voice (Optional)'}
            </label>
            <p className="text-[11px] text-slate-400">
              {isTamil
                ? 'உங்கள் கணினியில் உள்ள குறிப்பிட்ட விண்டோஸ் பெண் குரலை தேர்வு செய்யலாம்.'
                : 'Select a specific system TTS voice installed on your PC.'}
            </p>
            <select
              value={prefs?.selectedVoiceName || ''}
              onChange={(e) => updatePref({ selectedVoiceName: e.target.value })}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">{isTamil ? 'தானியங்கி / பரிந்துரைக்கப்பட்ட பெண் குரல் (Default Auto Lady)' : 'Auto / Recommended Lady Voice'}</option>
              {systemVoices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4. Notifications & Voice / Sound Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Volume2 size={16} className="text-teal-500" />
            <span>{isTamil ? 'அறிவிப்புகள் மற்றும் குரல் ஒலி' : 'Notifications & Voice Audio'}</span>
          </h3>

          {/* Test Voice Button */}
          <button
            onClick={handleTestVoice}
            disabled={testingVoice || prefs?.soundEnabled === false}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              prefs?.soundEnabled === false
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
            }`}
            title="Preview companion speech audio"
          >
            <Sparkles size={13} className={testingVoice ? 'animate-spin' : ''} />
            <span>{testingVoice ? (isTamil ? 'பேசுகிறது...' : 'Speaking...') : isTamil ? '🔊 குரலை சோதிக்கவும்' : '🔊 Test Voice'}</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-teal-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isTamil ? 'விண்டோஸ் கணினி அறிவிப்புகள்' : 'Native Desktop Notifications'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isTamil
                    ? 'நினைவூட்டல்கள் வரும்போது விண்டோஸ் சிஸ்டம் அறிவிப்பு அட்டைகளை காண்பிக்கும்'
                    : 'Deliver Windows native notification toasts for wellness reminders'}
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

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-teal-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isTamil ? 'குரல் பேச்சு மற்றும் ஒலி விளைவுகள்' : 'Spoken Voice & Audio Effects'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isTamil
                    ? 'நினைவூட்டல்களின் போது தோழி/துணைவர் குரலில் பேசி நினைவூட்டும்'
                    : 'Companion speaks reminders and advice in the selected lady/Tamil voice'}
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

      {/* 5. Desktop Floating Companion Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Maximize2 size={16} className="text-sky-500" />
          <span>{isTamil ? 'திரை மிதக்கும் துணைவர் அமைப்புகள்' : 'Desktop Companion Controls'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTamil
            ? 'கணினி திரையில் தோன்றும் மிதக்கும் பாத்திரத்தின் அளவு மற்றும் நிலையை மாற்றலாம்.'
            : 'Customize the scale, visibility, and placement of your floating companion.'}
        </p>

        <div className="space-y-3">
          {/* Size Options */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                {isTamil ? 'துணைவர் அளவு' : 'Companion Widget Size'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isTamil ? 'சிறியது, இயல்பானது அல்லது பெரிய அளவு' : 'Choose Compact (small), Standard, or Large'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['compact', 'standard', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updatePref({ companionSize: s })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                    (prefs?.companionSize || 'standard') === s
                      ? 'bg-teal-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {s === 'compact' ? (isTamil ? 'சிறியது' : 'Compact') : s === 'standard' ? (isTamil ? 'இயல்பு' : 'Standard') : isTamil ? 'பெரியது' : 'Large'}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility and Reset Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => updatePref({ companionVisible: !prefs?.companionVisible })}
              className={`flex-1 p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                prefs?.companionVisible
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700'
                  : 'bg-slate-50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {prefs?.companionVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>{prefs?.companionVisible ? (isTamil ? 'துணைவர் திரையில் உள்ளது' : 'Companion Visible on Screen') : isTamil ? 'துணைவர் மறைக்கப்பட்டுள்ளது' : 'Companion Hidden'}</span>
            </button>

            <button
              onClick={handleResetPosition}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Reset companion position to top-left corner"
            >
              <Move size={15} />
              <span>{isTamil ? 'நிலையை மீட்டமைக்க' : 'Reset Screen Position'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Daily Hydration Goal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Droplet size={16} className="text-sky-500" />
          <span>{isTamil ? 'தினசரி தண்ணீர் குடிக்கும் இலக்கு' : 'Daily Hydration Goal'}</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTamil
            ? 'ஒவ்வொரு நாளும் நீங்கள் குடிக்க விரும்பும் தண்ணீரின் அளவை மில்லிலிட்டரில் (ml) அமைக்கவும்.'
            : 'Set how much water you want to drink each day (in ml).'}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {[1500, 2000, 2500, 3000].map((preset) => (
            <button
              key={preset}
              onClick={() => handleSaveGoal(preset)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                (prefs?.waterDailyGoalMl || 2000) === preset
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {preset} ml
            </button>
          ))}

          <div className="flex items-center gap-2 ml-auto">
            <input
              type="number"
              min="500"
              max="10000"
              step="100"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white"
            />
            <span className="text-xs text-slate-400 font-medium">ml</span>
            <button
              onClick={() => handleSaveGoal(parseInt(customGoal, 10))}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {goalSaved ? <Check size={13} strokeWidth={3} /> : null}
              <span>{goalSaved ? (isTamil ? 'சேமிக்கப்பட்டது' : 'Saved!') : isTamil ? 'சேமி' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Windows Integration & Startup */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Power size={16} className="text-emerald-500" />
          <span>{isTamil ? 'விண்டோஸ் சிஸ்டம் ஒருங்கிணைப்பு' : 'Windows System Integration'}</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Power size={18} className="text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isTamil ? 'விண்டோஸ் தொடங்கும் போது தானாக திறக்கவும்' : 'Launch on Windows Startup'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isTamil
                    ? 'கணினி துவங்கும் போது WellBuddy தானாக இயங்கும்'
                    : 'Starts WellBuddy automatically when you boot or log into Windows'}
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

          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
            <div className="flex items-center gap-3">
              <Minimize2 size={18} className="text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isTamil ? 'கணினி ட்ரேயில் சுருக்கி தொடங்கவும்' : 'Start Minimized to System Tray'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isTamil
                    ? 'முக்கிய சாளரத்தை திறக்காமல் பின்னணியில் அமைதியாக இயங்கும்'
                    : 'Silently launch in background tray on boot without opening the main window'}
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

      {/* 7. Privacy and Local Persistence Notice */}
      <div className="bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 rounded-2xl p-5 flex items-start gap-3.5">
        <ShieldCheck size={22} className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <h4 className="font-bold text-teal-800 dark:text-teal-200 mb-0.5">
            {isTamil ? '100% பாதுகாப்பானது மற்றும் தனிப்பட்ட கணினி சேமிப்பகம்' : '100% Local & Private by Design'}
          </h4>
          <p>
            {isTamil
              ? 'உங்கள் நல்வாழ்வு பழக்கங்கள் மற்றும் தண்ணீர் பதிவுகள் அனைத்தும் உங்கள் கணினியிலேயே பாதுகாப்பாக சேமிக்கப்படுகின்றன. எவ்வித வெளிப்புற பரிமாற்றமும் இல்லை.'
              : "WellBuddy stores your habits, water logs, and reminder schedules exclusively on your computer in a local SQLite database. No cloud accounts, no telemetry, and no remote data transfers."}
          </p>
        </div>
      </div>

      {/* 8. Exit App Completely Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleExitApp}
          className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>{isTamil ? 'WellBuddy செயலியை முழுமையாக வெளியேறுக' : 'Exit WellBuddy Completely'}</span>
        </button>
      </div>
    </div>
  );
};

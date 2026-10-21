import React, { useState, useEffect } from 'react';
import type { UserPreferences } from '@shared/types';
import { api } from '../../services/api';
import type {
  LadyVoiceProfile,
  VoicePromptAction,
} from '../../services/audio/types';
import { LADY_VOICE_PROFILES } from '../../services/audio/voice-profiles';
import { voiceAudioService } from '../../services/audio/VoiceAudioService';
import {
  Sparkles,
  Star,
  Radio,
  Play,
  Square,
  Volume2,
  VolumeX,
  Droplet,
  Eye,
  Move,
  Activity,
  Check,
  Languages,
  Sliders,
  Award,
} from 'lucide-react';

interface VoiceStudioViewProps {
  prefs: UserPreferences | null;
  onRefresh: () => void;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({ prefs, onRefresh }) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'celebrity' | 'companion'>('all');
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);

  const isTamil = prefs?.language === 'ta';
  const activeVoiceId = prefs?.ladyVoiceId || 'trisha_classic';

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        setSystemVoices(window.speechSynthesis.getVoices() || []);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const updatePref = async (updates: Partial<UserPreferences>) => {
    await api.updatePreferences(updates);
    onRefresh();
  };

  const handlePlayPrompt = (
    profile: LadyVoiceProfile,
    action: VoicePromptAction,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();
    const key = `${profile.id}_${action}`;

    if (playingKey === key) {
      voiceAudioService.stop();
      setPlayingKey(null);
      return;
    }

    voiceAudioService.stop();
    setPlayingKey(key);

    const actionTexts: Record<VoicePromptAction, { en: string; ta: string }> = {
      preview: {
        en: profile.previewTextEn,
        ta: profile.previewTextTa,
      },
      water: {
        en: "Time to hydrate! Drink a glass of fresh water to keep your body energized.",
        ta: "ஹே, கொஞ்சம் தண்ணீர் குடிங்க! உடலை நீரேற்றமாக வெச்சிருக்கிறது ரொம்ப முக்கியம்.",
      },
      eye_rest: {
        en: "Give your eyes a 20-second break. Look 20 feet away into the distance.",
        ta: "ஸ்கிரீனை தொடர்ந்து பார்க்காதீங்க. கண்களுக்கு கொஞ்சம் ஓய்வு கொடுத்து தூரத்துல பாருங்க.",
      },
      standing: {
        en: "You have been seated for a while. Stand up and take a brisk 2-minute stroll.",
        ta: "ரொம்ப நேரம் உட்கார்ந்தாச்சு! எந்திரிச்சு ஒரு சின்ன நடை போயிட்டு வாங்க.",
      },
      stretching: {
        en: "Let's do a refreshing stretch. Roll your shoulders and relieve tension.",
        ta: "கொஞ்சம் சோம்பல் முறிச்சு உடம்பை ஸ்ட்ரெட்ச் பண்ணுங்க. ரொம்ப ரிலாக்ஸா இருக்கும்!",
      },
      greeting: {
        en: profile.previewTextEn,
        ta: profile.previewTextTa,
      },
    };

    const textToSpeak = isTamil ? actionTexts[action].ta : actionTexts[action].en;

    voiceAudioService
      .play(textToSpeak, {
        lang: isTamil ? 'ta' : 'en',
        ladyVoiceId: profile.id,
        promptAction: action,
        voiceName: prefs?.selectedVoiceName,
        onStart: () => setPlayingKey(key),
        onEnd: () => setPlayingKey(null),
      })
      .catch(() => setPlayingKey(null));
  };

  const celebrityProfiles = LADY_VOICE_PROFILES.filter((p: LadyVoiceProfile) => p.category === 'celebrity');
  const companionProfiles = LADY_VOICE_PROFILES.filter((p: LadyVoiceProfile) => p.category === 'companion');

  const actionButtons: { action: VoicePromptAction; labelEn: string; labelTa: string; icon: any }[] = [
    { action: 'preview', labelEn: 'Intro Greeting', labelTa: 'அறிமுகம்', icon: Sparkles },
    { action: 'water', labelEn: 'Water Intake', labelTa: 'தண்ணீர்', icon: Droplet },
    { action: 'eye_rest', labelEn: 'Eye Reset', labelTa: 'கண் ஓய்வு', icon: Eye },
    { action: 'standing', labelEn: 'Posture Break', labelTa: 'நடை பயிற்சி', icon: Move },
    { action: 'stretching', labelEn: 'Stretching', labelTa: 'ஸ்ட்ரெட்ச்', icon: Activity },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl border border-rose-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold tracking-wide uppercase">
              <Award size={14} className="text-amber-400" />
              <span>{isTamil ? 'அங்கீகரிக்கப்பட்ட நேரடி குரல் ஸ்டுடியோ' : 'Flagship Voice Studio & Neural Audio'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {isTamil ? 'பிரபல நட்சத்திர குரல்கள் & பெண் தோழிகள்' : 'Celebrity Voice Models & Companion Personas'}
            </h1>
            <p className="text-sm text-rose-100/80 leading-relaxed">
              {isTamil
                ? 'உங்கள் ஆரோக்கிய நினைவூட்டல்களுக்கு நடிகை த்ரிஷா மற்றும் சமந்தாவின் நேரடி குரல் பதிவுகளைக் கேட்கலாம்.'
                : 'Experience authentic, soothing voices of iconic film stars Trisha and Samantha calibrated specifically for your wellness breaks.'}
            </p>
          </div>

          {/* Quick Sound Control Card */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 self-stretch md:self-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePref({ soundEnabled: !prefs?.soundEnabled })}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  prefs?.soundEnabled !== false
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/20 text-white/60'
                }`}
                title={prefs?.soundEnabled !== false ? 'Voice Sound is ON' : 'Voice Sound is MUTED'}
              >
                {prefs?.soundEnabled !== false ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <div>
                <span className="block text-xs font-bold">
                  {prefs?.soundEnabled !== false
                    ? (isTamil ? 'குரல் ஒலி இயக்கத்தில் உள்ளது' : 'Voice Audio Active')
                    : (isTamil ? 'குரல் ஒலி முடக்கப்பட்டுள்ளது' : 'Audio Muted')}
                </span>
                <span className="text-[10px] text-rose-200/70">
                  {isTamil ? 'நினைவூட்டலின் போது பேசும்' : 'Spoken on desktop reminders'}
                </span>
              </div>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => updatePref({ language: isTamil ? 'en' : 'ta' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all cursor-pointer"
            >
              <Languages size={14} className="text-amber-300" />
              <span>{isTamil ? 'தமிழ் (TA)' : 'English (EN)'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Category Segment Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isTamil ? 'அனைத்து குரல் மாடல்கள் (6)' : 'All Models (6)'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('celebrity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedCategory === 'celebrity'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <Star size={13} className="fill-current" />
            <span>{isTamil ? 'திரைப்பட நட்சத்திரங்கள் (2)' : 'Cinema Stars (2)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('companion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'companion'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isTamil ? 'தோழி குரல்கள் (4)' : 'Companion Personas (4)'}
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline-block">
          {isTamil ? 'தேர்வு செய்தவுடன் தானாக சேமிக்கப்படும்' : 'Changes apply instantly to companion'}
        </span>
      </div>

      {/* SECTION 1: Flagship Cinema Stars */}
      {(selectedCategory === 'all' || selectedCategory === 'celebrity') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
            <Star size={14} className="fill-current" />
            <span>{isTamil ? 'பிரபல நட்சத்திர குரல் மாடல்கள் (நேரடி ஆடியோ)' : 'Authentic Cinema Star Models (Studio Master Audio)'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {celebrityProfiles.map((profile: LadyVoiceProfile) => {
              const isSelected = activeVoiceId === profile.id;
              const isAnyPlayingForThisVoice = playingKey?.startsWith(profile.id);

              return (
                <div
                  key={profile.id}
                  onClick={() => updatePref({ ladyVoiceId: profile.id })}
                  className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between gap-5 ${
                    isSelected
                      ? 'bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-pink-500/10 dark:from-rose-950/40 dark:via-amber-950/20 dark:to-pink-950/30 border-rose-500 dark:border-rose-400 shadow-lg ring-4 ring-rose-500/15'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md'
                  }`}
                >
                  {/* Top Bar with Avatar, Name, and Selection Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${profile.avatarColor} p-0.5 shadow-md flex items-center justify-center text-white font-black text-lg`}>
                          {profile.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {isTamil ? profile.tamilName : profile.name}
                            </h3>
                            <span className="p-1 rounded-full bg-amber-400/20 text-amber-500 dark:text-amber-300">
                              <Star size={12} className="fill-current" />
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                            {profile.badge[isTamil ? 'ta' : 'en']}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-xs">
                          <Check size={13} /> {isTamil ? 'இயக்கத்தில் உள்ளது' : 'Selected'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePref({ ladyVoiceId: profile.id });
                          }}
                          className="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {isTamil ? 'தேர்வு செய்' : 'Set as Active'}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {isTamil ? profile.tamilTagline : profile.tagline}
                    </p>

                    {/* Pre-recorded Audio Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-bold border border-rose-300/60 dark:border-rose-800">
                        <Radio size={12} className="text-rose-500 animate-pulse" />
                        <span>{isTamil ? 'நேரடி ஸ்டுடியோ ஆடியோ (உண்மையான குரல்)' : 'Studio Master MP3 (Authentic Voice)'}</span>
                      </span>

                      {isAnyPlayingForThisVoice && (
                        <div className="flex items-end gap-1 h-3.5 px-2">
                          <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" />
                          <span className="w-1 h-3.5 bg-rose-500 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1 h-2.5 bg-rose-500 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5-Prompt Action Soundboard */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {isTamil ? '5 நினைவூட்டல் குரல் மாதிரிகள் (Test Voice Lines):' : 'Interactive Soundboard (Test Voice Lines):'}
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {actionButtons.map(({ action, labelEn, labelTa, icon: Icon }) => {
                        const btnKey = `${profile.id}_${action}`;
                        const isThisPlaying = playingKey === btnKey;

                        return (
                          <button
                            key={action}
                            type="button"
                            onClick={(e) => handlePlayPrompt(profile, action, e)}
                            className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                              isThisPlaying
                                ? 'bg-rose-500 text-white shadow-md'
                                : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rose-300 dark:hover:border-rose-800'
                            }`}
                            title={isTamil ? `${labelTa} குரல் மாதிரி கேட்க` : `Play ${labelEn} audio`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <Icon size={12} className={isThisPlaying ? 'text-white' : 'text-rose-500'} />
                              <span className="truncate">{isTamil ? labelTa : labelEn}</span>
                            </span>
                            {isThisPlaying ? (
                              <Square size={10} className="fill-current flex-shrink-0" />
                            ) : (
                              <Play size={10} className="fill-current flex-shrink-0 opacity-70" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Companion Voice Personas */}
      {(selectedCategory === 'all' || selectedCategory === 'companion') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            <Sparkles size={14} className="text-pink-500" />
            <span>{isTamil ? 'தினசரி வாழ்க்கை தோழி குரல்கள்' : 'Companion Lifestyle Personas'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {companionProfiles.map((profile: LadyVoiceProfile) => {
              const isSelected = activeVoiceId === profile.id;
              const isPlaying = playingKey === `${profile.id}_preview`;

              return (
                <div
                  key={profile.id}
                  onClick={() => updatePref({ ladyVoiceId: profile.id })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-br from-pink-50/80 to-rose-50/40 dark:from-pink-950/30 dark:to-rose-950/20 border-pink-400 dark:border-pink-500 shadow-md ring-2 ring-pink-400/20'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${profile.avatarColor} shadow-xs`} />
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                          {isTamil ? profile.tamilName : profile.name}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-pink-500" />
                      )}
                    </div>

                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[10px] font-semibold mb-2">
                      {profile.badge[isTamil ? 'ta' : 'en']}
                    </span>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isTamil ? profile.tamilTagline : profile.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {isTamil ? 'இயற்கை குரல்' : 'Natural TTS'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handlePlayPrompt(profile, 'preview', e)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-pink-100 dark:hover:bg-pink-950/60'
                      }`}
                    >
                      {isPlaying ? <Square size={10} className="fill-current" /> : <Play size={10} className="fill-current text-pink-500" />}
                      <span>{isTamil ? 'மாதிரி' : 'Preview'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System SAPI Voice Settings */}
      {systemVoices.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders size={14} className="text-teal-500" />
                <span>{isTamil ? 'கணினி குரல் அமைப்பு (Windows TTS Fallback)' : 'Operating System Voice Engine (Windows SAPI)'}</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {isTamil
                  ? 'கணினியில் உள்ள பிரத்யேக ஆங்கில பெண் குரலை தேர்வு செய்யலாம்.'
                  : 'Select a specific system TTS engine voice installed on your PC.'}
              </p>
            </div>
          </div>

          <select
            value={prefs?.selectedVoiceName || ''}
            onChange={(e) => updatePref({ selectedVoiceName: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
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
  );
};

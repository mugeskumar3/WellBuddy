import { api } from '../services/api';
import { LadyVoiceId } from '@shared/types';

export interface LadyVoiceProfile {
  id: LadyVoiceId;
  name: string;
  tamilName: string;
  tagline: string;
  tamilTagline: string;
  avatarColor: string;
  englishPitch: number;
  englishRate: number;
  tamilRate: number;
  previewTextEn: string;
  previewTextTa: string;
}

export const LADY_VOICE_PROFILES: LadyVoiceProfile[] = [
  {
    id: 'lily_cheerful',
    name: 'Lily (Cheerful)',
    tamilName: 'லிலி (மகிழ்ச்சி)',
    tagline: 'Upbeat, warm, and lively companion voice',
    tamilTagline: 'மகிழ்ச்சியான, இனிமையான உற்சாக குரல்',
    avatarColor: 'from-pink-500 to-rose-400',
    englishPitch: 1.4,
    englishRate: 1.05,
    tamilRate: 1.05,
    previewTextEn: "Hello! I am Lily. I'm so happy to keep you healthy and energized today!",
    previewTextTa: 'வணக்கம்! நான் லிலி. இன்று உங்களை ஆரோக்கியமாகவும் உற்சாகமாகவும் வைத்திருக்க மகிழ்ச்சி அடைகிறேன்!',
  },
  {
    id: 'maya_gentle',
    name: 'Maya (Gentle)',
    tamilName: 'மாயா (மென்மை)',
    tagline: 'Calm, soothing, and caring tone',
    tamilTagline: 'அமைதியான, இதமான மற்றும் பாசமான குரல்',
    avatarColor: 'from-teal-500 to-emerald-400',
    englishPitch: 1.2,
    englishRate: 0.95,
    tamilRate: 0.92,
    previewTextEn: 'Hello, I am Maya. Take a gentle breath, relax your shoulders, and stay hydrated.',
    previewTextTa: 'வணக்கம், நான் மாயா. மெதுவாக சுவாசித்து, மனதை அமைதிப்படுத்தி போதுமான தண்ணீர் குடியுங்கள்.',
  },
  {
    id: 'chloe_energetic',
    name: 'Chloe (Energetic)',
    tamilName: 'குளோயி (சுறுசுறுப்பு)',
    tagline: 'Dynamic, spirited fitness and focus coach',
    tamilTagline: 'சுறுசுறுப்பான, வேகமான ஊக்கமளிக்கும் குரல்',
    avatarColor: 'from-amber-500 to-orange-400',
    englishPitch: 1.28,
    englishRate: 1.15,
    tamilRate: 1.1,
    previewTextEn: "Hey there! I am Chloe. Let's conquer the day with high energy and regular breaks!",
    previewTextTa: 'வணக்கம்! நான் குளோயி. முழு உற்சாகத்துடனும் சிறிய இடைவேளைகளுடனும் இன்றைய நாளை வெல்வோம்!',
  },
  {
    id: 'tara_zen',
    name: 'Tara (Zen & Mindful)',
    tamilName: 'தாரா (தியானம் & அமைதி)',
    tagline: 'Peaceful, meditative, and balanced pace',
    tamilTagline: 'மன அமைதி, தியானம் மற்றும் சீரான குரல்',
    avatarColor: 'from-indigo-500 to-purple-400',
    englishPitch: 1.08,
    englishRate: 0.88,
    tamilRate: 0.88,
    previewTextEn: 'Greetings, I am Tara. Be present in this moment, and remember to rest your eyes.',
    previewTextTa: 'வணக்கம், நான் தாரா. இந்த தருணத்தில் விழிப்புடன் இருங்கள், கண்களுக்கு சீரான ஓய்வு கொடுங்கள்.',
  },
  {
    id: 'samantha_star',
    name: 'Samantha (சமந்தா)',
    tamilName: 'சமந்தா (Samantha Ruth Prabhu)',
    tagline: 'Vibrant, youthful, and cheerful star voice with radiant energy',
    tamilTagline: 'உற்சாகமான, இளமையான, வசீகரமான சமந்தா குரல் மாடல்',
    avatarColor: 'from-rose-500 to-amber-400',
    englishPitch: 1.34,
    englishRate: 1.05,
    tamilRate: 1.06,
    previewTextEn: "Hey there! I am Samantha! Drink plenty of water, stretch those muscles, and keep shining bright today!",
    previewTextTa: 'வணக்கம்! நான் சமந்தா! உடலை ஆரோக்கியமாக வையுங்கள், நிறைய தண்ணீர் குடியுங்கள், எப்போதும் உற்சாகமாக இருங்கள்!',
  },
  {
    id: 'trisha_classic',
    name: 'Trisha (த்ரிஷா)',
    tamilName: 'த்ரிஷா (Trisha Krishnan)',
    tagline: 'Sweet, melodious, and elegant iconic voice with soothing grace',
    tamilTagline: 'இனிமையான, நளினமான, கனிவான த்ரிஷா குரல் மாடல்',
    avatarColor: 'from-fuchsia-500 to-pink-400',
    englishPitch: 1.22,
    englishRate: 0.96,
    tamilRate: 0.94,
    previewTextEn: "Hello, I am Trisha. Remember to take a mindful break, relax your eyes, and stay refreshed.",
    previewTextTa: 'வணக்கம், நான் த்ரிஷா. கண்களுக்கு சிறிது ஓய்வு கொடுத்து, மனதை அமைதிப்படுத்தி புத்துணர்ச்சியுடன் இருங்கள்.',
  },
];

export interface SpeakOptions {
  lang?: 'en' | 'ta';
  ladyVoiceId?: LadyVoiceId;
  voiceName?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

let activeAudio: HTMLAudioElement | null = null;

/**
 * Stop any currently playing audio stream or SpeechSynthesis speech
 */
export function stopSpeaking(): void {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Get all available browser / system voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices() || [];
}

/**
 * Find an English female / lady voice in SpeechSynthesis, optionally matching preferred voice name
 */
export function getLadyVoice(
  preferredVoiceName?: string,
  ladyVoiceId?: LadyVoiceId
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  if (preferredVoiceName) {
    const match = voices.find((v) => v.name.toLowerCase() === preferredVoiceName.toLowerCase());
    if (match) return match;
  }

  // Celebrity / Persona voice targeted matching
  if (ladyVoiceId === 'samantha_star') {
    const samMatch =
      voices.find((v) => v.name.toLowerCase().includes('samantha')) ||
      voices.find((v) => v.lang.toLowerCase().includes('in') && (v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('female'))) ||
      voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in'));
    if (samMatch) return samMatch;
  }

  if (ladyVoiceId === 'trisha_classic') {
    const trishaMatch =
      voices.find((v) => (v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india')) && (v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('female'))) ||
      voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('en_in')) ||
      voices.find((v) => v.name.toLowerCase().includes('aria') || v.name.toLowerCase().includes('jenny'));
    if (trishaMatch) return trishaMatch;
  }

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

  return (
    voices.find((v) => {
      const name = v.name.toLowerCase();
      const isEnglish = v.lang.toLowerCase().startsWith('en');
      return isEnglish && femaleKeywords.some((k) => name.includes(k));
    }) ||
    voices.find((v) => femaleKeywords.some((k) => v.name.toLowerCase().includes(k))) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
    voices[0] ||
    null
  );
}

/**
 * Find Tamil voice in local SpeechSynthesis (if installed in Windows SAPI)
 */
export function getTamilVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  return (
    voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('ta') ||
        v.name.toLowerCase().includes('tamil') ||
        v.name.toLowerCase().includes('valluvar') ||
        v.name.toLowerCase().includes('latha')
    ) || null
  );
}

/**
 * Speaks text in either Tamil or English with custom Lady voice profiles:
 * - For Tamil: Plays native Tamil voice audio stream (guaranteed to work on Windows without Tamil language packs),
 *   with profile-calibrated playback speed and local SpeechSynthesis fallback.
 * - For English: Plays natural English lady voice via SpeechSynthesis with profile-tuned pitch and rate.
 */
export function speakText(text: string, options: SpeakOptions = {}): void {
  if (typeof window === 'undefined') return;

  const {
    lang = 'en',
    ladyVoiceId = 'lily_cheerful',
    voiceName,
    volume = 0.95,
    onStart,
    onEnd,
  } = options;

  const profile =
    LADY_VOICE_PROFILES.find((p) => p.id === ladyVoiceId) || LADY_VOICE_PROFILES[0];

  const effectivePitch = options.pitch ?? (lang === 'ta' ? 1.1 : profile.englishPitch);
  const effectiveRate =
    options.rate ?? (lang === 'ta' ? profile.tamilRate : profile.englishRate);

  stopSpeaking();

  // Strip emojis from text for clean pronunciation
  const cleanText = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  if (!cleanText) return;

  // Check if an authentic pre-recorded audio clip exists for this actor & reminder
  const getPreRecordedAudioPath = (): string | null => {
    let actorFolder = '';
    if (ladyVoiceId === 'trisha_classic') actorFolder = 'trisha';
    else if (ladyVoiceId === 'samantha_star') actorFolder = 'samantha';
    if (!actorFolder) return null;

    const lower = cleanText.toLowerCase();
    if (lower.includes('தண்ணீர்') || lower.includes('water') || lower.includes('drink')) {
      return `./audio/${actorFolder}/water.mp3`;
    }
    if (lower.includes('கண்') || lower.includes('eye') || lower.includes('rest')) {
      return `./audio/${actorFolder}/eye_rest.mp3`;
    }
    if (lower.includes('எழுந்து') || lower.includes('நட') || lower.includes('stand') || lower.includes('walk')) {
      return `./audio/${actorFolder}/standing.mp3`;
    }
    if (lower.includes('நீட்டி') || lower.includes('உடற்பயிற்சி') || lower.includes('stretch')) {
      return `./audio/${actorFolder}/stretching.mp3`;
    }
    if (lower.includes('சமந்தா') || lower.includes('த்ரிஷா') || lower.includes('வணக்கம்') || lower.includes('hello') || lower.includes('i am')) {
      return `./audio/${actorFolder}/preview.mp3`;
    }
    return null;
  };

  const preRecordedPath = getPreRecordedAudioPath();
  if (preRecordedPath) {
    const directAudio = new Audio(preRecordedPath);
    directAudio.volume = Math.min(1, Math.max(0, volume));
    if (onStart) directAudio.onplay = () => onStart();
    directAudio.onended = () => {
      if (activeAudio === directAudio) activeAudio = null;
      if (onEnd) onEnd();
    };
    directAudio.onerror = () => {
      // If authentic custom audio file hasn't been placed yet, proceed to synthesized stream
      proceedWithSpeechStream();
    };
    activeAudio = directAudio;
    directAudio.play().catch(() => {
      proceedWithSpeechStream();
    });
    return;
  }

  proceedWithSpeechStream();

  function proceedWithSpeechStream() {
    if (lang === 'ta') {
      // If local Windows Tamil voice is installed, use it
      const localTamilVoice = getTamilVoice();
      if (localTamilVoice) {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.voice = localTamilVoice;
          utterance.lang = 'ta-IN';
          utterance.pitch = effectivePitch;
          utterance.rate = effectiveRate;
          utterance.volume = volume;
          if (onStart) utterance.onstart = onStart;
          if (onEnd) {
            utterance.onend = onEnd;
            utterance.onerror = onEnd;
          }
          window.speechSynthesis.speak(utterance);
          return;
        } catch {
          // Fall back to stream below
        }
      }

      // Native Tamil voice stream fetched via Electron main process to bypass browser CORS/Referer
      api
        .getTamilAudioDataUri(cleanText)
        .then((dataUri) => {
          if (!dataUri) {
            fallbackSpeech();
            return;
          }
          const audio = new Audio(dataUri);
          activeAudio = audio;
          audio.volume = Math.min(1, Math.max(0, volume));
          audio.playbackRate = effectiveRate;

          if (onStart) {
            audio.onplay = () => onStart();
          }
          audio.onended = () => {
            if (activeAudio === audio) activeAudio = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            if (activeAudio === audio) activeAudio = null;
            fallbackSpeech();
          };

          audio.play().catch(() => {
            fallbackSpeech();
          });
        })
        .catch(() => {
          fallbackSpeech();
        });
      return;
    }
  }

  // English Lady Voice
  try {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const ladyVoice = getLadyVoice(voiceName, ladyVoiceId);
    if (ladyVoice) {
      utterance.voice = ladyVoice;
      utterance.lang = ladyVoice.lang || 'en-US';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.pitch = effectivePitch;
    utterance.rate = effectiveRate;
    utterance.volume = volume;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }

  function fallbackSpeech() {
    try {
      if (!window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ta-IN';
      utterance.volume = volume;
      utterance.rate = effectiveRate;
      utterance.pitch = effectivePitch;
      if (onStart) utterance.onstart = onStart;
      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

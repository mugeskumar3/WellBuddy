import { LadyVoiceId, ReminderType } from '@shared/types';

export type VoiceCategory = 'celebrity' | 'companion';

export type VoicePromptAction =
  | 'preview'
  | 'greeting'
  | 'water'
  | 'eye_rest'
  | 'standing'
  | 'stretching';

export type AudioPlaybackEngine = 'studio_asset' | 'neural_tts_stream' | 'speech_synthesis';

export interface VoiceBadge {
  en: string;
  ta: string;
}

export interface LadyVoiceProfile {
  id: LadyVoiceId;
  name: string;
  tamilName: string;
  category: VoiceCategory;
  badge: VoiceBadge;
  tagline: string;
  tamilTagline: string;
  avatarColor: string;
  cardGradient: string;
  borderAccent: string;
  englishPitch: number;
  englishRate: number;
  tamilRate: number;
  previewTextEn: string;
  previewTextTa: string;
  hasPreRecordedAudio: boolean;
  audioFolder?: string;
}

export interface VoicePlaybackOptions {
  lang?: 'en' | 'ta';
  ladyVoiceId?: LadyVoiceId;
  voiceName?: string;
  promptAction?: VoicePromptAction;
  reminderType?: ReminderType;
  pitch?: number;
  rate?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export interface PlaybackState {
  isPlaying: boolean;
  activeVoiceId: LadyVoiceId | null;
  engine: AudioPlaybackEngine | null;
  currentAction: VoicePromptAction | null;
}

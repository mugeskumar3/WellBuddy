import type { LadyVoiceId } from '@shared/types';
import {
  LadyVoiceProfile,
  VoicePromptAction,
  VoicePlaybackOptions,
} from '../services/audio/types';
import { LADY_VOICE_PROFILES } from '../services/audio/voice-profiles';
import { voiceAudioService } from '../services/audio/VoiceAudioService';

export type { LadyVoiceProfile, VoicePromptAction };
export { LADY_VOICE_PROFILES };

export interface SpeakOptions extends VoicePlaybackOptions {}

/**
 * Stop any currently playing audio stream or SpeechSynthesis speech
 */
export function stopSpeaking(): void {
  voiceAudioService.stop();
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
  return voiceAudioService.findLadyVoice(preferredVoiceName, ladyVoiceId);
}

/**
 * Find Tamil voice in local SpeechSynthesis (if installed in Windows SAPI)
 */
export function getTamilVoice(): SpeechSynthesisVoice | null {
  return voiceAudioService.findLocalTamilVoice();
}

/**
 * Speaks text in either Tamil or English with custom Lady voice profiles:
 * - Deterministic high-priority pre-recorded studio clips for Samantha & Trisha.
 * - Profile-calibrated neural audio streams for Tamil.
 * - Browser speech synthesis fallback with profile-tuned pitch and rate.
 */
export function speakText(text: string, options: SpeakOptions = {}): void {
  voiceAudioService.play(text, options).catch((err) => {
    console.error('Failed to play speech audio:', err);
  });
}

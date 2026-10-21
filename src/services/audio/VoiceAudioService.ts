import { api } from '../api';
import type { LadyVoiceId, ReminderType } from '@shared/types';
import type {
  PlaybackState,
  VoicePlaybackOptions,
  VoicePromptAction,
} from './types';
import { LADY_VOICE_PROFILES } from './voice-profiles';

/**
 * Senior-level Unified Voice Audio Service
 * Manages studio pre-recorded audio assets, cloud neural streams, and browser synthesis fallbacks.
 */
export class VoiceAudioService {
  private static instance: VoiceAudioService;

  private activeAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, HTMLAudioElement>();
  private audioContext: AudioContext | null = null;

  private state: PlaybackState = {
    isPlaying: false,
    activeVoiceId: null,
    engine: null,
    currentAction: null,
  };

  private listeners = new Set<(state: PlaybackState) => void>();

  private constructor() {
    // Singleton
  }

  public static getInstance(): VoiceAudioService {
    if (!VoiceAudioService.instance) {
      VoiceAudioService.instance = new VoiceAudioService();
    }
    return VoiceAudioService.instance;
  }

  /**
   * Subscribe to playback state changes
   */
  public subscribe(listener: (state: PlaybackState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  private updateState(partial: Partial<PlaybackState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  public getState(): PlaybackState {
    return { ...this.state };
  }

  /**
   * Stop any current speech or audio playback
   */
  public stop(): void {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // Safe ignore
      }
      this.activeAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe ignore
      }
    }

    this.updateState({
      isPlaying: false,
      activeVoiceId: null,
      engine: null,
      currentAction: null,
    });
  }

  /**
   * Resolve appropriate VoicePromptAction from explicit options or semantic text analysis
   */
  public resolvePromptAction(
    text: string,
    explicitAction?: VoicePromptAction,
    reminderType?: ReminderType
  ): VoicePromptAction {
    if (explicitAction) return explicitAction;

    if (reminderType) {
      switch (reminderType) {
        case 'water':
          return 'water';
        case 'eye_rest':
          return 'eye_rest';
        case 'standing':
          return 'standing';
        case 'stretching':
          return 'stretching';
      }
    }

    const lower = text.toLowerCase();
    if (lower.includes('தண்ணீர்') || lower.includes('water') || lower.includes('drink')) {
      return 'water';
    }
    if (lower.includes('கண்') || lower.includes('eye') || lower.includes('rest')) {
      return 'eye_rest';
    }
    if (lower.includes('எழுந்து') || lower.includes('நட') || lower.includes('stand') || lower.includes('walk')) {
      return 'standing';
    }
    if (lower.includes('நீட்டி') || lower.includes('உடற்பயிற்சி') || lower.includes('stretch')) {
      return 'stretching';
    }
    return 'preview';
  }

  /**
   * Deterministic pre-recorded audio file path resolver
   */
  public getStudioAssetPath(voiceId: LadyVoiceId, action: VoicePromptAction): string | null {
    const profile = LADY_VOICE_PROFILES.find((p) => p.id === voiceId);
    if (!profile || !profile.hasPreRecordedAudio || !profile.audioFolder) {
      return null;
    }

    const filename = action === 'greeting' ? 'preview.mp3' : `${action}.mp3`;
    return `./audio/${profile.audioFolder}/${filename}`;
  }

  /**
   * Main entry point: Play voice with multi-tiered resilience
   */
  public async play(text: string, options: VoicePlaybackOptions = {}): Promise<void> {
    if (typeof window === 'undefined') return;

    const {
      lang = 'en',
      ladyVoiceId = 'lily_cheerful',
      voiceName,
      promptAction,
      reminderType,
      volume = 0.95,
      onStart,
      onEnd,
      onError,
    } = options;

    const profile =
      LADY_VOICE_PROFILES.find((p) => p.id === ladyVoiceId) || LADY_VOICE_PROFILES[0];

    const effectivePitch = options.pitch ?? (lang === 'ta' ? 1.1 : profile.englishPitch);
    const effectiveRate =
      options.rate ?? (lang === 'ta' ? profile.tamilRate : profile.englishRate);

    this.stop();

    const cleanText = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();
    if (!cleanText) return;

    const action = this.resolvePromptAction(cleanText, promptAction, reminderType);

    // Tier 1: Check for studio pre-recorded audio asset (Trisha / Samantha)
    const studioPath = this.getStudioAssetPath(ladyVoiceId, action);
    if (studioPath) {
      const success = await this.tryPlayStudioAsset(studioPath, volume, {
        onStart: () => {
          this.updateState({
            isPlaying: true,
            activeVoiceId: ladyVoiceId,
            engine: 'studio_asset',
            currentAction: action,
          });
          onStart?.();
        },
        onEnd: () => {
          this.updateState({
            isPlaying: false,
            activeVoiceId: null,
            engine: null,
            currentAction: null,
          });
          onEnd?.();
        },
      });

      if (success) return;
    }

    // Tier 2: For Tamil, use Neural audio stream
    if (lang === 'ta') {
      const localTamilVoice = this.findLocalTamilVoice();
      if (localTamilVoice) {
        this.playSpeechSynthesis(cleanText, localTamilVoice, {
          pitch: effectivePitch,
          rate: effectiveRate,
          volume,
          onStart: () => {
            this.updateState({
              isPlaying: true,
              activeVoiceId: ladyVoiceId,
              engine: 'speech_synthesis',
              currentAction: action,
            });
            onStart?.();
          },
          onEnd: () => {
            this.updateState({
              isPlaying: false,
              activeVoiceId: null,
              engine: null,
              currentAction: null,
            });
            onEnd?.();
          },
        });
        return;
      }

      // Stream from main process
      try {
        const dataUri = await api.getTamilAudioDataUri(cleanText);
        if (dataUri) {
          const played = await this.playAudioStream(dataUri, volume, effectiveRate, ladyVoiceId, {
            onStart: () => {
              this.updateState({
                isPlaying: true,
                activeVoiceId: ladyVoiceId,
                engine: 'neural_tts_stream',
                currentAction: action,
              });
              onStart?.();
            },
            onEnd: () => {
              this.updateState({
                isPlaying: false,
                activeVoiceId: null,
                engine: null,
                currentAction: null,
              });
              onEnd?.();
            },
          });
          if (played) return;
        }
      } catch (err) {
        console.warn('Neural stream playback error, falling back to speech synthesis:', err);
      }
    }

    // Tier 3: SpeechSynthesis fallback (English lady voice or system fallback)
    const targetVoice = this.findLadyVoice(voiceName, ladyVoiceId);
    this.playSpeechSynthesis(cleanText, targetVoice, {
      pitch: effectivePitch,
      rate: effectiveRate,
      volume,
      onStart: () => {
        this.updateState({
          isPlaying: true,
          activeVoiceId: ladyVoiceId,
          engine: 'speech_synthesis',
          currentAction: action,
        });
        onStart?.();
      },
      onEnd: () => {
        this.updateState({
          isPlaying: false,
          activeVoiceId: null,
          engine: null,
          currentAction: null,
        });
        onEnd?.();
      },
      onError,
    });
  }

  private async tryPlayStudioAsset(
    path: string,
    volume: number,
    callbacks: { onStart?: () => void; onEnd?: () => void }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        let audio = this.audioCache.get(path);
        if (!audio) {
          audio = new Audio(path);
          this.audioCache.set(path, audio);
        } else {
          audio.currentTime = 0;
        }
        audio.volume = Math.min(1, Math.max(0, volume));

        audio.onplay = () => {
          this.activeAudio = audio;
          callbacks.onStart?.();
        };

        audio.onended = () => {
          if (this.activeAudio === audio) this.activeAudio = null;
          callbacks.onEnd?.();
        };

        audio.onerror = () => {
          if (this.activeAudio === audio) this.activeAudio = null;
          resolve(false);
        };

        audio
          .play()
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  private async playAudioStream(
    dataUri: string,
    volume: number,
    playbackRate: number,
    ladyVoiceId: LadyVoiceId,
    callbacks: { onStart?: () => void; onEnd?: () => void }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(dataUri);
        this.activeAudio = audio;
        audio.volume = Math.min(1, Math.max(0, volume));
        audio.playbackRate = playbackRate;

        // Apply acoustic shaping filters for Samantha & Trisha
        if (ladyVoiceId === 'trisha_classic' || ladyVoiceId === 'samantha_star') {
          this.applyAcousticFilter(audio, ladyVoiceId);
        }

        audio.onplay = () => callbacks.onStart?.();
        audio.onended = () => {
          if (this.activeAudio === audio) this.activeAudio = null;
          callbacks.onEnd?.();
        };
        audio.onerror = () => {
          if (this.activeAudio === audio) this.activeAudio = null;
          resolve(false);
        };

        audio
          .play()
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  private applyAcousticFilter(audio: HTMLAudioElement, voiceId: LadyVoiceId): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtx();
      }
      const ctx = this.audioContext;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const source = ctx.createMediaElementSource(audio);
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'peaking';
      lowFilter.frequency.value = voiceId === 'trisha_classic' ? 220 : 280;
      lowFilter.Q.value = 1.2;
      lowFilter.gain.value = 3.5;

      const notchFilter = ctx.createBiquadFilter();
      notchFilter.type = 'notch';
      notchFilter.frequency.value = 3200;
      notchFilter.Q.value = 3.0;

      const highAir = ctx.createBiquadFilter();
      highAir.type = 'highshelf';
      highAir.frequency.value = 7000;
      highAir.gain.value = 2.0;

      source.connect(lowFilter);
      lowFilter.connect(notchFilter);
      notchFilter.connect(highAir);
      highAir.connect(ctx.destination);
    } catch {
      // Audio node already connected or not supported
    }
  }

  private playSpeechSynthesis(
    text: string,
    voice: SpeechSynthesisVoice | null,
    options: {
      pitch: number;
      rate: number;
      volume: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }
  ): void {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.pitch = options.pitch;
      utterance.rate = options.rate;
      utterance.volume = options.volume;

      if (options.onStart) utterance.onstart = options.onStart;
      utterance.onend = () => options.onEnd?.();
      utterance.onerror = (e) => {
        options.onError?.(e);
        options.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      options.onError?.(err);
      options.onEnd?.();
    }
  }

  public findLocalTamilVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
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

  public findLadyVoice(
    preferredVoiceName?: string,
    ladyVoiceId?: LadyVoiceId
  ): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) return null;

    if (preferredVoiceName) {
      const match = voices.find(
        (v) => v.name.toLowerCase() === preferredVoiceName.toLowerCase()
      );
      if (match) return match;
    }

    if (ladyVoiceId === 'samantha_star') {
      const samMatch =
        voices.find((v) => v.name.toLowerCase().includes('samantha')) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().includes('in') &&
            (v.name.toLowerCase().includes('heera') ||
              v.name.toLowerCase().includes('neerja') ||
              v.name.toLowerCase().includes('female'))
        ) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().includes('en-in') ||
            v.lang.toLowerCase().includes('en_in')
        );
      if (samMatch) return samMatch;
    }

    if (ladyVoiceId === 'trisha_classic') {
      const trishaMatch =
        voices.find(
          (v) =>
            (v.lang.toLowerCase().includes('in') ||
              v.name.toLowerCase().includes('india')) &&
            (v.name.toLowerCase().includes('neerja') ||
              v.name.toLowerCase().includes('heera') ||
              v.name.toLowerCase().includes('female'))
        ) ||
        voices.find(
          (v) =>
            v.lang.toLowerCase().includes('en-in') ||
            v.lang.toLowerCase().includes('en_in')
        ) ||
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
}

export const voiceAudioService = VoiceAudioService.getInstance();

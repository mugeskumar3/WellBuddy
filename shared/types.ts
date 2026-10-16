export type ReminderType = 'water' | 'standing' | 'eye_rest' | 'stretching';

export type OccurrenceStatus = 'scheduled' | 'delivered' | 'completed' | 'snoozed' | 'skipped';

export interface WorkingHours {
  startTime: string; // HH:mm format, e.g. "09:00"
  endTime: string;   // HH:mm format, e.g. "18:00"
  activeDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface ReminderSettings {
  id: ReminderType;
  name: string;
  enabled: boolean;
  intervalMinutes: number;
  snoozeMinutes: number;
  workingHours: WorkingHours;
  quietHours: QuietHours;
  soundEnabled: boolean;
  updatedAt: number;
}

export interface ReminderOccurrence {
  id: string; // deterministic occurrence ID: `${reminderId}_${scheduledAt}`
  reminderId: ReminderType;
  scheduledAt: number; // Unix timestamp ms
  status: OccurrenceStatus;
  snoozedUntil: number | null;
  deliveredAt: number | null;
  completedAt: number | null;
  createdAt: number;
}

export interface WaterEntry {
  id: string;
  amountMl: number;
  loggedAt: number;
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  reminderType: ReminderType;
  occurrenceId: string;
  action: 'completed' | 'snoozed' | 'skipped';
  occurredAt: number;
}

export type AvatarType = 'builtin' | 'custom';

export interface AvatarInfo {
  id: string;
  name: string;
  type: AvatarType;
  src: string; // data URI or local path
  description: string;
}

export type LadyVoiceId = 'lily_cheerful' | 'maya_gentle' | 'chloe_energetic' | 'tara_zen';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  startAtLogin: boolean;
  startMinimized: boolean;
  companionVisible: boolean;
  companionPosition: { x: number; y: number };
  companionSize: 'compact' | 'standard' | 'large';
  selectedAvatarId: string;
  customAvatarPath: string | null;
  waterDailyGoalMl: number;
  remindersPaused: boolean;
  pauseUntil: number | null; // null if paused indefinitely or not paused
  language?: 'en' | 'ta';
  ladyVoiceId?: LadyVoiceId;
  selectedVoiceName?: string;
}

export interface DailyProgressSummary {
  date: string; // YYYY-MM-DD
  waterTotalMl: number;
  waterGoalMl: number;
  completedActivities: number;
  snoozedActivities: number;
  skippedActivities: number;
  byType: Record<ReminderType, { completed: number; snoozed: number; skipped: number }>;
  recentLogs: ActivityLog[];
}

export interface NextReminderInfo {
  type: ReminderType;
  name: string;
  dueAt: number;
  occurrenceId: string;
}

export interface ActivePromptInfo {
  occurrenceId: string;
  type: ReminderType;
  title: string;
  message: string;
  suggestedAction?: string;
  options?: string[];
  dueAt: number;
}

// IPC API contract exposed to Renderer
export interface WellBuddyAPI {
  // Reminders
  getReminderSettings: () => Promise<ReminderSettings[]>;
  updateReminderSettings: (settings: ReminderSettings) => Promise<boolean>;
  completeReminder: (occurrenceId: string, reminderType: ReminderType) => Promise<boolean>;
  snoozeReminder: (occurrenceId: string, reminderType: ReminderType, minutes?: number) => Promise<boolean>;
  skipReminder: (occurrenceId: string, reminderType: ReminderType) => Promise<boolean>;
  getNextReminders: () => Promise<NextReminderInfo[]>;
  pauseReminders: (durationMinutes?: number) => Promise<boolean>;
  resumeReminders: () => Promise<boolean>;

  // Water Tracking
  getWaterEntriesToday: () => Promise<WaterEntry[]>;
  logWater: (amountMl: number) => Promise<WaterEntry>;
  deleteWaterEntry: (id: string) => Promise<boolean>;
  getDailyProgress: (dateStr?: string) => Promise<DailyProgressSummary>;
  getWeeklyHistory: () => Promise<{ date: string; waterMl: number; completedActivities: number }[]>;

  // User Preferences
  getPreferences: () => Promise<UserPreferences>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<UserPreferences>;

  // Avatars
  getAvatars: () => Promise<AvatarInfo[]>;
  uploadAvatar: (fileBuffer: Uint8Array, fileName: string, mimeType: string) => Promise<AvatarInfo>;
  selectAvatar: (avatarId: string) => Promise<boolean>;
  deleteCustomAvatar: (avatarId: string) => Promise<boolean>;

  // Window & System Controls
  showCompanion: () => Promise<void>;
  hideCompanion: () => Promise<void>;
  setCompanionPosition: (pos: { x: number; y: number }) => Promise<void>;
  getCompanionPosition: () => Promise<{ x: number; y: number }>;
  openDashboard: () => Promise<void>;
  closeDashboard: () => Promise<void>; // Minimizes to tray
  exitApp: () => Promise<void>;
  setStartAtLogin: (enable: boolean) => Promise<boolean>;
  getStartAtLogin: () => Promise<boolean>;
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) => void;
  getTamilAudioDataUri: (text: string) => Promise<string | null>;

  // Events (from Main to Renderer)
  onReminderTriggered: (callback: (prompt: ActivePromptInfo) => void) => () => void;
  onReminderStatusChanged: (callback: (info: { type: ReminderType; status: OccurrenceStatus }) => void) => () => void;
  onProgressUpdated: (callback: () => void) => () => void;
  onPreferencesUpdated: (callback: (prefs: UserPreferences) => void) => () => void;
}

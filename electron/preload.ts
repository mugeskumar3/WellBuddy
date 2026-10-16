import { contextBridge, ipcRenderer } from 'electron';
import {
  ActivePromptInfo,
  AvatarInfo,
  DailyProgressSummary,
  NextReminderInfo,
  OccurrenceStatus,
  ReminderSettings,
  ReminderType,
  UserPreferences,
  WaterEntry,
  WellBuddyAPI,
} from '../shared/types';

const api: WellBuddyAPI = {
  // Reminders
  getReminderSettings: () => ipcRenderer.invoke('wellbuddy:get-reminder-settings'),
  updateReminderSettings: (settings: ReminderSettings) =>
    ipcRenderer.invoke('wellbuddy:update-reminder-settings', settings),
  completeReminder: (occurrenceId: string, reminderType: ReminderType) =>
    ipcRenderer.invoke('wellbuddy:complete-reminder', occurrenceId, reminderType),
  snoozeReminder: (occurrenceId: string, reminderType: ReminderType, minutes?: number) =>
    ipcRenderer.invoke('wellbuddy:snooze-reminder', occurrenceId, reminderType, minutes),
  skipReminder: (occurrenceId: string, reminderType: ReminderType) =>
    ipcRenderer.invoke('wellbuddy:skip-reminder', occurrenceId, reminderType),
  getNextReminders: () => ipcRenderer.invoke('wellbuddy:get-next-reminders'),
  pauseReminders: (durationMinutes?: number) =>
    ipcRenderer.invoke('wellbuddy:pause-reminders', durationMinutes),
  resumeReminders: () => ipcRenderer.invoke('wellbuddy:resume-reminders'),

  // Water Tracking
  getWaterEntriesToday: () => ipcRenderer.invoke('wellbuddy:get-water-entries-today'),
  logWater: (amountMl: number) => ipcRenderer.invoke('wellbuddy:log-water', amountMl),
  deleteWaterEntry: (id: string) => ipcRenderer.invoke('wellbuddy:delete-water-entry', id),
  getDailyProgress: (dateStr?: string) =>
    ipcRenderer.invoke('wellbuddy:get-daily-progress', dateStr),
  getWeeklyHistory: () => ipcRenderer.invoke('wellbuddy:get-weekly-history'),

  // User Preferences
  getPreferences: () => ipcRenderer.invoke('wellbuddy:get-preferences'),
  updatePreferences: (updates: Partial<UserPreferences>) =>
    ipcRenderer.invoke('wellbuddy:update-preferences', updates),

  // Avatars
  getAvatars: () => ipcRenderer.invoke('wellbuddy:get-avatars'),
  uploadAvatar: (fileBuffer: Uint8Array, fileName: string, mimeType: string) =>
    ipcRenderer.invoke('wellbuddy:upload-avatar', fileBuffer, fileName, mimeType),
  selectAvatar: (avatarId: string) =>
    ipcRenderer.invoke('wellbuddy:select-avatar', avatarId),
  deleteCustomAvatar: (avatarId: string) =>
    ipcRenderer.invoke('wellbuddy:delete-custom-avatar', avatarId),

  // Window & System Controls
  showCompanion: () => ipcRenderer.invoke('wellbuddy:show-companion'),
  hideCompanion: () => ipcRenderer.invoke('wellbuddy:hide-companion'),
  setCompanionPosition: (pos: { x: number; y: number }) =>
    ipcRenderer.invoke('wellbuddy:set-companion-position', pos),
  getCompanionPosition: () => ipcRenderer.invoke('wellbuddy:get-companion-position'),
  openDashboard: () => ipcRenderer.invoke('wellbuddy:open-dashboard'),
  closeDashboard: () => ipcRenderer.invoke('wellbuddy:close-dashboard'),
  exitApp: () => ipcRenderer.invoke('wellbuddy:exit-app'),
  setStartAtLogin: (enable: boolean) =>
    ipcRenderer.invoke('wellbuddy:set-start-at-login', enable),
  getStartAtLogin: () => ipcRenderer.invoke('wellbuddy:get-start-at-login'),
  setIgnoreMouseEvents: (ignore: boolean, forward?: boolean) =>
    ipcRenderer.send('wellbuddy:set-ignore-mouse-events', ignore, forward),
  getTamilAudioDataUri: (text: string) =>
    ipcRenderer.invoke('wellbuddy:get-tamil-audio', text),

  // Events (from Main to Renderer)
  onReminderTriggered: (callback: (prompt: ActivePromptInfo) => void) => {
    const handler = (_event: any, prompt: ActivePromptInfo) => callback(prompt);
    ipcRenderer.on('wellbuddy:reminder-triggered', handler);
    return () => {
      ipcRenderer.removeListener('wellbuddy:reminder-triggered', handler);
    };
  },
  onReminderStatusChanged: (callback: (info: { type: ReminderType; status: OccurrenceStatus }) => void) => {
    const handler = (_event: any, info: { type: ReminderType; status: OccurrenceStatus }) => callback(info);
    ipcRenderer.on('wellbuddy:reminder-status-changed', handler);
    return () => {
      ipcRenderer.removeListener('wellbuddy:reminder-status-changed', handler);
    };
  },
  onProgressUpdated: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('wellbuddy:progress-updated', handler);
    return () => {
      ipcRenderer.removeListener('wellbuddy:progress-updated', handler);
    };
  },
  onPreferencesUpdated: (callback: (prefs: UserPreferences) => void) => {
    const handler = (_event: any, prefs: UserPreferences) => callback(prefs);
    ipcRenderer.on('wellbuddy:preferences-updated', handler);
    return () => {
      ipcRenderer.removeListener('wellbuddy:preferences-updated', handler);
    };
  },
};

contextBridge.exposeInMainWorld('wellBuddyAPI', api);

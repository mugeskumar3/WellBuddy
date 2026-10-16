import {
  AvatarInfo,
  DailyProgressSummary,
  NextReminderInfo,
  ReminderSettings,
  UserPreferences,
  WaterEntry,
  WellBuddyAPI,
} from '@shared/types';
import { BUILT_IN_AVATARS } from '@shared/built-in-avatars';

declare global {
  interface Window {
    wellBuddyAPI?: WellBuddyAPI;
  }
}

// Fallback in-memory implementation for browser development or component testing
class MockWellBuddyAPI implements WellBuddyAPI {
  private prefs: UserPreferences = {
    theme: 'light',
    soundEnabled: true,
    notificationsEnabled: true,
    startAtLogin: true,
    startMinimized: false,
    companionVisible: true,
    companionPosition: { x: 100, y: 100 },
    companionSize: 'standard',
    selectedAvatarId: 'water-drop',
    customAvatarPath: null,
    waterDailyGoalMl: 2000,
    remindersPaused: false,
    pauseUntil: null,
    language: 'en',
    ladyVoiceId: 'lily_cheerful',
  };

  private reminders: ReminderSettings[] = [
    {
      id: 'water',
      name: 'Hydration Break',
      enabled: true,
      intervalMinutes: 45,
      snoozeMinutes: 5,
      workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
      quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
      soundEnabled: true,
      updatedAt: Date.now(),
    },
    {
      id: 'standing',
      name: 'Stand & Move',
      enabled: true,
      intervalMinutes: 60,
      snoozeMinutes: 10,
      workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
      quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
      soundEnabled: true,
      updatedAt: Date.now(),
    },
    {
      id: 'eye_rest',
      name: '20-20-20 Eye Rest',
      enabled: true,
      intervalMinutes: 20,
      snoozeMinutes: 5,
      workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
      quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
      soundEnabled: true,
      updatedAt: Date.now(),
    },
    {
      id: 'stretching',
      name: 'Desk Stretch',
      enabled: true,
      intervalMinutes: 90,
      snoozeMinutes: 15,
      workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
      quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
      soundEnabled: true,
      updatedAt: Date.now(),
    },
  ];

  private waterEntries: WaterEntry[] = [
    { id: 'mock_1', amountMl: 250, loggedAt: Date.now() - 3600000, createdAt: Date.now() - 3600000 },
    { id: 'mock_2', amountMl: 500, loggedAt: Date.now() - 1800000, createdAt: Date.now() - 1800000 },
  ];

  async getReminderSettings(): Promise<ReminderSettings[]> {
    return [...this.reminders];
  }

  async updateReminderSettings(settings: ReminderSettings): Promise<boolean> {
    const idx = this.reminders.findIndex((r) => r.id === settings.id);
    if (idx >= 0) {
      this.reminders[idx] = { ...settings, updatedAt: Date.now() };
    }
    return true;
  }

  async completeReminder(): Promise<boolean> {
    return true;
  }

  async snoozeReminder(): Promise<boolean> {
    return true;
  }

  async skipReminder(): Promise<boolean> {
    return true;
  }

  async getNextReminders(): Promise<NextReminderInfo[]> {
    const now = Date.now();
    return this.reminders
      .filter((r) => r.enabled)
      .map((r) => ({
        type: r.id,
        name: r.name,
        dueAt: now + r.intervalMinutes * 60000,
        occurrenceId: `${r.id}_${now}`,
      }))
      .sort((a, b) => a.dueAt - b.dueAt);
  }

  async pauseReminders(durationMinutes?: number): Promise<boolean> {
    this.prefs.remindersPaused = true;
    this.prefs.pauseUntil = durationMinutes ? Date.now() + durationMinutes * 60000 : null;
    return true;
  }

  async resumeReminders(): Promise<boolean> {
    this.prefs.remindersPaused = false;
    this.prefs.pauseUntil = null;
    return true;
  }

  async getWaterEntriesToday(): Promise<WaterEntry[]> {
    return [...this.waterEntries];
  }

  async logWater(amountMl: number): Promise<WaterEntry> {
    const entry: WaterEntry = {
      id: `w_${Date.now()}`,
      amountMl,
      loggedAt: Date.now(),
      createdAt: Date.now(),
    };
    this.waterEntries.unshift(entry);
    return entry;
  }

  async deleteWaterEntry(id: string): Promise<boolean> {
    this.waterEntries = this.waterEntries.filter((w) => w.id !== id);
    return true;
  }

  async getDailyProgress(): Promise<DailyProgressSummary> {
    const totalWater = this.waterEntries.reduce((sum, w) => sum + w.amountMl, 0);
    return {
      date: new Date().toISOString().split('T')[0],
      waterTotalMl: totalWater,
      waterGoalMl: this.prefs.waterDailyGoalMl,
      completedActivities: 3,
      snoozedActivities: 1,
      skippedActivities: 0,
      byType: {
        water: { completed: 2, snoozed: 0, skipped: 0 },
        standing: { completed: 1, snoozed: 0, skipped: 0 },
        eye_rest: { completed: 0, snoozed: 1, skipped: 0 },
        stretching: { completed: 0, snoozed: 0, skipped: 0 },
      },
      recentLogs: [],
    };
  }

  async getWeeklyHistory() {
    return [
      { date: '2026-10-10', waterMl: 1750, completedActivities: 6 },
      { date: '2026-10-11', waterMl: 2000, completedActivities: 8 },
      { date: '2026-10-12', waterMl: 1500, completedActivities: 5 },
      { date: '2026-10-13', waterMl: 2250, completedActivities: 9 },
      { date: '2026-10-14', waterMl: 1800, completedActivities: 7 },
      { date: '2026-10-15', waterMl: 2100, completedActivities: 8 },
      { date: '2026-10-16', waterMl: 750, completedActivities: 3 },
    ];
  }

  async getPreferences(): Promise<UserPreferences> {
    return { ...this.prefs };
  }

  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    this.prefs = { ...this.prefs, ...updates };
    return { ...this.prefs };
  }

  async getAvatars(): Promise<AvatarInfo[]> {
    return [...BUILT_IN_AVATARS];
  }

  async uploadAvatar(_fileBuffer: Uint8Array, fileName: string): Promise<AvatarInfo> {
    const newAvatar: AvatarInfo = {
      id: `custom_${Date.now()}`,
      name: `Custom (${fileName})`,
      type: 'custom',
      description: 'Mock custom avatar',
      src: BUILT_IN_AVATARS[0].src,
    };
    this.prefs.selectedAvatarId = newAvatar.id;
    return newAvatar;
  }

  async selectAvatar(avatarId: string): Promise<boolean> {
    this.prefs.selectedAvatarId = avatarId;
    return true;
  }

  async deleteCustomAvatar(): Promise<boolean> {
    return true;
  }

  async showCompanion(): Promise<void> {
    this.prefs.companionVisible = true;
  }

  async hideCompanion(): Promise<void> {
    this.prefs.companionVisible = false;
  }

  async setCompanionPosition(pos: { x: number; y: number }): Promise<void> {
    this.prefs.companionPosition = pos;
  }

  async getCompanionPosition(): Promise<{ x: number; y: number }> {
    return this.prefs.companionPosition;
  }

  async openDashboard(): Promise<void> {}
  async closeDashboard(): Promise<void> {}
  async exitApp(): Promise<void> {}

  async setStartAtLogin(enable: boolean): Promise<boolean> {
    this.prefs.startAtLogin = enable;
    return true;
  }

  async getStartAtLogin(): Promise<boolean> {
    return this.prefs.startAtLogin;
  }

  setIgnoreMouseEvents(_ignore: boolean, _forward?: boolean): void {}
  async getTamilAudioDataUri(_text: string): Promise<string | null> {
    return null;
  }

  onReminderTriggered(): () => void {
    return () => {};
  }

  onReminderStatusChanged(): () => void {
    return () => {};
  }

  onProgressUpdated(): () => void {
    return () => {};
  }

  onPreferencesUpdated(): () => void {
    return () => {};
  }
}

// Single exported API bridge
export const api: WellBuddyAPI =
  typeof window !== 'undefined' && window.wellBuddyAPI
    ? window.wellBuddyAPI
    : new MockWellBuddyAPI();

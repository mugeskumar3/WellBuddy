import { ipcMain, BrowserWindow } from 'electron';
import { DatabaseService } from '../../database';
import { ReminderScheduler } from '../engine/scheduler';
import { AvatarManager } from '../avatars/avatar-manager';
import { StartupManager } from '../startup/startup-manager';
import { DashboardWindowManager } from '../windows/dashboard-window';
import { CompanionWindowManager } from '../windows/companion-window';
import { TrayManager } from '../tray/tray-manager';
import {
  reminderSettingsSchema,
  waterEntryInputSchema,
  userPreferencesSchema,
  reminderTypeSchema,
} from '../../shared/validation';
import {
  DailyProgressSummary,
  ReminderSettings,
  ReminderType,
  UserPreferences,
  WaterEntry,
} from '../../shared/types';

export function registerIpcHandlers(options: {
  dbService: DatabaseService;
  scheduler: ReminderScheduler;
  avatarManager: AvatarManager;
  startupManager: StartupManager;
  dashboardWindow: DashboardWindowManager;
  companionWindow: CompanionWindowManager;
  trayManager: TrayManager;
  onQuitApp: () => void;
}) {
  const {
    dbService,
    scheduler,
    avatarManager,
    startupManager,
    dashboardWindow,
    companionWindow,
    trayManager,
    onQuitApp,
  } = options;

  function broadcastToAllWindows(channel: string, ...args: any[]) {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) {
        win.webContents.send(channel, ...args);
      }
    }
  }

  // --- Reminders ---
  ipcMain.handle('wellbuddy:get-reminder-settings', async (): Promise<ReminderSettings[]> => {
    return dbService.reminders.getAll();
  });

  ipcMain.handle('wellbuddy:update-reminder-settings', async (_event, rawSettings: any): Promise<boolean> => {
    const validated = reminderSettingsSchema.parse(rawSettings);
    dbService.reminders.update(validated as ReminderSettings);
    scheduler.recalculate(validated.id as ReminderType, true);
    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:progress-updated');
    return true;
  });

  ipcMain.handle('wellbuddy:complete-reminder', async (_event, occurrenceId: string, reminderType: string): Promise<boolean> => {
    const type = reminderTypeSchema.parse(reminderType);
    const result = scheduler.completeOccurrence(occurrenceId, type);
    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:progress-updated');
    return result;
  });

  ipcMain.handle('wellbuddy:snooze-reminder', async (_event, occurrenceId: string, reminderType: string, minutes?: number): Promise<boolean> => {
    const type = reminderTypeSchema.parse(reminderType);
    const result = scheduler.snoozeOccurrence(occurrenceId, type, minutes);
    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:progress-updated');
    return result;
  });

  ipcMain.handle('wellbuddy:skip-reminder', async (_event, occurrenceId: string, reminderType: string): Promise<boolean> => {
    const type = reminderTypeSchema.parse(reminderType);
    const result = scheduler.skipOccurrence(occurrenceId, type);
    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:progress-updated');
    return result;
  });

  ipcMain.handle('wellbuddy:get-next-reminders', async () => {
    return scheduler.getNextReminders();
  });

  ipcMain.handle('wellbuddy:pause-reminders', async (_event, durationMinutes?: number) => {
    scheduler.pause(durationMinutes);
    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:preferences-updated', dbService.preferences.getAll());
    return true;
  });

  ipcMain.handle('wellbuddy:resume-reminders', async () => {
    scheduler.resume();
    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:preferences-updated', dbService.preferences.getAll());
    return true;
  });

  // --- Water Tracking ---
  ipcMain.handle('wellbuddy:get-water-entries-today', async (): Promise<WaterEntry[]> => {
    return dbService.water.getTodayEntries();
  });

  ipcMain.handle('wellbuddy:log-water', async (_event, amountMl: number): Promise<WaterEntry> => {
    const validated = waterEntryInputSchema.parse({ amountMl });
    const now = Date.now();
    const entry: WaterEntry = {
      id: `water_${now}_${Math.random().toString(36).substring(2, 7)}`,
      amountMl: validated.amountMl,
      loggedAt: now,
      createdAt: now,
    };
    dbService.water.add(entry);
    broadcastToAllWindows('wellbuddy:progress-updated');
    return entry;
  });

  ipcMain.handle('wellbuddy:delete-water-entry', async (_event, id: string): Promise<boolean> => {
    const deleted = dbService.water.delete(id);
    if (deleted) {
      broadcastToAllWindows('wellbuddy:progress-updated');
    }
    return deleted;
  });

  ipcMain.handle('wellbuddy:get-daily-progress', async (): Promise<DailyProgressSummary> => {
    const now = Date.now();
    const todayStr = new Date(now).toISOString().split('T')[0];
    const waterTotalMl = dbService.water.getTodayTotal(now);
    const prefs = dbService.preferences.getAll();
    const activitySummary = dbService.activityLogs.getTodaySummary(now);

    return {
      date: todayStr,
      waterTotalMl,
      waterGoalMl: prefs.waterDailyGoalMl,
      completedActivities: activitySummary.completed,
      snoozedActivities: activitySummary.snoozed,
      skippedActivities: activitySummary.skipped,
      byType: activitySummary.byType,
      recentLogs: activitySummary.logs.slice(0, 20),
    };
  });

  ipcMain.handle('wellbuddy:get-weekly-history', async () => {
    const days = 7;
    const waterHistory = dbService.water.getDailyTotalsForDays(days);
    const now = Date.now();

    return waterHistory.map((w) => {
      const d = new Date(w.date);
      d.setHours(0, 0, 0, 0);
      const start = d.getTime();
      d.setHours(23, 59, 59, 999);
      const end = d.getTime();

      const logs = dbService.activityLogs.getForRange(start, end);
      const completedCount = logs.filter((l) => l.action === 'completed').length;

      return {
        date: w.date,
        waterMl: w.waterMl,
        completedActivities: completedCount,
      };
    });
  });

  // --- Preferences ---
  ipcMain.handle('wellbuddy:get-preferences', async (): Promise<UserPreferences> => {
    return dbService.preferences.getAll();
  });

  ipcMain.handle('wellbuddy:update-preferences', async (_event, updates: any): Promise<UserPreferences> => {
    const validated = userPreferencesSchema.parse(updates);
    const updated = dbService.preferences.update(validated as Partial<UserPreferences>);

    if (validated.startAtLogin !== undefined) {
      startupManager.setStartAtLogin(validated.startAtLogin);
    }

    if (validated.companionVisible !== undefined) {
      if (validated.companionVisible) {
        companionWindow.show();
      } else {
        companionWindow.hide();
      }
    }

    trayManager.updateMenu();
    broadcastToAllWindows('wellbuddy:preferences-updated', updated);
    return updated;
  });

  // --- Avatars ---
  ipcMain.handle('wellbuddy:get-avatars', async () => {
    return avatarManager.getAvatars();
  });

  ipcMain.handle('wellbuddy:upload-avatar', async (_event, fileBuffer: Uint8Array, fileName: string, mimeType: string) => {
    const avatar = avatarManager.saveUploadedAvatar(fileBuffer, fileName, mimeType);
    dbService.preferences.update({ selectedAvatarId: avatar.id });
    broadcastToAllWindows('wellbuddy:preferences-updated', dbService.preferences.getAll());
    return avatar;
  });

  ipcMain.handle('wellbuddy:select-avatar', async (_event, avatarId: string) => {
    dbService.preferences.update({ selectedAvatarId: avatarId });
    broadcastToAllWindows('wellbuddy:preferences-updated', dbService.preferences.getAll());
    return true;
  });

  ipcMain.handle('wellbuddy:delete-custom-avatar', async (_event, avatarId: string) => {
    const success = avatarManager.deleteAvatar(avatarId);
    if (success) {
      const prefs = dbService.preferences.getAll();
      if (prefs.selectedAvatarId === avatarId) {
        dbService.preferences.update({ selectedAvatarId: 'water-drop' });
      }
      broadcastToAllWindows('wellbuddy:preferences-updated', dbService.preferences.getAll());
    }
    return success;
  });

  // --- Windows & System ---
  ipcMain.handle('wellbuddy:show-companion', async () => {
    companionWindow.show();
    trayManager.updateMenu();
  });

  ipcMain.handle('wellbuddy:hide-companion', async () => {
    companionWindow.hide();
    trayManager.updateMenu();
  });

  ipcMain.handle('wellbuddy:set-companion-position', async (_event, pos: { x: number; y: number }) => {
    companionWindow.setPosition(pos);
  });

  ipcMain.handle('wellbuddy:get-companion-position', async () => {
    return companionWindow.getPosition();
  });

  ipcMain.handle('wellbuddy:open-dashboard', async () => {
    dashboardWindow.show();
  });

  ipcMain.handle('wellbuddy:close-dashboard', async () => {
    dashboardWindow.hide();
  });

  ipcMain.handle('wellbuddy:exit-app', async () => {
    onQuitApp();
  });

  ipcMain.handle('wellbuddy:set-start-at-login', async (_event, enable: boolean) => {
    return startupManager.setStartAtLogin(enable);
  });

  ipcMain.handle('wellbuddy:get-start-at-login', async () => {
    return startupManager.isStartAtLogin();
  });

  ipcMain.on('wellbuddy:set-ignore-mouse-events', (event, ignore: boolean, forward?: boolean) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && !win.isDestroyed()) {
      win.setIgnoreMouseEvents(ignore, forward ? { forward: true } : undefined);
    }
  });
}

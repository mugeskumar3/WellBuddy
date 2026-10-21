import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import { initDatabase } from '../database';
import { ReminderScheduler } from './engine/scheduler';
import { AvatarManager } from './avatars/avatar-manager';
import { StartupManager } from './startup/startup-manager';
import { NotificationManager } from './notifications/notification-manager';
import { DashboardWindowManager } from './windows/dashboard-window';
import { CompanionWindowManager } from './windows/companion-window';
import { TrayManager } from './tray/tray-manager';
import { registerIpcHandlers } from './ipc/handlers';
import { ActivePromptInfo } from '../shared/types';

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// Increase Chromium's max active WebGL contexts so all 3D model cards in the gallery render smoothly
app.commandLine.appendSwitch('max-active-webgl-contexts', '64');

let isQuitting = false;

async function bootstrap() {
  await app.whenReady();

  // Configure Content Security Policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' data: blob: https:;",
        ],
      },
    });
  });

  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'wellbuddy.db');
  const preloadPath = path.join(__dirname, 'preload.js');

  // 1. Initialize Database
  const dbService = initDatabase(dbPath);

  // 2. Initialize Avatar Manager
  const avatarManager = new AvatarManager(userDataPath);

  // 3. Initialize Windows Managers
  const dashboardWindow = new DashboardWindowManager(preloadPath);
  const companionWindow = new CompanionWindowManager(preloadPath, dbService);

  // 4. Initialize Notification Manager
  const notificationManager = new NotificationManager({
    onComplete: (occId) => {
      const occ = dbService.occurrences.getById(occId);
      if (occ) {
        scheduler.completeOccurrence(occId, occ.reminderId);
        trayManager.updateMenu();
      }
    },
    onSnooze: (occId) => {
      const occ = dbService.occurrences.getById(occId);
      if (occ) {
        scheduler.snoozeOccurrence(occId, occ.reminderId);
        trayManager.updateMenu();
      }
    },
    onClick: () => {
      dashboardWindow.show();
    },
  });

  // 5. Initialize Reminder Scheduler
  const scheduler = new ReminderScheduler(
    dbService,
    (prompt: ActivePromptInfo, soundEnabled: boolean) => {
      // Deliver native notification
      notificationManager.showReminderNotification(prompt, soundEnabled);

      // Broadcast to companion and dashboard windows
      for (const win of BrowserWindow.getAllWindows()) {
        if (!win.isDestroyed()) {
          win.webContents.send('wellbuddy:reminder-triggered', prompt);
        }
      }
    },
    (info) => {
      for (const win of BrowserWindow.getAllWindows()) {
        if (!win.isDestroyed()) {
          win.webContents.send('wellbuddy:reminder-status-changed', info);
        }
      }
      trayManager.updateMenu();
    }
  );

  // 6. Initialize Startup Manager
  const startupManager = new StartupManager(dbService);
  startupManager.initialize();

  // 7. Initialize System Tray
  const quitApplication = () => {
    isQuitting = true;
    dashboardWindow.setQuitting(true);
    scheduler.stop();
    trayManager.destroy();
    dbService.close();
    app.quit();
  };

  const trayManager = new TrayManager(dbService, scheduler, {
    onOpenDashboard: () => dashboardWindow.show(),
    onOpenSettings: () => {
      dashboardWindow.show();
      const win = dashboardWindow.getWindow();
      win?.webContents.send('wellbuddy:navigate-tab', 'settings');
    },
    onToggleCompanion: () => {
      const prefs = dbService.preferences.getAll();
      if (prefs.companionVisible) {
        companionWindow.hide();
      } else {
        companionWindow.show();
      }
      trayManager.updateMenu();
    },
    onQuit: quitApplication,
  });

  // 8. Register IPC Handlers
  registerIpcHandlers({
    dbService,
    scheduler,
    avatarManager,
    startupManager,
    dashboardWindow,
    companionWindow,
    trayManager,
    onQuitApp: quitApplication,
  });

  // 9. Initialize tray and windows
  trayManager.initialize();

  const prefs = dbService.preferences.getAll();
  const launchHidden = process.argv.includes('--hidden') || prefs.startMinimized;

  // Always initialize companion window so it is ready
  companionWindow.create();

  if (!launchHidden) {
    dashboardWindow.show();
  }

  // 10. Start reminder scheduler
  scheduler.start();

  // Handle second instance activation
  app.on('second-instance', () => {
    dashboardWindow.show();
  });

  // Prevent unexpected window navigation
  app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-navigate', (event, navigationUrl) => {
      const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
      if (!isDev && !navigationUrl.startsWith('file://')) {
        event.preventDefault();
      }
    });
  });

  app.on('before-quit', () => {
    isQuitting = true;
    dashboardWindow.setQuitting(true);
    scheduler.stop();
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start WellBuddy:', err);
});

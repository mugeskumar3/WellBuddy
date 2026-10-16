import { Tray, Menu, nativeImage, app } from 'electron';
import { ReminderScheduler } from '../engine/scheduler';
import { DatabaseService } from '../../database';

export interface TrayCallbacks {
  onOpenDashboard: () => void;
  onOpenSettings: () => void;
  onToggleCompanion: () => void;
  onQuit: () => void;
}

export class TrayManager {
  private tray: Tray | null = null;

  constructor(
    private dbService: DatabaseService,
    private scheduler: ReminderScheduler,
    private callbacks: TrayCallbacks
  ) {}

  initialize(): void {
    if (this.tray) return;

    // Create crisp 16x16 / 32x32 tray icon from SVG data URL
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="#0d9488"/>
        <path d="M16 6 C16 6 9 14.5 9 19.5 C9 23.36 12.14 26.5 16 26.5 C19.86 26.5 23 23.36 23 19.5 C23 14.5 16 6 16 6 Z" fill="#ffffff"/>
      </svg>
    `;
    const iconDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`;
    const icon = nativeImage.createFromDataURL(iconDataUrl);

    this.tray = new Tray(icon);
    this.tray.setToolTip('WellBuddy — Desktop Wellness Companion');

    this.tray.on('click', () => {
      this.callbacks.onOpenDashboard();
    });

    this.updateMenu();
  }

  updateMenu(): void {
    if (!this.tray) return;

    const prefs = this.dbService.preferences.getAll();
    const isPaused = prefs.remindersPaused;
    const isCompanionVisible = prefs.companionVisible;

    // Get next reminder summary
    const nextList = this.scheduler.getNextReminders();
    let nextReminderText = 'No active reminders';
    if (nextList.length > 0) {
      const next = nextList[0];
      const diffMin = Math.max(0, Math.round((next.dueAt - Date.now()) / 60000));
      nextReminderText = `Next: ${next.name} in ${diffMin}m`;
    }

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'WellBuddy Companion',
        enabled: false,
      },
      {
        label: nextReminderText,
        enabled: false,
      },
      { type: 'separator' },
      {
        label: 'Open Dashboard',
        click: () => this.callbacks.onOpenDashboard(),
      },
      {
        label: isCompanionVisible ? 'Hide Companion' : 'Show Companion',
        click: () => this.callbacks.onToggleCompanion(),
      },
      {
        label: isPaused ? 'Resume Reminders' : 'Pause Reminders (1 Hour)',
        click: () => {
          if (isPaused) {
            this.scheduler.resume();
          } else {
            this.scheduler.pause(60);
          }
          this.updateMenu();
        },
      },
      {
        label: 'Settings',
        click: () => this.callbacks.onOpenSettings(),
      },
      { type: 'separator' },
      {
        label: 'Exit WellBuddy',
        click: () => this.callbacks.onQuit(),
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}

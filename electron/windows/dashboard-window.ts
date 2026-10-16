import { BrowserWindow, app } from 'electron';
import path from 'path';

export class DashboardWindowManager {
  private window: BrowserWindow | null = null;
  private isQuitting = false;

  constructor(private preloadPath: string) {}

  setQuitting(quitting: boolean): void {
    this.isQuitting = quitting;
  }

  createOrShow(): BrowserWindow {
    if (this.window && !this.window.isDestroyed()) {
      if (this.window.isMinimized()) this.window.restore();
      this.window.show();
      this.window.focus();
      return this.window;
    }

    this.window = new BrowserWindow({
      width: 1040,
      height: 720,
      minWidth: 800,
      minHeight: 600,
      title: 'WellBuddy — Desktop Wellness Companion',
      backgroundColor: '#f8fafc',
      show: false,
      webPreferences: {
        preload: this.preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    // Handle close button -> minimize to tray unless app is quitting
    this.window.on('close', (event) => {
      if (!this.isQuitting) {
        event.preventDefault();
        this.window?.hide();
      }
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    this.window.once('ready-to-show', () => {
      this.window?.show();
    });

    // Load URL or local index.html
    const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
    if (isDev && process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      const indexPath = path.join(app.getAppPath(), 'dist/index.html');
      this.window.loadFile(indexPath);
    }

    return this.window;
  }

  getWindow(): BrowserWindow | null {
    return this.window && !this.window.isDestroyed() ? this.window : null;
  }

  hide(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.hide();
    }
  }

  show(): void {
    this.createOrShow();
  }
}

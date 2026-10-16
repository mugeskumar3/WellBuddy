import { BrowserWindow, screen, app } from 'electron';
import path from 'path';
import { DatabaseService } from '../../database';

export class CompanionWindowManager {
  private window: BrowserWindow | null = null;

  constructor(
    private preloadPath: string,
    private dbService: DatabaseService
  ) {}

  create(): BrowserWindow {
    if (this.window && !this.window.isDestroyed()) {
      return this.window;
    }

    const prefs = this.dbService.preferences.getAll();
    const savedPos = prefs.companionPosition || { x: 100, y: 100 };

    // Screen boundary validation
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    const winWidth = 260;
    const winHeight = 280;

    let posX = Math.max(0, Math.min(savedPos.x, screenWidth - winWidth));
    let posY = Math.max(0, Math.min(savedPos.y, screenHeight - winHeight));

    // Default to bottom-right corner if zero/invalid
    if (posX === 0 && posY === 0) {
      posX = screenWidth - winWidth - 30;
      posY = screenHeight - winHeight - 30;
    }

    this.window = new BrowserWindow({
      width: winWidth,
      height: winHeight,
      x: posX,
      y: posY,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      resizable: false,
      skipTaskbar: true,
      hasShadow: false,
      show: false,
      webPreferences: {
        preload: this.preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    // Save position on move
    this.window.on('moved', () => {
      if (this.window && !this.window.isDestroyed()) {
        const [x, y] = this.window.getPosition();
        this.dbService.preferences.update({
          companionPosition: { x, y },
        });
      }
    });

    this.window.on('closed', () => {
      this.window = null;
    });

    // Load companion view with query param
    const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
    if (isDev && process.env.VITE_DEV_SERVER_URL) {
      this.window.loadURL(`${process.env.VITE_DEV_SERVER_URL}?window=companion`);
    } else {
      const indexPath = path.join(app.getAppPath(), 'dist/index.html');
      this.window.loadFile(indexPath, { query: { window: 'companion' } });
    }

    if (prefs.companionVisible) {
      this.window.once('ready-to-show', () => {
        this.window?.showInactive();
      });
    }

    return this.window;
  }

  show(): void {
    if (!this.window || this.window.isDestroyed()) {
      this.create();
    }
    this.window?.showInactive();
    this.dbService.preferences.update({ companionVisible: true });
  }

  hide(): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.hide();
    }
    this.dbService.preferences.update({ companionVisible: false });
  }

  setPosition(pos: { x: number; y: number }): void {
    if (this.window && !this.window.isDestroyed()) {
      this.window.setPosition(pos.x, pos.y);
    }
    this.dbService.preferences.update({ companionPosition: pos });
  }

  getPosition(): { x: number; y: number } {
    if (this.window && !this.window.isDestroyed()) {
      const [x, y] = this.window.getPosition();
      return { x, y };
    }
    return this.dbService.preferences.getAll().companionPosition;
  }

  getWindow(): BrowserWindow | null {
    return this.window && !this.window.isDestroyed() ? this.window : null;
  }
}

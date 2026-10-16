import { app } from 'electron';
import { DatabaseService } from '../../database';

export class StartupManager {
  constructor(private dbService: DatabaseService) {}

  /**
   * Initializes startup integration on app start.
   * If this is first launch, default to enabled (openAtLogin = true).
   * Otherwise, respect user's persisted preference.
   */
  initialize(): void {
    try {
      const prefs = this.dbService.preferences.getAll();
      const isStartAtLogin = prefs.startAtLogin;

      // Only attempt in production or when packaged / supported
      this.applySetting(isStartAtLogin);
    } catch (err) {
      console.warn('Could not initialize Windows login item settings:', err);
    }
  }

  /**
   * Sets the startup state and persists it.
   */
  setStartAtLogin(enabled: boolean): boolean {
    try {
      this.applySetting(enabled);
      this.dbService.preferences.update({ startAtLogin: enabled });
      return true;
    } catch (err) {
      console.error('Failed to set login item settings:', err);
      return false;
    }
  }

  /**
   * Reads current startup state from Electron and persisted settings.
   */
  isStartAtLogin(): boolean {
    try {
      if (app && typeof app.getLoginItemSettings === 'function') {
        const settings = app.getLoginItemSettings();
        return settings.openAtLogin;
      }
    } catch {
      // fallback to database
    }
    const prefs = this.dbService.preferences.getAll();
    return prefs.startAtLogin;
  }

  private applySetting(enabled: boolean): void {
    if (app && typeof app.setLoginItemSettings === 'function') {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath,
        args: ['--hidden'],
      });
    }
  }
}

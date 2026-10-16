import { Notification } from 'electron';
import { ActivePromptInfo } from '../../shared/types';

export interface NotificationActionCallbacks {
  onComplete: (occurrenceId: string) => void;
  onSnooze: (occurrenceId: string) => void;
  onClick: () => void;
}

export class NotificationManager {
  constructor(private callbacks: NotificationActionCallbacks) {}

  showReminderNotification(prompt: ActivePromptInfo, soundEnabled: boolean): void {
    if (!Notification.isSupported()) {
      console.warn('Native notifications not supported on this platform');
      return;
    }

    try {
      const notif = new Notification({
        title: prompt.title,
        body: prompt.message,
        silent: !soundEnabled,
        urgency: 'normal',
        actions: [
          { type: 'button', text: 'Done ✓' },
          { type: 'button', text: 'Snooze 5m ⏱️' },
        ],
      });

      notif.on('action', (_event, index) => {
        if (index === 0) {
          this.callbacks.onComplete(prompt.occurrenceId);
        } else if (index === 1) {
          this.callbacks.onSnooze(prompt.occurrenceId);
        }
      });

      notif.on('click', () => {
        this.callbacks.onClick();
      });

      notif.show();
    } catch (err) {
      console.error('Failed to show native desktop notification:', err);
    }
  }
}

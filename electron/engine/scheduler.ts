import { DatabaseService } from '../../database';
import {
  ActivePromptInfo,
  NextReminderInfo,
  OccurrenceStatus,
  ReminderOccurrence,
  ReminderType,
} from '../../shared/types';
import { getNextEligibleTime } from './time-utils';
import { getReminderContent } from './content-catalog';

export type NotificationDeliverer = (prompt: ActivePromptInfo, soundEnabled: boolean) => void;
export type StatusListener = (info: { type: ReminderType; status: OccurrenceStatus }) => void;

export class ReminderScheduler {
  private timerMap = new Map<ReminderType, NodeJS.Timeout>();
  private activePrompts = new Map<string, ActivePromptInfo>();
  private lastDeliveryTimestamp = 0;
  private isRunning = false;

  constructor(
    private dbService: DatabaseService,
    private onDeliverNotification: NotificationDeliverer,
    private onStatusChanged?: StatusListener
  ) {}

  /**
   * Initializes the scheduler on application launch or system resume.
   * Restores schedules from the database and runs overdue recovery.
   */
  start(): void {
    this.isRunning = true;
    this.recoverOverdueOccurrences();
    this.recalculateAll();
  }

  /**
   * Stops all active timers (e.g. during application quit).
   */
  stop(): void {
    this.isRunning = false;
    for (const [_, timer] of this.timerMap) {
      clearTimeout(timer);
    }
    this.timerMap.clear();
  }

  /**
   * Overdue recovery policy:
   * Marks occurrences older than 15 minutes as 'skipped' in bulk to prevent notification flood.
   */
  private recoverOverdueOccurrences(): void {
    const now = Date.now();
    const fifteenMinutesAgo = now - 15 * 60 * 1000;
    this.dbService.occurrences.bulkSkipOverdue(fifteenMinutesAgo);
  }

  /**
   * Recalculates schedules for all 4 reminder types independently.
   */
  recalculateAll(): void {
    const allSettings = this.dbService.reminders.getAll();
    for (const settings of allSettings) {
      this.recalculate(settings.id);
    }
  }

  /**
   * Recalculates the schedule for a single reminder type.
   * If resetFuture is true, any pending un-delivered future occurrence is rescheduled.
   */
  recalculate(reminderType: ReminderType, resetFuture = false): void {
    // 1. Clear existing timer for this type
    const existingTimer = this.timerMap.get(reminderType);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.timerMap.delete(reminderType);
    }

    if (!this.isRunning) return;

    // 2. Check preferences (pause state)
    const prefs = this.dbService.preferences.getAll();
    if (prefs.remindersPaused) {
      if (prefs.pauseUntil && Date.now() >= prefs.pauseUntil) {
        // Pause period expired, automatically unpause
        this.dbService.preferences.update({ remindersPaused: false, pauseUntil: null });
      } else {
        return; // Reminders currently paused
      }
    }

    // 3. Check settings
    const settings = this.dbService.reminders.getById(reminderType);
    if (!settings || !settings.enabled) {
      return; // Disabled
    }

    if (resetFuture) {
      this.dbService.occurrences.cancelPendingScheduled(reminderType);
    }

    const now = Date.now();

    // 4. Check for an active pending or snoozed occurrence
    let occurrence = this.dbService.occurrences.getPendingOrSnoozed(reminderType);

    if (occurrence) {
      // Check if snoozed
      if (occurrence.status === 'snoozed' && occurrence.snoozedUntil) {
        if (occurrence.snoozedUntil <= now) {
          // Snooze expired, trigger delivery
          this.triggerOccurrence(occurrence);
          return;
        } else {
          // Schedule timer for snoozed expiration
          this.scheduleTimer(occurrence.id, reminderType, occurrence.snoozedUntil);
          return;
        }
      }

      // If scheduled occurrence is already overdue within 15 min catch-up window
      if (occurrence.scheduledAt <= now && occurrence.status === 'scheduled') {
        this.triggerOccurrence(occurrence);
        return;
      }

      // If scheduled in the future
      if (occurrence.scheduledAt > now && occurrence.status === 'scheduled') {
        this.scheduleTimer(occurrence.id, reminderType, occurrence.scheduledAt);
        return;
      }
    }

    // 5. No pending occurrence: calculate next eligible due time
    const targetTime = getNextEligibleTime(
      now,
      settings.intervalMinutes,
      settings.workingHours,
      settings.quietHours
    );

    const occurrenceId = `${reminderType}_${targetTime}`;
    const newOccurrence: ReminderOccurrence = {
      id: occurrenceId,
      reminderId: reminderType,
      scheduledAt: targetTime,
      status: 'scheduled',
      snoozedUntil: null,
      deliveredAt: null,
      completedAt: null,
      createdAt: now,
    };

    this.dbService.occurrences.create(newOccurrence);
    this.scheduleTimer(occurrenceId, reminderType, targetTime);
  }

  /**
   * Sets a timer for the scheduled target time.
   */
  private scheduleTimer(occurrenceId: string, reminderType: ReminderType, targetTimeMs: number): void {
    const now = Date.now();
    const delay = Math.max(0, targetTimeMs - now);

    const timer = setTimeout(() => {
      const occ = this.dbService.occurrences.getById(occurrenceId);
      if (occ && (occ.status === 'scheduled' || occ.status === 'snoozed')) {
        this.triggerOccurrence(occ);
      }
    }, delay);

    this.timerMap.set(reminderType, timer);
  }

  /**
   * Delivers an occurrence with anti-storm pacing and idempotency checks.
   */
  private triggerOccurrence(occurrence: ReminderOccurrence): void {
    const now = Date.now();

    // Idempotency check: if already completed or skipped, do not deliver
    if (occurrence.status === 'completed' || occurrence.status === 'skipped') {
      return;
    }

    // Check pause state
    const prefs = this.dbService.preferences.getAll();
    if (prefs.remindersPaused) {
      return;
    }

    const settings = this.dbService.reminders.getById(occurrence.reminderId);
    if (!settings || !settings.enabled) {
      return;
    }

    // Anti-storm delivery: Space notifications by at least 2.5 seconds
    const timeSinceLastDelivery = now - this.lastDeliveryTimestamp;
    const minSpacingMs = 2500;
    if (timeSinceLastDelivery < minSpacingMs) {
      const waitTime = minSpacingMs - timeSinceLastDelivery;
      setTimeout(() => {
        this.triggerOccurrence(occurrence);
      }, waitTime);
      return;
    }

    this.lastDeliveryTimestamp = Date.now();

    // Transition status to delivered
    this.dbService.occurrences.updateStatus(occurrence.id, 'delivered', {
      deliveredAt: now,
    });

    // Build prompt information
    const content = getReminderContent(occurrence.reminderId, Math.floor(Math.random() * 3));
    const prompt: ActivePromptInfo = {
      occurrenceId: occurrence.id,
      type: occurrence.reminderId,
      title: content.title,
      message: content.message,
      suggestedAction: content.suggestedAction,
      options: content.options,
      dueAt: now,
    };

    this.activePrompts.set(occurrence.id, prompt);

    // Deliver notification
    if (prefs.notificationsEnabled) {
      this.onDeliverNotification(prompt, settings.soundEnabled && prefs.soundEnabled);
    }

    if (this.onStatusChanged) {
      this.onStatusChanged({ type: occurrence.reminderId, status: 'delivered' });
    }
  }

  /**
   * Action: Mark reminder Done / Completed.
   */
  completeOccurrence(occurrenceId: string, reminderType: ReminderType): boolean {
    const occ = this.dbService.occurrences.getById(occurrenceId);
    if (!occ) return false;

    // Idempotency: cannot complete twice
    if (occ.status === 'completed') return true;

    const now = Date.now();
    const updated = this.dbService.occurrences.updateStatus(occurrenceId, 'completed', {
      completedAt: now,
    });

    if (updated) {
      this.activePrompts.delete(occurrenceId);

      // Log activity
      this.dbService.activityLogs.add({
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        reminderType,
        occurrenceId,
        action: 'completed',
        occurredAt: now,
      });

      if (this.onStatusChanged) {
        this.onStatusChanged({ type: reminderType, status: 'completed' });
      }

      // Schedule next occurrence
      this.recalculate(reminderType);
      return true;
    }

    return false;
  }

  /**
   * Action: Snooze reminder occurrence.
   */
  snoozeOccurrence(occurrenceId: string, reminderType: ReminderType, customMinutes?: number): boolean {
    const occ = this.dbService.occurrences.getById(occurrenceId);
    if (!occ || occ.status === 'completed') return false;

    const settings = this.dbService.reminders.getById(reminderType);
    const snoozeMinutes = customMinutes ?? settings?.snoozeMinutes ?? 5;
    const now = Date.now();
    const snoozedUntil = now + snoozeMinutes * 60 * 1000;

    const updated = this.dbService.occurrences.updateStatus(occurrenceId, 'snoozed', {
      snoozedUntil,
    });

    if (updated) {
      this.activePrompts.delete(occurrenceId);

      // Log snooze
      this.dbService.activityLogs.add({
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        reminderType,
        occurrenceId,
        action: 'snoozed',
        occurredAt: now,
      });

      if (this.onStatusChanged) {
        this.onStatusChanged({ type: reminderType, status: 'snoozed' });
      }

      // Set snooze timer
      this.scheduleTimer(occurrenceId, reminderType, snoozedUntil);
      return true;
    }

    return false;
  }

  /**
   * Action: Skip reminder occurrence.
   */
  skipOccurrence(occurrenceId: string, reminderType: ReminderType): boolean {
    const occ = this.dbService.occurrences.getById(occurrenceId);
    if (!occ || occ.status === 'completed') return false;

    const now = Date.now();
    const updated = this.dbService.occurrences.updateStatus(occurrenceId, 'skipped');

    if (updated) {
      this.activePrompts.delete(occurrenceId);

      // Log skip
      this.dbService.activityLogs.add({
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        reminderType,
        occurrenceId,
        action: 'skipped',
        occurredAt: now,
      });

      if (this.onStatusChanged) {
        this.onStatusChanged({ type: reminderType, status: 'skipped' });
      }

      // Schedule next occurrence
      this.recalculate(reminderType);
      return true;
    }

    return false;
  }

  /**
   * Pauses all reminders.
   */
  pause(durationMinutes?: number): void {
    const now = Date.now();
    const pauseUntil = durationMinutes ? now + durationMinutes * 60 * 1000 : null;

    this.dbService.preferences.update({
      remindersPaused: true,
      pauseUntil,
    });

    for (const [_, timer] of this.timerMap) {
      clearTimeout(timer);
    }
    this.timerMap.clear();
  }

  /**
   * Resumes reminders.
   */
  resume(): void {
    this.dbService.preferences.update({
      remindersPaused: false,
      pauseUntil: null,
    });

    this.recalculateAll();
  }

  /**
   * Gets list of upcoming next reminders.
   */
  getNextReminders(): NextReminderInfo[] {
    const results: NextReminderInfo[] = [];
    const settings = this.dbService.reminders.getAll().filter((s) => s.enabled);

    for (const s of settings) {
      const occ = this.dbService.occurrences.getPendingOrSnoozed(s.id);
      if (occ) {
        const due = occ.status === 'snoozed' && occ.snoozedUntil ? occ.snoozedUntil : occ.scheduledAt;
        results.push({
          type: s.id,
          name: s.name,
          dueAt: due,
          occurrenceId: occ.id,
        });
      }
    }

    results.sort((a, b) => a.dueAt - b.dueAt);
    return results;
  }

  getActivePrompts(): ActivePromptInfo[] {
    return Array.from(this.activePrompts.values());
  }
}

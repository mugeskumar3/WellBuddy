import { z } from 'zod';

export const reminderTypeSchema = z.enum(['water', 'standing', 'eye_rest', 'stretching']);

export const workingHoursSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format (HH:mm)'),
  activeDays: z.array(z.number().int().min(0).max(6)).min(1, 'At least one active day must be selected'),
});

export const quietHoursSchema = z.object({
  enabled: z.boolean(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid quiet start time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid quiet end time format (HH:mm)'),
});

export const reminderSettingsSchema = z.object({
  id: reminderTypeSchema,
  name: z.string().min(1),
  enabled: z.boolean(),
  intervalMinutes: z.number().int().min(1, 'Interval must be at least 1 minute').max(1440, 'Interval cannot exceed 24 hours'),
  snoozeMinutes: z.number().int().min(1, 'Snooze must be at least 1 minute').max(120, 'Snooze cannot exceed 2 hours'),
  workingHours: workingHoursSchema,
  quietHours: quietHoursSchema,
  soundEnabled: z.boolean(),
  updatedAt: z.number().optional(),
});

export const waterEntryInputSchema = z.object({
  amountMl: z.number().int().min(10, 'Amount must be at least 10 ml').max(5000, 'Amount cannot exceed 5000 ml'),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  soundEnabled: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  startAtLogin: z.boolean().optional(),
  startMinimized: z.boolean().optional(),
  companionVisible: z.boolean().optional(),
  companionPosition: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  companionSize: z.enum(['compact', 'standard', 'large']).optional(),
  selectedAvatarId: z.string().optional(),
  customAvatarPath: z.string().nullable().optional(),
  waterDailyGoalMl: z.number().int().min(500).max(10000).optional(),
  remindersPaused: z.boolean().optional(),
  pauseUntil: z.number().nullable().optional(),
});

export const avatarUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']),
  sizeBytes: z.number().max(5 * 1024 * 1024, 'File size must not exceed 5MB'),
});

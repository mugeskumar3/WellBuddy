import { describe, it, expect } from 'vitest';
import {
  reminderSettingsSchema,
  waterEntryInputSchema,
  avatarUploadSchema,
  userPreferencesSchema,
} from '../../shared/validation';

describe('Validation Schemas (Zod)', () => {
  it('validates correct reminder settings', () => {
    const valid = {
      id: 'water',
      name: 'Hydration',
      enabled: true,
      intervalMinutes: 30,
      snoozeMinutes: 5,
      workingHours: {
        startTime: '09:00',
        endTime: '17:30',
        activeDays: [1, 2, 3, 4, 5],
      },
      quietHours: {
        enabled: true,
        startTime: '12:00',
        endTime: '13:00',
      },
      soundEnabled: true,
    };

    const parsed = reminderSettingsSchema.parse(valid);
    expect(parsed.id).toBe('water');
    expect(parsed.intervalMinutes).toBe(30);
  });

  it('rejects invalid reminder intervals', () => {
    const invalidZero = {
      id: 'water',
      name: 'Hydration',
      enabled: true,
      intervalMinutes: 0, // Invalid: min is 1
      snoozeMinutes: 5,
      workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1] },
      quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
      soundEnabled: true,
    };

    expect(() => reminderSettingsSchema.parse(invalidZero)).toThrow();

    const invalidExcessive = {
      ...invalidZero,
      intervalMinutes: 2000, // Invalid: max is 1440
    };
    expect(() => reminderSettingsSchema.parse(invalidExcessive)).toThrow();
  });

  it('rejects invalid time formats and empty active days', () => {
    const invalidTime = {
      id: 'standing',
      name: 'Stand',
      enabled: true,
      intervalMinutes: 60,
      snoozeMinutes: 5,
      workingHours: { startTime: '25:99', endTime: '18:00', activeDays: [1] },
      quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
      soundEnabled: true,
    };
    expect(() => reminderSettingsSchema.parse(invalidTime)).toThrow();

    const emptyDays = {
      ...invalidTime,
      workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [] }, // Invalid: min 1
    };
    expect(() => reminderSettingsSchema.parse(emptyDays)).toThrow();
  });

  it('validates water entry amounts and rejects unreasonable inputs', () => {
    expect(waterEntryInputSchema.parse({ amountMl: 250 }).amountMl).toBe(250);
    expect(waterEntryInputSchema.parse({ amountMl: 10 }).amountMl).toBe(10);

    // Below min
    expect(() => waterEntryInputSchema.parse({ amountMl: 5 })).toThrow();
    // Above max
    expect(() => waterEntryInputSchema.parse({ amountMl: 6000 })).toThrow();
    // Non-integer
    expect(() => waterEntryInputSchema.parse({ amountMl: 250.5 })).toThrow();
  });

  it('validates avatar upload files and enforces size and type constraints', () => {
    expect(() =>
      avatarUploadSchema.parse({
        fileName: 'avatar.png',
        mimeType: 'image/png',
        sizeBytes: 2 * 1024 * 1024,
      })
    ).not.toThrow();

    // Rejects executable or text files
    expect(() =>
      avatarUploadSchema.parse({
        fileName: 'virus.exe',
        mimeType: 'application/x-msdownload' as any,
        sizeBytes: 1024,
      })
    ).toThrow();

    // Rejects file > 5MB
    expect(() =>
      avatarUploadSchema.parse({
        fileName: 'huge.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 6 * 1024 * 1024,
      })
    ).toThrow();
  });

  it('validates user preferences and partial updates', () => {
    const valid = userPreferencesSchema.parse({
      theme: 'dark',
      soundEnabled: false,
      waterDailyGoalMl: 2500,
      companionPosition: { x: 200, y: 150 },
      companionSize: 'large',
    });

    expect(valid.theme).toBe('dark');
    expect(valid.waterDailyGoalMl).toBe(2500);
    expect(valid.companionSize).toBe('large');

    // Invalid theme
    expect(() => userPreferencesSchema.parse({ theme: 'neon' as any })).toThrow();
  });
});

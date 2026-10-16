import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OverviewView } from '../../src/features/dashboard/OverviewView';
import { WaterView } from '../../src/features/water/WaterView';
import { RemindersView } from '../../src/features/reminders/RemindersView';
import { CompanionApp } from '../../src/components/CompanionApp';
import { ReminderSettings } from '../../shared/types';
import { api } from '../../src/services/api';

const mockReminders: ReminderSettings[] = [
  {
    id: 'water',
    name: 'Hydration Break',
    enabled: true,
    intervalMinutes: 45,
    snoozeMinutes: 5,
    workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
    quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
    soundEnabled: true,
    updatedAt: Date.now(),
  },
  {
    id: 'standing',
    name: 'Stand & Move',
    enabled: true,
    intervalMinutes: 60,
    snoozeMinutes: 10,
    workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
    quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
    soundEnabled: true,
    updatedAt: Date.now(),
  },
  {
    id: 'eye_rest',
    name: '20-20-20 Eye Rest',
    enabled: true,
    intervalMinutes: 20,
    snoozeMinutes: 5,
    workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
    quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
    soundEnabled: true,
    updatedAt: Date.now(),
  },
  {
    id: 'stretching',
    name: 'Desk Stretch',
    enabled: true,
    intervalMinutes: 90,
    snoozeMinutes: 15,
    workingHours: { startTime: '09:00', endTime: '18:00', activeDays: [1, 2, 3, 4, 5] },
    quietHours: { enabled: false, startTime: '12:00', endTime: '13:00' },
    soundEnabled: true,
    updatedAt: Date.now(),
  },
];

describe('UI Component Tests', () => {
  it('renders OverviewView with habit metrics and reminder cards', () => {
    const onNavigateTab = vi.fn();
    const onRefresh = vi.fn();

    render(
      <OverviewView
        progress={{
          date: '2026-10-16',
          waterTotalMl: 750,
          waterGoalMl: 2000,
          completedActivities: 4,
          snoozedActivities: 1,
          skippedActivities: 0,
          byType: {
            water: { completed: 2, snoozed: 0, skipped: 0 },
            standing: { completed: 1, snoozed: 0, skipped: 0 },
            eye_rest: { completed: 1, snoozed: 1, skipped: 0 },
            stretching: { completed: 0, snoozed: 0, skipped: 0 },
          },
          recentLogs: [],
        }}
        reminders={mockReminders}
        nextReminders={[
          {
            type: 'eye_rest',
            name: '20-20-20 Eye Rest',
            dueAt: Date.now() + 10 * 60000,
            occurrenceId: 'eye_rest_test',
          },
        ]}
        prefs={{
          theme: 'light',
          soundEnabled: true,
          notificationsEnabled: true,
          startAtLogin: true,
          startMinimized: false,
          companionVisible: true,
          companionPosition: { x: 100, y: 100 },
          companionSize: 'standard',
          selectedAvatarId: 'water-drop',
          customAvatarPath: null,
          waterDailyGoalMl: 2000,
          remindersPaused: false,
          pauseUntil: null,
        }}
        onNavigateTab={onNavigateTab}
        onRefresh={onRefresh}
      />
    );

    expect(screen.getByText('Next Upcoming Activity')).toBeInTheDocument();
    expect(screen.getAllByText('20-20-20 Eye Rest').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Water Intake')).toBeInTheDocument();
    expect(screen.getByText('750 ml logged')).toBeInTheDocument();
    expect(screen.getByText('Completed Activities')).toBeInTheDocument();
  });

  it('renders WaterView and allows logging water via quick button', async () => {
    const onRefresh = vi.fn();
    const logSpy = vi.spyOn(api, 'logWater');

    render(<WaterView onRefresh={onRefresh} />);

    expect(screen.getByText('Hydration Tracker')).toBeInTheDocument();
    const add250Btn = screen.getByText('+250 ml');
    expect(add250Btn).toBeInTheDocument();

    fireEvent.click(add250Btn);

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(250);
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  it('renders RemindersView with interval controls and working hours', () => {
    const onRefresh = vi.fn();
    render(<RemindersView reminders={mockReminders} onRefresh={onRefresh} />);

    expect(screen.getByText(/Hydration Break Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Reminder Interval/i)).toBeInTheDocument();
    expect(screen.getByText(/Snooze Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Working Hours Window/i)).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('renders CompanionApp mascot and displays action buttons when prompt triggers', async () => {
    let triggerCb: any;
    vi.spyOn(api, 'onReminderTriggered').mockImplementation((cb) => {
      triggerCb = cb;
      return () => {};
    });

    render(<CompanionApp />);

    // Check mascot image is present
    const mascotImg = screen.getByAltText(/Aqua the Droplet/i);
    expect(mascotImg).toBeInTheDocument();

    // Simulate reminder delivery event to companion
    fireEvent.click(mascotImg);

    if (triggerCb) {
      triggerCb({
        occurrenceId: 'water_test_occ',
        type: 'water',
        title: 'Hydration Time! 💧',
        message: 'Take a drink of water now to stay refreshed.',
        dueAt: Date.now(),
      });
    }

    await waitFor(() => {
      expect(screen.getByText('Hydration Time! 💧')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('5m')).toBeInTheDocument();
    });
  });
});

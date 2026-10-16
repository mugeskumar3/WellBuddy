import { ReminderType } from '../../shared/types';

export interface ReminderContent {
  title: string;
  message: string;
  suggestedAction?: string;
  options?: string[];
}

const waterPrompts: ReminderContent[] = [
  {
    title: 'Hydration Break 💧',
    message: 'Time for a refreshing glass of water! Staying hydrated boosts energy and focus.',
    suggestedAction: 'Log 250ml water intake',
  },
  {
    title: 'Time to Sip! 🥤',
    message: 'Your brain needs water to function at its best. Drink a glass of fresh water now.',
    suggestedAction: 'Log 250ml water intake',
  },
  {
    title: 'Water Check-in 🌊',
    message: 'Have you drank enough water recently? Take a moment to hydrate and refresh your mind.',
    suggestedAction: 'Log 300ml water intake',
  },
];

const standingPrompts: ReminderContent[] = [
  {
    title: 'Stand & Move Up 🚶‍♂️',
    message: 'You have been seated for a while. Stand up, shake out your arms, and take a quick walk.',
    suggestedAction: 'Stand up for 2 minutes',
  },
  {
    title: 'Posture Check! 🧘',
    message: 'Break the sitting cycle! Stand up straight, roll your shoulders back, and take a deep breath.',
    suggestedAction: 'Stand up and realign posture',
  },
  {
    title: 'Move Your Body 🏃‍♀️',
    message: 'Sitting slows your circulation. Stand up and pace around your desk for a couple of minutes.',
    suggestedAction: 'Take 100 steps around your room',
  },
];

const eyeRestPrompts: ReminderContent[] = [
  {
    title: '20-20-20 Eye Rest 👀',
    message: 'Give your eyes a break: look at an object 20 feet away for at least 20 seconds.',
    suggestedAction: 'Look into the distance for 20 seconds',
  },
  {
    title: 'Blink & Relax Your Eyes 👁️',
    message: 'Close your eyes gently for 15 seconds, then blink several times to lubricate your eyes.',
    suggestedAction: 'Rest eyes and blink slowly',
  },
  {
    title: 'Screen Break Time 👓',
    message: 'Look away from all screens, focus on something in the far distance, and let your optic muscles relax.',
    suggestedAction: 'Rest eyes away from screen',
  },
];

const stretchingPrompts: ReminderContent[] = [
  {
    title: 'Desk Stretch Break 🧘',
    message: 'Neck & Shoulder Release: Gently tilt your head toward each shoulder, then roll your shoulders backward 5 times.',
    suggestedAction: 'Perform neck and shoulder rolls',
    options: ['Neck Tilt (15s)', 'Shoulder Rolls (15s)', 'Wrist Flex (15s)'],
  },
  {
    title: 'Full Body Reset 🙆',
    message: 'Interlace your fingers, reach up toward the ceiling, and lean gently from side to side.',
    suggestedAction: 'Reach high and stretch your spine',
    options: ['Overhead Reach (20s)', 'Torso Twist (20s)'],
  },
  {
    title: 'Wrist & Finger Care ✋',
    message: 'Extend your arms forward, flex wrists up and down, and wiggle your fingers to release tension.',
    suggestedAction: 'Wrist flexion & shakeout',
    options: ['Wrist Flexor Stretch', 'Wrist Extensor Stretch', 'Finger Taps'],
  },
];

export function getReminderContent(type: ReminderType, index = 0): ReminderContent {
  switch (type) {
    case 'water':
      return waterPrompts[index % waterPrompts.length];
    case 'standing':
      return standingPrompts[index % standingPrompts.length];
    case 'eye_rest':
      return eyeRestPrompts[index % eyeRestPrompts.length];
    case 'stretching':
      return stretchingPrompts[index % stretchingPrompts.length];
  }
}

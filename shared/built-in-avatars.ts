import { AvatarInfo } from './types';

// High-fidelity embedded SVG avatars
export const BUILT_IN_AVATARS: AvatarInfo[] = [
  {
    id: 'water-drop',
    name: 'Aqua the Droplet',
    type: 'builtin',
    description: 'A cheerful water drop cheering you on to stay hydrated throughout the day.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0284c7" flood-opacity="0.3"/>
          </filter>
        </defs>
        <!-- Body -->
        <path d="M60 12 C60 12 24 55 24 80 C24 99.88 40.12 116 60 116 C79.88 116 96 99.88 96 80 C96 55 60 12 60 12 Z" 
              fill="url(#dropGrad)" filter="url(#glow)"/>
        <!-- Highlight -->
        <ellipse cx="44" cy="62" rx="6" ry="14" transform="rotate(-25 44 62)" fill="white" opacity="0.45"/>
        <!-- Eyes -->
        <ellipse cx="48" cy="78" rx="4.5" ry="6" fill="#0f172a"/>
        <ellipse cx="72" cy="78" rx="4.5" ry="6" fill="#0f172a"/>
        <circle cx="50" cy="76" r="2" fill="white"/>
        <circle cx="74" cy="76" r="2" fill="white"/>
        <!-- Rosy Cheeks -->
        <ellipse cx="40" cy="86" rx="5" ry="3" fill="#f43f5e" opacity="0.35"/>
        <ellipse cx="80" cy="86" rx="5" ry="3" fill="#f43f5e" opacity="0.35"/>
        <!-- Smile -->
        <path d="M52 86 Q60 95 68 86" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
      </svg>
    `)}`,
  },
  {
    id: 'sprout',
    name: 'Sprout the Seedling',
    type: 'builtin',
    description: 'A lively little plant reminding you to stand tall, stretch, and grow healthy.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="100%" stop-color="#16a34a"/>
          </linearGradient>
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#c2410c"/>
          </linearGradient>
        </defs>
        <!-- Leaves -->
        <path d="M60 55 C45 35 30 42 35 22 C50 25 58 40 60 55 Z" fill="url(#leafGrad)"/>
        <path d="M60 55 C75 35 90 42 85 22 C70 25 62 40 60 55 Z" fill="url(#leafGrad)"/>
        <!-- Stem -->
        <path d="M60 52 L60 68" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
        <!-- Pot Body -->
        <path d="M36 68 L84 68 L78 110 L42 110 Z" fill="url(#potGrad)"/>
        <rect x="32" y="64" width="56" height="8" rx="4" fill="#ea580c"/>
        <!-- Eyes on Pot -->
        <circle cx="50" cy="86" r="4.5" fill="#0f172a"/>
        <circle cx="70" cy="86" r="4.5" fill="#0f172a"/>
        <circle cx="51.5" cy="84.5" r="1.5" fill="white"/>
        <circle cx="71.5" cy="84.5" r="1.5" fill="white"/>
        <!-- Cheeks -->
        <circle cx="42" cy="92" r="4" fill="#f43f5e" opacity="0.4"/>
        <circle cx="78" cy="92" r="4" fill="#f43f5e" opacity="0.4"/>
        <!-- Pot Smile -->
        <path d="M54 94 Q60 100 66 94" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      </svg>
    `)}`,
  },
  {
    id: 'robobuddy',
    name: 'Bolt the RoboBuddy',
    type: 'builtin',
    description: 'An upbeat cyber assistant keeping track of your focus and desk ergonomics.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="roboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <!-- Antenna -->
        <line x1="60" y1="26" x2="60" y2="12" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <circle cx="60" cy="10" r="5" fill="#eab308"/>
        <!-- Ears -->
        <rect x="22" y="50" width="8" height="20" rx="3" fill="#64748b"/>
        <rect x="90" y="50" width="8" height="20" rx="3" fill="#64748b"/>
        <!-- Head -->
        <rect x="28" y="26" width="64" height="68" rx="18" fill="url(#roboGrad)"/>
        <!-- Screen Visor -->
        <rect x="36" y="38" width="48" height="30" rx="10" fill="#0f172a"/>
        <!-- Glowing Eyes -->
        <rect x="42" y="46" width="12" height="12" rx="4" fill="url(#visorGrad)"/>
        <rect x="66" y="46" width="12" height="12" rx="4" fill="url(#visorGrad)"/>
        <circle cx="46" cy="50" r="2" fill="white"/>
        <circle cx="70" cy="50" r="2" fill="white"/>
        <!-- Speaker / Smile -->
        <line x1="50" y1="78" x2="70" y2="78" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <!-- Bolt details -->
        <circle cx="34" cy="34" r="2" fill="#cbd5e1"/>
        <circle cx="86" cy="34" r="2" fill="#cbd5e1"/>
      </svg>
    `)}`,
  },
  {
    id: 'zen-pebble',
    name: 'Zen the Pebble',
    type: 'builtin',
    description: 'A calm, grounded stone companion radiating peaceful breaths and mindful focus.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
        <defs>
          <linearGradient id="pebGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="50%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#64748b"/>
          </linearGradient>
        </defs>
        <!-- Smooth Pebble Shape -->
        <path d="M60 22 C88 22 104 46 102 76 C100 98 84 108 58 108 C30 108 18 96 18 72 C18 44 34 22 60 22 Z" 
              fill="url(#pebGrad)"/>
        <!-- Calm Closed Eyes -->
        <path d="M40 68 Q48 76 54 68" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M66 68 Q72 76 80 68" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Soft Blush -->
        <ellipse cx="36" cy="76" rx="6" ry="3.5" fill="#f472b6" opacity="0.4"/>
        <ellipse cx="84" cy="76" rx="6" ry="3.5" fill="#f472b6" opacity="0.4"/>
        <!-- Peaceful Smile -->
        <path d="M55 84 Q60 88 65 84" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Zen Lotus Petal on Top -->
        <path d="M60 14 C56 18 56 22 60 25 C64 22 64 18 60 14 Z" fill="#ec4899"/>
      </svg>
    `)}`,
  },
];

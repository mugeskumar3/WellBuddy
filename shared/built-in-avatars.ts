import { AvatarInfo } from './types';

// High-fidelity active animated embedded SVG avatars
export const BUILT_IN_AVATARS: AvatarInfo[] = [
  {
    id: 'water-drop',
    name: 'Aqua the Droplet',
    type: 'builtin',
    description: 'Active water companion with splashing droplets, sloshing liquid waves, and bouncy walking steps.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
          <linearGradient id="innerWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8"/>
          </linearGradient>
          <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0284c7" flood-opacity="0.4"/>
          </filter>
        </defs>
        <style>
          /* Liquid Walking and Bouncing Rhythm */
          @keyframes dropWalk {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(-2.5deg) scale(0.96, 1.04); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-5px) rotate(2.5deg) scale(0.96, 1.04); }
          }
          /* Splashing Droplet 1 (Left Fountain Arc) */
          @keyframes splashArcL {
            0%, 100% { transform: translate(0, 0) scale(0.2); opacity: 0; }
            40% { transform: translate(-22px, -26px) scale(1.1); opacity: 1; }
            70% { transform: translate(-30px, -8px) scale(0.8); opacity: 0.8; }
            85% { transform: translate(-24px, 12px) scale(0); opacity: 0; }
          }
          /* Splashing Droplet 2 (Right Fountain Arc) */
          @keyframes splashArcR {
            0%, 100% { transform: translate(0, 0) scale(0.2); opacity: 0; }
            45% { transform: translate(24px, -28px) scale(1.2); opacity: 1; }
            75% { transform: translate(32px, -10px) scale(0.8); opacity: 0.8; }
            90% { transform: translate(26px, 12px) scale(0); opacity: 0; }
          }
          /* Top Crown Splash */
          @keyframes splashCrown {
            0%, 100% { transform: translateY(0) scale(0.4); opacity: 0; }
            50% { transform: translateY(-16px) scale(1.2); opacity: 1; }
            75% { transform: translateY(-8px) scale(0.6); opacity: 0.5; }
          }
          /* Internal Liquid Wave Churn */
          @keyframes waveChurn {
            0% { transform: translateX(-12px) rotate(0deg); }
            50% { transform: translateX(12px) rotate(6deg); }
            100% { transform: translateX(-12px) rotate(0deg); }
          }
          /* Natural Stepping Feet */
          @keyframes footStepL {
            0%, 100% { transform: translate(-3px, 0px) rotate(5deg); }
            25% { transform: translate(-1px, -3px) rotate(10deg); }
            50% { transform: translate(3px, -6px) rotate(-10deg); }
            75% { transform: translate(4px, -1px) rotate(-4deg); }
          }
          @keyframes footStepR {
            0%, 100% { transform: translate(3px, -6px) rotate(-10deg); }
            25% { transform: translate(4px, -1px) rotate(-4deg); }
            50% { transform: translate(-3px, 0px) rotate(5deg); }
            75% { transform: translate(-1px, -3px) rotate(10deg); }
          }
          /* Swinging Liquid Arms */
          @keyframes armSwingL {
            0%, 100% { transform: rotate(18deg) translateY(-2px); }
            50% { transform: rotate(-18deg) translateY(2px); }
          }
          @keyframes armSwingR {
            0%, 100% { transform: rotate(-18deg) translateY(2px); }
            50% { transform: rotate(18deg) translateY(-2px); }
          }
          /* Water Ripple at base */
          @keyframes rippleBase {
            0% { rx: 20px; ry: 4px; opacity: 0.7; }
            100% { rx: 42px; ry: 8px; opacity: 0; }
          }
          /* Eye Blink */
          @keyframes dropEyes {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.12); }
          }
          .drop-body-group { animation: dropWalk 0.75s ease-in-out infinite; transform-origin: 65px 95px; }
          .splash-l { animation: splashArcL 2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite; }
          .splash-r { animation: splashArcR 2.3s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 0.4s; }
          .splash-top { animation: splashCrown 1.8s ease-out infinite 0.2s; }
          .inner-wave { animation: waveChurn 3s ease-in-out infinite alternate; transform-origin: 65px 80px; }
          .water-arm-l { animation: armSwingL 0.75s ease-in-out infinite; transform-origin: 36px 72px; }
          .water-arm-r { animation: armSwingR 0.75s ease-in-out infinite; transform-origin: 94px 72px; }
          .water-foot-l { animation: footStepL 0.75s ease-in-out infinite; transform-origin: 52px 113px; }
          .water-foot-r { animation: footStepR 0.75s ease-in-out infinite; transform-origin: 78px 113px; }
          .puddle-ripple { animation: rippleBase 2s ease-out infinite; }
          .drop-eyes { animation: dropEyes 3.8s ease-in-out infinite; transform-origin: 65px 72px; }
          /* Speaking Mouth Movement Animation */
          @keyframes dropSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.8); }
            50% { transform: scale(0.9, 0.7); }
            75% { transform: scale(1.1, 1.5); }
          }
          .drop-voice-mouth {
            animation: dropSpeak 0.45s ease-in-out infinite;
            transform-origin: 65px 84px;
          }
        </style>

        <!-- Base Puddle and Ripples -->
        <ellipse class="puddle-ripple" cx="65" cy="115" rx="20" ry="4" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <ellipse cx="65" cy="115" rx="32" ry="6" fill="#38bdf8" opacity="0.35"/>

        <!-- Active Splashing Droplets Erupting -->
        <g transform="translate(65, 45)">
          <circle class="splash-l" cx="0" cy="0" r="4.5" fill="#38bdf8" filter="url(#waterGlow)"/>
          <circle class="splash-r" cx="0" cy="0" r="5" fill="#0284c7" filter="url(#waterGlow)"/>
          <circle class="splash-top" cx="0" cy="-28" r="3.5" fill="#7dd3fc"/>
        </g>

        <!-- Stepping Water Feet -->
        <g>
          <ellipse class="water-foot-l" cx="52" cy="113" rx="7" ry="4" fill="#0284c7"/>
          <ellipse class="water-foot-r" cx="78" cy="113" rx="7" ry="4" fill="#0284c7"/>
        </g>

        <!-- Main Walking and Bouncing Liquid Body -->
        <g class="drop-body-group">
          <!-- Waving Liquid Arms -->
          <path class="water-arm-l" d="M38 72 Q24 64 22 52 Q28 50 36 66 Z" fill="#38bdf8"/>
          <path class="water-arm-r" d="M92 72 Q106 64 108 52 Q102 50 94 66 Z" fill="#38bdf8"/>

          <!-- Body Silhouette with Clip -->
          <g filter="url(#waterGlow)">
            <path id="dropShape" d="M65 14 C65 14 30 54 30 78 C30 98 45.6 112 65 112 C84.4 112 100 98 100 78 C100 54 65 14 65 14 Z" fill="url(#dropGrad)"/>
            
            <!-- Sloshing Inner Wave Effect -->
            <path class="inner-wave" d="M26 80 Q45 70 65 82 Q85 94 104 80 L104 114 L26 114 Z" fill="url(#innerWaveGrad)" opacity="0.45"/>
          </g>

          <!-- Shiny Water Reflection Curve -->
          <ellipse cx="48" cy="58" rx="6" ry="15" transform="rotate(-24 48 58)" fill="white" opacity="0.55"/>
          <circle cx="43" cy="80" r="3" fill="white" opacity="0.4"/>

          <!-- Expressive Eyes with Blink -->
          <g class="drop-eyes">
            <ellipse cx="53" cy="74" rx="4.5" ry="6" fill="#0f172a"/>
            <ellipse cx="77" cy="74" rx="4.5" ry="6" fill="#0f172a"/>
            <circle cx="55" cy="72" r="2" fill="white"/>
            <circle cx="79" cy="72" r="2" fill="white"/>
          </g>

          <!-- Rosy Cheeks -->
          <ellipse cx="45" cy="82" rx="5" ry="3" fill="#f43f5e" opacity="0.45"/>
          <ellipse cx="85" cy="82" rx="5" ry="3" fill="#f43f5e" opacity="0.45"/>

          <!-- Big Happy Smile with Speak Animation -->
          <path class="drop-voice-mouth" d="M57 82 Q65 92 73 82" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'robobuddy',
    name: 'Bolt the RoboBuddy',
    type: 'builtin',
    description: 'Robotic cyber buddy with marching walkable mechanical legs, rocket jet thrusters, swinging arms, and scanner beam.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="100%" height="100%">
        <defs>
          <linearGradient id="roboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
          <linearGradient id="jetFireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="45%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#ef4444"/>
          </linearGradient>
          <filter id="glowYellow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#facc15" flood-opacity="0.9"/>
          </filter>
          <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#38bdf8" flood-opacity="0.9"/>
          </filter>
        </defs>
        <style>
          /* Marching Walk Cycle: Left and Right Mechanical Legs */
          @keyframes legStrideL {
            0%, 100% { transform: rotate(-16deg) translateY(1px); }
            25% { transform: rotate(0deg) translateY(2px); }
            50% { transform: rotate(16deg) translateY(-4px); }
            75% { transform: rotate(4deg) translateY(-6px); }
          }
          @keyframes legStrideR {
            0%, 100% { transform: rotate(16deg) translateY(-4px); }
            25% { transform: rotate(4deg) translateY(-6px); }
            50% { transform: rotate(-16deg) translateY(1px); }
            75% { transform: rotate(0deg) translateY(2px); }
          }
          /* Counter-Swinging Mechanical Arms */
          @keyframes armSwingL {
            0%, 100% { transform: rotate(20deg) translateY(-2px); }
            50% { transform: rotate(-20deg) translateY(2px); }
          }
          @keyframes armSwingR {
            0%, 100% { transform: rotate(-20deg) translateY(2px); }
            50% { transform: rotate(20deg) translateY(-2px); }
          }
          /* Jet Thruster Exhaust Flames under Feet */
          @keyframes jetPulse {
            0%, 100% { transform: scaleY(0.7) scaleX(0.85); opacity: 0.75; }
            50% { transform: scaleY(1.4) scaleX(1.15); opacity: 1; }
          }
          /* Robot Torso Walk Bobbing */
          @keyframes roboWalkBob {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-1.5deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-4px) rotate(1.5deg); }
          }
          /* Visor Scanner Laser Sweep */
          @keyframes scannerLaser {
            0%, 100% { transform: translateX(0); opacity: 0.6; }
            50% { transform: translateX(20px); opacity: 1; }
          }
          /* Chest Reactor Core Pulse */
          @keyframes reactorBreathe {
            0%, 100% { r: 5px; opacity: 0.7; }
            50% { r: 7.5px; opacity: 1; }
          }
          /* Radar Signal expanding wave */
          @keyframes radarWave {
            0% { r: 4px; opacity: 0.9; stroke-width: 2px; }
            100% { r: 16px; opacity: 0; stroke-width: 0.5px; }
          }
          /* Eye Blink */
          @keyframes eyeBlink {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.12); }
          }
          .robo-body-all { animation: roboWalkBob 0.75s ease-in-out infinite; transform-origin: 70px 70px; }
          .robo-leg-l { animation: legStrideL 0.75s ease-in-out infinite; transform-origin: 54px 92px; }
          .robo-leg-r { animation: legStrideR 0.75s ease-in-out infinite; transform-origin: 86px 92px; }
          .robo-arm-l { animation: armSwingL 0.75s ease-in-out infinite; transform-origin: 40px 66px; }
          .robo-arm-r { animation: armSwingR 0.75s ease-in-out infinite; transform-origin: 100px 66px; }
          .jet-flame-l { animation: jetPulse 0.22s ease-in-out infinite; transform-origin: 54px 116px; }
          .jet-flame-r { animation: jetPulse 0.22s ease-in-out infinite 0.1s; transform-origin: 86px 116px; }
          .scanner-bar { animation: scannerLaser 1.5s ease-in-out infinite alternate; }
          .reactor-core { animation: reactorBreathe 1.5s ease-in-out infinite; transform-origin: 70px 84px; }
          .radar-signal { animation: radarWave 2s cubic-bezier(0.1, 0.7, 0.4, 1) infinite; }
          .robo-eyes { animation: eyeBlink 3.8s ease-in-out infinite; transform-origin: 70px 45px; }
          /* Animated Robotic Equalizer Voice Mouth */
          @keyframes vBarBounce {
            0%, 100% { transform: scaleY(0.7); }
            50% { transform: scaleY(3.2); }
          }
          .v-bar-1 { animation: vBarBounce 0.38s ease-in-out infinite; transform-origin: 58px 60px; }
          .v-bar-2 { animation: vBarBounce 0.32s ease-in-out infinite 0.08s; transform-origin: 64px 60px; }
          .v-bar-3 { animation: vBarBounce 0.45s ease-in-out infinite 0.04s; transform-origin: 70px 60px; }
          .v-bar-4 { animation: vBarBounce 0.35s ease-in-out infinite 0.12s; transform-origin: 76px 60px; }
          .v-bar-5 { animation: vBarBounce 0.4s ease-in-out infinite 0.06s; transform-origin: 82px 60px; }
        </style>

        <!-- Walking Mechanical Legs and Rocket Boots -->
        <g class="robo-leg-l">
          <rect x="49" y="92" width="10" height="22" rx="4" fill="#475569"/>
          <!-- Foot / Rocket Boot -->
          <rect x="44" y="110" width="20" height="7" rx="3" fill="#334155"/>
          <!-- Rocket Jet Flame -->
          <polygon class="jet-flame-l" points="54,117 48,132 54,127 60,132" fill="url(#jetFireGrad)"/>
        </g>

        <g class="robo-leg-r">
          <rect x="81" y="92" width="10" height="22" rx="4" fill="#475569"/>
          <!-- Foot / Rocket Boot -->
          <rect x="76" y="110" width="20" height="7" rx="3" fill="#334155"/>
          <!-- Rocket Jet Flame -->
          <polygon class="jet-flame-r" points="86,117 80,132 86,127 92,132" fill="url(#jetFireGrad)"/>
        </g>

        <!-- Torso, Arms, and Head (Walking Bob) -->
        <g class="robo-body-all">
          <!-- Left Swinging Mechanical Arm with Claw -->
          <g class="robo-arm-l">
            <rect x="30" y="66" width="10" height="24" rx="4" fill="#64748b"/>
            <!-- Hand / Claw -->
            <path d="M28 90 Q35 98 42 90" stroke="#cbd5e1" stroke-width="3" fill="none"/>
          </g>

          <!-- Right Waving Mechanical Arm with Scanner Gadget -->
          <g class="robo-arm-r">
            <rect x="100" y="66" width="10" height="24" rx="4" fill="#64748b"/>
            <!-- Waving Hand -->
            <circle cx="105" cy="92" r="5" fill="#38bdf8"/>
            <path d="M102 92 L108 92 M105 89 L105 95" stroke="white" stroke-width="1.5"/>
          </g>

          <!-- Torso Chassis -->
          <rect x="44" y="66" width="52" height="30" rx="8" fill="#334155"/>
          <rect x="48" y="70" width="44" height="22" rx="5" fill="#1e293b"/>

          <!-- Glowing Arc Reactor Core in Chest -->
          <circle class="reactor-core" cx="70" cy="81" r="6" fill="#38bdf8" filter="url(#glowCyan)"/>
          <circle cx="70" cy="81" r="3" fill="white"/>

          <!-- Antenna Radar Signal -->
          <circle class="radar-signal" cx="70" cy="11" r="4" fill="none" stroke="#facc15"/>
          <line x1="70" y1="24" x2="70" y2="12" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
          <circle cx="70" cy="11" r="5.5" fill="#facc15" filter="url(#glowYellow)"/>

          <!-- Head Unit -->
          <rect x="38" y="24" width="64" height="42" rx="14" fill="url(#roboGrad)"/>

          <!-- Ear Bolts -->
          <rect x="32" y="36" width="6" height="18" rx="2" fill="#64748b"/>
          <rect x="102" y="36" width="6" height="18" rx="2" fill="#64748b"/>

          <!-- Visor Screen -->
          <rect x="46" y="32" width="48" height="24" rx="8" fill="#0f172a"/>

          <!-- Active Red/Cyan Scanner Laser Bar in Visor -->
          <rect class="scanner-bar" x="50" y="42" width="12" height="4" rx="2" fill="#ef4444" opacity="0.8"/>

          <!-- Glowing Eyes with Blink Animation -->
          <g class="robo-eyes">
            <rect x="52" y="38" width="10" height="11" rx="3" fill="url(#visorGrad)"/>
            <rect x="78" y="38" width="10" height="11" rx="3" fill="url(#visorGrad)"/>
            <circle cx="55" cy="41" r="1.8" fill="white"/>
            <circle cx="81" cy="41" r="1.8" fill="white"/>
          </g>

          <!-- Animated Equalizer Voice Mouth -->
          <g>
            <line x1="56" y1="60" x2="60" y2="60" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" class="v-bar-1"/>
            <line x1="62" y1="60" x2="66" y2="60" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" class="v-bar-2"/>
            <line x1="68" y1="60" x2="72" y2="60" stroke="#facc15" stroke-width="3.5" stroke-linecap="round" class="v-bar-3"/>
            <line x1="74" y1="60" x2="78" y2="60" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" class="v-bar-4"/>
            <line x1="80" y1="60" x2="84" y2="60" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" class="v-bar-5"/>
          </g>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'sprout',
    name: 'Sprout the Seedling',
    type: 'builtin',
    description: 'Active plant buddy with growing stretch posture, blooming vibrant flower, dancing leaves, and stepping roots.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4ade80"/>
            <stop offset="100%" stop-color="#16a34a"/>
          </linearGradient>
          <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f472b6"/>
            <stop offset="100%" stop-color="#ec4899"/>
          </linearGradient>
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#c2410c"/>
          </linearGradient>
          <filter id="flowerGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ec4899" flood-opacity="0.6"/>
          </filter>
        </defs>
        <style>
          /* Plant Stretching and Growing Activity */
          @keyframes plantStretchGrow {
            0%, 100% { transform: scaleY(1) translateY(0); }
            40% { transform: scaleY(1.18) translateY(-8px); }
            70% { transform: scaleY(0.95) translateY(2px); }
          }
          /* Blooming Flower Petals Opening and Closing */
          @keyframes bloomFlower {
            0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.85; }
            50% { transform: scale(1.3) rotate(18deg); opacity: 1; }
          }
          /* Dancing Left Leaf Branch */
          @keyframes leafDanceL {
            0%, 100% { transform: rotate(-15deg); }
            50% { transform: rotate(25deg); }
          }
          /* Dancing Right Leaf Branch */
          @keyframes leafDanceR {
            0%, 100% { transform: rotate(15deg); }
            50% { transform: rotate(-25deg); }
          }
          /* Floating Nature Pollen / Sparkles */
          @keyframes sporeFloat1 {
            0%, 100% { transform: translate(0, 0) scale(0); opacity: 0; }
            50% { transform: translate(-18px, -20px) scale(1); opacity: 0.9; }
          }
          @keyframes sporeFloat2 {
            0%, 100% { transform: translate(0, 0) scale(0); opacity: 0; }
            50% { transform: translate(18px, -24px) scale(1.1); opacity: 0.9; }
          }
          /* Stepping Walking Roots */
          @keyframes rootStepL {
            0%, 100% { transform: translate(-3px, 0px) rotate(5deg); }
            25% { transform: translate(-1px, -3px) rotate(10deg); }
            50% { transform: translate(3px, -5px) rotate(-8deg); }
            75% { transform: translate(4px, -1px) rotate(-4deg); }
          }
          @keyframes rootStepR {
            0%, 100% { transform: translate(3px, -5px) rotate(-8deg); }
            25% { transform: translate(4px, -1px) rotate(-4deg); }
            50% { transform: translate(-3px, 0px) rotate(5deg); }
            75% { transform: translate(-1px, -3px) rotate(10deg); }
          }
          /* Pot Walk Wiggle */
          @keyframes potWiggle {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-3deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(-4px) rotate(3deg); }
          }
          /* Eye Blink */
          @keyframes sproutEyes {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.12); }
          }
          .stem-stretch { animation: plantStretchGrow 3s ease-in-out infinite; transform-origin: 65px 75px; }
          .flower-bloom { animation: bloomFlower 3s ease-in-out infinite; transform-origin: 65px 22px; }
          .leaf-dance-l { animation: leafDanceL 1.4s ease-in-out infinite; transform-origin: 65px 50px; }
          .leaf-dance-r { animation: leafDanceR 1.4s ease-in-out infinite; transform-origin: 65px 50px; }
          .spore-1 { animation: sporeFloat1 2.5s ease-out infinite; }
          .spore-2 { animation: sporeFloat2 2.8s ease-out infinite 0.6s; }
          .pot-group { animation: potWiggle 0.75s ease-in-out infinite; transform-origin: 65px 110px; }
          .root-l { animation: rootStepL 0.75s ease-in-out infinite; transform-origin: 50px 120px; }
          .root-r { animation: rootStepR 0.75s ease-in-out infinite; transform-origin: 80px 120px; }
          .sprout-eyes { animation: sproutEyes 3.6s ease-in-out infinite; transform-origin: 65px 95px; }
          /* Speaking Mouth Movement Animation */
          @keyframes sproutSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.7); }
            50% { transform: scale(0.9, 0.7); }
            75% { transform: scale(1.1, 1.5); }
          }
          .sprout-voice-mouth {
            animation: sproutSpeak 0.42s ease-in-out infinite;
            transform-origin: 65px 103px;
          }
        </style>

        <!-- Stepping Root Paws beneath Pot -->
        <g>
          <ellipse class="root-l" cx="50" cy="120" rx="8" ry="4" fill="#92400e"/>
          <ellipse class="root-r" cx="80" cy="120" rx="8" ry="4" fill="#92400e"/>
        </g>

        <!-- Active Growing Stem and Blooming Flower -->
        <g class="stem-stretch">
          <!-- Floating Spores / Pollen -->
          <circle class="spore-1" cx="65" cy="24" r="3" fill="#fde047"/>
          <circle class="spore-2" cx="65" cy="24" r="2.5" fill="#4ade80"/>

          <!-- Blooming Flower on Top -->
          <g class="flower-bloom" filter="url(#flowerGlow)">
            <!-- 5 Flower Petals -->
            <circle cx="65" cy="14" r="6" fill="url(#flowerGrad)"/>
            <circle cx="73" cy="20" r="6" fill="url(#flowerGrad)"/>
            <circle cx="70" cy="28" r="6" fill="url(#flowerGrad)"/>
            <circle cx="60" cy="28" r="6" fill="url(#flowerGrad)"/>
            <circle cx="57" cy="20" r="6" fill="url(#flowerGrad)"/>
            <!-- Flower Center Nectar -->
            <circle cx="65" cy="22" r="5" fill="#fde047"/>
          </g>

          <!-- Thick Green Stem -->
          <path d="M65 24 Q63 48 65 74" stroke="#15803d" stroke-width="6" stroke-linecap="round" fill="none"/>

          <!-- Dancing Leaf Branches -->
          <path class="leaf-dance-l" d="M65 48 C42 28 26 38 32 16 C50 20 60 38 65 48 Z" fill="url(#leafGrad)"/>
          <path class="leaf-dance-r" d="M65 48 C88 28 104 38 98 16 C80 20 70 38 65 48 Z" fill="url(#leafGrad)"/>
        </g>

        <!-- Terracotta Pot with Face (Walking Wiggle) -->
        <g class="pot-group">
          <!-- Pot Body -->
          <path d="M40 74 L90 74 L84 116 L46 116 Z" fill="url(#potGrad)"/>
          <rect x="36" y="70" width="58" height="9" rx="4.5" fill="#ea580c"/>

          <!-- Pot Cute Eyes with Blink -->
          <g class="sprout-eyes">
            <circle cx="55" cy="94" r="5" fill="#0f172a"/>
            <circle cx="75" cy="94" r="5" fill="#0f172a"/>
            <circle cx="57" cy="92" r="1.8" fill="white"/>
            <circle cx="77" cy="92" r="1.8" fill="white"/>
          </g>

          <!-- Rosy Cheeks -->
          <circle cx="47" cy="100" r="4.5" fill="#f43f5e" opacity="0.45"/>
          <circle cx="83" cy="100" r="4.5" fill="#f43f5e" opacity="0.45"/>

          <!-- Happy Plant Smile with Speaking Animation -->
          <path class="sprout-voice-mouth" d="M59 101 Q65 108 71 101" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'pippy-cat',
    name: 'Pippy the Kitty',
    type: 'builtin',
    description: 'Walkable 4-legged animated kitten mascot who trots in side profile, turns front to sit and wave playfully.',
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="50%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#ea580c"/>
          </linearGradient>
          <linearGradient id="catCream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="100%" stop-color="#ffedd5"/>
          </linearGradient>
          <filter id="catShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
          </filter>
        </defs>
        <style>
          /* Toggle Side Profile Trot vs Front Posing View */
          @keyframes toggleSideWalk {
            0%, 28% { opacity: 1; visibility: visible; }
            28.1%, 49.9% { opacity: 0; visibility: hidden; }
            50%, 78% { opacity: 1; visibility: visible; }
            78.1%, 100% { opacity: 0; visibility: hidden; }
          }
          @keyframes toggleFrontPose {
            0%, 28% { opacity: 0; visibility: hidden; }
            28.1%, 49.9% { opacity: 1; visibility: visible; }
            50%, 78% { opacity: 0; visibility: hidden; }
            78.1%, 100% { opacity: 1; visibility: visible; }
          }

          /* Side Quadruped Leg Strides */
          /* Diagonal Pair 1: Front-Right and Back-Left */
          @keyframes sideCatStridePair1 {
            0% { transform: rotate(24deg) translateY(0px); }
            3.5% { transform: rotate(0deg) translateY(0px); }
            7% { transform: rotate(-24deg) translateY(-2px); }
            10.5% { transform: rotate(6deg) translateY(-5px); }
            14% { transform: rotate(24deg) translateY(0px); }
            17.5% { transform: rotate(0deg) translateY(0px); }
            21% { transform: rotate(-24deg) translateY(-2px); }
            24.5% { transform: rotate(6deg) translateY(-5px); }
            28%, 50% { transform: rotate(0deg) translateY(0px); }
            53.5% { transform: rotate(24deg) translateY(0px); }
            57% { transform: rotate(0deg) translateY(0px); }
            60.5% { transform: rotate(-24deg) translateY(-2px); }
            64% { transform: rotate(6deg) translateY(-5px); }
            67.5% { transform: rotate(24deg) translateY(0px); }
            71% { transform: rotate(0deg) translateY(0px); }
            74.5% { transform: rotate(-24deg) translateY(-2px); }
            78%, 100% { transform: rotate(0deg) translateY(0px); }
          }

          /* Diagonal Pair 2: Front-Left and Back-Right */
          @keyframes sideCatStridePair2 {
            0% { transform: rotate(-24deg) translateY(-2px); }
            3.5% { transform: rotate(6deg) translateY(-5px); }
            7% { transform: rotate(24deg) translateY(0px); }
            10.5% { transform: rotate(0deg) translateY(0px); }
            14% { transform: rotate(-24deg) translateY(-2px); }
            17.5% { transform: rotate(6deg) translateY(-5px); }
            21% { transform: rotate(24deg) translateY(0px); }
            24.5% { transform: rotate(0deg) translateY(0px); }
            28%, 50% { transform: rotate(0deg) translateY(0px); }
            53.5% { transform: rotate(-24deg) translateY(-2px); }
            57% { transform: rotate(6deg) translateY(-5px); }
            60.5% { transform: rotate(24deg) translateY(0px); }
            64% { transform: rotate(0deg) translateY(0px); }
            67.5% { transform: rotate(-24deg) translateY(-2px); }
            71% { transform: rotate(6deg) translateY(-5px); }
            74.5% { transform: rotate(24deg) translateY(0px); }
            78%, 100% { transform: rotate(0deg) translateY(0px); }
          }

          /* Side Body Step Bobbing */
          @keyframes sideCatBob {
            0%, 7%, 14%, 21%, 28%, 50%, 57%, 64%, 71%, 78% { transform: translateY(0px); }
            3.5%, 10.5%, 17.5%, 24.5%, 53.5%, 60.5%, 67.5%, 74.5% { transform: translateY(-3px); }
          }

          /* Side Swishing Tail */
          @keyframes sideCatTailSwish {
            0%, 28%, 50%, 78%, 100% { transform: rotate(0deg); }
            7%, 21%, 57%, 71% { transform: rotate(18deg); }
            14%, 28%, 64%, 78% { transform: rotate(-12deg); }
          }

          /* Front Pose Idle Breathing and Maneki-Neko Wave */
          @keyframes frontCatIdle {
            0%, 100% { transform: translateY(0px) scale(1); }
            35%, 85% { transform: translateY(-2.5px) scale(1.02); }
            42%, 92% { transform: translateY(-1px) scale(1.01); }
          }
          @keyframes frontCatPawWave {
            0%, 28%, 50%, 78%, 100% { transform: rotate(0deg); }
            31%, 37%, 43%, 81%, 87%, 93% { transform: rotate(-24deg); }
            34%, 40%, 46%, 84%, 90%, 96% { transform: rotate(16deg); }
          }
          @keyframes frontCatTailSway {
            0%, 28%, 50%, 78%, 100% { transform: rotate(0deg); }
            35%, 85% { transform: rotate(14deg); }
            42%, 92% { transform: rotate(-8deg); }
          }
          @keyframes catBlink {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.1); }
          }
          @keyframes catSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.18, 1.45); }
            50% { transform: scale(0.95, 0.85); }
            75% { transform: scale(1.12, 1.3); }
          }

          .side-walk-view { animation: toggleSideWalk 12s linear infinite; }
          .front-pose-view { animation: toggleFrontPose 12s linear infinite; }
          .side-cat-pair1 { animation: sideCatStridePair1 12s linear infinite; }
          .side-cat-pair2 { animation: sideCatStridePair2 12s linear infinite; }
          .side-cat-body { animation: sideCatBob 12s linear infinite; transform-origin: 65px 105px; }
          .side-cat-tail { animation: sideCatTailSwish 12s linear infinite; transform-origin: 40px 84px; }
          .front-cat-body { animation: frontCatIdle 12s linear infinite; transform-origin: 65px 115px; }
          .front-cat-wave-paw { animation: frontCatPawWave 12s linear infinite; transform-origin: 82px 84px; }
          .front-cat-tail { animation: frontCatTailSway 12s linear infinite; transform-origin: 94px 104px; }
          .cat-eyes { animation: catBlink 3.8s ease-in-out infinite; transform-origin: 65px 54px; }
          .cat-side-eye { animation: catBlink 3.8s ease-in-out infinite; transform-origin: 86px 57px; }
          .cat-mouth { animation: catSpeak 0.38s ease-in-out infinite; transform-origin: 65px 67px; }
        </style>

        <!-- Ground Shadow -->
        <ellipse cx="65" cy="122" rx="34" ry="4" fill="#000000" opacity="0.18"/>

        <!-- ============================================== -->
        <!-- 1. SIDE-PROFILE TROT VIEW (Walk Phase)         -->
        <!-- ============================================== -->
        <g class="side-walk-view" filter="url(#catShadow)">
          <!-- Background Legs: Back-Left and Front-Left -->
          <!-- Back-Left Leg (Background, Pair 1) -->
          <g class="side-cat-pair1" style="transform-origin: 46px 88px;">
            <path d="M46 88 L42 106 L40 118" stroke="#c2410c" stroke-width="7" stroke-linecap="round"/>
            <ellipse cx="40" cy="118" rx="5" ry="3.5" fill="#ffedd5"/>
          </g>

          <!-- Front-Left Leg (Background, Pair 2) -->
          <g class="side-cat-pair2" style="transform-origin: 78px 86px;">
            <path d="M78 86 L74 104 L72 118" stroke="#c2410c" stroke-width="7" stroke-linecap="round"/>
            <ellipse cx="72" cy="118" rx="5" ry="3.5" fill="#ffedd5"/>
          </g>

          <!-- Side Body, Head and Swishing Tail -->
          <g class="side-cat-body">
            <!-- Swishing Tail Behind -->
            <path class="side-cat-tail" d="M40 84 Q20 76 22 50 Q26 44 30 58" stroke="#ea580c" stroke-width="6.5" stroke-linecap="round" fill="none"/>

            <!-- Torso -->
            <path d="M42 80 C40 68 54 66 74 70 C84 72 88 84 82 92 C66 96 46 94 42 80 Z" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>

            <!-- Tabby Stripes -->
            <path d="M54 68 Q58 76 56 82" stroke="#9a3412" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <path d="M64 69 Q68 77 66 84" stroke="#9a3412" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <path d="M74 71 Q76 78 74 84" stroke="#9a3412" stroke-width="2.2" stroke-linecap="round" fill="none"/>

            <!-- White Underbelly Fur -->
            <path d="M50 88 Q65 92 78 88" stroke="#ffedd5" stroke-width="4" stroke-linecap="round" fill="none"/>

            <!-- Cat Head Profile -->
            <circle cx="84" cy="60" r="16" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>

            <!-- Pointed Ear in Profile -->
            <polygon points="76,52 84,32 92,48" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>
            <polygon points="79,49 84,36 89,47" fill="#f472b6" opacity="0.65"/>

            <!-- Profile Eye with Blink -->
            <g class="cat-side-eye">
              <ellipse cx="86" cy="57" rx="3.8" ry="5.2" fill="#1e293b"/>
              <circle cx="87" cy="55.5" r="1.4" fill="#ffffff"/>
            </g>

            <!-- Pink Nose -->
            <polygon points="97,63 94,60 94,66" fill="#f43f5e"/>

            <!-- Side Cheerful Whiskers -->
            <g stroke="#9a3412" stroke-width="1.6" stroke-linecap="round">
              <line x1="94" y1="63" x2="108" y2="60"/>
              <line x1="94" y1="65" x2="110" y2="65"/>
              <line x1="94" y1="67" x2="108" y2="70"/>
            </g>
          </g>

          <!-- Foreground Legs: Back-Right and Front-Right -->
          <!-- Back-Right Leg (Foreground, Pair 2) -->
          <g class="side-cat-pair2" style="transform-origin: 52px 88px;">
            <path d="M52 88 L50 106 L54 118" stroke="url(#catGrad)" stroke-width="8" stroke-linecap="round"/>
            <path d="M52 88 L50 106 L54 118" stroke="#c2410c" stroke-width="2" stroke-linecap="round" fill="none"/>
            <ellipse cx="54" cy="118" rx="5.5" ry="3.5" fill="#ffedd5" stroke="#c2410c" stroke-width="1.8"/>
          </g>

          <!-- Front-Right Leg (Foreground, Pair 1) -->
          <g class="side-cat-pair1" style="transform-origin: 84px 86px;">
            <path d="M84 86 L84 104 L88 118" stroke="url(#catGrad)" stroke-width="8" stroke-linecap="round"/>
            <path d="M84 86 L84 104 L88 118" stroke="#c2410c" stroke-width="2" stroke-linecap="round" fill="none"/>
            <ellipse cx="88" cy="118" rx="5.5" ry="3.5" fill="#ffedd5" stroke="#c2410c" stroke-width="1.8"/>
          </g>
        </g>

        <!-- ============================================== -->
        <!-- 2. FRONT-FACING SITTING POSE VIEW (Pause/Wave) -->
        <!-- ============================================== -->
        <g class="front-pose-view" filter="url(#catShadow)">
          <!-- Sitting Hindquarters Haunches -->
          <ellipse cx="44" cy="106" rx="14" ry="11" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>
          <ellipse cx="86" cy="106" rx="14" ry="11" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>

          <!-- Hind Paws Flat on Ground -->
          <ellipse cx="43" cy="116" rx="7" ry="4.2" fill="#ffedd5" stroke="#c2410c" stroke-width="1.8"/>
          <ellipse cx="87" cy="116" rx="7" ry="4.2" fill="#ffedd5" stroke="#c2410c" stroke-width="1.8"/>

          <!-- Front Sitting Body Group -->
          <g class="front-cat-body">
            <!-- Tail Curling Up Beside Right Haunch -->
            <path class="front-cat-tail" d="M96 106 Q116 98 112 68 Q106 64 102 78" stroke="#ea580c" stroke-width="6.5" stroke-linecap="round" fill="none"/>

            <!-- Upright Cat Chest -->
            <path d="M48 76 Q65 64 82 76 L85 112 Q65 116 45 112 Z" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>

            <!-- White Fluffy Chest Bib -->
            <path d="M55 76 Q65 72 75 76 Q78 94 65 106 Q52 94 55 76 Z" fill="url(#catCream)"/>

            <!-- Left Front Paw Resting Neatly -->
            <g>
              <path d="M56 86 L54 112" stroke="url(#catGrad)" stroke-width="8.5" stroke-linecap="round"/>
              <ellipse cx="54" cy="115" rx="6" ry="4" fill="#ffedd5" stroke="#c2410c" stroke-width="1.8"/>
            </g>

            <!-- Right Front Paw (Maneki-Neko Lucky Paw Wave!) -->
            <g class="front-cat-wave-paw">
              <path d="M78 86 Q90 78 88 66" stroke="url(#catGrad)" stroke-width="9" stroke-linecap="round"/>
              <ellipse cx="88" cy="64" rx="6.5" ry="5.5" fill="#ffedd5" stroke="#c2410c" stroke-width="1.8"/>
              <circle cx="88" cy="64" r="2.2" fill="#f472b6"/>
              <circle cx="85" cy="60" r="1.1" fill="#f472b6"/>
              <circle cx="88" cy="59" r="1.1" fill="#f472b6"/>
              <circle cx="91" cy="60" r="1.1" fill="#f472b6"/>
            </g>

            <!-- Head -->
            <circle cx="65" cy="56" r="28" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2.2"/>

            <!-- Ears -->
            <polygon points="38,38 48,14 62,32" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>
            <polygon points="92,38 82,14 68,32" fill="url(#catGrad)" stroke="#c2410c" stroke-width="2"/>
            <polygon points="41,36 48,20 58,32" fill="#f472b6" opacity="0.6"/>
            <polygon points="89,36 82,20 72,32" fill="#f472b6" opacity="0.6"/>

            <!-- White Cheeks / Muzzle -->
            <ellipse cx="59" cy="66" rx="7.5" ry="6" fill="#ffedd5"/>
            <ellipse cx="71" cy="66" rx="7.5" ry="6" fill="#ffedd5"/>

            <!-- Eyes with Blink -->
            <g class="cat-eyes">
              <ellipse cx="52" cy="52" rx="4.8" ry="6.5" fill="#1e293b"/>
              <ellipse cx="78" cy="52" rx="4.8" ry="6.5" fill="#1e293b"/>
              <circle cx="54" cy="50" r="2" fill="#ffffff"/>
              <circle cx="80" cy="50" r="2" fill="#ffffff"/>
            </g>

            <!-- Pink Nose -->
            <polygon points="65,61 61,58 69,58" fill="#f43f5e"/>

            <!-- Sweet Meow Smile with Speaking Animation -->
            <g class="cat-mouth">
              <path d="M59 63 Q65 68 65 63 Q65 68 71 63" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            </g>

            <!-- Whiskers -->
            <g stroke="#9a3412" stroke-width="1.8" stroke-linecap="round">
              <line x1="32" y1="60" x2="48" y2="62"/>
              <line x1="31" y1="66" x2="48" y2="65"/>
              <line x1="98" y1="60" x2="82" y2="62"/>
              <line x1="99" y1="66" x2="82" y2="65"/>
            </g>
          </g>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'zen-pebble',
    name: 'Zen the Pebble',
    type: 'builtin',
    description: 'Levitating meditation stone with 3 revolving energy chakra orbs, pulsing lotus crown, and expanding aura rings.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="pebGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#cbd5e1"/>
            <stop offset="50%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#64748b"/>
          </linearGradient>
          <filter id="zenGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ec4899" flood-opacity="0.5"/>
          </filter>
        </defs>
        <style>
          /* Levitating Meditation Bobbing and Gliding */
          @keyframes zenFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-5px) rotate(-2deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-5px) rotate(2deg); }
          }
          /* Orbiting Chakra Orb 1 */
          @keyframes orbitOrb1 {
            0% { transform: rotate(0deg) translateX(46px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(46px) rotate(-360deg); }
          }
          /* Orbiting Chakra Orb 2 */
          @keyframes orbitOrb2 {
            0% { transform: rotate(120deg) translateX(46px) rotate(-120deg); }
            100% { transform: rotate(480deg) translateX(46px) rotate(-480deg); }
          }
          /* Orbiting Chakra Orb 3 */
          @keyframes orbitOrb3 {
            0% { transform: rotate(240deg) translateX(46px) rotate(-240deg); }
            100% { transform: rotate(600deg) translateX(46px) rotate(-600deg); }
          }
          /* Expanding Zen Breath Wave */
          @keyframes breathWave {
            0% { rx: 34px; ry: 34px; opacity: 0.8; stroke-width: 3px; }
            100% { rx: 58px; ry: 58px; opacity: 0; stroke-width: 0.5px; }
          }
          /* Lotus Bloom Pulse */
          @keyframes lotusPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
          .zen-root-group { animation: zenFloat 1.5s ease-in-out infinite; transform-origin: 65px 70px; }
          .zen-breath-ring { animation: breathWave 3.5s ease-out infinite; }
          .chakra-1 { animation: orbitOrb1 4s linear infinite; transform-origin: 65px 70px; }
          .chakra-2 { animation: orbitOrb2 4s linear infinite; transform-origin: 65px 70px; }
          .chakra-3 { animation: orbitOrb3 4s linear infinite; transform-origin: 65px 70px; }
          .lotus-flower { animation: lotusPulse 2.5s ease-in-out infinite; transform-origin: 65px 24px; }
          /* Speaking Mouth Movement Animation */
          @keyframes zenSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.7); }
            50% { transform: scale(0.9, 0.7); }
            75% { transform: scale(1.1, 1.5); }
          }
          .zen-voice-mouth {
            animation: zenSpeak 0.5s ease-in-out infinite;
            transform-origin: 65px 89px;
          }
        </style>

        <!-- Expanding Breath Aura -->
        <ellipse class="zen-breath-ring" cx="65" cy="70" rx="34" ry="34" fill="none" stroke="#f472b6"/>

        <!-- Orbiting Chakra Energy Spheres -->
        <g class="chakra-1">
          <circle cx="65" cy="70" r="5" fill="#38bdf8" filter="url(#zenGlow)"/>
        </g>
        <g class="chakra-2">
          <circle cx="65" cy="70" r="5" fill="#4ade80" filter="url(#zenGlow)"/>
        </g>
        <g class="chakra-3">
          <circle cx="65" cy="70" r="5" fill="#facc15" filter="url(#zenGlow)"/>
        </g>

        <!-- Levitating Pebble Body -->
        <g class="zen-root-group">
          <!-- Smooth Pebble Shape -->
          <path d="M65 26 C93 26 109 48 107 78 C105 100 89 110 63 110 C35 110 23 98 23 74 C23 46 39 26 65 26 Z" 
                fill="url(#pebGrad)"/>

          <!-- Calm Closed Eyes -->
          <path d="M45 72 Q53 80 59 72" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M71 72 Q77 80 85 72" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>

          <!-- Soft Blush -->
          <ellipse cx="41" cy="80" rx="6" ry="3.5" fill="#f472b6" opacity="0.45"/>
          <ellipse cx="89" cy="80" rx="6" ry="3.5" fill="#f472b6" opacity="0.45"/>

          <!-- Peaceful Smile with Speaking Animation -->
          <path class="zen-voice-mouth" d="M60 88 Q65 92 70 88" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>

          <!-- Blooming Lotus Petal on Top -->
          <path class="lotus-flower" d="M65 14 C60 20 60 26 65 30 C70 26 70 20 65 14 Z" fill="#ec4899" filter="url(#zenGlow)"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'sparky-star',
    name: 'Sparky the Star',
    type: 'builtin',
    description: 'Dynamic cosmic star with stepping rocket boots, rotating celestial corona, and shooting sparkles.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde047"/>
            <stop offset="50%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#facc15" flood-opacity="0.6"/>
          </filter>
        </defs>
        <style>
          /* Natural Stepping Cosmic Boots */
          @keyframes starStepL {
            0%, 100% { transform: translate(-4px, 0px) rotate(6deg); }
            25% { transform: translate(-2px, -3px) rotate(12deg); }
            50% { transform: translate(3px, -6px) rotate(-12deg); }
            75% { transform: translate(4px, -1px) rotate(-5deg); }
          }
          @keyframes starStepR {
            0%, 100% { transform: translate(3px, -6px) rotate(-12deg); }
            25% { transform: translate(4px, -1px) rotate(-5deg); }
            50% { transform: translate(-4px, 0px) rotate(6deg); }
            75% { transform: translate(-2px, -3px) rotate(12deg); }
          }
          /* Body Walk Bobbing */
          @keyframes starBodyWalk {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-3.5deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(-4px) rotate(3.5deg); }
          }
          @keyframes sparkleSpin {
            0% { transform: rotate(0deg) scale(0.8); opacity: 0.4; }
            50% { transform: rotate(180deg) scale(1.3); opacity: 1; }
            100% { transform: rotate(360deg) scale(0.8); opacity: 0.4; }
          }
          @keyframes starEyes {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.12); }
          }
          .star-step-l { animation: starStepL 0.75s ease-in-out infinite; transform-origin: 52px 116px; }
          .star-step-r { animation: starStepR 0.75s ease-in-out infinite; transform-origin: 78px 116px; }
          .star-body-walk { animation: starBodyWalk 0.75s ease-in-out infinite; transform-origin: 65px 65px; }
          .sparkle-orbit { animation: sparkleSpin 3s linear infinite; transform-origin: 65px 65px; }
          .star-eyes { animation: starEyes 3.8s ease-in-out infinite; transform-origin: 65px 68px; }
          /* Speaking Mouth Movement Animation */
          @keyframes starSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.7); }
            50% { transform: scale(0.9, 0.7); }
            75% { transform: scale(1.1, 1.5); }
          }
          .star-voice-mouth {
            animation: starSpeak 0.4s ease-in-out infinite;
            transform-origin: 65px 76px;
          }
        </style>

        <!-- Orbiting Sparkle Starbursts -->
        <g class="sparkle-orbit">
          <polygon points="22,24 24,28 28,30 24,32 22,36 20,32 16,30 20,28" fill="#facc15"/>
          <polygon points="108,24 110,28 114,30 110,32 108,36 106,32 102,30 106,28" fill="#facc15"/>
          <polygon points="110,100 112,103 115,105 112,107 110,110 108,107 105,105 108,103" fill="#fde047"/>
        </g>

        <!-- Stepping Boots -->
        <g>
          <ellipse class="star-step-l" cx="52" cy="116" rx="8" ry="5" fill="#ca8a04"/>
          <ellipse class="star-step-r" cx="78" cy="116" rx="8" ry="5" fill="#ca8a04"/>
        </g>

        <!-- Walking Star Body -->
        <g class="star-body-walk" filter="url(#starGlow)">
          <polygon points="65,18 78,48 110,50 84,72 93,104 65,86 37,104 46,72 20,50 52,48" 
                   fill="url(#starGrad)" stroke="#eab308" stroke-width="2" stroke-linejoin="round"/>

          <!-- Eyes -->
          <g class="star-eyes">
            <circle cx="55" cy="66" r="4.8" fill="#0f172a"/>
            <circle cx="75" cy="66" r="4.8" fill="#0f172a"/>
            <circle cx="56.5" cy="64.5" r="1.8" fill="white"/>
            <circle cx="76.5" cy="64.5" r="1.8" fill="white"/>
          </g>

          <!-- Rosy Cheeks -->
          <ellipse cx="47" cy="73" rx="5" ry="3" fill="#f43f5e" opacity="0.45"/>
          <ellipse cx="83" cy="73" rx="5" ry="3" fill="#f43f5e" opacity="0.45"/>

          <!-- Smile with Speaking Animation -->
          <path class="star-voice-mouth" d="M59 74 Q65 80 71 74" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'doraemon',
    name: 'Doraemon (டோரேமான்)',
    type: 'builtin',
    description: 'Beloved robotic cat who walks in side profile with counter-swinging arms, turns front to wave cheerfully and speak.',
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="doreBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
          <linearGradient id="doreBell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="60%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#ca8a04"/>
          </linearGradient>
          <filter id="doreShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
          </filter>
        </defs>
        <style>
          /* Toggle Side Profile Walk vs Front Posing View */
          @keyframes toggleSideWalk {
            0%, 28% { opacity: 1; visibility: visible; }
            28.1%, 49.9% { opacity: 0; visibility: hidden; }
            50%, 78% { opacity: 1; visibility: visible; }
            78.1%, 100% { opacity: 0; visibility: hidden; }
          }
          @keyframes toggleFrontPose {
            0%, 28% { opacity: 0; visibility: hidden; }
            28.1%, 49.9% { opacity: 1; visibility: visible; }
            50%, 78% { opacity: 0; visibility: hidden; }
            78.1%, 100% { opacity: 1; visibility: visible; }
          }

          /* Side Profile Stride: Front Leg */
          @keyframes sideDoreLegFront {
            0% { transform: rotate(26deg) translateY(0px); }
            3.5% { transform: rotate(0deg) translateY(0px); }
            7% { transform: rotate(-26deg) translateY(-2px); }
            10.5% { transform: rotate(8deg) translateY(-6px); }
            14% { transform: rotate(26deg) translateY(0px); }
            17.5% { transform: rotate(0deg) translateY(0px); }
            21% { transform: rotate(-26deg) translateY(-2px); }
            24.5% { transform: rotate(8deg) translateY(-6px); }
            28%, 50% { transform: rotate(0deg) translateY(0px); }
            53.5% { transform: rotate(26deg) translateY(0px); }
            57% { transform: rotate(0deg) translateY(0px); }
            60.5% { transform: rotate(-26deg) translateY(-2px); }
            64% { transform: rotate(8deg) translateY(-6px); }
            67.5% { transform: rotate(26deg) translateY(0px); }
            71% { transform: rotate(0deg) translateY(0px); }
            74.5% { transform: rotate(-26deg) translateY(-2px); }
            78%, 100% { transform: rotate(0deg) translateY(0px); }
          }

          /* Side Profile Stride: Back Leg */
          @keyframes sideDoreLegBack {
            0% { transform: rotate(-26deg) translateY(-2px); }
            3.5% { transform: rotate(8deg) translateY(-6px); }
            7% { transform: rotate(26deg) translateY(0px); }
            10.5% { transform: rotate(0deg) translateY(0px); }
            14% { transform: rotate(-26deg) translateY(-2px); }
            17.5% { transform: rotate(8deg) translateY(-6px); }
            21% { transform: rotate(26deg) translateY(0px); }
            24.5% { transform: rotate(0deg) translateY(0px); }
            28%, 50% { transform: rotate(0deg) translateY(0px); }
            53.5% { transform: rotate(-26deg) translateY(-2px); }
            57% { transform: rotate(8deg) translateY(-6px); }
            60.5% { transform: rotate(26deg) translateY(0px); }
            64% { transform: rotate(0deg) translateY(0px); }
            67.5% { transform: rotate(-26deg) translateY(-2px); }
            71% { transform: rotate(8deg) translateY(-6px); }
            74.5% { transform: rotate(26deg) translateY(0px); }
            78%, 100% { transform: rotate(0deg) translateY(0px); }
          }

          /* Side Arms Counter-Swinging */
          @keyframes sideDoreArmFront {
            0% { transform: rotate(-28deg); }
            7% { transform: rotate(28deg); }
            14% { transform: rotate(-28deg); }
            21% { transform: rotate(28deg); }
            28%, 50% { transform: rotate(0deg); }
            57% { transform: rotate(28deg); }
            64% { transform: rotate(-28deg); }
            71% { transform: rotate(28deg); }
            78%, 100% { transform: rotate(0deg); }
          }
          @keyframes sideDoreArmBack {
            0% { transform: rotate(28deg); }
            7% { transform: rotate(-28deg); }
            14% { transform: rotate(28deg); }
            21% { transform: rotate(-28deg); }
            28%, 50% { transform: rotate(0deg); }
            57% { transform: rotate(-28deg); }
            64% { transform: rotate(28deg); }
            71% { transform: rotate(-28deg); }
            78%, 100% { transform: rotate(0deg); }
          }

          /* Side Body Step Bobbing */
          @keyframes sideDoreBob {
            0%, 7%, 14%, 21%, 28%, 50%, 57%, 64%, 71%, 78% { transform: translateY(0px); }
            3.5%, 10.5%, 17.5%, 24.5%, 53.5%, 60.5%, 67.5%, 74.5% { transform: translateY(-3px); }
          }

          /* Front Pose Idle Breathing and High Wave */
          @keyframes frontDoreIdle {
            0%, 100% { transform: translateY(0px) scale(1); }
            35%, 85% { transform: translateY(-2.5px) scale(1.02); }
            42%, 92% { transform: translateY(-1px) scale(1.01); }
          }
          @keyframes frontDoreWave {
            0%, 28%, 50%, 78%, 100% { transform: rotate(0deg); }
            31%, 37%, 43%, 81%, 87%, 93% { transform: rotate(-22deg); }
            34%, 40%, 46%, 84%, 90%, 96% { transform: rotate(18deg); }
          }
          @keyframes doreBlink {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.1); }
          }
          @keyframes doreSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.4); }
            50% { transform: scale(0.95, 0.85); }
            75% { transform: scale(1.1, 1.3); }
          }

          .side-walk-view { animation: toggleSideWalk 12s linear infinite; }
          .front-pose-view { animation: toggleFrontPose 12s linear infinite; }
          .side-dore-leg-front { animation: sideDoreLegFront 12s linear infinite; transform-origin: 70px 92px; }
          .side-dore-leg-back { animation: sideDoreLegBack 12s linear infinite; transform-origin: 62px 92px; }
          .side-dore-arm-front { animation: sideDoreArmFront 12s linear infinite; transform-origin: 70px 72px; }
          .side-dore-arm-back { animation: sideDoreArmBack 12s linear infinite; transform-origin: 58px 72px; }
          .side-dore-body { animation: sideDoreBob 12s linear infinite; transform-origin: 65px 105px; }
          .front-dore-body { animation: frontDoreIdle 12s linear infinite; transform-origin: 65px 115px; }
          .front-dore-wave-arm { animation: frontDoreWave 12s linear infinite; transform-origin: 40px 75px; }
          .dore-eyes { animation: doreBlink 3.8s ease-in-out infinite; transform-origin: 65px 33px; }
          .dore-side-eye { animation: doreBlink 3.8s ease-in-out infinite; transform-origin: 76px 33px; }
          .dore-mouth { animation: doreSpeak 0.38s ease-in-out infinite; transform-origin: 65px 62px; }
        </style>

        <!-- Ground Shadow -->
        <ellipse cx="65" cy="122" rx="32" ry="4" fill="#000000" opacity="0.18"/>

        <!-- ============================================== -->
        <!-- 1. SIDE-PROFILE WALKING VIEW (Walk Phase)     -->
        <!-- ============================================== -->
        <g class="side-walk-view" filter="url(#doreShadow)">
          <!-- Side Back Arm (Background) -->
          <g class="side-dore-arm-back">
            <path d="M58 72 L46 84" stroke="#0284c7" stroke-width="10" stroke-linecap="round"/>
            <path d="M58 72 L46 84" stroke="#182230" stroke-width="2.2" fill="none"/>
            <circle cx="44" cy="86" r="6.5" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>
          </g>

          <!-- Side Back Leg and White Shoe -->
          <g class="side-dore-leg-back">
            <path d="M58 88 L52 110 L64 110 L68 88 Z" fill="#0284c7" stroke="#182230" stroke-width="2.2"/>
            <ellipse cx="56" cy="116" rx="12" ry="5.5" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
          </g>

          <!-- Side Front Leg and White Shoe -->
          <g class="side-dore-leg-front">
            <path d="M66 88 L72 110 L84 110 L78 88 Z" fill="url(#doreBlue)" stroke="#182230" stroke-width="2.2"/>
            <ellipse cx="78" cy="116" rx="12" ry="5.5" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
          </g>

          <!-- Side Body, Head, Collar and Belly -->
          <g class="side-dore-body">
            <!-- Red Tail (Back Left) -->
            <circle cx="42" cy="94" r="5" fill="#ef4444" stroke="#182230" stroke-width="2.2"/>

            <!-- Blue Torso Profile -->
            <path d="M48 68 C44 82 48 100 65 100 C80 100 86 86 84 68 Z" fill="url(#doreBlue)" stroke="#182230" stroke-width="2.4"/>

            <!-- White Tummy Pouch (Front Right Profile) -->
            <path d="M62 70 C62 86 66 96 76 96 C82 96 85 86 84 70 Z" fill="#ffffff" stroke="#182230" stroke-width="2"/>

            <!-- 4D Pocket Side View -->
            <path d="M68 76 C76 76 82 80 82 85 C76 88 70 86 68 76 Z" fill="#ffffff" stroke="#182230" stroke-width="1.8"/>

            <!-- Red Collar Band -->
            <path d="M50 63 Q68 67 86 63" stroke="#dc2626" stroke-width="6.5" stroke-linecap="round"/>
            <path d="M50 63 Q68 67 86 63" stroke="#182230" stroke-width="2.2" fill="none"/>

            <!-- Golden Bell hanging in front -->
            <circle cx="82" cy="70" r="5.5" fill="url(#doreBell)" stroke="#182230" stroke-width="1.8"/>
            <circle cx="82" cy="71" r="1.5" fill="#182230"/>

            <!-- Blue Head Side View -->
            <circle cx="68" cy="42" r="32" fill="url(#doreBlue)" stroke="#182230" stroke-width="2.6"/>

            <!-- White Face Profile Mask -->
            <path d="M62 24 C78 24 92 34 90 52 C88 64 74 66 62 62 Z" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>

            <!-- Side Profile Eye with Blink -->
            <g class="dore-side-eye">
              <ellipse cx="76" cy="33" rx="6.5" ry="9" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>
              <circle cx="78.5" cy="33.5" r="2.4" fill="#182230"/>
              <circle cx="79.5" cy="32.5" r="0.8" fill="#ffffff"/>
            </g>

            <!-- Red Nose (Facing Right) -->
            <circle cx="90" cy="38" r="4.8" fill="#ef4444" stroke="#182230" stroke-width="2"/>
            <circle cx="88.5" cy="36.5" r="1.2" fill="#ffffff"/>

            <!-- Whiskers (Pointing Right) -->
            <g stroke="#182230" stroke-width="1.8" stroke-linecap="round">
              <line x1="82" y1="44" x2="98" y2="42"/>
              <line x1="82" y1="49" x2="100" y2="49"/>
              <line x1="82" y1="54" x2="98" y2="56"/>
            </g>

            <!-- Cheerful Smile Line -->
            <path d="M72 52 Q82 58 88 52" stroke="#182230" stroke-width="2" stroke-linecap="round" fill="none"/>
          </g>

          <!-- Side Front Arm and Hand (Foreground Counter-Swing) -->
          <g class="side-dore-arm-front">
            <path d="M70 72 L84 84" stroke="url(#doreBlue)" stroke-width="10.5" stroke-linecap="round"/>
            <path d="M70 72 L84 84" stroke="#182230" stroke-width="2.2" fill="none"/>
            <circle cx="86" cy="86" r="6.5" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>
          </g>
        </g>

        <!-- ============================================== -->
        <!-- 2. FRONT-FACING POSE VIEW (Pause and Toast/Wave) -->
        <!-- ============================================== -->
        <g class="front-pose-view" filter="url(#doreShadow)">
          <!-- Ground Feet Together -->
          <ellipse cx="48" cy="116" rx="12" ry="5.5" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
          <ellipse cx="82" cy="116" rx="12" ry="5.5" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>

          <!-- Front Resting Body -->
          <g class="front-dore-body">
            <!-- Red Tail Behind -->
            <circle cx="93" cy="102" r="5" fill="#ef4444" stroke="#182230" stroke-width="2.2"/>

            <!-- Blue Body and Legs -->
            <path d="M44 80 L40 108 Q40 114 47 114 L62 114 L62 107 L68 107 L68 114 L83 114 Q90 114 90 108 L86 80 Z" 
                  fill="url(#doreBlue)" stroke="#182230" stroke-width="2.6" stroke-linejoin="round"/>

            <!-- White Tummy -->
            <ellipse cx="65" cy="94" rx="19" ry="14" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>

            <!-- 4D Pocket -->
            <path d="M50 92 L80 92 Q65 109 50 92 Z" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>

            <!-- Right Arm Resting on Side -->
            <g>
              <path d="M85 86 L98 94" stroke="url(#doreBlue)" stroke-width="10" stroke-linecap="round"/>
              <path d="M85 86 L98 94" stroke="#182230" stroke-width="2.2" fill="none"/>
              <circle cx="102" cy="97" r="6.8" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>
            </g>

            <!-- Left Arm Raised High Waving to User! -->
            <g class="front-dore-wave-arm">
              <path d="M45 80 L26 58" stroke="url(#doreBlue)" stroke-width="11" stroke-linecap="round"/>
              <path d="M45 80 L26 58" stroke="#182230" stroke-width="2.2" fill="none"/>
              <circle cx="21" cy="52" r="7.5" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>
            </g>

            <!-- Red Collar Band -->
            <path d="M40 74 Q65 82 90 74" stroke="#dc2626" stroke-width="6.5" stroke-linecap="round"/>
            <path d="M40 74 Q65 82 90 74" stroke="#182230" stroke-width="2.2" fill="none"/>

            <!-- Golden Bell -->
            <circle cx="65" cy="81" r="6.5" fill="url(#doreBell)" stroke="#182230" stroke-width="1.8"/>
            <line x1="59.5" y1="79.5" x2="70.5" y2="79.5" stroke="#182230" stroke-width="1.6"/>
            <circle cx="65" cy="82.8" r="1.8" fill="#182230"/>
            <line x1="65" y1="84.6" x2="65" y2="87.5" stroke="#182230" stroke-width="1.6"/>

            <!-- Round Blue Head -->
            <circle cx="65" cy="46" r="36" fill="url(#doreBlue)" stroke="#182230" stroke-width="2.8"/>

            <!-- White Face Mask -->
            <path d="M38 51 C38 30 50 26 65 26 C80 26 92 30 92 51 C92 68 80 75 65 75 C50 75 38 68 38 51 Z" 
                  fill="#ffffff" stroke="#182230" stroke-width="2.6"/>

            <!-- Eyes with Blink -->
            <g class="dore-eyes">
              <ellipse cx="57.5" cy="32" rx="7.5" ry="11" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
              <ellipse cx="72.5" cy="32" rx="7.5" ry="11" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
              <circle cx="60" cy="33" r="2.6" fill="#182230"/>
              <circle cx="70" cy="33" r="2.6" fill="#182230"/>
              <circle cx="61" cy="32" r="0.9" fill="#ffffff"/>
              <circle cx="71" cy="32" r="0.9" fill="#ffffff"/>
            </g>

            <!-- Red Nose -->
            <circle cx="65" cy="40" r="5" fill="#ef4444" stroke="#182230" stroke-width="2"/>
            <circle cx="63.6" cy="38.6" r="1.3" fill="#ffffff"/>

            <line x1="65" y1="45" x2="65" y2="53" stroke="#182230" stroke-width="2.2"/>

            <!-- Cheerful Speaking Mouth -->
            <g class="dore-mouth">
              <path d="M44 54 Q65 57 86 54 Q86 76 65 76 Q44 76 44 54 Z" 
                    fill="#b91c1c" stroke="#182230" stroke-width="2.4" stroke-linejoin="round"/>
              <path d="M52 66 Q65 58 78 66 Q65 76 52 66 Z" 
                    fill="#f97316" stroke="#182230" stroke-width="1.6"/>
              <path d="M43 54 Q65 57 87 54" fill="none" stroke="#182230" stroke-width="2.4" stroke-linecap="round"/>
            </g>

            <!-- Whiskers -->
            <g stroke="#182230" stroke-width="2" stroke-linecap="round">
              <line x1="33" y1="44" x2="55" y2="47"/>
              <line x1="30" y1="52" x2="55" y2="52"/>
              <line x1="33" y1="59" x2="55" y2="57"/>
              <line x1="75" y1="47" x2="97" y2="44"/>
              <line x1="75" y1="52" x2="100" y2="52"/>
              <line x1="75" y1="57" x2="97" y2="59"/>
            </g>
          </g>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'human-buddy',
    name: 'Dr. Buddy (நலன் நண்பன்)',
    type: 'builtin',
    description: 'Wellness companion who walks in side profile with a glass of water, turns front to toast you, and shares healthy reminders.',
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="hbHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#94a3b8"/>
            <stop offset="50%" stop-color="#475569"/>
            <stop offset="100%" stop-color="#334155"/>
          </linearGradient>
          <linearGradient id="hbSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="100%" stop-color="#fba068"/>
          </linearGradient>
          <linearGradient id="hbShirt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#bfdbfe"/>
            <stop offset="100%" stop-color="#60a5fa"/>
          </linearGradient>
          <linearGradient id="hbPants" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
          <linearGradient id="hbShoe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
          <linearGradient id="waterGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.9"/>
          </linearGradient>
          <filter id="hbShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <style>
          /* Toggle Side Profile Walk vs Front Posing View */
          @keyframes toggleSideWalk {
            0%, 28% { opacity: 1; visibility: visible; }
            28.1%, 49.9% { opacity: 0; visibility: hidden; }
            50%, 78% { opacity: 1; visibility: visible; }
            78.1%, 100% { opacity: 0; visibility: hidden; }
          }
          @keyframes toggleFrontPose {
            0%, 28% { opacity: 0; visibility: hidden; }
            28.1%, 49.9% { opacity: 1; visibility: visible; }
            50%, 78% { opacity: 0; visibility: hidden; }
            78.1%, 100% { opacity: 1; visibility: visible; }
          }

          /* Side Profile Stride: Front Leg */
          @keyframes sideLegFrontStride {
            0% { transform: rotate(24deg) translateY(0px); }
            3.5% { transform: rotate(0deg) translateY(0px); }
            7% { transform: rotate(-24deg) translateY(-2px); }
            10.5% { transform: rotate(6deg) translateY(-6px); }
            14% { transform: rotate(24deg) translateY(0px); }
            17.5% { transform: rotate(0deg) translateY(0px); }
            21% { transform: rotate(-24deg) translateY(-2px); }
            24.5% { transform: rotate(6deg) translateY(-6px); }
            28%, 50% { transform: rotate(0deg) translateY(0px); }
            53.5% { transform: rotate(24deg) translateY(0px); }
            57% { transform: rotate(0deg) translateY(0px); }
            60.5% { transform: rotate(-24deg) translateY(-2px); }
            64% { transform: rotate(6deg) translateY(-6px); }
            67.5% { transform: rotate(24deg) translateY(0px); }
            71% { transform: rotate(0deg) translateY(0px); }
            74.5% { transform: rotate(-24deg) translateY(-2px); }
            78%, 100% { transform: rotate(0deg) translateY(0px); }
          }

          /* Side Profile Stride: Back Leg */
          @keyframes sideLegBackStride {
            0% { transform: rotate(-24deg) translateY(-2px); }
            3.5% { transform: rotate(6deg) translateY(-6px); }
            7% { transform: rotate(24deg) translateY(0px); }
            10.5% { transform: rotate(0deg) translateY(0px); }
            14% { transform: rotate(-24deg) translateY(-2px); }
            17.5% { transform: rotate(6deg) translateY(-6px); }
            21% { transform: rotate(24deg) translateY(0px); }
            24.5% { transform: rotate(0deg) translateY(0px); }
            28%, 50% { transform: rotate(0deg) translateY(0px); }
            53.5% { transform: rotate(-24deg) translateY(-2px); }
            57% { transform: rotate(6deg) translateY(-6px); }
            60.5% { transform: rotate(24deg) translateY(0px); }
            64% { transform: rotate(0deg) translateY(0px); }
            67.5% { transform: rotate(-24deg) translateY(-2px); }
            71% { transform: rotate(6deg) translateY(-6px); }
            74.5% { transform: rotate(24deg) translateY(0px); }
            78%, 100% { transform: rotate(0deg) translateY(0px); }
          }

          /* Side Body Step Bobbing */
          @keyframes sideBodyBob {
            0%, 7%, 14%, 21%, 28%, 50%, 57%, 64%, 71%, 78% { transform: translateY(0px); }
            3.5%, 10.5%, 17.5%, 24.5%, 53.5%, 60.5%, 67.5%, 74.5% { transform: translateY(-3px); }
          }

          /* Front Pose Idle Breathing and Toast */
          @keyframes frontPoseIdle {
            0%, 100% { transform: translateY(0px) scale(1); }
            35%, 85% { transform: translateY(-2px) scale(1.02); }
            42%, 92% { transform: translateY(-1px) scale(1.01); }
          }

          /* Eye Blink */
          @keyframes hbBlink {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.1); }
          }

          /* Speaking Mouth */
          @keyframes hbSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.4); }
            50% { transform: scale(0.95, 0.85); }
            75% { transform: scale(1.1, 1.3); }
          }

          .side-walk-view { animation: toggleSideWalk 12s linear infinite; }
          .front-pose-view { animation: toggleFrontPose 12s linear infinite; }
          .side-leg-front-elem { animation: sideLegFrontStride 12s linear infinite; transform-origin: 72px 84px; }
          .side-leg-back-elem { animation: sideLegBackStride 12s linear infinite; transform-origin: 66px 84px; }
          .side-body-elem { animation: sideBodyBob 12s linear infinite; transform-origin: 70px 100px; }
          .front-pose-body { animation: frontPoseIdle 12s linear infinite; transform-origin: 65px 115px; }
          .hb-eyes { animation: hbBlink 3.8s ease-in-out infinite; transform-origin: 65px 44px; }
          .hb-mouth { animation: hbSpeak 0.38s ease-in-out infinite; transform-origin: 65px 52px; }
        </style>

        <!-- Ground Shadow -->
        <ellipse cx="68" cy="123" rx="30" ry="4" fill="#000000" opacity="0.18"/>

        <!-- ============================================== -->
        <!-- 1. SIDE-PROFILE WALKING VIEW (Active during Walk) -->
        <!-- ============================================== -->
        <g class="side-walk-view" filter="url(#hbShadow)">
          <!-- Side Back Leg -->
          <g class="side-leg-back-elem">
            <path d="M62 82 L58 102 L56 116 L65 116 L68 102 L70 82 Z" fill="#1e293b"/>
            <!-- Back Shoe -->
            <path d="M52 115 L68 115 Q72 115 72 118 L72 122 L48 122 Q48 118 52 115 Z" fill="#451a03"/>
          </g>

          <!-- Side Front Leg -->
          <g class="side-leg-front-elem">
            <path d="M68 82 L72 102 L74 116 L83 116 L80 102 L76 82 Z" fill="url(#hbPants)"/>
            <!-- Front Shoe -->
            <path d="M68 115 L86 115 Q90 115 90 118 L90 122 L64 122 Q64 118 68 115 Z" fill="url(#hbShoe)"/>
          </g>

          <!-- Side Body, Head, and Arm holding water -->
          <g class="side-body-elem">
            <!-- Torso: Side Blue Shirt -->
            <path d="M56 56 L78 56 L82 84 L58 84 Z" fill="url(#hbShirt)" stroke="#0f172a" stroke-width="1.8"/>
            <path d="M58 82 L82 82 L82 86 L58 86 Z" fill="#0f172a"/>

            <!-- Arm holding Water Glass -->
            <g>
              <path d="M68 58 L82 72 L88 70" stroke="url(#hbShirt)" stroke-width="10" stroke-linecap="round" fill="none"/>
              <circle cx="89" cy="70" r="4.5" fill="url(#hbSkin)"/>
              <!-- Water Glass with Ice in Side View -->
              <path d="M86 60 L98 60 L96 74 L88 74 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.4" opacity="0.9"/>
              <path d="M87 64 L97 64 L95 73 L89 73 Z" fill="url(#waterGlass)"/>
              <rect x="89" y="66" width="3" height="3" rx="0.5" fill="white" opacity="0.8"/>
            </g>

            <!-- Neck in Side View -->
            <rect x="64" y="48" width="9" height="9" fill="url(#hbSkin)"/>
            <!-- White Collar -->
            <polygon points="63,56 74,56 71,51" fill="white"/>

            <!-- Head in Side Profile -->
            <path d="M56 36 C56 22 70 18 80 26 C86 31 87 40 85 48 C81 54 70 54 62 50 C58 46 56 41 56 36 Z" 
                  fill="url(#hbSkin)" stroke="#0f172a" stroke-width="1.8"/>

            <!-- Beard and Mustache in Side View -->
            <path d="M72 44 Q83 45 80 50 Q73 54 66 52 Z" fill="#64748b"/>
            <path d="M75 42 Q83 42 81 45 Z" fill="#475569"/>

            <!-- Side Hair (Swept Back Grey) -->
            <path d="M54 36 C52 20 66 14 78 14 C84 14 86 19 82 23 C76 21 68 22 62 27 C58 31 56 36 54 36 Z" 
                  fill="url(#hbHair)"/>

            <!-- Glasses in Side View -->
            <rect x="73" y="32" width="12" height="8" rx="2" fill="none" stroke="#0f172a" stroke-width="2"/>
            <line x1="64" y1="34" x2="73" y2="34" stroke="#0f172a" stroke-width="1.8"/>
            <!-- Eye behind glasses -->
            <circle cx="78" cy="36" r="1.8" fill="#0f172a"/>

            <!-- Ear -->
            <ellipse cx="62" cy="38" rx="3.5" ry="4.5" fill="url(#hbSkin)" stroke="#0f172a" stroke-width="1.2"/>
          </g>
        </g>

        <!-- ============================================== -->
        <!-- 2. FRONT-FACING POSE VIEW (Active during Pose) -->
        <!-- ============================================== -->
        <g class="front-pose-view" filter="url(#hbShadow)">
          <g class="front-pose-body">
            <!-- Both Legs Planted Side by Side -->
            <g>
              <rect x="48" y="82" width="12" height="34" rx="4" fill="url(#hbPants)"/>
              <rect x="68" y="82" width="12" height="34" rx="4" fill="url(#hbPants)"/>
              <!-- Shoes Planted -->
              <path d="M44 114 L62 114 Q66 114 66 118 L66 122 L42 122 Q42 118 44 114 Z" fill="url(#hbShoe)"/>
              <path d="M66 114 L84 114 Q88 114 88 118 L88 122 L64 122 Q64 118 66 114 Z" fill="url(#hbShoe)"/>
            </g>

            <!-- Torso: Light Blue Polo Shirt with Placket -->
            <path d="M43 56 L85 56 L88 84 L40 84 Z" fill="url(#hbShirt)" stroke="#0f172a" stroke-width="1.8"/>
            <rect x="40" y="82" width="48" height="5" fill="#0f172a"/>
            <!-- Placket and Pen in Pocket -->
            <rect x="62" y="56" width="4" height="15" fill="#93c5fd"/>
            <circle cx="64" cy="62" r="1" fill="#1e293b"/>
            <circle cx="64" cy="68" r="1" fill="#1e293b"/>
            <!-- Pocket with Pen -->
            <path d="M72 65 L81 65 L80 73 L73 73 Z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1"/>
            <line x1="77" y1="62" x2="77" y2="67" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/>

            <!-- Left Arm: Resting at Waist / Hip -->
            <g>
              <path d="M42 58 L32 72 L36 78" stroke="url(#hbShirt)" stroke-width="9" stroke-linecap="round" fill="none"/>
              <circle cx="37" cy="80" r="4.5" fill="url(#hbSkin)"/>
              <!-- Watch -->
              <rect x="33" y="74" width="7" height="2.5" rx="1" fill="#0f172a"/>
            </g>

            <!-- Right Arm: Raised Holding Water Glass in Cheers / Toast -->
            <g>
              <path d="M85 58 L98 64 L96 74" stroke="url(#hbShirt)" stroke-width="9" stroke-linecap="round" fill="none"/>
              <circle cx="95" cy="76" r="4.5" fill="url(#hbSkin)"/>
              <!-- Glass of Water with Ice -->
              <path d="M91 62 L105 62 L103 76 L93 76 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.6" opacity="0.95"/>
              <path d="M92 66 L104 66 L102 75 L94 75 Z" fill="url(#waterGlass)"/>
              <rect x="94" y="68" width="3.5" height="3.5" rx="0.5" fill="white" opacity="0.85"/>
              <rect x="99" y="70" width="2.5" height="2.5" rx="0.5" fill="white" opacity="0.75"/>
            </g>

            <!-- Neck and White Collar -->
            <rect x="59" y="48" width="10" height="9" fill="url(#hbSkin)"/>
            <polygon points="56,56 64,56 60,50" fill="white"/>
            <polygon points="72,56 64,56 68,50" fill="white"/>

            <!-- Head: Facing Front -->
            <ellipse cx="64" cy="40" rx="18" ry="17" fill="url(#hbSkin)" stroke="#0f172a" stroke-width="1.8"/>

            <!-- Salt-and-Pepper Hair -->
            <path d="M46 36 C44 20 54 13 64 13 C74 13 84 20 82 36 C78 28 72 26 64 26 C56 26 50 28 46 36 Z" 
                  fill="url(#hbHair)"/>
            <!-- Side Hair Volume -->
            <path d="M45 36 C43 40 45 44 47 46" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none"/>
            <path d="M83 36 C85 40 83 44 81 46" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none"/>

            <!-- Beard and Mustache -->
            <path d="M52 42 C52 53 76 53 76 42 C74 48 70 51 64 51 C58 51 54 48 52 42 Z" fill="#64748b"/>
            <path d="M57 43 Q64 41 71 43 Q64 46 57 43 Z" fill="#475569"/>

            <!-- Glasses (Rectangular Black Frames) -->
            <rect x="51" y="32" width="11" height="8" rx="2" fill="none" stroke="#0f172a" stroke-width="2"/>
            <rect x="66" y="32" width="11" height="8" rx="2" fill="none" stroke="#0f172a" stroke-width="2"/>
            <line x1="62" y1="36" x2="66" y2="36" stroke="#0f172a" stroke-width="2"/>

            <!-- Eyes behind Glasses with Blink -->
            <g class="hb-eyes">
              <circle cx="56.5" cy="36" r="2.2" fill="#0f172a"/>
              <circle cx="71.5" cy="36" r="2.2" fill="#0f172a"/>
              <circle cx="57.5" cy="35" r="0.9" fill="white"/>
              <circle cx="72.5" cy="35" r="0.9" fill="white"/>
            </g>

            <!-- Warm Friendly Smile -->
            <path class="hb-mouth" d="M59 46 Q64 50 69 46" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none"/>

            <!-- Cheeks -->
            <ellipse cx="50" cy="40" rx="3" ry="2" fill="#f43f5e" opacity="0.3"/>
            <ellipse cx="78" cy="40" rx="3" ry="2" fill="#f43f5e" opacity="0.3"/>
          </g>
        </g>
      </svg>
    `)}`,
  },
];

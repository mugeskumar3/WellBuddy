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
    description: 'Walkable 4-legged animated kitten mascot with walking paws, swishing tail, and curious ears.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="100%" stop-color="#f97316"/>
          </linearGradient>
        </defs>
        <style>
          /* 12-Second Synchronized Walk-and-Pose Cadence */
          @keyframes catWalkBob {
            0%, 7%, 14%, 21%, 28% { transform: translateY(0px) rotate(0deg); }
            3.5%, 17.5% { transform: translateY(-3px) rotate(1.5deg); }
            10.5%, 24.5% { transform: translateY(-3px) rotate(-1.5deg); }
            28% { transform: translateY(0px) rotate(0deg); }
            32% { transform: translateY(-3px) rotate(-3deg) scale(1.03); }
            36% { transform: translateY(-4px) rotate(-3deg) scale(1.04); }
            42% { transform: translateY(-2px) rotate(-2deg) scale(1.02); }
            46% { transform: translateY(0px) rotate(0deg); }
            48% { transform: translateY(-1px) rotate(0deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            50%, 57%, 64%, 71%, 78% { transform: translateY(0px) rotate(0deg); }
            53.5%, 67.5% { transform: translateY(-3px) rotate(1.5deg); }
            60.5%, 74.5% { transform: translateY(-3px) rotate(-1.5deg); }
            78% { transform: translateY(0px) rotate(0deg); }
            82% { transform: translateY(-3px) rotate(3deg) scale(1.03); }
            86% { transform: translateY(-4px) rotate(3deg) scale(1.04); }
            92% { transform: translateY(-2px) rotate(2deg) scale(1.02); }
            96% { transform: translateY(0px) rotate(0deg); }
            98% { transform: translateY(-1px) rotate(0deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes pawWalkFL {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(-3px, -2px) rotate(8deg); }
            7% { transform: translate(0, 0) rotate(0deg); }
            10.5% { transform: translate(4px, -6px) rotate(-10deg); }
            14% { transform: translate(2px, 0px) rotate(-2deg); }
            17.5% { transform: translate(-3px, -2px) rotate(8deg); }
            21% { transform: translate(0, 0) rotate(0deg); }
            24.5% { transform: translate(4px, -6px) rotate(-10deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(4px, -6px) rotate(-10deg); }
            57% { transform: translate(2px, 0px) rotate(-2deg); }
            60.5% { transform: translate(-3px, -2px) rotate(8deg); }
            64% { transform: translate(0, 0) rotate(0deg); }
            67.5% { transform: translate(4px, -6px) rotate(-10deg); }
            71% { transform: translate(2px, 0px) rotate(-2deg); }
            74.5% { transform: translate(-3px, -2px) rotate(8deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes pawWalkFR {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(4px, -6px) rotate(-10deg); }
            7% { transform: translate(2px, 0px) rotate(-2deg); }
            10.5% { transform: translate(-3px, -2px) rotate(8deg); }
            14% { transform: translate(0, 0) rotate(0deg); }
            17.5% { transform: translate(4px, -6px) rotate(-10deg); }
            21% { transform: translate(2px, 0px) rotate(-2deg); }
            24.5% { transform: translate(-3px, -2px) rotate(8deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(-3px, -2px) rotate(8deg); }
            57% { transform: translate(0, 0) rotate(0deg); }
            60.5% { transform: translate(4px, -6px) rotate(-10deg); }
            64% { transform: translate(2px, 0px) rotate(-2deg); }
            67.5% { transform: translate(-3px, -2px) rotate(8deg); }
            71% { transform: translate(0, 0) rotate(0deg); }
            74.5% { transform: translate(4px, -6px) rotate(-10deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes pawWalkBL {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(4px, -5px) rotate(-10deg); }
            7% { transform: translate(2px, 0px) rotate(-2deg); }
            10.5% { transform: translate(-3px, -2px) rotate(8deg); }
            14% { transform: translate(0, 0) rotate(0deg); }
            17.5% { transform: translate(4px, -5px) rotate(-10deg); }
            21% { transform: translate(2px, 0px) rotate(-2deg); }
            24.5% { transform: translate(-3px, -2px) rotate(8deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(-3px, -2px) rotate(8deg); }
            57% { transform: translate(0, 0) rotate(0deg); }
            60.5% { transform: translate(4px, -5px) rotate(-10deg); }
            64% { transform: translate(2px, 0px) rotate(-2deg); }
            67.5% { transform: translate(-3px, -2px) rotate(8deg); }
            71% { transform: translate(0, 0) rotate(0deg); }
            74.5% { transform: translate(4px, -5px) rotate(-10deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes pawWalkBR {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(-3px, -2px) rotate(8deg); }
            7% { transform: translate(0, 0) rotate(0deg); }
            10.5% { transform: translate(4px, -5px) rotate(-10deg); }
            14% { transform: translate(2px, 0px) rotate(-2deg); }
            17.5% { transform: translate(-3px, -2px) rotate(8deg); }
            21% { transform: translate(0, 0) rotate(0deg); }
            24.5% { transform: translate(4px, -5px) rotate(-10deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(4px, -5px) rotate(-10deg); }
            57% { transform: translate(2px, 0px) rotate(-2deg); }
            60.5% { transform: translate(-3px, -2px) rotate(8deg); }
            64% { transform: translate(0, 0) rotate(0deg); }
            67.5% { transform: translate(4px, -5px) rotate(-10deg); }
            71% { transform: translate(2px, 0px) rotate(-2deg); }
            74.5% { transform: translate(-3px, -2px) rotate(8deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          /* Swishing Cat Tail */
          @keyframes tailSwish {
            0%, 28%, 50%, 78%, 100% { transform: rotate(-15deg); }
            32%, 42%, 82%, 92% { transform: rotate(35deg) scale(1.08); }
          }
          /* Ear Twitch */
          @keyframes earTwitchL {
            0%, 85%, 100% { transform: rotate(0deg); }
            90% { transform: rotate(-12deg); }
            95% { transform: rotate(6deg); }
          }
          @keyframes earTwitchR {
            0%, 85%, 100% { transform: rotate(0deg); }
            90% { transform: rotate(12deg); }
            95% { transform: rotate(-6deg); }
          }
          @keyframes catBlink {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.12); }
          }
          .cat-body-group { animation: catWalkBob 12s linear infinite; transform-origin: 65px 75px; }
          .paw-fl { animation: pawWalkFL 12s linear infinite; transform-origin: 50px 114px; }
          .paw-fr { animation: pawWalkFR 12s linear infinite; transform-origin: 80px 114px; }
          .paw-bl { animation: pawWalkBL 12s linear infinite; transform-origin: 38px 116px; }
          .paw-br { animation: pawWalkBR 12s linear infinite; transform-origin: 92px 116px; }
          .cat-tail { animation: tailSwish 12s linear infinite; transform-origin: 95px 75px; }
          .cat-ear-l { animation: earTwitchL 3.8s ease-in-out infinite; transform-origin: 40px 38px; }
          .cat-ear-r { animation: earTwitchR 3.8s ease-in-out infinite; transform-origin: 90px 38px; }
          .cat-eyes { animation: catBlink 3.8s ease-in-out infinite; transform-origin: 65px 62px; }
          /* Speaking Mouth Movement Animation */
          @keyframes catMeowSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.2, 1.8); }
            50% { transform: scale(0.9, 0.8); }
            75% { transform: scale(1.15, 1.6); }
          }
          .cat-voice-mouth {
            animation: catMeowSpeak 0.38s ease-in-out infinite;
            transform-origin: 65px 67px;
          }
        </style>

        <!-- Swishing Tail in back -->
        <path class="cat-tail" d="M92 78 Q118 70 114 42 Q108 42 102 62" stroke="#ea580c" stroke-width="7" stroke-linecap="round" fill="none"/>

        <!-- Back Stepping Paws -->
        <g>
          <ellipse class="paw-bl" cx="38" cy="116" rx="6.5" ry="4.5" fill="#c2410c"/>
          <ellipse class="paw-br" cx="92" cy="116" rx="6.5" ry="4.5" fill="#c2410c"/>
        </g>

        <!-- Walking Cat Body and Head -->
        <g class="cat-body-group">
          <!-- Torso -->
          <ellipse cx="65" cy="80" rx="32" ry="24" fill="url(#catGrad)"/>

          <!-- Front Stepping Paws -->
          <ellipse class="paw-fl" cx="50" cy="114" rx="7" ry="5" fill="#ffedd5"/>
          <ellipse class="paw-fr" cx="80" cy="114" rx="7" ry="5" fill="#ffedd5"/>

          <!-- Head -->
          <circle cx="65" cy="58" r="30" fill="url(#catGrad)"/>

          <!-- Ears with Twitch Animation -->
          <polygon class="cat-ear-l" points="38,40 48,16 62,34" fill="url(#catGrad)"/>
          <polygon class="cat-ear-r" points="92,40 82,16 68,34" fill="url(#catGrad)"/>
          <polygon points="41,38 48,22 58,34" fill="#f472b6" opacity="0.6"/>
          <polygon points="89,38 82,22 72,34" fill="#f472b6" opacity="0.6"/>

          <!-- Cheeks / Muzzle -->
          <ellipse cx="59" cy="68" rx="7" ry="5.5" fill="#ffedd5"/>
          <ellipse cx="71" cy="68" rx="7" ry="5.5" fill="#ffedd5"/>

          <!-- Eyes with Blink -->
          <g class="cat-eyes">
            <ellipse cx="52" cy="54" rx="4.5" ry="6" fill="#1e293b"/>
            <ellipse cx="78" cy="54" rx="4.5" ry="6" fill="#1e293b"/>
            <circle cx="54" cy="52" r="1.8" fill="white"/>
            <circle cx="80" cy="52" r="1.8" fill="white"/>
          </g>

          <!-- Nose and Mouth with Speaking Animation -->
          <polygon points="65,63 61,60 69,60" fill="#f43f5e"/>
          <path class="cat-voice-mouth" d="M59 65 Q65 70 65 65 Q65 70 71 65" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none"/>

          <!-- Whiskers -->
          <line x1="34" y1="62" x2="48" y2="64" stroke="#9a3412" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="33" y1="68" x2="48" y2="67" stroke="#9a3412" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="96" y1="62" x2="82" y2="64" stroke="#9a3412" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="97" y1="68" x2="82" y2="67" stroke="#9a3412" stroke-width="1.8" stroke-linecap="round"/>
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
    description: 'Beloved robotic cat with magical 4D pocket, waving hand, stepping shoes, and cheerful speaking animations.',
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <style>
          /* 12-Second Synchronized Walk-and-Pose Cadence */
          @keyframes doremonWalk {
            0%, 7%, 14%, 21%, 28% { transform: translateY(0px) rotate(0deg); }
            3.5%, 17.5% { transform: translateY(-3px) rotate(1.5deg); }
            10.5%, 24.5% { transform: translateY(-3px) rotate(-1.5deg); }
            28% { transform: translateY(0px) rotate(0deg); }
            32% { transform: translateY(-3px) rotate(-3deg) scale(1.03); }
            36% { transform: translateY(-4px) rotate(-3deg) scale(1.04); }
            42% { transform: translateY(-2px) rotate(-2deg) scale(1.02); }
            46% { transform: translateY(0px) rotate(0deg); }
            48% { transform: translateY(-1px) rotate(0deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            50%, 57%, 64%, 71%, 78% { transform: translateY(0px) rotate(0deg); }
            53.5%, 67.5% { transform: translateY(-3px) rotate(1.5deg); }
            60.5%, 74.5% { transform: translateY(-3px) rotate(-1.5deg); }
            78% { transform: translateY(0px) rotate(0deg); }
            82% { transform: translateY(-3px) rotate(3deg) scale(1.03); }
            86% { transform: translateY(-4px) rotate(3deg) scale(1.04); }
            92% { transform: translateY(-2px) rotate(2deg) scale(1.02); }
            96% { transform: translateY(0px) rotate(0deg); }
            98% { transform: translateY(-1px) rotate(0deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes doremonFootL {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(-3px, -2px) rotate(8deg); }
            7% { transform: translate(0, 0) rotate(0deg); }
            10.5% { transform: translate(4px, -6px) rotate(-10deg); }
            14% { transform: translate(2px, 0px) rotate(-2deg); }
            17.5% { transform: translate(-3px, -2px) rotate(8deg); }
            21% { transform: translate(0, 0) rotate(0deg); }
            24.5% { transform: translate(4px, -6px) rotate(-10deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(4px, -6px) rotate(-10deg); }
            57% { transform: translate(2px, 0px) rotate(-2deg); }
            60.5% { transform: translate(-3px, -2px) rotate(8deg); }
            64% { transform: translate(0, 0) rotate(0deg); }
            67.5% { transform: translate(4px, -6px) rotate(-10deg); }
            71% { transform: translate(2px, 0px) rotate(-2deg); }
            74.5% { transform: translate(-3px, -2px) rotate(8deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes doremonFootR {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(4px, -6px) rotate(-10deg); }
            7% { transform: translate(2px, 0px) rotate(-2deg); }
            10.5% { transform: translate(-3px, -2px) rotate(8deg); }
            14% { transform: translate(0, 0) rotate(0deg); }
            17.5% { transform: translate(4px, -6px) rotate(-10deg); }
            21% { transform: translate(2px, 0px) rotate(-2deg); }
            24.5% { transform: translate(-3px, -2px) rotate(8deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(-3px, -2px) rotate(8deg); }
            57% { transform: translate(0, 0) rotate(0deg); }
            60.5% { transform: translate(4px, -6px) rotate(-10deg); }
            64% { transform: translate(2px, 0px) rotate(-2deg); }
            67.5% { transform: translate(-3px, -2px) rotate(8deg); }
            71% { transform: translate(0, 0) rotate(0deg); }
            74.5% { transform: translate(4px, -6px) rotate(-10deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes doremonWaveArm {
            0%, 28%, 50%, 78%, 100% { transform: rotate(0deg); }
            32%, 42% { transform: rotate(-24deg) scale(1.06); }
            82%, 92% { transform: rotate(-24deg) scale(1.06); }
          }
          @keyframes doremonArmR {
            0%, 7%, 14%, 21%, 28% { transform: rotate(0deg); }
            3.5%, 17.5% { transform: rotate(16deg) translateY(-2px); }
            10.5%, 24.5% { transform: rotate(-14deg) translateY(2px); }
            28%, 46% { transform: rotate(0deg); }
            50%, 57%, 64%, 71%, 78% { transform: rotate(0deg); }
            53.5%, 67.5% { transform: rotate(-14deg) translateY(2px); }
            60.5%, 74.5% { transform: rotate(16deg) translateY(-2px); }
            78%, 100% { transform: rotate(0deg); }
          }
          @keyframes doremonBlink {
            0%, 45%, 49%, 95%, 100% { transform: scaleY(1); }
            47%, 97% { transform: scaleY(0.12); }
          }
          @keyframes doremonBell {
            0%, 28%, 46%, 78%, 96%, 100% { transform: rotate(0deg); }
            3.5%, 17.5%, 53.5%, 67.5% { transform: rotate(-6deg); }
            10.5%, 24.5%, 60.5%, 74.5% { transform: rotate(6deg); }
            34%, 40%, 84%, 90% { transform: rotate(8deg); }
          }
          @keyframes doremonSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.12, 1.35); }
            50% { transform: scale(0.96, 0.82); }
            75% { transform: scale(1.08, 1.25); }
          }
          .doremon-body-group { animation: doremonWalk 12s linear infinite; transform-origin: 65px 105px; }
          .doremon-wave-arm { animation: doremonWaveArm 12s linear infinite; transform-origin: 36px 74px; }
          .doremon-arm-r { animation: doremonArmR 12s linear infinite; transform-origin: 84px 89px; }
          .doremon-foot-l { animation: doremonFootL 12s linear infinite; transform-origin: 47px 118px; }
          .doremon-foot-r { animation: doremonFootR 12s linear infinite; transform-origin: 83px 118px; }
          .doremon-eyes { animation: doremonBlink 3.8s ease-in-out infinite; transform-origin: 65px 33px; }
          .doremon-bell-elem { animation: doremonBell 12s linear infinite; transform-origin: 65px 83px; }
          .doremon-voice-mouth {
            animation: doremonSpeak 0.38s ease-in-out infinite;
            transform-origin: 65px 60px;
          }
        </style>

        <!-- Ground Shadow -->
        <ellipse cx="65" cy="122" rx="32" ry="4.5" fill="#000000" opacity="0.18"/>

        <!-- Stepping White Feet -->
        <g>
          <ellipse class="doremon-foot-l" cx="47" cy="118" rx="12" ry="6" fill="#ffffff" stroke="#182230" stroke-width="2.6"/>
          <ellipse class="doremon-foot-r" cx="83" cy="118" rx="12" ry="6" fill="#ffffff" stroke="#182230" stroke-width="2.6"/>
        </g>

        <!-- Main Doraemon Character Body Group -->
        <g class="doremon-body-group">
          <!-- Red Round Tail -->
          <circle cx="93" cy="104" r="5.5" fill="#ef4444" stroke="#182230" stroke-width="2.4"/>

          <!-- Blue Body Legs and Torso -->
          <path d="M45 80 L40 108 Q40 114 47 114 L62 114 L62 107 L68 107 L68 114 L83 114 Q90 114 90 108 L85 80 Z" 
                fill="#0298d7" stroke="#182230" stroke-width="2.8" stroke-linejoin="round"/>

          <!-- White Tummy -->
          <ellipse cx="65" cy="94" rx="19" ry="14" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>

          <!-- 4D Pocket -->
          <path d="M50 92 L80 92 Q65 109 50 92 Z" fill="#ffffff" stroke="#182230" stroke-width="2.2"/>

          <!-- Right Arm and Hand with Counter-Stride Swing -->
          <g class="doremon-arm-r">
            <path d="M84 89 L99 96" stroke="#0298d7" stroke-width="10" stroke-linecap="round"/>
            <path d="M84 89 L99 96" stroke="#182230" stroke-width="2.4" fill="none"/>
            <circle cx="104" cy="99" r="7" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
          </g>

          <!-- Left Arm and Hand (Waving High!) -->
          <g class="doremon-wave-arm">
            <path d="M45 82 L28 62" stroke="#0298d7" stroke-width="11" stroke-linecap="round"/>
            <path d="M45 82 L28 62" stroke="#182230" stroke-width="2.4" fill="none"/>
            <circle cx="23" cy="56" r="7.5" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
          </g>

          <!-- Red Collar Band -->
          <path d="M40 76 Q65 84 90 76" stroke="#dc2626" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M40 76 Q65 84 90 76" stroke="#182230" stroke-width="2.4" fill="none"/>

          <!-- Golden Bell -->
          <g class="doremon-bell-elem">
            <circle cx="65" cy="83" r="6.8" fill="#facc15" stroke="#182230" stroke-width="1.8"/>
            <line x1="59.5" y1="81.2" x2="70.5" y2="81.2" stroke="#182230" stroke-width="1.6"/>
            <circle cx="65" cy="84.8" r="1.8" fill="#182230"/>
            <line x1="65" y1="86.6" x2="65" y2="89.5" stroke="#182230" stroke-width="1.6"/>
          </g>

          <!-- Round Blue Head -->
          <circle cx="65" cy="46" r="37" fill="#0298d7" stroke="#182230" stroke-width="2.8"/>

          <!-- White Face Mask -->
          <path d="M38 51 C38 30 50 26 65 26 C80 26 92 30 92 51 C92 68 80 75 65 75 C50 75 38 68 38 51 Z" 
                fill="#ffffff" stroke="#182230" stroke-width="2.6"/>

          <!-- Eyes Group with Blinking Animation -->
          <g class="doremon-eyes">
            <ellipse cx="57.5" cy="32" rx="7.5" ry="11" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
            <ellipse cx="72.5" cy="32" rx="7.5" ry="11" fill="#ffffff" stroke="#182230" stroke-width="2.4"/>
            <circle cx="60" cy="33" r="2.6" fill="#182230"/>
            <circle cx="70" cy="33" r="2.6" fill="#182230"/>
            <circle cx="61" cy="32" r="0.9" fill="#ffffff"/>
            <circle cx="71" cy="32" r="0.9" fill="#ffffff"/>
          </g>

          <!-- Red Round Nose -->
          <circle cx="65" cy="40" r="5.2" fill="#ef4444" stroke="#182230" stroke-width="2"/>
          <circle cx="63.6" cy="38.6" r="1.3" fill="#ffffff"/>

          <!-- Nose-to-Mouth Vertical Seam Line -->
          <line x1="65" y1="45.2" x2="65" y2="53" stroke="#182230" stroke-width="2.2"/>

          <!-- Cheerful Wide Open Mouth with Speaking Animation -->
          <g class="doremon-voice-mouth">
            <path d="M44 54 Q65 57 86 54 Q86 78 65 78 Q44 78 44 54 Z" 
                  fill="#b91c1c" stroke="#182230" stroke-width="2.4" stroke-linejoin="round"/>
            <!-- Tongue inside mouth -->
            <path d="M52 68 Q65 58 78 68 Q65 78 52 68 Z" 
                  fill="#f97316" stroke="#182230" stroke-width="1.6"/>
            <!-- Upper smile lip outline -->
            <path d="M43 54 Q65 57 87 54" fill="none" stroke="#182230" stroke-width="2.4" stroke-linecap="round"/>
          </g>

          <!-- Whiskers (3 on Left, 3 on Right) -->
          <g stroke="#182230" stroke-width="2" stroke-linecap="round">
            <!-- Left Whiskers -->
            <line x1="33" y1="44" x2="55" y2="47"/>
            <line x1="30" y1="52" x2="55" y2="52"/>
            <line x1="33" y1="59" x2="55" y2="57"/>
            <!-- Right Whiskers -->
            <line x1="75" y1="47" x2="97" y2="44"/>
            <line x1="75" y1="52" x2="100" y2="52"/>
            <line x1="75" y1="57" x2="97" y2="59"/>
          </g>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'human-buddy',
    name: 'Alex the Buddy (மனித நண்பன்)',
    type: 'builtin',
    description: 'Proper human companion with walking sneakers, swinging arms, head tilt, expressive smile, and charming idle poses.',
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" width="100%" height="100%">
        <defs>
          <linearGradient id="alexHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#1c1917"/>
          </linearGradient>
          <linearGradient id="alexSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="100%" stop-color="#fed7aa"/>
          </linearGradient>
          <linearGradient id="alexHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>
          <linearGradient id="alexPants" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="100%" stop-color="#172554"/>
          </linearGradient>
          <filter id="alexShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
        </defs>
        <style>
          /* 12-Second Human Walk-and-Pose Cadence */
          @keyframes humanBodyGroup {
            0%, 7%, 14%, 21%, 28% { transform: translateY(0px) rotate(0deg); }
            3.5%, 17.5% { transform: translateY(-3px) rotate(1.5deg); }
            10.5%, 24.5% { transform: translateY(-3px) rotate(-1.5deg); }
            28% { transform: translateY(0px) rotate(0deg); }
            32% { transform: translateY(-3px) rotate(-3deg) scale(1.03); }
            36% { transform: translateY(-4px) rotate(-3deg) scale(1.04); }
            42% { transform: translateY(-2px) rotate(-2deg) scale(1.02); }
            46% { transform: translateY(0px) rotate(0deg); }
            48% { transform: translateY(-1px) rotate(0deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            50%, 57%, 64%, 71%, 78% { transform: translateY(0px) rotate(0deg); }
            53.5%, 67.5% { transform: translateY(-3px) rotate(1.5deg); }
            60.5%, 74.5% { transform: translateY(-3px) rotate(-1.5deg); }
            78% { transform: translateY(0px) rotate(0deg); }
            82% { transform: translateY(-3px) rotate(3deg) scale(1.03); }
            86% { transform: translateY(-4px) rotate(3deg) scale(1.04); }
            92% { transform: translateY(-2px) rotate(2deg) scale(1.02); }
            96% { transform: translateY(0px) rotate(0deg); }
            98% { transform: translateY(-1px) rotate(0deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          @keyframes humanLegL {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(-3px, -2px) rotate(8deg); }
            7% { transform: translate(0, 0) rotate(0deg); }
            10.5% { transform: translate(5px, -6px) rotate(-12deg); }
            14% { transform: translate(2px, 0px) rotate(-2deg); }
            17.5% { transform: translate(-3px, -2px) rotate(8deg); }
            21% { transform: translate(0, 0) rotate(0deg); }
            24.5% { transform: translate(5px, -6px) rotate(-12deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(5px, -6px) rotate(-12deg); }
            57% { transform: translate(2px, 0px) rotate(-2deg); }
            60.5% { transform: translate(-3px, -2px) rotate(8deg); }
            64% { transform: translate(0, 0) rotate(0deg); }
            67.5% { transform: translate(5px, -6px) rotate(-12deg); }
            71% { transform: translate(2px, 0px) rotate(-2deg); }
            74.5% { transform: translate(-3px, -2px) rotate(8deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes humanLegR {
            0% { transform: translate(0, 0) rotate(0deg); }
            3.5% { transform: translate(5px, -6px) rotate(-12deg); }
            7% { transform: translate(2px, 0px) rotate(-2deg); }
            10.5% { transform: translate(-3px, -2px) rotate(8deg); }
            14% { transform: translate(0, 0) rotate(0deg); }
            17.5% { transform: translate(5px, -6px) rotate(-12deg); }
            21% { transform: translate(2px, 0px) rotate(-2deg); }
            24.5% { transform: translate(-3px, -2px) rotate(8deg); }
            28%, 50% { transform: translate(0, 0) rotate(0deg); }
            53.5% { transform: translate(-3px, -2px) rotate(8deg); }
            57% { transform: translate(0, 0) rotate(0deg); }
            60.5% { transform: translate(5px, -6px) rotate(-12deg); }
            64% { transform: translate(2px, 0px) rotate(-2deg); }
            67.5% { transform: translate(-3px, -2px) rotate(8deg); }
            71% { transform: translate(0, 0) rotate(0deg); }
            74.5% { transform: translate(5px, -6px) rotate(-12deg); }
            78%, 100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes humanArmL {
            0%, 7%, 14%, 21%, 28% { transform: rotate(0deg); }
            3.5%, 17.5% { transform: rotate(18deg) translateY(-2px); }
            10.5%, 24.5% { transform: rotate(-18deg) translateY(2px); }
            28% { transform: rotate(0deg); }
            32%, 42% { transform: rotate(26deg) translateY(-2px); }
            46% { transform: rotate(0deg); }
            50%, 57%, 64%, 71%, 78% { transform: rotate(0deg); }
            53.5%, 67.5% { transform: rotate(-18deg) translateY(2px); }
            60.5%, 74.5% { transform: rotate(18deg) translateY(-2px); }
            78% { transform: rotate(0deg); }
            82%, 92% { transform: rotate(-48deg) translateY(-8px) scale(1.05); }
            96%, 100% { transform: rotate(0deg); }
          }
          @keyframes humanArmR {
            0%, 7%, 14%, 21%, 28% { transform: rotate(0deg); }
            3.5%, 17.5% { transform: rotate(-18deg) translateY(2px); }
            10.5%, 24.5% { transform: rotate(18deg) translateY(-2px); }
            28% { transform: rotate(0deg); }
            32%, 42% { transform: rotate(-48deg) translateY(-8px) scale(1.05); }
            46% { transform: rotate(0deg); }
            50%, 57%, 64%, 71%, 78% { transform: rotate(0deg); }
            53.5%, 67.5% { transform: rotate(18deg) translateY(-2px); }
            60.5%, 74.5% { transform: rotate(-18deg) translateY(2px); }
            78% { transform: rotate(0deg); }
            82%, 92% { transform: rotate(26deg) translateY(-2px); }
            96%, 100% { transform: rotate(0deg); }
          }
          @keyframes humanEyes {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.1); }
          }
          @keyframes humanMouthSpeak {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.15, 1.4); }
            50% { transform: scale(0.95, 0.85); }
            75% { transform: scale(1.1, 1.3); }
          }
          .human-body-group { animation: humanBodyGroup 12s linear infinite; transform-origin: 65px 115px; }
          .human-leg-l { animation: humanLegL 12s linear infinite; transform-origin: 52px 88px; }
          .human-leg-r { animation: humanLegR 12s linear infinite; transform-origin: 78px 88px; }
          .human-arm-l { animation: humanArmL 12s linear infinite; transform-origin: 39px 62px; }
          .human-arm-r { animation: humanArmR 12s linear infinite; transform-origin: 91px 62px; }
          .human-eyes { animation: humanEyes 3.8s ease-in-out infinite; transform-origin: 65px 44px; }
          .human-voice-mouth { animation: humanMouthSpeak 0.38s ease-in-out infinite; transform-origin: 65px 50px; }
        </style>

        <!-- Ground Shadow -->
        <ellipse cx="65" cy="123" rx="30" ry="4.5" fill="#000000" opacity="0.18"/>

        <!-- Left Leg and Sneaker -->
        <g class="human-leg-l">
          <rect x="47" y="86" width="10" height="26" rx="4" fill="url(#alexPants)"/>
          <path d="M43 112 L61 112 Q65 112 65 116 L65 119 Q65 122 59 122 L41 122 Q39 122 39 119 L39 115 Q39 112 43 112 Z" 
                fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M40 120 L64 120" stroke="#ef4444" stroke-width="2"/>
          <line x1="48" y1="113" x2="56" y2="113" stroke="#0f172a" stroke-width="1.2"/>
          <line x1="48" y1="116" x2="56" y2="116" stroke="#0f172a" stroke-width="1.2"/>
        </g>

        <!-- Right Leg and Sneaker -->
        <g class="human-leg-r">
          <rect x="73" y="86" width="10" height="26" rx="4" fill="url(#alexPants)"/>
          <path d="M69 112 L87 112 Q91 112 91 116 L91 119 Q91 122 85 122 L67 122 Q65 122 65 119 L65 115 Q65 112 69 112 Z" 
                fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
          <path d="M66 120 L90 120" stroke="#ef4444" stroke-width="2"/>
          <line x1="74" y1="113" x2="82" y2="113" stroke="#0f172a" stroke-width="1.2"/>
          <line x1="74" y1="116" x2="82" y2="116" stroke="#0f172a" stroke-width="1.2"/>
        </g>

        <!-- Main Body Group (Torso, Arms, Head) -->
        <g class="human-body-group" filter="url(#alexShadow)">
          <!-- Left Arm -->
          <g class="human-arm-l">
            <rect x="34" y="60" width="10" height="25" rx="5" fill="url(#alexHoodie)"/>
            <circle cx="39" cy="87" r="5" fill="url(#alexSkin)"/>
          </g>

          <!-- Right Arm -->
          <g class="human-arm-r">
            <rect x="86" y="60" width="10" height="25" rx="5" fill="url(#alexHoodie)"/>
            <circle cx="91" cy="87" r="5" fill="url(#alexSkin)"/>
          </g>

          <!-- Torso / Hoodie -->
          <path d="M44 58 L86 58 L89 88 L41 88 Z" fill="url(#alexHoodie)" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
          <!-- Kangaroo Pocket -->
          <path d="M52 74 L78 74 L75 86 L55 86 Z" fill="#0369a1" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Drawstrings -->
          <line x1="60" y1="58" x2="60" y2="69" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="70" y1="58" x2="70" y2="69" stroke="white" stroke-width="1.6" stroke-linecap="round"/>

          <!-- Neck -->
          <rect x="60" y="52" width="10" height="8" rx="2" fill="url(#alexSkin)"/>

          <!-- Head and Face -->
          <ellipse cx="65" cy="42" rx="22" ry="20" fill="url(#alexSkin)" stroke="#0f172a" stroke-width="2"/>

          <!-- Stylish Hair -->
          <path d="M43 40 C41 24 55 16 65 16 C78 16 89 24 87 40 C84 32 80 30 76 33 C72 28 65 29 61 34 C57 28 49 32 43 40 Z" 
                fill="url(#alexHair)" stroke="#0f172a" stroke-width="2"/>
          <path d="M48 30 Q56 36 64 30 Q72 37 82 32" stroke="#1c1917" stroke-width="1.8" fill="none"/>

          <!-- Eyes Group with Blink -->
          <g class="human-eyes">
            <ellipse cx="55" cy="44" rx="4.5" ry="5.5" fill="#1e293b"/>
            <ellipse cx="75" cy="44" rx="4.5" ry="5.5" fill="#1e293b"/>
            <circle cx="56.5" cy="42.5" r="1.8" fill="white"/>
            <circle cx="76.5" cy="42.5" r="1.8" fill="white"/>
            <circle cx="53.5" cy="45.5" r="0.9" fill="white"/>
            <circle cx="73.5" cy="45.5" r="0.9" fill="white"/>
          </g>

          <!-- Eyebrows -->
          <path d="M51 36 Q55 34 59 36" stroke="#451a03" stroke-width="1.6" stroke-linecap="round" fill="none"/>
          <path d="M71 36 Q75 34 79 36" stroke="#451a03" stroke-width="1.6" stroke-linecap="round" fill="none"/>

          <!-- Rosy Cheeks -->
          <circle cx="48" cy="47" r="3.5" fill="#f43f5e" opacity="0.45"/>
          <circle cx="82" cy="47" r="3.5" fill="#f43f5e" opacity="0.45"/>

          <!-- Smile with Speaking Animation -->
          <path class="human-voice-mouth" d="M60 49 Q65 55 70 49" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        </g>
      </svg>
    `)}`,
  },
];

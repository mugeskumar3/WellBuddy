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
    id: 'pixel-buddy',
    name: 'Pranjali the Pixel Desk Buddy',
    type: 'builtin',
    description: 'Cozy pixel-art desktop companion with natural walking steps, water drinking animation on hydration alerts, and celebration jumps with hearts and sparkles.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%" shape-rendering="crispEdges">
        <defs>
          <style>
            @keyframes pixelBlink { 0%, 94%, 100% { opacity: 1; } 95%, 99% { opacity: 0; } }
            @keyframes pixelBlinkClosed { 0%, 94%, 100% { opacity: 0; } 95%, 99% { opacity: 1; } }
            @keyframes pixelBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
            @keyframes pixelWalkL { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
            @keyframes pixelWalkR { 0%, 100% { transform: translateY(-2px); } 50% { transform: translateY(0); } }
            .px-eyes-open { animation: pixelBlink 3.6s infinite; }
            .px-eyes-shut { animation: pixelBlinkClosed 3.6s infinite; }
            .px-bounce { animation: pixelBob 0.8s steps(2, end) infinite; }
            .px-leg-l { animation: pixelWalkL 0.6s steps(2, end) infinite; }
            .px-leg-r { animation: pixelWalkR 0.6s steps(2, end) infinite; }
          </style>
        </defs>
        <ellipse cx="16" cy="28" rx="8" ry="2" fill="#0f172a" opacity="0.25"/>
        <g class="px-bounce">
          <rect x="9" y="8" width="4" height="7" fill="#18181b"/>
          <rect x="8" y="12" width="3" height="5" fill="#27272a"/>
          <rect x="11" y="14" width="10" height="8" fill="#c084fc"/>
          <rect x="11" y="21" width="10" height="1" fill="#9333ea"/>
          <rect x="13" y="18" width="6" height="3" fill="#a855f7"/>
          <rect x="14" y="15" width="1" height="3" fill="#f8fafc"/>
          <rect x="17" y="15" width="1" height="3" fill="#f8fafc"/>
          <rect x="12" y="22" width="8" height="3" fill="#2563eb"/>
          <g class="px-leg-l">
            <rect x="12" y="24" width="3" height="3" fill="#fed7aa"/>
            <rect x="11" y="26" width="4" height="2" fill="#ffffff"/>
            <rect x="11" y="28" width="4" height="1" fill="#0284c7"/>
          </g>
          <g class="px-leg-r">
            <rect x="17" y="24" width="3" height="3" fill="#fed7aa"/>
            <rect x="17" y="26" width="4" height="2" fill="#ffffff"/>
            <rect x="17" y="28" width="4" height="1" fill="#0284c7"/>
          </g>
          <rect x="9" y="15" width="2" height="5" fill="#a855f7"/>
          <rect x="21" y="15" width="2" height="5" fill="#a855f7"/>
          <rect x="21" y="17" width="3" height="4" rx="0.5" fill="#38bdf8"/>
          <rect x="22" y="16" width="1" height="1" fill="#ffffff"/>
          <rect x="12" y="8" width="8" height="7" fill="#fed7aa"/>
          <rect x="11" y="5" width="10" height="4" fill="#18181b"/>
          <rect x="10" y="7" width="2" height="6" fill="#27272a"/>
          <rect x="20" y="7" width="2" height="6" fill="#27272a"/>
          <rect x="12" y="7" width="3" height="2" fill="#18181b"/>
          <rect x="16" y="7" width="4" height="2" fill="#18181b"/>
          <g class="px-eyes-open">
            <rect x="13" y="10" width="2" height="2" fill="#18181b"/>
            <rect x="13" y="10" width="1" height="1" fill="#ffffff"/>
            <rect x="17" y="10" width="2" height="2" fill="#18181b"/>
            <rect x="17" y="10" width="1" height="1" fill="#ffffff"/>
          </g>
          <g class="px-eyes-shut">
            <rect x="13" y="11" width="2" height="1" fill="#18181b"/>
            <rect x="17" y="11" width="2" height="1" fill="#18181b"/>
          </g>
          <rect x="12" y="12" width="2" height="1" fill="#fb7185" opacity="0.85"/>
          <rect x="18" y="12" width="2" height="1" fill="#fb7185" opacity="0.85"/>
          <rect x="15" y="13" width="2" height="1" fill="#e11d48"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'pixel-cat',
    name: 'Mochi the Pixel Cat',
    type: 'builtin',
    description: 'Charming retro ginger tabby cat desktop companion that walks, wags its tail, and drinks from its saucer.',
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%" shape-rendering="crispEdges">
        <defs>
          <style>
            @keyframes catTail { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
            @keyframes catBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
            .px-cat-body { animation: catBob 0.8s steps(2, end) infinite; }
            .px-cat-tail { animation: catTail 1s ease-in-out infinite; transform-origin: 8px 19px; }
          </style>
        </defs>
        <ellipse cx="16" cy="27" rx="8" ry="2" fill="#0f172a" opacity="0.25"/>
        <g class="px-cat-body">
          <path class="px-cat-tail" d="M8 19 H6 V15 H5 V12 H7 V15 H8 Z" fill="#ea580c"/>
          <rect x="5" y="12" width="2" height="2" fill="#fed7aa"/>
          <rect x="9" y="17" width="13" height="7" fill="#f97316"/>
          <rect x="11" y="17" width="2" height="4" fill="#c2410c"/>
          <rect x="15" y="17" width="2" height="4" fill="#c2410c"/>
          <rect x="10" y="21" width="10" height="3" fill="#ffedd5"/>
          <rect x="9" y="24" width="2" height="3" fill="#ea580c"/>
          <rect x="9" y="27" width="3" height="1" fill="#ffedd5"/>
          <rect x="13" y="24" width="2" height="3" fill="#ea580c"/>
          <rect x="13" y="27" width="3" height="1" fill="#ffedd5"/>
          <rect x="17" y="24" width="2" height="3" fill="#ea580c"/>
          <rect x="17" y="27" width="3" height="1" fill="#ffedd5"/>
          <rect x="20" y="24" width="2" height="3" fill="#ea580c"/>
          <rect x="20" y="27" width="3" height="1" fill="#ffedd5"/>
          <rect x="17" y="11" width="10" height="8" fill="#f97316"/>
          <rect x="19" y="15" width="6" height="4" fill="#ffedd5"/>
          <polygon points="17,11 17,7 20,11" fill="#ea580c"/>
          <polygon points="18,10 18,8 19,10" fill="#f43f5e"/>
          <polygon points="24,11 27,7 27,11" fill="#ea580c"/>
          <polygon points="25,10 26,8 26,10" fill="#f43f5e"/>
          <rect x="19" y="13" width="2" height="2" fill="#15803d"/>
          <rect x="19" y="13" width="1" height="1" fill="#ffffff"/>
          <rect x="24" y="13" width="2" height="2" fill="#15803d"/>
          <rect x="24" y="13" width="1" height="1" fill="#ffffff"/>
          <rect x="22" y="15" width="1" height="1" fill="#f43f5e"/>
          <rect x="21" y="16" width="3" height="1" fill="#c2410c"/>
          <rect x="18" y="16" width="2" height="1" fill="#fb7185" opacity="0.8"/>
          <rect x="25" y="16" width="2" height="1" fill="#fb7185" opacity="0.8"/>
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
    description: '3D animated AI-style wellness mentor in full front perspective, holding a refreshing glass of water with walking strides and gentle encouragement.',
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="100%" height="100%">
        <defs>
          <!-- Volumetric 3D Skin Gradient -->
          <radialGradient id="hb3dHead" cx="42%" cy="32%" r="68%">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="45%" stop-color="#fba068"/>
            <stop offset="100%" stop-color="#c2410c"/>
          </radialGradient>
          <linearGradient id="hb3dNeck" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ea580c"/>
            <stop offset="50%" stop-color="#fed7aa"/>
            <stop offset="100%" stop-color="#c2410c"/>
          </linearGradient>

          <!-- Volumetric 3D Salt-and-Pepper Hair -->
          <linearGradient id="hb3dHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f1f5f9"/>
            <stop offset="25%" stop-color="#cbd5e1"/>
            <stop offset="60%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>

          <!-- 3D Polo Shirt with Cylindrical Rounding -->
          <radialGradient id="hb3dShirt" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#dbeafe"/>
            <stop offset="40%" stop-color="#60a5fa"/>
            <stop offset="85%" stop-color="#2563eb"/>
            <stop offset="100%" stop-color="#1e40af"/>
          </radialGradient>
          <linearGradient id="hb3dArmL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#93c5fd"/>
            <stop offset="50%" stop-color="#3b82f6"/>
            <stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="hb3dArmR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#93c5fd"/>
            <stop offset="50%" stop-color="#3b82f6"/>
            <stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>

          <!-- 3D Cylindrical Trousers Legs -->
          <linearGradient id="hb3dPantsL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b"/>
            <stop offset="40%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="hb3dPantsR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b"/>
            <stop offset="40%" stop-color="#334155"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>

          <!-- 3D Leather Loafers -->
          <linearGradient id="hb3dShoe" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="40%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#291102"/>
          </linearGradient>

          <!-- 3D Crystal Water Glass with Shimmer -->
          <linearGradient id="hb3dGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="35%" stop-color="#bae6fd" stop-opacity="0.55"/>
            <stop offset="80%" stop-color="#38bdf8" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="hb3dWater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#7dd3fc"/>
            <stop offset="50%" stop-color="#0ea5e9"/>
            <stop offset="100%" stop-color="#0369a1"/>
          </linearGradient>

          <!-- Realistic Soft Ambient Occlusion and Ground Shadow -->
          <filter id="hb3dShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.32"/>
          </filter>
          <filter id="hbWaterGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#38bdf8" flood-opacity="0.65"/>
          </filter>
        </defs>
        <style>
          /* 3D Front Perspective Walk Cycle (Continuous 3D Front View - No Side Profile!) */
          @keyframes hb3dWalkBob {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-1.5deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-4px) rotate(1.5deg); }
          }
          /* Left Leg Front Stepping (Forward Plant and Lift) */
          @keyframes hb3dLegL {
            0%, 100% { transform: translateY(0px) scale(1, 1); }
            25% { transform: translateY(-6px) scale(0.96, 1.04); }
            50% { transform: translateY(0px) scale(1.02, 0.98); }
            75% { transform: translateY(2px) scale(1, 1); }
          }
          /* Right Leg Front Stepping (Counter-Step) */
          @keyframes hb3dLegR {
            0%, 100% { transform: translateY(0px) scale(1.02, 0.98); }
            25% { transform: translateY(2px) scale(1, 1); }
            50% { transform: translateY(0px) scale(1, 1); }
            75% { transform: translateY(-6px) scale(0.96, 1.04); }
          }
          /* Left Arm Natural Stride Sway */
          @keyframes hb3dArmSwayL {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(10deg); }
          }
          /* Right Arm Cheerful Glass Toast with Sloshing Liquid */
          @keyframes hb3dToastArm {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            35% { transform: rotate(-8deg) translateY(-4px); }
            70% { transform: rotate(5deg) translateY(-2px); }
          }
          /* Sloshing Liquid and Ice Float */
          @keyframes hb3dWaterWave {
            0%, 100% { transform: rotate(-4deg); }
            50% { transform: rotate(5deg); }
          }
          /* Ground Soft Contact Shadow Pulse */
          @keyframes hb3dShadowPulse {
            0%, 50%, 100% { rx: 34px; opacity: 0.28; }
            25%, 75% { rx: 29px; opacity: 0.2; }
          }
          /* Natural Eye Blink */
          @keyframes hb3dEyeBlink {
            0%, 46%, 50%, 96%, 100% { transform: scaleY(1); }
            48%, 98% { transform: scaleY(0.12); }
          }
          /* Expressive Speaking Mouth */
          @keyframes hb3dLipSync {
            0%, 100% { transform: scale(1, 1); }
            25% { transform: scale(1.18, 1.6); }
            50% { transform: scale(0.92, 0.75); }
            75% { transform: scale(1.12, 1.4); }
          }
          .hb3d-body-all { animation: hb3dWalkBob 0.8s ease-in-out infinite; transform-origin: 70px 105px; }
          .hb3d-leg-l { animation: hb3dLegL 0.8s ease-in-out infinite; transform-origin: 55px 86px; }
          .hb3d-leg-r { animation: hb3dLegR 0.8s ease-in-out infinite; transform-origin: 85px 86px; }
          .hb3d-arm-l { animation: hb3dArmSwayL 0.8s ease-in-out infinite; transform-origin: 43px 60px; }
          .hb3d-arm-r { animation: hb3dToastArm 2.6s ease-in-out infinite; transform-origin: 97px 60px; }
          .hb3d-slosh { animation: hb3dWaterWave 2.6s ease-in-out infinite; transform-origin: 106px 74px; }
          .hb3d-shadow { animation: hb3dShadowPulse 0.8s ease-in-out infinite; transform-origin: 70px 125px; }
          .hb3d-eyes { animation: hb3dEyeBlink 3.8s ease-in-out infinite; transform-origin: 70px 42px; }
          .hb3d-mouth { animation: hb3dLipSync 0.4s ease-in-out infinite; transform-origin: 70px 52px; }
        </style>

        <!-- Dynamic Ground Contact Shadow -->
        <ellipse class="hb3d-shadow" cx="70" cy="125" rx="34" ry="4.5" fill="#0f172a"/>

        <!-- 3D Front Left Leg and Shoe (Forward Stepping) -->
        <g class="hb3d-leg-l">
          <rect x="49" y="84" width="13" height="32" rx="6.5" fill="url(#hb3dPantsL)" stroke="#0f172a" stroke-width="1.2"/>
          <!-- 3D Shoe with Highlight and Heel -->
          <path d="M44 116 L64 116 Q69 116 69 120 L69 124 L42 124 Q42 120 44 116 Z" fill="url(#hb3dShoe)" stroke="#1c1917" stroke-width="1.2"/>
          <ellipse cx="55" cy="117.5" rx="7" ry="1.8" fill="#f59e0b" opacity="0.35"/>
        </g>

        <!-- 3D Front Right Leg and Shoe (Counter Stepping) -->
        <g class="hb3d-leg-r">
          <rect x="78" y="84" width="13" height="32" rx="6.5" fill="url(#hb3dPantsR)" stroke="#0f172a" stroke-width="1.2"/>
          <!-- 3D Shoe with Highlight and Heel -->
          <path d="M73 116 L93 116 Q98 116 98 120 L98 124 L71 124 Q71 120 73 116 Z" fill="url(#hb3dShoe)" stroke="#1c1917" stroke-width="1.2"/>
          <ellipse cx="84" cy="117.5" rx="7" ry="1.8" fill="#f59e0b" opacity="0.35"/>
        </g>

        <!-- 3D Torso, Arms, and Head (Walk Bobbing in Front Perspective) -->
        <g class="hb3d-body-all" filter="url(#hb3dShadow)">
          <!-- Left Arm Swaying in 3D Perspective -->
          <g class="hb3d-arm-l">
            <path d="M44 60 L32 75 L36 82" stroke="url(#hb3dArmL)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M44 60 L32 75 L36 82" stroke="#1d4ed8" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <!-- 3D Hand Resting / Clenched softly -->
            <circle cx="37" cy="84" r="5" fill="url(#hb3dHead)"/>
            <!-- Metallic Smartwatch -->
            <rect x="32" y="77" width="9" height="3.5" rx="1.5" fill="#0f172a"/>
            <rect x="34.5" y="78" width="4" height="2" rx="0.5" fill="#38bdf8"/>
          </g>

          <!-- Right Arm Raised in Cheerful Toast Holding 3D Water Glass -->
          <g class="hb3d-arm-r">
            <path d="M96 60 L110 68 L107 78" stroke="url(#hb3dArmR)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M96 60 L110 68 L107 78" stroke="#1d4ed8" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <!-- 3D Hand Grasping Glass -->
            <circle cx="106" cy="80" r="5" fill="url(#hb3dHead)"/>

            <!-- 3D Sparkling Crystal Glass with Ice &amp; Water -->
            <g class="hb3d-slosh" filter="url(#hbWaterGlow)">
              <!-- Glass Outline and Translucency -->
              <path d="M100 64 L117 64 L114 81 L103 81 Z" fill="url(#hb3dGlass)" stroke="#0284c7" stroke-width="1.4"/>
              <!-- Refreshing Blue Water Level -->
              <path d="M101.5 68 L115.5 68 L113.2 80 L103.8 80 Z" fill="url(#hb3dWater)"/>
              <!-- Floating Ice Cubes in 3D -->
              <rect x="103.5" y="70" width="4" height="4" rx="1" fill="#ffffff" opacity="0.85"/>
              <rect x="110" y="72" width="3" height="3" rx="0.8" fill="#ffffff" opacity="0.75"/>
              <!-- Specular Glass Highlights (Vertical Sheen) -->
              <path d="M102 65 L104 80" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
              <circle cx="114" cy="67" r="1" fill="#ffffff" opacity="0.9"/>
            </g>
          </g>

          <!-- Volumetric 3D Polo Shirt (Torso) -->
          <path d="M43 58 L97 58 L100 86 L40 86 Z" fill="url(#hb3dShirt)" stroke="#1e3a8a" stroke-width="1.4"/>
          <!-- Belt Line -->
          <rect x="40" y="84" width="60" height="4.5" rx="1" fill="#0f172a"/>
          <rect x="67" y="84" width="6" height="4.5" rx="1" fill="#facc15"/>

          <!-- Polo Collar and Center Placket -->
          <rect x="68" y="58" width="4" height="15" fill="#93c5fd"/>
          <circle cx="70" cy="64" r="1.2" fill="#1e293b"/>
          <circle cx="70" cy="70" r="1.2" fill="#1e293b"/>
          <!-- 3D Collar Flaps -->
          <polygon points="56,58 68,58 62,51" fill="#ffffff" stroke="#93c5fd" stroke-width="1"/>
          <polygon points="84,58 72,58 78,51" fill="#ffffff" stroke="#93c5fd" stroke-width="1"/>

          <!-- Chest Pocket with Stylus / Pen -->
          <path d="M80 67 L90 67 L89 76 L81 76 Z" fill="#60a5fa" stroke="#2563eb" stroke-width="1"/>
          <line x1="85" y1="64" x2="85" y2="69" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>

          <!-- Volumetric 3D Neck -->
          <rect x="65" y="49" width="10" height="10" fill="url(#hb3dNeck)"/>

          <!-- 3D Character Head (Spherical Depth and Warm Lighting) -->
          <ellipse cx="70" cy="41" rx="20" ry="19" fill="url(#hb3dHead)" stroke="#c2410c" stroke-width="1.4"/>

          <!-- 3D Ears with Inner Depth -->
          <ellipse cx="49" cy="42" rx="3.5" ry="5" fill="url(#hb3dHead)" stroke="#c2410c" stroke-width="1"/>
          <ellipse cx="91" cy="42" rx="3.5" ry="5" fill="url(#hb3dHead)" stroke="#c2410c" stroke-width="1"/>

          <!-- 3D Salt-and-Pepper Styled Volumetric Hair -->
          <path d="M49 37 C47 20 59 12 70 12 C81 12 93 20 91 37 C87 29 80 27 70 27 C60 27 53 29 49 37 Z" 
                fill="url(#hb3dHair)" filter="url(#hb3dShadow)"/>
          <!-- Hair Specular Highlights (Top Sheen) -->
          <path d="M57 20 Q70 16 83 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
          <!-- Side Hair Volume Swirls -->
          <path d="M48 37 C46 41 48 45 50 47" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path d="M92 37 C94 41 92 45 90 47" stroke="#475569" stroke-width="3" stroke-linecap="round" fill="none"/>

          <!-- 3D Groomed Mustache and Beard with Shadow -->
          <path d="M57 43 C57 55 83 55 83 43 C81 50 77 53 70 53 C63 53 59 50 57 43 Z" fill="#475569" stroke="#334155" stroke-width="1.2"/>
          <path d="M62 44 Q70 41 78 44 Q70 48 62 44 Z" fill="#334155"/>

          <!-- 3D Glasses (Modern Dark Frames with Glossy Glare) -->
          <rect x="56" y="33" width="12" height="9" rx="2.5" fill="none" stroke="#0f172a" stroke-width="2.2"/>
          <rect x="72" y="33" width="12" height="9" rx="2.5" fill="none" stroke="#0f172a" stroke-width="2.2"/>
          <line x1="68" y1="37" x2="72" y2="37" stroke="#0f172a" stroke-width="2.2"/>
          <!-- Glasses Diagonal Glare -->
          <line x1="58" y1="40" x2="63" y2="35" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
          <line x1="74" y1="40" x2="79" y2="35" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>

          <!-- Eyes with Natural Blink -->
          <g class="hb3d-eyes">
            <circle cx="62" cy="37.5" r="2.4" fill="#0f172a"/>
            <circle cx="78" cy="37.5" r="2.4" fill="#0f172a"/>
            <circle cx="63" cy="36.5" r="0.9" fill="#ffffff"/>
            <circle cx="79" cy="36.5" r="0.9" fill="#ffffff"/>
          </g>

          <!-- 3D Expressive Speaking Smile -->
          <path class="hb3d-mouth" d="M64 47 Q70 52 76 47" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none"/>

          <!-- Rosy Cheeks -->
          <ellipse cx="55" cy="42" rx="3.5" ry="2.2" fill="#f43f5e" opacity="0.35"/>
          <ellipse cx="85" cy="42" rx="3.5" ry="2.2" fill="#f43f5e" opacity="0.35"/>
        </g>
      </svg>
    `)}`,
  },
];

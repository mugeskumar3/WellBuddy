import React, { useEffect, useState } from 'react';

export type PixelCompanionState = 'idle' | 'walk' | 'drink' | 'celebrate' | 'wave';

interface PixelCompanionProps {
  id?: string;
  state?: PixelCompanionState;
  isWalking?: boolean;
  isWaving?: boolean;
  isSpeaking?: boolean;
  isCelebrating?: boolean;
  isDrinking?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PixelCompanion: React.FC<PixelCompanionProps> = ({
  id = 'pixel-buddy',
  state: explicitState,
  isWalking = false,
  isWaving = false,
  isSpeaking = false,
  isCelebrating = false,
  isDrinking = false,
  className = 'w-28 h-28',
  onClick,
}) => {
  // Determine effective animation state
  const currentState: PixelCompanionState = explicitState || (
    isCelebrating
      ? 'celebrate'
      : isDrinking
      ? 'drink'
      : isWaving
      ? 'wave'
      : isWalking
      ? 'walk'
      : 'idle'
  );

  // Frame tick for multi-frame retro pixel animation (8-10 fps)
  const [frame, setFrame] = useState<number>(0);
  const [blink, setBlink] = useState<boolean>(false);

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 180);

    return () => clearInterval(frameInterval);
  }, [currentState]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3600);

    return () => clearInterval(blinkInterval);
  }, []);

  const isCat = id === 'pixel-cat';

  return (
    <div
      onClick={onClick}
      className={`relative select-none pointer-events-auto flex items-center justify-center cursor-pointer transition-transform duration-200 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {isCat ? (
        /* ================= MOCHI THE PIXEL CAT ================= */
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full overflow-visible drop-shadow-md"
          shapeRendering="crispEdges"
        >
          {/* Ground Contact Shadow */}
          <ellipse
            cx="16"
            cy={currentState === 'celebrate' ? 29 : 27}
            rx={currentState === 'celebrate' ? 6 : 9}
            ry={2}
            fill="#0f172a"
            opacity={currentState === 'celebrate' ? 0.18 : 0.28}
          />

          <g
            transform={
              currentState === 'celebrate'
                ? `translate(0, ${frame % 2 === 0 ? -5 : -2})`
                : currentState === 'walk'
                ? `translate(0, ${frame % 2 === 0 ? -1 : 0})`
                : 'translate(0, 0)'
            }
          >
            {/* Animated Tail */}
            <path
              d={
                currentState === 'celebrate' || frame % 2 === 0
                  ? 'M8 19 H6 V15 H5 V12 H7 V15 H8 Z'
                  : 'M8 20 H6 V17 H5 V14 H7 V17 H8 Z'
              }
              fill="#ea580c"
            />
            <rect x="5" y={currentState === 'celebrate' ? 11 : 13} width="2" height="2" fill="#fed7aa" />

            {/* Cat Body (Ginger Tabby) */}
            <rect x="9" y="17" width="13" height="7" fill="#f97316" />
            <rect x="11" y="17" width="2" height="4" fill="#c2410c" />
            <rect x="15" y="17" width="2" height="4" fill="#c2410c" />
            <rect x="10" y="21" width="10" height="3" fill="#ffedd5" />

            {/* Cat Legs */}
            {currentState === 'walk' ? (
              frame % 2 === 0 ? (
                <>
                  <rect x="9" y="24" width="2" height="3" fill="#ea580c" />
                  <rect x="9" y="27" width="3" height="1" fill="#ffedd5" />
                  <rect x="13" y="24" width="2" height="2" fill="#c2410c" />
                  <rect x="17" y="24" width="2" height="3" fill="#ea580c" />
                  <rect x="17" y="27" width="3" height="1" fill="#ffedd5" />
                  <rect x="20" y="24" width="2" height="2" fill="#c2410c" />
                </>
              ) : (
                <>
                  <rect x="10" y="24" width="2" height="2" fill="#c2410c" />
                  <rect x="12" y="24" width="2" height="3" fill="#ea580c" />
                  <rect x="12" y="27" width="3" height="1" fill="#ffedd5" />
                  <rect x="18" y="24" width="2" height="2" fill="#c2410c" />
                  <rect x="19" y="24" width="2" height="3" fill="#ea580c" />
                  <rect x="19" y="27" width="3" height="1" fill="#ffedd5" />
                </>
              )
            ) : (
              <>
                <rect x="9" y="24" width="2" height="3" fill="#ea580c" />
                <rect x="9" y="27" width="3" height="1" fill="#ffedd5" />
                <rect x="13" y="24" width="2" height="3" fill="#ea580c" />
                <rect x="13" y="27" width="3" height="1" fill="#ffedd5" />
                <rect x="17" y="24" width="2" height="3" fill="#ea580c" />
                <rect x="17" y="27" width="3" height="1" fill="#ffedd5" />
                <rect x="20" y="24" width="2" height="3" fill="#ea580c" />
                <rect x="20" y="27" width="3" height="1" fill="#ffedd5" />
              </>
            )}

            {/* Cat Head */}
            <rect x="17" y="11" width="10" height="8" fill="#f97316" />
            <rect x="19" y="15" width="6" height="4" fill="#ffedd5" />

            {/* Cat Ears */}
            <polygon points="17,11 17,7 20,11" fill="#ea580c" />
            <polygon points="18,10 18,8 19,10" fill="#f43f5e" />
            <polygon points="24,11 27,7 27,11" fill="#ea580c" />
            <polygon points="25,10 26,8 26,10" fill="#f43f5e" />

            {/* Cat Tabby Forehead Marks */}
            <rect x="21" y="11" width="2" height="2" fill="#c2410c" />

            {/* Cat Eyes */}
            {blink ? (
              <>
                <rect x="19" y="14" width="2" height="1" fill="#0f172a" />
                <rect x="24" y="14" width="2" height="1" fill="#0f172a" />
              </>
            ) : (
              <>
                <rect x="19" y="13" width="2" height="2" fill="#15803d" />
                <rect x="19" y="13" width="1" height="1" fill="#ffffff" />
                <rect x="24" y="13" width="2" height="2" fill="#15803d" />
                <rect x="24" y="13" width="1" height="1" fill="#ffffff" />
              </>
            )}

            {/* Nose & Mouth */}
            <rect x="22" y="15" width="1" height="1" fill="#f43f5e" />
            <rect x="21" y="16" width="3" height="1" fill="#c2410c" />

            {/* Rosy Cheeks */}
            <rect x="18" y="16" width="2" height="1" fill="#fb7185" opacity="0.8" />
            <rect x="25" y="16" width="2" height="1" fill="#fb7185" opacity="0.8" />

            {/* Water Bowl when Drinking */}
            {currentState === 'drink' && (
              <g transform="translate(23, 21)">
                <rect x="0" y="3" width="7" height="3" rx="1" fill="#0284c7" />
                <rect x="1" y="4" width="5" height="1" fill="#7dd3fc" />
                {/* Lapping tongue & water sparkle */}
                <rect x="-1" y="-1" width="2" height="2" fill="#fb7185" />
                <circle cx="2" cy="0" r="1" fill="#38bdf8" />
              </g>
            )}
          </g>

          {/* Celebration Hearts / Stars */}
          {currentState === 'celebrate' && (
            <g>
              <path
                d="M14 4 H16 V6 H14 Z M17 4 H19 V6 H17 Z M15 6 H18 V8 H15 Z M16 8 H17 V9 H16 Z"
                fill="#f43f5e"
              />
              <rect x="8" y="8" width="2" height="2" fill="#facc15" />
              <rect x="24" y="6" width="2" height="2" fill="#38bdf8" />
            </g>
          )}
        </svg>
      ) : (
        /* ================= PRANJALI / PIXEL COZY DESK BUDDY ================= */
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full overflow-visible drop-shadow-md"
          shapeRendering="crispEdges"
        >
          {/* Ground Soft Pixel Shadow */}
          <ellipse
            cx="16"
            cy={currentState === 'celebrate' ? 30 : 28}
            rx={currentState === 'celebrate' ? 6 : 9}
            ry={2}
            fill="#0f172a"
            opacity={currentState === 'celebrate' ? 0.18 : 0.28}
          />

          <g
            transform={
              currentState === 'celebrate'
                ? `translate(0, ${frame % 2 === 0 ? -4 : -1})`
                : currentState === 'walk'
                ? `translate(0, ${frame % 2 === 0 ? -1 : 0})`
                : 'translate(0, 0)'
            }
          >
            {/* Back Ponytail Hair Bounce */}
            <rect
              x={currentState === 'walk' && frame % 2 === 0 ? 8 : 9}
              y={currentState === 'walk' && frame % 2 === 0 ? 7 : 8}
              width="4"
              height="7"
              fill="#18181b"
            />
            <rect
              x={currentState === 'walk' && frame % 2 === 0 ? 7 : 8}
              y={currentState === 'walk' && frame % 2 === 0 ? 11 : 12}
              width="3"
              height="5"
              fill="#27272a"
            />

            {/* Cozy Sweaters / Torso (Oversized Lilac Hoodie) */}
            <rect x="11" y="14" width="10" height="8" fill="#c084fc" />
            <rect x="11" y="21" width="10" height="1" fill="#9333ea" />
            {/* Front Kangaroo Pocket */}
            <rect x="13" y="18" width="6" height="3" fill="#a855f7" />
            {/* White Drawstrings */}
            <rect x="14" y="15" width="1" height="3" fill="#f8fafc" />
            <rect x="17" y="15" width="1" height="3" fill="#f8fafc" />

            {/* Denim Jeans */}
            <rect x="12" y="22" width="8" height="3" fill="#2563eb" />
            <rect x="15" y="23" width="2" height="2" fill="#1d4ed8" />

            {/* Animated Legs and Sneakers */}
            {currentState === 'walk' ? (
              frame % 2 === 0 ? (
                <>
                  {/* Left Leg Step Forward */}
                  <rect x="11" y="24" width="3" height="3" fill="#fed7aa" />
                  <rect x="10" y="26" width="4" height="2" fill="#ffffff" />
                  <rect x="10" y="28" width="4" height="1" fill="#0284c7" />

                  {/* Right Leg Trailing Back */}
                  <rect x="18" y="24" width="3" height="2" fill="#fed7aa" />
                  <rect x="18" y="25" width="3" height="2" fill="#ffffff" />
                  <rect x="18" y="27" width="3" height="1" fill="#0284c7" />
                </>
              ) : (
                <>
                  {/* Right Leg Step Forward */}
                  <rect x="18" y="24" width="3" height="3" fill="#fed7aa" />
                  <rect x="18" y="26" width="4" height="2" fill="#ffffff" />
                  <rect x="18" y="28" width="4" height="1" fill="#0284c7" />

                  {/* Left Leg Trailing Back */}
                  <rect x="11" y="24" width="3" height="2" fill="#fed7aa" />
                  <rect x="11" y="25" width="3" height="2" fill="#ffffff" />
                  <rect x="11" y="27" width="3" height="1" fill="#0284c7" />
                </>
              )
            ) : currentState === 'celebrate' ? (
              <>
                {/* Jumping Legs (Tucked up playfully) */}
                <rect x="11" y="24" width="3" height="2" fill="#fed7aa" />
                <rect x="10" y="25" width="4" height="2" fill="#ffffff" />
                <rect x="10" y="27" width="4" height="1" fill="#0284c7" />

                <rect x="18" y="24" width="3" height="2" fill="#fed7aa" />
                <rect x="18" y="25" width="4" height="2" fill="#ffffff" />
                <rect x="18" y="27" width="4" height="1" fill="#0284c7" />
              </>
            ) : (
              <>
                {/* Idle / Standing Legs */}
                <rect x="12" y="24" width="3" height="3" fill="#fed7aa" />
                <rect x="11" y="26" width="4" height="2" fill="#ffffff" />
                <rect x="11" y="28" width="4" height="1" fill="#0284c7" />

                <rect x="17" y="24" width="3" height="3" fill="#fed7aa" />
                <rect x="17" y="26" width="4" height="2" fill="#ffffff" />
                <rect x="17" y="28" width="4" height="1" fill="#0284c7" />
              </>
            )}

            {/* Left Arm State */}
            {currentState === 'celebrate' ? (
              /* Arm Raised in Cheering V */
              <>
                <rect x="8" y="10" width="3" height="5" fill="#c084fc" />
                <rect x="8" y="9" width="3" height="2" fill="#fed7aa" />
              </>
            ) : currentState === 'walk' ? (
              frame % 2 === 0 ? (
                /* Swinging back */
                <rect x="8" y="16" width="3" height="5" fill="#a855f7" />
              ) : (
                /* Swinging forward */
                <rect x="8" y="14" width="3" height="5" fill="#c084fc" />
              )
            ) : (
              /* Natural resting side arm */
              <rect x="9" y="15" width="2" height="5" fill="#a855f7" />
            )}

            {/* Right Arm / Item State (Water Tumbler or Wave) */}
            {currentState === 'drink' ? (
              /* Holding Water Bottle and Sipping! */
              <g>
                <rect x="20" y="13" width="3" height="4" fill="#c084fc" />
                <rect x="20" y="11" width="2" height="2" fill="#fed7aa" />
                {/* Pastel Sky Blue Water Bottle with Straw */}
                <rect x="20" y="10" width="4" height="6" rx="1" fill="#38bdf8" />
                <rect x="21" y="12" width="2" height="3" fill="#0284c7" />
                {/* White Cap & Straw */}
                <rect x="21" y="9" width="2" height="1" fill="#ffffff" />
                <rect x="19" y="8" width="3" height="1" fill="#f43f5e" />
                {/* Water Droplets Refreshing */}
                <circle cx="23" cy="7" r="1" fill="#38bdf8" />
                <circle cx="25" cy="9" r="0.8" fill="#7dd3fc" />
              </g>
            ) : currentState === 'wave' ? (
              /* Waving Right Hand */
              <g>
                <rect x="21" y="10" width="3" height="5" fill="#c084fc" />
                <rect
                  x={frame % 2 === 0 ? 22 : 24}
                  y="8"
                  width="3"
                  height="3"
                  fill="#fed7aa"
                />
              </g>
            ) : currentState === 'celebrate' ? (
              /* Both Arms Raised */
              <>
                <rect x="21" y="10" width="3" height="5" fill="#c084fc" />
                <rect x="21" y="9" width="3" height="2" fill="#fed7aa" />
              </>
            ) : currentState === 'walk' ? (
              frame % 2 === 0 ? (
                /* Swinging forward */
                <rect x="21" y="14" width="3" height="5" fill="#c084fc" />
              ) : (
                /* Swinging back */
                <rect x="21" y="16" width="3" height="5" fill="#a855f7" />
              )
            ) : (
              /* Idle holding mini tumbler at hip */
              <g>
                <rect x="21" y="15" width="2" height="5" fill="#a855f7" />
                <rect x="21" y="17" width="2" height="3" rx="0.5" fill="#38bdf8" />
              </g>
            )}

            {/* Character Head & Hair */}
            {/* Face Skin */}
            <rect x="12" y="8" width="8" height="7" fill="#fed7aa" />
            <rect x="11" y="9" width="1" height="4" fill="#fde68a" />
            <rect x="20" y="9" width="1" height="4" fill="#fde68a" />

            {/* Dark Hair / Fringe / Bangs */}
            <rect x="11" y="5" width="10" height="4" fill="#18181b" />
            <rect x="10" y="7" width="2" height="6" fill="#27272a" />
            <rect x="20" y="7" width="2" height="6" fill="#27272a" />
            {/* Bangs fringe */}
            <rect x="12" y="7" width="3" height="2" fill="#18181b" />
            <rect x="16" y="7" width="4" height="2" fill="#18181b" />
            <rect x="15" y="6" width="2" height="1" fill="#52525b" />

            {/* Eyes */}
            {blink || currentState === 'drink' ? (
              /* Happy Closed / Sipping Eyes (´ ꒳ `) */
              <>
                <rect x="13" y="11" width="2" height="1" fill="#18181b" />
                <rect x="17" y="11" width="2" height="1" fill="#18181b" />
              </>
            ) : (
              /* Expressive Pixel Eyes with Specular Sparkle */
              <>
                <rect x="13" y="10" width="2" height="2" fill="#18181b" />
                <rect x="13" y="10" width="1" height="1" fill="#ffffff" />
                <rect x="17" y="10" width="2" height="2" fill="#18181b" />
                <rect x="17" y="10" width="1" height="1" fill="#ffffff" />
              </>
            )}

            {/* Rosy Cheeks Blush */}
            <rect x="12" y="12" width="2" height="1" fill="#fb7185" opacity="0.85" />
            <rect x="18" y="12" width="2" height="1" fill="#fb7185" opacity="0.85" />

            {/* Mouth */}
            {isSpeaking ? (
              /* Animated Speaking Mouth */
              <rect
                x="15"
                y={frame % 2 === 0 ? 12 : 13}
                width="2"
                height={frame % 2 === 0 ? 2 : 1}
                fill="#e11d48"
              />
            ) : currentState === 'drink' ? (
              /* Sipping 'o' mouth */
              <rect x="15" y="12" width="2" height="1" fill="#e11d48" />
            ) : (
              /* Gentle Warm Smile */
              <rect x="15" y="13" width="2" height="1" fill="#e11d48" />
            )}
          </g>

          {/* Emotes / Floating Celebration & Hydration Effects */}
          {currentState === 'celebrate' && (
            <g>
              {/* Floating Heart */}
              <path
                d="M14 2 H16 V4 H14 Z M17 2 H19 V4 H17 Z M15 4 H18 V6 H15 Z M16 6 H17 V7 H16 Z"
                fill="#f43f5e"
              />
              {/* Sparkle Stars */}
              <rect x="7" y="6" width="2" height="2" fill="#facc15" />
              <rect x="23" y="4" width="2" height="2" fill="#38bdf8" />
              <rect x="6" y="13" width="1" height="1" fill="#ec4899" />
              <rect x="25" y="12" width="1" height="1" fill="#10b981" />
            </g>
          )}

          {currentState === 'wave' && (
            <g>
              <path
                d="M24 2 H26 V4 H24 Z M27 2 H29 V4 H27 Z M25 4 H28 V6 H25 Z M26 6 H27 V7 H26 Z"
                fill="#fb7185"
              />
            </g>
          )}
        </svg>
      )}
    </div>
  );
};

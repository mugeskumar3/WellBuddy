import React, { useMemo } from 'react';
import { AvatarInfo } from '@shared/types';
import { LottieLight } from 'lottie-react';
import { PixelCompanion } from './PixelCompanion';

interface AnimatedCharacterProps {
  avatar: AvatarInfo;
  isWalking?: boolean;
  isWaving?: boolean;
  isSpeaking?: boolean;
  isCelebrating?: boolean;
  isDrinking?: boolean;
  sizeClasses?: string;
  onClick?: () => void;
}

const getSvgMarkup = (src: string): string | null => {
  if (!src || !src.startsWith('data:image/svg+xml')) return null;
  const commaIdx = src.indexOf(',');
  if (commaIdx === -1) return null;
  try {
    return decodeURIComponent(src.substring(commaIdx + 1));
  } catch {
    return null;
  }
};

const getLottieJson = (src: string): any | null => {
  if (!src) return null;
  if (src.startsWith('data:application/json')) {
    const commaIdx = src.indexOf(',');
    if (commaIdx === -1) return null;
    try {
      const jsonStr = decodeURIComponent(src.substring(commaIdx + 1));
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  avatar,
  isWalking = false,
  isWaving = false,
  isSpeaking = false,
  isCelebrating = false,
  isDrinking = false,
  sizeClasses = 'w-28 h-28',
  onClick,
}) => {
  const isPixel = Boolean(
    avatar.id?.startsWith('pixel-') ||
    avatar.src?.includes('shape-rendering="crispEdges"') ||
    avatar.src?.includes('shape-rendering=\'crispEdges\'')
  );
  const svgMarkup = useMemo(() => getSvgMarkup(avatar.src), [avatar.src]);
  const lottieData = useMemo(() => getLottieJson(avatar.src), [avatar.src]);
  const isVideo = useMemo(() => {
    if (!avatar.src) return false;
    return (
      avatar.src.startsWith('data:video/') ||
      avatar.src.endsWith('.webm') ||
      avatar.src.endsWith('.mp4')
    );
  }, [avatar.src]);

  return (
    <div
      onClick={onClick}
      className={`drag-region cursor-grab active:cursor-grabbing transition-all duration-300 rounded-2xl filter drop-shadow-xl flex items-center justify-center ${sizeClasses} ${
        isWaving
          ? 'animate-mascot-celebrate'
          : isSpeaking
          ? 'animate-talking-speech'
          : 'hover:scale-105'
      }`}
    >
      {/* 1. Interactive Retro Pixel Art Companion (Match for Desktop Pet Video) */}
      {isPixel ? (
        <PixelCompanion
          id={avatar.id}
          isWalking={isWalking}
          isWaving={isWaving}
          isSpeaking={isSpeaking}
          isCelebrating={isCelebrating}
          isDrinking={isDrinking}
          className="w-full h-full"
        />
      ) : lottieData ? (
        /* 2. Lottie Animation Render (if Lottie JSON is provided) */
        <div className="w-full h-full flex items-center justify-center select-none pointer-events-none">
          <LottieLight
            src={lottieData}
            autoplay={isWalking || isSpeaking || isWaving}
            loop={true}
            className="w-full h-full"
          />
        </div>
      ) : isVideo ? (
        /* 3. 3D Animated AI Video Loop Render (transparent WebM / MP4) */
        <video
          src={avatar.src}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-contain pointer-events-none drop-shadow-md select-none ${
            !isWalking ? 'avatar-stationary-pose' : ''
          }`}
        />
      ) : svgMarkup ? (
        /* 4. Embedded Dynamic Vector SVG Render */
        <div
          className={`w-full h-full flex items-center justify-center select-none pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible ${
            !isWalking ? 'avatar-stationary-pose' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        /* 5. Static/Raster Image Fallback */
        <img
          src={avatar.src}
          alt={avatar.name}
          className={`w-full h-full object-contain pointer-events-none drop-shadow-md select-none ${
            !isWalking ? 'avatar-stationary-pose' : ''
          }`}
          draggable={false}
        />
      )}

      {/* Screen-reader and testing accessibility anchor */}
      <img
        src={avatar.src}
        alt={avatar.name}
        className="sr-only"
        draggable={false}
      />
    </div>
  );
};

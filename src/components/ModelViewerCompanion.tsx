import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';

export interface ModelViewerCompanionProps {
  src: string;
  alt?: string;
  isWalking?: boolean;
  isWaving?: boolean;
  isSpeaking?: boolean;
  isCelebrating?: boolean;
  isDrinking?: boolean;
  className?: string;
  onClick?: () => void;
}

export const ModelViewerCompanion: React.FC<ModelViewerCompanionProps> = ({
  src,
  alt = '3D Companion',
  isWalking = false,
  isWaving = false,
  isCelebrating = false,
  isDrinking = false,
  className = 'w-28 h-28',
  onClick,
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const [availableAnimations, setAvailableAnimations] = useState<string[]>([]);

  // Listen for available animation clips once model finishes loading
  useEffect(() => {
    const el = modelViewerRef.current as any;
    if (!el) return;

    const handleLoad = () => {
      if (el.availableAnimations && Array.isArray(el.availableAnimations)) {
        setAvailableAnimations(el.availableAnimations);
      }
    };

    if (el.availableAnimations && Array.isArray(el.availableAnimations) && el.availableAnimations.length > 0) {
      setAvailableAnimations(el.availableAnimations);
    }

    el.addEventListener('load', handleLoad);
    return () => {
      el.removeEventListener('load', handleLoad);
    };
  }, [src]);

  // Determine which 3D animation clip to play based on current app state
  const findMatch = (...names: string[]): string | undefined => {
    if (!availableAnimations.length) return undefined;
    for (const name of names) {
      const found = availableAnimations.find(
        (a) => typeof a === 'string' && a.toLowerCase().includes(name.toLowerCase())
      );
      if (found) return found;
    }
    return undefined;
  };

  const hasSkeletalWalk = Boolean(
    findMatch('walking', 'walk', 'gallop', 'running', 'run')
  );

  const getAnimationName = (): string | undefined => {
    if (!availableAnimations.length) return undefined;

    if (isCelebrating) {
      return (
        findMatch('dance', 'gallop_jump', 'jump', 'thumbsup', 'cheer') ||
        availableAnimations[0]
      );
    }
    if (isDrinking) {
      return (
        findMatch('eating', 'drink', 'thumbsup', 'yes', 'wave') ||
        availableAnimations[0]
      );
    }
    if (isWaving) {
      return (
        findMatch('wave', 'thumbsup', 'yes') ||
        availableAnimations[0]
      );
    }
    if (isWalking) {
      return (
        findMatch('walking', 'walk', 'gallop', 'running', 'run') ||
        availableAnimations[0]
      );
    }

    // Default: Idle
    return (
      findMatch('idle', 'survey', 'standing') ||
      availableAnimations[0]
    );
  };

  const currentAnimation = getAnimationName();

  // Dynamically update and control animation clip playback on model-viewer element
  useEffect(() => {
    const el = modelViewerRef.current as any;
    if (!el) return;

    if (isWalking || isWaving || isCelebrating || isDrinking) {
      if (currentAnimation && typeof currentAnimation === 'string') {
        el.animationName = currentAnimation;
      }
      try {
        el.play();
      } catch { }
    } else {
      // Resting / stationary mode: pause skeletal locomotion
      try {
        if (currentAnimation) {
          el.pause();
          el.currentTime = 0;
        }
      } catch { }
    }
  }, [currentAnimation, isWalking, isWaving, isCelebrating, isDrinking]);

  const hasWebGL = typeof window !== 'undefined' && Boolean(
    window.WebGLRenderingContext &&
    (() => {
      try {
        const c = document.createElement('canvas');
        return Boolean(c.getContext('webgl') || c.getContext('experimental-webgl'));
      } catch {
        return false;
      }
    })()
  );

  const isStaticModel = availableAnimations.length === 0;
  // Gentle auto-rotation only when resting / idle; when walking, character faces forward and strides
  const shouldAutoRotate = isStaticModel && !isWalking;

  return (
    <div
      onClick={onClick}
      className={`interactive-area relative select-none pointer-events-auto flex items-center justify-center cursor-pointer transition-transform duration-200 ${
        isWalking && !hasSkeletalWalk ? 'model-walking-active' : ''
      } ${className}`}
    >
      {hasWebGL ? (
        React.createElement('model-viewer', {
          ref: modelViewerRef,
          src: src,
          alt: alt,
          loading: 'lazy',
          'animation-name': currentAnimation,
          autoplay: isWalking || isWaving || isCelebrating || isDrinking,
          'auto-rotate': shouldAutoRotate,
          'rotation-per-second': '24deg',
          'auto-rotate-delay': '0',
          'camera-orbit': '0deg 75deg 105%',
          'camera-controls': false,
          'interaction-prompt': 'none',
          'shadow-intensity': '1.2',
          'shadow-softness': '0.7',
          exposure: '1.05',
          style: {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            outline: 'none',
            pointerEvents: 'none',
          },
        })
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-sky-500 font-bold">
          3D
        </div>
      )}
    </div>
  );
};

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface FullscreenState {
  isFullscreen: boolean;
  isSupported: boolean;
}

/**
 * Fullscreen API hook
 */
export function useFullscreen<T extends HTMLElement = HTMLElement>() {
  const [state, setState] = useState<FullscreenState>({
    isFullscreen: false,
    isSupported: false,
  });
  
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const isSupported =
      typeof document !== 'undefined' &&
      (document.fullscreenEnabled ||
        (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
        (document as Document & { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled ||
        (document as Document & { msFullscreenEnabled?: boolean }).msFullscreenEnabled);

    setState((prev) => ({ ...prev, isSupported: !!isSupported }));

    const handleChange = () => {
      setState((prev) => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('mozfullscreenchange', handleChange);
    document.addEventListener('MSFullscreenChange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('mozfullscreenchange', handleChange);
      document.removeEventListener('MSFullscreenChange', handleChange);
    };
  }, []);

  const enter = useCallback(async () => {
    const element = elementRef.current || document.documentElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (element as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((element as HTMLElement & { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
        await (element as HTMLElement & { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
      } else if ((element as HTMLElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (element as HTMLElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as Document & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ((document as Document & { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
        await (document as Document & { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
      } else if ((document as Document & { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
        await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (state.isFullscreen) {
      await exit();
    } else {
      await enter();
    }
  }, [state.isFullscreen, enter, exit]);

  return {
    ...state,
    ref: elementRef,
    enter,
    exit,
    toggle,
  };
}

/**
 * Screen lock orientation hook
 */
export function useScreenOrientation() {
  const [orientation, setOrientation] = useState<{
    type: string;
    angle: number;
  }>({
    type: 'portrait-primary',
    angle: 0,
  });

  useEffect(() => {
    const updateOrientation = () => {
      if (screen.orientation) {
        setOrientation({
          type: screen.orientation.type,
          angle: screen.orientation.angle,
        });
      }
    };

    updateOrientation();

    if (screen.orientation) {
      screen.orientation.addEventListener('change', updateOrientation);
    }
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', updateOrientation);
      }
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  const lock = useCallback(async (lockType: OrientationLockType) => {
    try {
      if (screen.orientation?.lock) {
        await screen.orientation.lock(lockType);
        return true;
      }
    } catch (error) {
      console.error('Failed to lock orientation:', error);
    }
    return false;
  }, []);

  const unlock = useCallback(() => {
    try {
      if (screen.orientation?.unlock) {
        screen.orientation.unlock();
        return true;
      }
    } catch (error) {
      console.error('Failed to unlock orientation:', error);
    }
    return false;
  }, []);

  const isPortrait = orientation.type.includes('portrait');
  const isLandscape = orientation.type.includes('landscape');

  return {
    ...orientation,
    isPortrait,
    isLandscape,
    lock,
    unlock,
  };
}

/**
 * Screen wake lock hook
 */
export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!isSupported) return false;

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);

      wakeLockRef.current.addEventListener('release', () => {
        setIsActive(false);
      });

      return true;
    } catch (error) {
      console.error('Failed to request wake lock:', error);
      return false;
    }
  }, [isSupported]);

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  // Re-acquire wake lock on visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLockRef.current) {
        await request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, request]);

  return { isActive, isSupported, request, release };
}

export { useFullscreen as default };

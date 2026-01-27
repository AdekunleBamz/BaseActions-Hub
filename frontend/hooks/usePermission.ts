'use client';

import { useState, useEffect, useCallback } from 'react';

type PermissionName = 
  | 'geolocation'
  | 'notifications'
  | 'push'
  | 'midi'
  | 'camera'
  | 'microphone'
  | 'speaker'
  | 'device-info'
  | 'background-fetch'
  | 'background-sync'
  | 'bluetooth'
  | 'persistent-storage'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'screen-wake-lock';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

interface UsePermissionReturn {
  state: PermissionState;
  isGranted: boolean;
  isDenied: boolean;
  isPrompt: boolean;
  isUnsupported: boolean;
  request: () => Promise<PermissionState>;
}

/**
 * Hook for checking browser permissions
 */
export function usePermission(permissionName: PermissionName): UsePermissionReturn {
  const [state, setState] = useState<PermissionState>('prompt');

  const checkPermission = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      setState('unsupported');
      return 'unsupported' as PermissionState;
    }

    try {
      const permission = await navigator.permissions.query({
        name: permissionName as PermissionDescriptor['name'],
      });
      
      setState(permission.state as PermissionState);

      permission.addEventListener('change', () => {
        setState(permission.state as PermissionState);
      });

      return permission.state as PermissionState;
    } catch {
      setState('unsupported');
      return 'unsupported' as PermissionState;
    }
  }, [permissionName]);

  const request = useCallback(async (): Promise<PermissionState> => {
    // Handle specific permission requests
    switch (permissionName) {
      case 'notifications':
        if ('Notification' in window) {
          const result = await Notification.requestPermission();
          const newState = result === 'default' ? 'prompt' : result;
          setState(newState as PermissionState);
          return newState as PermissionState;
        }
        break;
      case 'geolocation':
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setState('granted');
              resolve('granted');
            },
            (error) => {
              const newState = error.code === 1 ? 'denied' : 'prompt';
              setState(newState);
              resolve(newState);
            }
          );
        });
      case 'camera':
      case 'microphone':
        try {
          const constraints = {
            video: permissionName === 'camera',
            audio: permissionName === 'microphone',
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          stream.getTracks().forEach((track) => track.stop());
          setState('granted');
          return 'granted';
        } catch {
          setState('denied');
          return 'denied';
        }
      case 'clipboard-read':
      case 'clipboard-write':
        return checkPermission();
    }

    return checkPermission();
  }, [permissionName, checkPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    state,
    isGranted: state === 'granted',
    isDenied: state === 'denied',
    isPrompt: state === 'prompt',
    isUnsupported: state === 'unsupported',
    request,
  };
}

/**
 * Hook for multiple permissions
 */
export function usePermissions(permissions: PermissionName[]) {
  const [states, setStates] = useState<Record<PermissionName, PermissionState>>(
    {} as Record<PermissionName, PermissionState>
  );

  useEffect(() => {
    const checkAll = async () => {
      const results: Record<string, PermissionState> = {};

      for (const permission of permissions) {
        if (typeof navigator !== 'undefined' && navigator.permissions) {
          try {
            const result = await navigator.permissions.query({
              name: permission as PermissionDescriptor['name'],
            });
            results[permission] = result.state as PermissionState;
          } catch {
            results[permission] = 'unsupported';
          }
        } else {
          results[permission] = 'unsupported';
        }
      }

      setStates(results as Record<PermissionName, PermissionState>);
    };

    checkAll();
  }, [permissions]);

  const allGranted = Object.values(states).every((s) => s === 'granted');
  const anyDenied = Object.values(states).some((s) => s === 'denied');

  return { states, allGranted, anyDenied };
}

export default usePermission;

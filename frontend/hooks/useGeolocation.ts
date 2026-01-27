'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

/**
 * Geolocation hook for accessing user location
 */
export function useGeolocation(options: GeolocationOptions = {}) {
  const {
    enableHighAccuracy = false,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestamp: null,
    error: null,
    isLoading: false,
  });

  const watchIdRef = useRef<number | null>(null);

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
      error: null,
      isLoading: false,
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: {
          code: 0,
          message: 'Geolocation not supported',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
  }, [enableHighAccuracy, timeout, maximumAge, onSuccess, onError]);

  useEffect(() => {
    if (!watch) return;

    if (!navigator.geolocation) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [watch, enableHighAccuracy, timeout, maximumAge, onSuccess, onError]);

  return {
    ...state,
    getPosition,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  };
}

/**
 * Distance calculation between two coordinates
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: 'km' | 'miles' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default useGeolocation;

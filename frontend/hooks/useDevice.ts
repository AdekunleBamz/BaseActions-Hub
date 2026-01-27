'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface BatteryState {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  isSupported: boolean;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManager, ev: Event) => void) | null;
  onchargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
  ondischargingtimechange: ((this: BatteryManager, ev: Event) => void) | null;
  onlevelchange: ((this: BatteryManager, ev: Event) => void) | null;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

/**
 * Battery status hook
 */
export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>({
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    level: 1,
    isSupported: false,
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;

    if (!nav.getBattery) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    let battery: BatteryManager | null = null;

    const updateBatteryState = (b: BatteryManager) => {
      setState({
        charging: b.charging,
        chargingTime: b.chargingTime,
        dischargingTime: b.dischargingTime,
        level: b.level,
        isSupported: true,
      });
    };

    nav.getBattery().then((b) => {
      battery = b;
      updateBatteryState(b);

      const handleChange = () => updateBatteryState(b);

      b.addEventListener('chargingchange', handleChange);
      b.addEventListener('chargingtimechange', handleChange);
      b.addEventListener('dischargingtimechange', handleChange);
      b.addEventListener('levelchange', handleChange);
    });

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', () => {});
        battery.removeEventListener('chargingtimechange', () => {});
        battery.removeEventListener('dischargingtimechange', () => {});
        battery.removeEventListener('levelchange', () => {});
      }
    };
  }, []);

  return state;
}

/**
 * Online/Offline status hook
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [offlineSince, setOfflineSince] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSince(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const offlineDuration = useMemo(() => {
    if (!offlineSince || isOnline) return 0;
    return Date.now() - offlineSince.getTime();
  }, [offlineSince, isOnline]);

  return { isOnline, isOffline: !isOnline, offlineSince, offlineDuration };
}

/**
 * Network information hook
 */
export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
    isSupported: boolean;
  }>({
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
    isSupported: false,
  });

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    if (!connection) {
      return;
    }

    const updateInfo = () => {
      setNetworkInfo({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
        isSupported: true,
      });
    };

    updateInfo();
    connection.addEventListener('change', updateInfo);

    return () => {
      connection.removeEventListener('change', updateInfo);
    };
  }, []);

  return networkInfo;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

/**
 * Device memory hook
 */
export function useDeviceMemory() {
  const [memory, setMemory] = useState<number | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (nav.deviceMemory) {
      setMemory(nav.deviceMemory);
    }
  }, []);

  return {
    memory,
    isLowMemory: memory !== null && memory <= 2,
    isSupported: memory !== null,
  };
}

/**
 * Hardware concurrency hook (CPU cores)
 */
export function useHardwareConcurrency() {
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined;
  
  return {
    cores,
    isSupported: cores !== undefined,
    isMultiCore: cores !== undefined && cores > 1,
  };
}

export { useBattery as default };

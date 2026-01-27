"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface NetworkState {
  online: boolean;
  downlink?: number;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number;
  saveData?: boolean;
}

export function useNetwork() {
  const [state, setState] = useState<NetworkState>({
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
  });

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as Navigator & {
        connection?: {
          downlink?: number;
          effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
          rtt?: number;
          saveData?: boolean;
        };
      }).connection;

      setState({
        online: navigator.onLine,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
      });
    };

    const handleOnline = () => setState((prev) => ({ ...prev, online: true }));
    const handleOffline = () => setState((prev) => ({ ...prev, online: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for connection changes if supported
    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo);
    }

    updateNetworkInfo();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo);
      }
    };
  }, []);

  return state;
}

/**
 * Hook to detect when user comes back online
 */
export function useOnReconnect(callback: () => void) {
  const savedCallback = useRef(callback);
  const wasOffline = useRef(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleOnline = () => {
      if (wasOffline.current) {
        savedCallback.current();
      }
      wasOffline.current = false;
    };

    const handleOffline = () => {
      wasOffline.current = true;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
}

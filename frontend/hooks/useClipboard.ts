"use client";

import { useState, useCallback } from "react";

interface ClipboardState {
  copied: boolean;
  error: Error | null;
}

export function useClipboard(timeout = 2000) {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    error: null,
  });

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        setState({
          copied: false,
          error: new Error("Clipboard API not available"),
        });
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setState({ copied: true, error: null });

        // Trigger haptic feedback on mobile
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        // Reset copied state after timeout
        setTimeout(() => {
          setState((prev) => ({ ...prev, copied: false }));
        }, timeout);

        return true;
      } catch (err) {
        setState({
          copied: false,
          error: err instanceof Error ? err : new Error("Failed to copy"),
        });
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setState({ copied: false, error: null });
  }, []);

  return {
    ...state,
    copy,
    reset,
  };
}

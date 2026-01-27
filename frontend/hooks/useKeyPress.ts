"use client";

import { useState, useEffect, useCallback } from "react";

type ModifierKey = "ctrlKey" | "shiftKey" | "altKey" | "metaKey";

interface KeyPressOptions {
  targetKey: string;
  modifiers?: ModifierKey[];
  enabled?: boolean;
}

export function useKeyPress(options: KeyPressOptions): boolean {
  const { targetKey, modifiers = [], enabled = true } = options;
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const modifiersMatch = modifiers.every((mod) => event[mod]);

      if (event.key.toLowerCase() === targetKey.toLowerCase() && modifiersMatch) {
        setKeyPressed(true);
      }
    },
    [targetKey, modifiers, enabled]
  );

  const upHandler = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      if (event.key.toLowerCase() === targetKey.toLowerCase()) {
        setKeyPressed(false);
      }
    },
    [targetKey, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler, enabled]);

  return keyPressed;
}

interface HotkeyOptions {
  key: string;
  callback: () => void;
  modifiers?: ModifierKey[];
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useHotkey(options: HotkeyOptions): void {
  const {
    key,
    callback,
    modifiers = [],
    enabled = true,
    preventDefault = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      const modifiersMatch = modifiers.every((mod) => event[mod]);

      if (event.key.toLowerCase() === key.toLowerCase() && modifiersMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, modifiers, enabled, preventDefault]);
}

// Common hotkey presets
export function useEscapeKey(callback: () => void, enabled = true): void {
  useHotkey({ key: "Escape", callback, enabled });
}

export function useEnterKey(callback: () => void, enabled = true): void {
  useHotkey({ key: "Enter", callback, enabled });
}

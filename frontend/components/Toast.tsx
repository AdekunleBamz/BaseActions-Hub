"use client";

import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  removeAll: () => void;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// ============================================================================
// Toast Icons
// ============================================================================

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ============================================================================
// Toast Item Component
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [toast.id, onRemove]);

  useEffect(() => {
    if (toast.duration !== 0) {
      timerRef.current = setTimeout(handleRemove, toast.duration || 5000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toast.duration, handleRemove]);

  const bgColors: Record<ToastType, string> = {
    success: "bg-green-900/90 border-green-700",
    error: "bg-red-900/90 border-red-700",
    warning: "bg-yellow-900/90 border-yellow-700",
    info: "bg-blue-900/90 border-blue-700",
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm",
        "shadow-lg shadow-black/20",
        "transition-all duration-200",
        isExiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0",
        bgColors[toast.type]
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-white/70">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-white underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {toast.dismissible !== false && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Toast Container
// ============================================================================

type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

interface ToastContainerProps {
  position?: ToastPosition;
}

function ToastContainer({ position = "bottom-right" }: ToastContainerProps) {
  const { toasts } = useToast();

  const positionClasses: Record<ToastPosition, string> = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 w-full max-w-sm",
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => {}}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Toast Provider
// ============================================================================

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((toast: Omit<Toast, "id">): string => {
    const id = `toast-${++toastIdRef.current}`;
    
    setToasts((prev) => {
      const newToasts = [...prev, { ...toast, id }];
      // Keep only the last maxToasts
      return newToasts.slice(-maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAll }}>
      {children}
      <ToastContainer position={position} />
    </ToastContext.Provider>
  );
}

// ============================================================================
// Convenience Hooks
// ============================================================================

export function useToastActions() {
  const { addToast, removeToast, removeAll } = useToast();

  const success = useCallback(
    (title: string, message?: string) => 
      addToast({ type: "success", title, message }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => 
      addToast({ type: "error", title, message, duration: 8000 }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => 
      addToast({ type: "warning", title, message }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => 
      addToast({ type: "info", title, message }),
    [addToast]
  );

  const promise = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ): Promise<T> => {
      const loadingId = addToast({
        type: "info",
        title: messages.loading,
        duration: 0,
        dismissible: false,
      });

      try {
        const result = await promise;
        removeToast(loadingId);
        addToast({ type: "success", title: messages.success });
        return result;
      } catch (err) {
        removeToast(loadingId);
        addToast({ 
          type: "error", 
          title: messages.error,
          message: err instanceof Error ? err.message : undefined,
        });
        throw err;
      }
    },
    [addToast, removeToast]
  );

  return {
    success,
    error,
    warning,
    info,
    promise,
    custom: addToast,
    remove: removeToast,
    removeAll,
  };
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info" | "loading";
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface ToastContext {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Omit<ToastData, "id">>) => void;
}

let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let toasts: ToastData[] = [];

const notify = () => {
  toastListeners.forEach((listener) => listener([...toasts]));
};

const generateId = () => Math.random().toString(36).substring(2, 9);

/**
 * Toast API functions
 */
export const toast = {
  success: (title: string, options?: Partial<Omit<ToastData, "id" | "type" | "title">>) => {
    const id = generateId();
    toasts = [...toasts, { id, type: "success", title, duration: 4000, ...options }];
    notify();
    return id;
  },

  error: (title: string, options?: Partial<Omit<ToastData, "id" | "type" | "title">>) => {
    const id = generateId();
    toasts = [...toasts, { id, type: "error", title, duration: 6000, ...options }];
    notify();
    return id;
  },

  warning: (title: string, options?: Partial<Omit<ToastData, "id" | "type" | "title">>) => {
    const id = generateId();
    toasts = [...toasts, { id, type: "warning", title, duration: 5000, ...options }];
    notify();
    return id;
  },

  info: (title: string, options?: Partial<Omit<ToastData, "id" | "type" | "title">>) => {
    const id = generateId();
    toasts = [...toasts, { id, type: "info", title, duration: 4000, ...options }];
    notify();
    return id;
  },

  loading: (title: string, options?: Partial<Omit<ToastData, "id" | "type" | "title">>) => {
    const id = generateId();
    toasts = [...toasts, { id, type: "loading", title, duration: 0, ...options }];
    notify();
    return id;
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    }
  ) => {
    const id = toast.loading(messages.loading);

    promise
      .then((data) => {
        const successMessage =
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success;
        toast.update(id, { type: "success", title: successMessage, duration: 4000 });
      })
      .catch((err) => {
        const errorMessage =
          typeof messages.error === "function"
            ? messages.error(err)
            : messages.error;
        toast.update(id, { type: "error", title: errorMessage, duration: 6000 });
      });

    return promise;
  },

  update: (id: string, updates: Partial<Omit<ToastData, "id">>) => {
    toasts = toasts.map((t) => (t.id === id ? { ...t, ...updates } : t));
    notify();
  },

  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },

  dismissAll: () => {
    toasts = [];
    notify();
  },
};

/**
 * Individual Toast component
 */
interface ToastItemProps {
  data: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(data.id), 200);
  }, [data.id, onDismiss]);

  useEffect(() => {
    if (data.duration && data.duration > 0) {
      timeoutRef.current = setTimeout(handleDismiss, data.duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data.duration, handleDismiss]);

  const icons = {
    success: (
      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    loading: (
      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    ),
  };

  const bgColors = {
    success: "bg-green-500/10 border-green-500/30",
    error: "bg-red-500/10 border-red-500/30",
    warning: "bg-yellow-500/10 border-yellow-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
    loading: "bg-gray-500/10 border-gray-500/30",
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border
        backdrop-blur-xl shadow-xl
        transform transition-all duration-200
        ${bgColors[data.type]}
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
    >
      {icons[data.type]}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{data.title}</p>
        {data.description && (
          <p className="text-sm text-gray-400 mt-1">{data.description}</p>
        )}
        {data.action && (
          <button
            onClick={() => {
              data.action?.onClick();
              handleDismiss();
            }}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 mt-2"
          >
            {data.action.label}
          </button>
        )}
      </div>

      {(data.dismissible !== false) && data.type !== "loading" && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * Toast Container - Manages toast rendering
 */
interface ToastContainerProps {
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  maxToasts?: number;
}

export function ToastContainer({
  position = "bottom-right",
  maxToasts = 5,
}: ToastContainerProps) {
  const [currentToasts, setCurrentToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const listener = (newToasts: ToastData[]) => {
      setCurrentToasts(newToasts.slice(-maxToasts));
    };

    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, [maxToasts]);

  const handleDismiss = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  const isTop = position.startsWith("top");

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed z-[100] flex flex-col gap-2 w-full max-w-sm ${positionClasses[position]}`}
      style={{ pointerEvents: "none" }}
    >
      {(isTop ? currentToasts : [...currentToasts].reverse()).map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <ToastItem data={t} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
}

/**
 * Transaction toast helpers
 */
export const txToast = {
  pending: (hash?: string) => {
    return toast.loading("Transaction pending...", {
      description: hash ? `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}` : undefined,
    });
  },

  success: (message: string = "Transaction confirmed!", hash?: string) => {
    return toast.success(message, {
      description: hash ? `Hash: ${hash.slice(0, 10)}...${hash.slice(-8)}` : undefined,
      action: hash
        ? {
            label: "View on Explorer",
            onClick: () => window.open(`https://basescan.org/tx/${hash}`, "_blank"),
          }
        : undefined,
    });
  },

  error: (message: string = "Transaction failed", error?: Error) => {
    return toast.error(message, {
      description: error?.message?.slice(0, 100),
    });
  },

  signature: () => {
    return toast.info("Please sign in your wallet...", {
      duration: 0,
    });
  },
};

/**
 * Notification badge component
 */
interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function NotificationBadge({ count, max = 99, className = "" }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[18px] h-[18px] px-1
        text-xs font-bold text-white
        bg-red-500 rounded-full
        ${className}
      `}
    >
      {displayCount}
    </span>
  );
}

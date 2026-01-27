"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

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
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Convenience functions
export function useToastActions() {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string) =>
      addToast({ type: "success", title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: "error", title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: "warning", title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: "info", title, message }),
  };
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

const typeStyles = {
  success: {
    bg: "bg-green-500/10 border-green-500/30",
    icon: "✓",
    iconBg: "bg-green-500",
  },
  error: {
    bg: "bg-red-500/10 border-red-500/30",
    icon: "✕",
    iconBg: "bg-red-500",
  },
  warning: {
    bg: "bg-yellow-500/10 border-yellow-500/30",
    icon: "⚠",
    iconBg: "bg-yellow-500",
  },
  info: {
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: "ℹ",
    iconBg: "bg-blue-500",
  },
} as const;

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [onDismiss, toast.id]);

  // Auto-dismiss
  useEffect(() => {
    setIsVisible(true);

    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(handleDismiss, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleDismiss]);

  const style = typeStyles[toast.type];

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl ${
        style.bg
      } transform transition-all duration-200 ${
        isVisible && !isLeaving
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
      role="alert"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-6 h-6 rounded-full ${style.iconBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
          aria-hidden="true"
        >
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">{toast.title}</p>
          {toast.message && (
            <p className="text-sm text-gray-400 mt-0.5">{toast.message}</p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm text-blue-400 hover:text-blue-300 mt-2 font-medium"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

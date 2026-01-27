"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "./ui/Button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.reset);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div
      className="min-h-[200px] flex items-center justify-center p-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4" aria-hidden="true">
          ⚠️
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={reset} variant="primary" size="sm">
          Try Again
        </Button>
      </div>
    </div>
  );
}

/**
 * Minimal error fallback for smaller components
 */
export function MinimalErrorFallback({ reset }: { reset: () => void }) {
  return (
    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
      <p className="text-red-400 text-sm mb-2">Failed to load</p>
      <button
        onClick={reset}
        className="text-xs text-blue-400 hover:text-blue-300"
      >
        Retry
      </button>
    </div>
  );
}

/**
 * Full page error fallback
 */
export function FullPageErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-pattern">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6" aria-hidden="true">
          💥
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Oops! Something crashed
        </h1>
        <p className="text-gray-400 mb-6">
          We apologize for the inconvenience. The error has been logged and
          we&apos;ll look into it.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="text-left text-xs text-red-400 bg-red-500/10 p-4 rounded-lg mb-6 overflow-auto max-h-40">
            {error.stack || error.message}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6" aria-hidden="true">
            🔥
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Application Error
          </h1>
          <p className="text-gray-400 mb-6">
            A critical error occurred. We apologize for the inconvenience.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mb-4">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={reset} variant="primary">
              Try Again
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="secondary">
              Go Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

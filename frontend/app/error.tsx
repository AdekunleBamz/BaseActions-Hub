"use client";

import { useEffect } from "react";
import { PageWrapper } from "@/components/Layout";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page error:", error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6" aria-hidden="true">
            😵
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-400 mb-6">
            We encountered an error while loading this page.
            Please try again or go back to the home page.
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
            <Button href="/" variant="secondary">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

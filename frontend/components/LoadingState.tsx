"use client";

import { Spinner } from "./ui/Spinner";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  message = "Loading...",
  size = "md",
}: LoadingStateProps) {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <Spinner size="lg" className="mx-auto text-blue-500 mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto text-blue-500 mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

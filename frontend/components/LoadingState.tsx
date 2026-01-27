"use client";

import { Spinner } from "./ui/Spinner";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "card" | "overlay";
}

export function LoadingState({
  message = "Loading...",
  size = "md",
  variant = "default",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "p-6",
    md: "p-12",
    lg: "p-16",
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        <Spinner size={size} className="text-blue-500" />
        <span className="text-gray-400 text-sm">{message}</span>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="glass rounded-2xl p-8 text-center animate-scale-in">
          <Spinner size="lg" className="mx-auto text-blue-500 mb-4" />
          <p className="text-gray-300 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass rounded-2xl ${sizeClasses[size]} text-center animate-fade-in`}>
      <Spinner size="lg" className="mx-auto text-blue-500 mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function PageLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative">
          <Spinner size="lg" className="mx-auto text-blue-500 mb-4" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full" />
        </div>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoadingState({ message }: { message?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-gray-400">
      <Spinner size="sm" className="text-blue-500" />
      {message && <span className="text-sm">{message}</span>}
    </span>
  );
}

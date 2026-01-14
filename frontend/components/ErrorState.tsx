"use client";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="glass rounded-xl p-6 border border-red-500/30 bg-red-500/10">
      <div className="flex items-start gap-4">
        <span className="text-2xl">❌</span>
        <div className="flex-1">
          <h4 className="font-bold text-red-400 mb-1">{title}</h4>
          <p className="text-sm text-red-400/80">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

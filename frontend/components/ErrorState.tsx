"use client";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: "default" | "inline" | "banner" | "fullpage";
  icon?: string;
  retryLabel?: string;
  showDetails?: boolean;
  details?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  variant = "default",
  icon = "❌",
  retryLabel = "Try again",
  showDetails = false,
  details,
}: ErrorStateProps) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm py-2">
        <span>{icon}</span>
        <span>{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="underline hover:text-red-300 ml-1">
            {retryLabel}
          </button>
        )}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="w-full px-4 py-3 bg-red-500/10 border-l-4 border-red-500 animate-slide-in-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
              <p className="font-medium text-red-400">{title}</p>
              <p className="text-sm text-red-400/80">{message}</p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "fullpage") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-6">{icon}</div>
          <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
          <p className="text-gray-400 mb-6">{message}</p>
          {showDetails && details && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                Show error details
              </summary>
              <pre className="mt-2 p-3 bg-red-500/10 rounded-lg text-xs text-red-400 overflow-auto">
                {details}
              </pre>
            </details>
          )}
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border border-red-500/30 bg-red-500/10 animate-fade-in">
      <div className="flex items-start gap-4">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h4 className="font-bold text-red-400 mb-1">{title}</h4>
          <p className="text-sm text-red-400/80">{message}</p>
          {showDetails && details && (
            <details className="mt-3">
              <summary className="text-xs text-red-400/60 cursor-pointer hover:text-red-400/80">
                Error details
              </summary>
              <pre className="mt-2 p-2 bg-black/20 rounded text-xs text-red-300 overflow-auto">
                {details}
              </pre>
            </details>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon="📡"
      title="Network Error"
      message="Unable to connect. Please check your internet connection."
      onRetry={onRetry}
      variant="default"
    />
  );
}

export function TransactionError({ 
  message, 
  onRetry,
  hash,
}: { 
  message: string; 
  onRetry?: () => void;
  hash?: string;
}) {
  return (
    <ErrorState
      icon="⚠️"
      title="Transaction Failed"
      message={message}
      onRetry={onRetry}
      variant="default"
      showDetails={!!hash}
      details={hash ? `Transaction hash: ${hash}` : undefined}
    />
  );
}

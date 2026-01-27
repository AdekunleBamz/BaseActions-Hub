"use client";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "card";
  className?: string;
}

/**
 * EmptyState - Display when no data is available
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  variant = "default",
  className = "",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-6 px-4",
      icon: "text-3xl mb-3",
      title: "text-base",
      description: "text-sm",
      button: "px-3 py-1.5 text-sm",
    },
    md: {
      container: "py-12 px-6",
      icon: "text-5xl mb-4",
      title: "text-xl",
      description: "text-base",
      button: "px-4 py-2 text-sm",
    },
    lg: {
      container: "py-16 px-8",
      icon: "text-7xl mb-6",
      title: "text-2xl",
      description: "text-lg",
      button: "px-5 py-2.5 text-base",
    },
  };

  const variantClasses = {
    default: "",
    minimal: "border-none bg-transparent",
    card: "bg-white/5 border border-white/10 rounded-2xl",
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${sizeClasses[size].container}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && (
        <div className={`text-gray-500 ${sizeClasses[size].icon}`}>
          {icon}
        </div>
      )}

      <h3 className={`font-semibold text-white ${sizeClasses[size].title}`}>
        {title}
      </h3>

      {description && (
        <p className={`text-gray-400 mt-2 max-w-md ${sizeClasses[size].description}`}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-6">
          {action && (
            <button
              onClick={action.onClick}
              className={`
                bg-blue-500 hover:bg-blue-600 text-white font-medium
                rounded-xl transition-colors
                ${sizeClasses[size].button}
              `}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`
                bg-white/5 hover:bg-white/10 text-gray-300 font-medium
                border border-white/10 rounded-xl transition-colors
                ${sizeClasses[size].button}
              `}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured empty states
 */
export function NoSignaturesEmpty({ onSign }: { onSign?: () => void }) {
  return (
    <EmptyState
      icon="✍️"
      title="No signatures yet"
      description="Be the first to sign this guestbook and leave your mark!"
      action={onSign ? { label: "Sign Now", onClick: onSign } : undefined}
    />
  );
}

export function NoMessagesEmpty({ onWrite }: { onWrite?: () => void }) {
  return (
    <EmptyState
      icon="💬"
      title="No messages"
      description="Start the conversation by writing the first message."
      action={onWrite ? { label: "Write Message", onClick: onWrite } : undefined}
    />
  );
}

export function NoBadgesEmpty({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon="🏆"
      title="No badges earned"
      description="Complete actions to earn badges and show off your achievements!"
      action={onExplore ? { label: "Explore Badges", onClick: onExplore } : undefined}
    />
  );
}

export function NoResultsEmpty({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
      action={onClear ? { label: "Clear Filters", onClick: onClear } : undefined}
      size="sm"
    />
  );
}

export function NoWalletEmpty({ onConnect }: { onConnect?: () => void }) {
  return (
    <EmptyState
      icon="👛"
      title="Connect your wallet"
      description="Connect your wallet to view your profile and activity."
      action={onConnect ? { label: "Connect Wallet", onClick: onConnect } : undefined}
    />
  );
}

export function NoActivityEmpty() {
  return (
    <EmptyState
      icon="📊"
      title="No activity yet"
      description="Your activity will appear here once you start interacting."
      size="sm"
      variant="minimal"
    />
  );
}

/**
 * ErrorState - Display when an error occurs
 */
interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  error,
  onRetry,
  onGoHome,
  showDetails = false,
  className = "",
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}>
      <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-white">{title}</h3>

      {description && (
        <p className="text-gray-400 mt-2 max-w-md">{description}</p>
      )}

      {showDetails && errorMessage && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md">
          <code className="text-sm text-red-400 break-all">{errorMessage}</code>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-medium border border-white/10 rounded-xl transition-colors"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * NotFoundState - Display for 404 pages
 */
interface NotFoundStateProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function NotFoundState({
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has been moved.",
  onGoBack,
  onGoHome,
  className = "",
}: NotFoundStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="text-8xl mb-6">🔮</div>

      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-300">{title}</h2>

      <p className="text-gray-400 mt-3 max-w-md">{description}</p>

      <div className="flex items-center gap-3 mt-8">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-medium border border-white/10 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * MaintenanceState - Display during maintenance
 */
interface MaintenanceStateProps {
  estimatedTime?: string;
  className?: string;
}

export function MaintenanceState({
  estimatedTime,
  className = "",
}: MaintenanceStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="text-7xl mb-6">🔧</div>

      <h2 className="text-2xl font-bold text-white">Under Maintenance</h2>

      <p className="text-gray-400 mt-3 max-w-md">
        We're performing scheduled maintenance to improve your experience.
        Please check back soon.
      </p>

      {estimatedTime && (
        <p className="text-sm text-blue-400 mt-4">
          Estimated completion: {estimatedTime}
        </p>
      )}

      <div className="mt-8 flex items-center gap-4 text-gray-500">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
          Follow updates on Twitter
        </a>
      </div>
    </div>
  );
}

/**
 * OfflineState - Display when user is offline
 */
export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="📡"
      title="You're offline"
      description="Please check your internet connection and try again."
      action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
    />
  );
}

"use client";

import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "default" | "minimal" | "illustration";
  size?: "sm" | "md" | "lg";
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction,
  variant = "default",
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: { container: "p-8", icon: "text-4xl mb-3", title: "text-lg", desc: "text-sm" },
    md: { container: "p-12", icon: "text-6xl mb-4", title: "text-xl", desc: "text-base" },
    lg: { container: "p-16", icon: "text-7xl mb-6", title: "text-2xl", desc: "text-lg" },
  };

  const sizes = sizeClasses[size];

  if (variant === "minimal") {
    return (
      <div className="text-center py-8">
        <div className={`${sizes.icon} opacity-50`}>{icon}</div>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    );
  }

  if (variant === "illustration") {
    return (
      <div className={`glass rounded-2xl ${sizes.container} text-center relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }} />
        </div>
        
        <div className="relative">
          {/* Animated floating icon */}
          <div className="relative inline-block mb-6">
            <div className={`${sizes.icon} animate-float`}>
              <span role="img" aria-hidden="true">{icon}</span>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <div className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          <h3 className={`${sizes.title} font-bold text-white mb-2`}>{title}</h3>
          <p className={`text-gray-400 ${sizes.desc} max-w-sm mx-auto mb-6`}>{description}</p>

          {(action || secondaryAction) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {action && (
                action.href ? (
                  <Link href={action.href} className="btn-primary py-3 px-6">
                    <span>{action.label}</span>
                  </Link>
                ) : (
                  <button onClick={action.onClick} className="btn-primary py-3 px-6">
                    <span>{action.label}</span>
                  </button>
                )
              )}
              {secondaryAction && (
                secondaryAction.href ? (
                  <Link href={secondaryAction.href} className="btn-secondary py-3 px-6">
                    {secondaryAction.label}
                  </Link>
                ) : (
                  <button onClick={secondaryAction.onClick} className="btn-secondary py-3 px-6">
                    {secondaryAction.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`glass rounded-2xl ${sizes.container} text-center animate-fade-in`}>
      <div className={sizes.icon}>
        <span role="img" aria-hidden="true">{icon}</span>
      </div>
      <h3 className={`${sizes.title} font-bold text-white mb-2`}>{title}</h3>
      <p className={`text-gray-400 ${sizes.desc} mb-6`}>{description}</p>
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && (
            action.href ? (
              <Link href={action.href} className="btn-primary py-3 px-6">
                <span>{action.label}</span>
              </Link>
            ) : (
              <button onClick={action.onClick} className="btn-primary py-3 px-6">
                <span>{action.label}</span>
              </button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href} className="btn-secondary py-3 px-6">
                {secondaryAction.label}
              </Link>
            ) : (
              <button onClick={secondaryAction.onClick} className="btn-secondary py-3 px-6">
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Preset empty states for common scenarios
export function NoSignaturesEmpty({ guestbookAddress }: { guestbookAddress?: string }) {
  return (
    <EmptyState
      icon="📝"
      title="No signatures yet"
      description="Be the first to leave your mark on this guestbook!"
      variant="illustration"
      action={{
        label: "Sign Guestbook ✍️",
        href: guestbookAddress ? `/sign?owner=${guestbookAddress}` : "/sign",
      }}
    />
  );
}

export function NoBadgesEmpty() {
  return (
    <EmptyState
      icon="🏅"
      title="No badges earned yet"
      description="Start signing guestbooks to earn achievement badges!"
      variant="illustration"
      action={{ label: "Start Earning", href: "/sign" }}
      secondaryAction={{ label: "View All Badges", href: "/leaderboard" }}
    />
  );
}

export function NoConnectionEmpty({ onConnect }: { onConnect?: () => void }) {
  return (
    <EmptyState
      icon="🔌"
      title="Wallet not connected"
      description="Connect your wallet to view your stats and achievements"
      variant="default"
      action={{ label: "Connect Wallet", onClick: onConnect }}
    />
  );
}

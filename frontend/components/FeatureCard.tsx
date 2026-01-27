"use client";

import Link from "next/link";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  gradient: string;
  badge?: string;
  disabled?: boolean;
  comingSoon?: boolean;
  stats?: { label: string; value: string };
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  gradient,
  badge,
  disabled = false,
  comingSoon = false,
  stats,
}: FeatureCardProps) {
  const isClickable = !disabled && !comingSoon;

  const content = (
    <>
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 ${isClickable ? "group-hover:opacity-5" : ""} transition-opacity`}
      />

      {/* Glow effect */}
      <div
        className={`absolute -inset-px bg-gradient-to-br ${gradient} opacity-0 ${isClickable ? "group-hover:opacity-20" : ""} blur-xl transition-opacity -z-10`}
      />

      <div className="relative">
        {/* Badge */}
        {(badge || comingSoon) && (
          <div className="absolute -top-2 -right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              comingSoon 
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            }`}>
              {comingSoon ? "Coming Soon" : badge}
            </span>
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-5 ${
            isClickable ? "group-hover:scale-110 group-hover:rotate-3" : ""
          } transition-transform shadow-lg`}
          style={{ boxShadow: `0 8px 24px -8px var(--tw-gradient-from)` }}
        >
          <span role="img" aria-hidden="true">{icon}</span>
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 transition-colors ${
          disabled 
            ? "text-gray-500" 
            : isClickable 
              ? "text-white group-hover:text-blue-400" 
              : "text-white"
        }`}>
          {title}
        </h3>

        {/* Description */}
        <p className={`leading-relaxed ${disabled ? "text-gray-600" : "text-gray-400"}`}>
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">{stats.label}:</span>
            <span className="font-medium text-white">{stats.value}</span>
          </div>
        )}

        {/* CTA */}
        {isClickable && (
          <div className="mt-5 flex items-center text-blue-400 text-sm font-medium">
            Get started
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}

        {/* Disabled state */}
        {disabled && (
          <div className="mt-5 flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Locked
          </div>
        )}
      </div>
    </>
  );

  const baseClasses = `group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 border p-8 transition-all ${
    isClickable 
      ? "border-white/5 hover:border-white/20 hover:-translate-y-1 cursor-pointer active:scale-[0.99]" 
      : "border-white/5 opacity-60 cursor-not-allowed"
  }`;

  if (isClickable) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses} aria-disabled="true">
      {content}
    </div>
  );
}

export function FeatureCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  icon: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  gradient?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
}

export function PageHeader({
  icon,
  title,
  description,
  badge,
  gradient = "from-blue-500 to-purple-500",
  breadcrumbs,
  actions,
  size = "md",
  align = "center",
}: PageHeaderProps) {
  const iconSizes = {
    sm: "w-14 h-14 text-2xl",
    md: "w-20 h-20 text-4xl",
    lg: "w-24 h-24 text-5xl",
  };

  const titleSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center mx-auto",
  };

  const iconAlignClasses = {
    left: "mr-auto",
    center: "mx-auto",
  };

  return (
    <div className={`mb-10 ${alignClasses[align]}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav 
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-white transition">
            🏠
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-gray-600">/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Icon */}
      <div
        className={`${iconSizes[size]} ${iconAlignClasses[align]} mb-6 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center animate-float shadow-lg`}
        style={{ boxShadow: `0 10px 40px -10px var(--tw-gradient-from)` }}
      >
        <span role="img" aria-hidden="true">{icon}</span>
      </div>

      {/* Title and description */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
        <h1 className={`${titleSizes[size]} font-bold gradient-text`}>
          {title}
        </h1>
        {badge && <div className="flex-shrink-0">{badge}</div>}
      </div>

      {description && (
        <p className="text-gray-400 max-w-lg mx-auto">{description}</p>
      )}

      {/* Action buttons */}
      {actions && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

export function PageHeaderCompact({
  title,
  backHref,
  actions,
}: {
  title: string;
  backHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

"use client";

import Link from "next/link";

interface CTASectionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
}: CTASectionProps) {
  return (
    <div className="gradient-border rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href={primaryAction.href} className="btn-primary py-3 px-8">
          <span>{primaryAction.label}</span>
        </Link>
        {secondaryAction && (
          <Link href={secondaryAction.href} className="btn-secondary py-3 px-8">
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}

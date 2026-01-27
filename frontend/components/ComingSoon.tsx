"use client";

interface ComingSoonProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function ComingSoon({ title, description, ctaLabel, ctaHref }: ComingSoonProps) {
  return (
    <div className="glass rounded-2xl p-8 text-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="text-6xl mb-6">🚧</div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>

        {ctaLabel && ctaHref && (
          <a href={ctaHref} className="btn-primary inline-block py-3 px-8">
            <span>{ctaLabel}</span>
          </a>
        )}
      </div>
    </div>
  );
}

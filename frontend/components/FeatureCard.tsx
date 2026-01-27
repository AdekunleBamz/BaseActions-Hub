"use client";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  gradient: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  gradient,
}: FeatureCardProps) {
  return (
    <a
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-white/5 p-8 transition-all hover:border-white/10 hover:-translate-y-1"
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
      />

      <div className="relative">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 leading-relaxed">{description}</p>

        <div className="mt-5 flex items-center text-blue-400 text-sm font-medium">
          Get started
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
      </div>
    </a>
  );
}

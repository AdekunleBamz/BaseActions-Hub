"use client";

interface PageHeaderProps {
  icon: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  gradient?: string;
}

export function PageHeader({
  icon,
  title,
  description,
  badge,
  gradient = "from-blue-500 to-purple-500",
}: PageHeaderProps) {
  return (
    <div className="text-center mb-10">
      <div
        className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-4xl animate-float`}
      >
        {icon}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-3">
        {title}
      </h1>
      {description && (
        <p className="text-gray-400">{description}</p>
      )}
      {badge && <div className="mt-4">{badge}</div>}
    </div>
  );
}

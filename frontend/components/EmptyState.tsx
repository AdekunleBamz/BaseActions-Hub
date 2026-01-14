"use client";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass rounded-2xl p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      {action && (
        action.href ? (
          <a href={action.href} className="btn-primary inline-block py-3 px-6">
            <span>{action.label}</span>
          </a>
        ) : (
          <button onClick={action.onClick} className="btn-primary py-3 px-6">
            <span>{action.label}</span>
          </button>
        )
      )}
    </div>
  );
}

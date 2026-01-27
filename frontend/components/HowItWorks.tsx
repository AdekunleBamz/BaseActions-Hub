"use client";

interface HowItWorksStepProps {
  step: string;
  icon: string;
  title: string;
  description: string;
}

export function HowItWorksStep({ step, icon, title, description }: HowItWorksStepProps) {
  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20" />
        <div className="relative w-full h-full flex items-center justify-center text-3xl">
          {icon}
        </div>
      </div>
      <div className="text-xs font-bold text-blue-400 mb-2">{step}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Connect Wallet",
      description: "Connect your wallet to start signing guestbooks on Base",
      icon: "🔗",
    },
    {
      step: "02",
      title: "Sign & Earn",
      description: "Sign guestbooks for 0.0001 ETH and earn points + badges",
      icon: "✨",
    },
    {
      step: "03",
      title: "Climb Ranks",
      description: "Build streaks, collect badges, and top the leaderboard",
      icon: "🚀",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 pb-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
        <p className="text-gray-500">Simple, fun, and rewarding</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((item, i) => (
          <HowItWorksStep key={i} {...item} />
        ))}
      </div>
    </section>
  );
}

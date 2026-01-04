"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/sign", label: "Sign", icon: "✍️" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { href: "/stats", label: "Stats", icon: "📊" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden glow-blue group-hover:scale-110 transition-transform">
              <Image
                src="/icon-512.png"
                alt="BaseActions"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              BaseActions
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Connect Button */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="btn-primary text-sm py-2.5 px-5"
                        >
                          <span>Connect</span>
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium border border-red-500/30"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        <span className="text-sm font-medium">
                          {account.displayName}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center justify-center gap-1 mt-3 pt-3 border-t border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === link.href
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="mr-1">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-512.png"
              alt="BaseActions"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-sm text-gray-500">
              Built on Base ⚡ Powered by Ethereum
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              Base
            </a>
            <a
              href="https://github.com/AdekunleBamz/BaseActions-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              GitHub
            </a>
            <a
              href="https://warpcast.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              Farcaster
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      <Header />
      <main className="flex-1 pt-24 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}

export function StatCard({
  value,
  label,
  icon,
  color = "blue",
}: {
  value: string | number;
  label: string;
  icon: string;
  color?: "blue" | "purple" | "green" | "orange" | "cyan";
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
    green: "from-green-500/20 to-green-600/5 border-green-500/20",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20",
  };

  const textColors = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    orange: "text-orange-400",
    cyan: "text-cyan-400",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-6`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-3xl font-bold ${textColors[color]} count-up`}>
            {value}
          </p>
          <p className="text-sm text-gray-400 mt-1">{label}</p>
        </div>
        <span className="text-3xl opacity-50">{icon}</span>
      </div>
      {/* Decorative gradient */}
      <div
        className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-50 blur-2xl`}
      />
    </div>
  );
}

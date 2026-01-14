"use client";

import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { useEffect } from "react";
import { useFarcaster } from "@/providers/FarcasterProvider";
import { NavLinks, Logo, WalletButton } from "@/components";
import { SOCIAL_LINKS } from "@/config/navigation";

export function Header() {
  const { isInMiniApp, isReady } = useFarcaster();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // Auto-connect in Farcaster miniapp
  useEffect(() => {
    if (isInMiniApp && isReady && !isConnected && connectors.length > 0) {
      const frameConnector = connectors.find((c) => c.id === "farcasterFrame");
      if (frameConnector) {
        connect({ connector: frameConnector });
      }
    }
  }, [isInMiniApp, isReady, isConnected, connectors, connect]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size="md" showText className="group-hover:scale-110 transition-transform" />
          </Link>

          {/* Navigation */}
          <NavLinks variant="desktop" />

          {/* Connect Button - Different for Farcaster miniapp */}
          <WalletButton />
        </div>

        {/* Mobile Navigation */}
        <NavLinks variant="mobile" />
      </div>
    </header>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              © {currentYear} BaseActions Hub · Built on Base ⚡ Powered by Ethereum
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href={SOCIAL_LINKS.base}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              Base
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              GitHub
            </a>
            <a
              href={SOCIAL_LINKS.farcaster}
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

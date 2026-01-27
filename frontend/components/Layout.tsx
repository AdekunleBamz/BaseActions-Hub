"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { useEffect, type ReactNode } from "react";
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
    <header 
      className="fixed top-0 left-0 right-0 z-50 glass"
      role="banner"
    >
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            aria-label="BaseActions Hub - Home"
          >
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
    <footer 
      className="border-t border-white/5 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-512.png"
              alt="BaseActions Hub logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-sm text-gray-500">
              © {currentYear} BaseActions Hub · Built on Base ⚡ Powered by Ethereum
            </span>
          </div>
          <nav aria-label="Social links">
            <ul className="flex items-center gap-6 text-sm text-gray-500 list-none">
              <li>
                <a
                  href={SOCIAL_LINKS.base}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1"
                >
                  Base
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded px-1"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL_LINKS.farcaster}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded px-1"
                >
                  Farcaster
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

interface PageWrapperProps {
  children: ReactNode;
  showBottomNav?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
}

export function PageWrapper({ 
  children, 
  showBottomNav = true,
  maxWidth = "xl",
  noPadding = false,
}: PageWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      <Header />
      <main 
        id="main-content"
        tabIndex={-1}
        className={`flex-1 pt-20 md:pt-20 ${showBottomNav ? "pb-20 md:pb-0" : ""} ${
          noPadding ? "" : "px-4"
        } focus:outline-none`}
        role="main"
        aria-label="Main content"
      >
        <div className={`${maxWidthClasses[maxWidth]} mx-auto w-full`}>
          {children}
        </div>
      </main>
      <Footer />
      {/* Mobile bottom navigation */}
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
}

// Separate mobile bottom nav to avoid circular import
function MobileBottomNav() {
  // Dynamic import to avoid SSR issues
  const { usePathname } = require("next/navigation");
  const { default: Link } = require("next/link");
  const { NAV_LINKS } = require("@/config/navigation");
  const pathname = usePathname();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {NAV_LINKS.map((link: { href: string; icon: string; label: string }) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[64px] ${
                isActive
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-500 hover:text-white active:scale-95"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl" role="img" aria-hidden="true">{link.icon}</span>
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function StatCard({
  value,
  label,
  icon,
  color = "blue",
  trend,
}: {
  value: string | number | React.ReactNode;
  label: string;
  icon: string;
  color?: "blue" | "purple" | "green" | "orange" | "cyan";
  trend?: { value: number; label?: string };
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
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-3xl font-bold ${textColors[color]} count-up`}>
            {value}
          </p>
          <p className="text-sm text-gray-400 mt-1">{label}</p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend.value >= 0 ? "text-green-400" : "text-red-400"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              {trend.label && <span className="text-gray-500">{trend.label}</span>}
            </p>
          )}
        </div>
        <span className="text-3xl opacity-50 group-hover:scale-110 transition-transform">{icon}</span>
      </div>
      {/* Decorative gradient */}
      <div
        className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-50 blur-2xl`}
      />
    </div>
  );
}

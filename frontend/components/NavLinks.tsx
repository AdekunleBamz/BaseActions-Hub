"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/config/navigation";

interface NavLinksProps {
  variant?: "desktop" | "mobile" | "bottom-bar";
}

export function NavLinks({ variant = "desktop" }: NavLinksProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (variant === "bottom-bar") {
    return (
      <nav 
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          isScrolled ? "glass" : "bg-gray-900/95 backdrop-blur-xl"
        } border-t border-white/5 safe-area-bottom`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around py-2 px-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[64px] ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400 scale-105"
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

  if (variant === "mobile") {
    return (
      <nav 
        className="flex md:hidden items-center justify-center gap-1 mt-3 pt-3 border-t border-white/5"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white active:bg-white/5"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mr-1" role="img" aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav 
      className="hidden md:flex items-center gap-1"
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="mr-1.5" role="img" aria-hidden="true">{link.icon}</span>
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNavBar() {
  return <NavLinks variant="bottom-bar" />;
}

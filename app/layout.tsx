import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Web3Provider";

export const metadata: Metadata = {
  title: "BaseActions Hub - Sign Guestbooks on Base",
  description: "Sign on-chain guestbooks, earn badges, and climb the leaderboard on Base blockchain.",
  openGraph: {
    title: "BaseActions Hub",
    description: "Sign on-chain guestbooks, earn badges, and climb the leaderboard on Base blockchain.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Web3Provider";

export const metadata: Metadata = {
  title: "BaseActions Hub - Sign Guestbooks on Base",
  description: "Sign on-chain guestbooks, earn achievement badges as NFTs, and climb the leaderboard on Base blockchain.",
  metadataBase: new URL("https://base-actions-hub.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "BaseActions Hub - Sign the Guestbook on Base",
    description: "A decentralized guestbook on Base blockchain. Sign messages, earn badges, and climb the leaderboard.",
    images: ["/og-image.png"],
    type: "website",
    url: "https://base-actions-hub.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseActions Hub - Sign the Guestbook on Base",
    description: "A decentralized guestbook on Base blockchain. Sign messages, earn badges, and climb the leaderboard.",
    images: ["/og-image.png"],
  },
  other: {
    // Farcaster Mini App embed tags
    "of:version": "vNext",
    "of:accepts:farcaster": "vNext",
    "og:image": "https://base-actions-hub.vercel.app/og-image.png",
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://base-actions-hub.vercel.app/og-image.png",
      button: {
        title: "Sign Guestbook",
        action: {
          type: "launch_frame",
          name: "BaseActions Hub",
          url: "https://base-actions-hub.vercel.app",
          splashImageUrl: "https://base-actions-hub.vercel.app/splash.png",
          splashBackgroundColor: "#0a0a0f"
        }
      }
    }),
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

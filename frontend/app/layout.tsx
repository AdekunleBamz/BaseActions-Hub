import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Web3Provider";

export const metadata: Metadata = {
  title: "BaseActions Hub - Sign Guestbooks on Base",
  description: "Sign on-chain guestbooks, earn achievement badges as NFTs, and climb the leaderboard on Base blockchain.",
  metadataBase: new URL("https://baseactions-hub.vercel.app"),
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
    url: "https://baseactions-hub.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseActions Hub - Sign the Guestbook on Base",
    description: "A decentralized guestbook on Base blockchain. Sign messages, earn badges, and climb the leaderboard.",
    images: ["/og-image.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://baseactions-hub.vercel.app/og-image.png",
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:button:1": "Sign Guestbook",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": "https://baseactions-hub.vercel.app",
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

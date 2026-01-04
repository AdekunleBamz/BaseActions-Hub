import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Web3Provider";

export const metadata: Metadata = {
  title: "BaseActions Hub - Sign Guestbooks on Base",
  description: "Sign on-chain guestbooks, earn achievement badges as NFTs, and climb the leaderboard on Base blockchain.",
  metadataBase: new URL("https://baseactions.xyz"),
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "BaseActions Hub",
    description: "Sign on-chain guestbooks, earn badges, and climb the leaderboard on Base blockchain.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseActions Hub",
    description: "Sign on-chain guestbooks, earn badges, and climb the leaderboard on Base blockchain.",
    images: ["/og-image.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "/splash.png",
    "fc:frame:button:1": "Open App",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": "https://baseactions.xyz",
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

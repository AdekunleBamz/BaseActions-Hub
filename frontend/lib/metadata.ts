import type { Metadata, Viewport } from "next";

const SITE_NAME = "BaseActions Hub";
const SITE_DESCRIPTION = "Your on-chain guestbook and reputation system on Base. Sign guestbooks, earn badges, and climb the leaderboard.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://baseactions.xyz";

export const defaultMetadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Base",
    "Ethereum",
    "Guestbook",
    "Web3",
    "NFT",
    "Badges",
    "Leaderboard",
    "On-chain",
    "Blockchain",
    "Farcaster",
  ],
  authors: [{ name: "BaseActions Team" }],
  creator: "BaseActions Team",
  publisher: "BaseActions Team",
  metadataBase: new URL(SITE_URL),
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@baseactions",
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const defaultViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || "/og-image.png";

  return {
    title,
    description: description || SITE_DESCRIPTION,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: description || SITE_DESCRIPTION,
      url,
      images: [{ url: ogImage }],
    },
    twitter: {
      title,
      description: description || SITE_DESCRIPTION,
      images: [ogImage],
    },
  };
}

/**
 * Generate metadata for guestbook pages
 */
export function generateGuestbookMetadata(address: string): Metadata {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return generatePageMetadata({
    title: `Guestbook - ${shortAddress}`,
    description: `View and sign the on-chain guestbook for ${shortAddress} on Base.`,
    path: `/guestbook/${address}`,
  });
}

/**
 * JSON-LD structured data for the site
 */
export const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/guestbook/{search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  sameAs: [
    "https://twitter.com/baseactions",
    "https://warpcast.com/baseactions",
    "https://github.com/baseactions",
  ],
};

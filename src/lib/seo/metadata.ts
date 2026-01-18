/**
 * SEO Metadata Configuration
 */

import type { Metadata } from "next";

export const siteConfig = {
  name: "Parrhesia",
  description:
    "Decentralized debate platform on Base. Stake, argue, and win USDC prizes through structured debates with AI-powered judging.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://parrhesia.app",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/parrhesia_app",
    github: "https://github.com/parrhesia/parrhesia",
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: "Parrhesia - Decentralized Debate Platform on Base",
    template: "%s | Parrhesia",
  },
  description: siteConfig.description,
  keywords: [
    "debate",
    "blockchain",
    "Base",
    "USDC",
    "web3",
    "decentralized",
    "argumentation",
    "AI judge",
    "crypto",
    "earn",
  ],
  authors: [{ name: "Parrhesia Team" }],
  creator: "Parrhesia",
  publisher: "Parrhesia",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "Parrhesia - Decentralized Debate Platform",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Parrhesia Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrhesia - Decentralized Debate Platform",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@parrhesia_app",
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export function generateDebateMetadata(debate: {
  topic: string;
  description?: string;
  category: string;
}): Metadata {
  return {
    title: debate.topic,
    description:
      debate.description ||
      `Join the debate: ${debate.topic} on Parrhesia`,
    openGraph: {
      title: debate.topic,
      description: debate.description || `Debate about ${debate.topic}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: debate.topic,
      description: debate.description || `Debate about ${debate.topic}`,
    },
  };
}

export function generateCategoryMetadata(category: string): Metadata {
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Debates`,
    description: `Explore and participate in ${category} debates on Parrhesia`,
  };
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OnchainProviders } from "@/components/providers/OnchainProviders";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parrhesia - Stake Your Truth",
  description:
    "Decentralized debate platform on Base. Stake USDC, debate boldly, and let the community decide.",
  keywords: [
    "debate",
    "Base",
    "Web3",
    "USDC",
    "onchain",
    "Basename",
    "Smart Wallet",
  ],
  authors: [{ name: "Parrhesia" }],
  openGraph: {
    title: "Parrhesia - Stake Your Truth",
    description: "Where convictions meet consensus",
    url: "https://parrhesia.xyz",
    siteName: "Parrhesia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrhesia",
    description: "Stake Your Truth",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OnchainProviders>
          <AuthProvider>{children}</AuthProvider>
        </OnchainProviders>
      </body>
    </html>
  );
}

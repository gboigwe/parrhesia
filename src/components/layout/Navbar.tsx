"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@/components/auth/ConnectWallet";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/debates", label: "Debates", authRequired: false },
    { href: "/leaderboard", label: "Leaderboard", authRequired: false },
    { href: "/profile", label: "Profile", authRequired: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Parrhesia
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              // Hide auth-required links if user is not authenticated
              if (link.authRequired && !isAuthenticated) {
                return null;
              }

              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Connect Wallet Button */}
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}

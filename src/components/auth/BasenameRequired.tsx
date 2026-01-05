"use client";

import { ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Component that displays when a user is connected but doesn't have a Basename
 * Guides them to register one
 */
export function BasenameRequired() {
  const { isAuthenticated, hasBasename, walletAddress } = useAuth();

  // Only show if user is connected but has no basename
  if (!walletAddress || hasBasename || isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Basename Required
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To participate in Parrhesia debates, you need a Basename - your onchain identity on
              Base.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What is a Basename?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Your unique identity on Base (e.g., yourname.base.eth)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Works across all Base applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Links to your reputation and achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Required for creating and voting on debates</span>
                </li>
              </ul>
            </div>

            <a
              href="https://www.base.org/names"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <span>Register Your Basename</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              After registering your Basename, reconnect your wallet to access Parrhesia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sign In Button Component
 * SIWE authentication UI
 */

"use client";

import { useAuth } from "@/hooks/useAuth";

export function SignInButton() {
  const { signIn, isSigningIn, error, isConnected } = useAuth();

  if (!isConnected) {
    return (
      <button
        disabled
        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
      >
        Connect Wallet First
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={signIn}
        disabled={isSigningIn}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigningIn ? "Signing In..." : "Sign In with Wallet"}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

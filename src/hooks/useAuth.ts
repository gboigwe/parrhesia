/**
 * useAuth Hook
 * Client-side authentication with SIWE
 */

"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { createSiweMessage } from "@/lib/auth/siwe";

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string>();

  const signIn = async () => {
    if (!address || !isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsSigningIn(true);
    setError(undefined);

    try {
      // Create SIWE message
      const message = createSiweMessage(address);
      const preparedMessage = message.prepareMessage();

      // Sign message
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      // Verify with backend
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: preparedMessage,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      // Reload to update session state
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.reload();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return {
    signIn,
    signOut,
    isSigningIn,
    error,
    isConnected,
    address,
  };
}

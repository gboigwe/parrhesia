"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BasenameRequired } from "./BasenameRequired";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireBasename?: boolean;
  requireSession?: boolean;
  redirectTo?: string;
}

/**
 * Component to guard routes that require authentication or basename
 */
export function AuthGuard({
  children,
  requireAuth = false,
  requireBasename = false,
  requireSession = false,
  redirectTo = "/",
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, hasBasename, isLoading, walletAddress, sessionAddress } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (requireSession && !sessionAddress) {
      router.push(redirectTo);
      return;
    }

    if (requireBasename && !hasBasename && walletAddress) {
      // Don't redirect, show the BasenameRequired component
      return;
    }
  }, [isAuthenticated, hasBasename, isLoading, requireAuth, requireBasename, requireSession, sessionAddress, redirectTo, router, walletAddress]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show basename required screen if needed
  if (requireBasename && !hasBasename && walletAddress) {
    return <BasenameRequired />;
  }

  // Show children if all requirements are met
  return <>{children}</>;
}

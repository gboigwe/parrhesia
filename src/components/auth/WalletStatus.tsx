"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";

export function WalletStatus() {
  const { isLoading, isAuthenticated, hasBasename, walletAddress } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Loader className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <AlertCircle className="w-4 h-4" />
        <span>Not connected</span>
      </div>
    );
  }

  if (!hasBasename) {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
        <AlertCircle className="w-4 h-4" />
        <span>Basename required</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle className="w-4 h-4" />
        <span>Authenticated</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <AlertCircle className="w-4 h-4" />
      <span>Setup incomplete</span>
    </div>
  );
}

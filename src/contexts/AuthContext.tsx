"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useBasename } from "@/hooks/useBasename";
import type { User } from "@/lib/db/schema/users";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasBasename: boolean;
  basename: string | null;
  walletAddress: string | undefined;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { basename, isLoading: basenameLoading } = useBasename(address);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (walletAddress: string, userBasename: string) => {
    try {
      const response = await fetch("/api/users/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          basename: userBasename,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!isConnected || !address) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (basenameLoading) {
        return;
      }

      if (basename) {
        await fetchUser(address, basename);
      }

      setIsLoading(false);
    };

    initAuth();
  }, [isConnected, address, basename, basenameLoading]);

  const login = async () => {
    if (!address || !basename) {
      throw new Error("Wallet address and basename required");
    }
    await fetchUser(address, basename);
  };

  const logout = () => {
    disconnect();
    setUser(null);
  };

  const refreshUser = async () => {
    if (address && basename) {
      await fetchUser(address, basename);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || basenameLoading,
    isAuthenticated: isConnected && !!basename && !!user,
    hasBasename: !!basename,
    basename,
    walletAddress: address,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

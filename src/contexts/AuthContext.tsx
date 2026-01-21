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
  sessionAddress: string | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { basename, isLoading: basenameLoading } = useBasename(address);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionAddress, setSessionAddress] = useState<string | null>(null);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        setSessionAddress(data.address || null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  };

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
        setSessionAddress(null);
        setIsLoading(false);
        return;
      }

      if (basenameLoading) {
        return;
      }

      // Check SIWE session
      await checkSession();

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

  const logout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setSessionAddress(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
    disconnect();
    setUser(null);
  };

  const refreshUser = async () => {
    if (address && basename) {
      await fetchUser(address, basename);
    }
  };

  const refreshSession = async () => {
    await checkSession();
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || basenameLoading,
    isAuthenticated: isConnected && !!basename && !!user && !!sessionAddress,
    hasBasename: !!basename,
    basename,
    walletAddress: address,
    sessionAddress,
    login,
    logout,
    refreshUser,
    refreshSession,
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

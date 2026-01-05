"use client";

import { useState, useEffect } from "react";

interface Argument {
  id: string;
  content: string;
  wordCount: number;
  roundNumber: number;
  postedAt: Date;
  userId: string;
  user: {
    basename: string;
    debaterReputation: string;
  };
}

export function useDebateArguments(debateId: string) {
  const [arguments, setArguments] = useState<Argument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArguments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/debates/${debateId}/arguments`);

      if (!response.ok) {
        throw new Error("Failed to fetch arguments");
      }

      const data = await response.json();
      setArguments(data.arguments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load arguments");
      console.error("Error fetching arguments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debateId) {
      fetchArguments();
    }
  }, [debateId]);

  const refetch = () => {
    fetchArguments();
  };

  return {
    arguments,
    isLoading,
    error,
    refetch,
  };
}

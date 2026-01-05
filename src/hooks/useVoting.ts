"use client";

import { useState, useEffect } from "react";

interface Vote {
  id: string;
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  totalScore: string;
  voter: {
    basename: string;
    voterReputation: string;
  };
}

export function useVoting(debateId: string) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/debates/${debateId}/votes`);

      if (!response.ok) {
        throw new Error("Failed to fetch votes");
      }

      const data = await response.json();
      setVotes(data.votes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load votes");
      console.error("Error fetching votes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debateId) {
      fetchVotes();
    }
  }, [debateId]);

  const refetch = () => {
    fetchVotes();
  };

  return {
    votes,
    isLoading,
    error,
    refetch,
  };
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DebateStatus } from "@/components/debate/DebateStatus";
import { DEBATE_CATEGORIES } from "@/lib/constants";

interface Debate {
  id: string;
  topic: string;
  resolution: string;
  category: string;
  format: string;
  status: string;
  stakeAmount: string;
  prizePool: string;
  createdAt: Date;
  startTime?: Date | null;
  endTime?: Date | null;
  votingEndsAt?: Date | null;
  contractAddress?: string | null;
  transactionHash?: string | null;
  creator: {
    id: string;
    basename: string;
    debaterReputation: string;
  };
  challenger?: {
    id: string;
    basename: string;
    debaterReputation: string;
  } | null;
  winner?: {
    id: string;
    basename: string;
  } | null;
}

export default function DebateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchDebate(params.id as string);
    }
  }, [params.id]);

  const fetchDebate = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/debates/${id}`);
      if (!response.ok) {
        throw new Error("Debate not found");
      }
      const data = await response.json();
      setDebate(data.debate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load debate");
    } finally {
      setIsLoading(false);
    }
  };

  const canJoinDebate = () => {
    if (!isAuthenticated || !debate || !user) return false;
    return (
      debate.status === "pending" &&
      debate.creator.id !== user.id &&
      !debate.challenger
    );
  };

  const handleJoinDebate = async () => {
    // TODO: Implement join debate logic
    console.log("Join debate");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !debate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">Error</h2>
          <p className="text-red-700 dark:text-red-300">{error || "Debate not found"}</p>
          <button
            onClick={() => router.push("/debates")}
            className="mt-4 text-red-600 dark:text-red-400 hover:underline"
          >
            ← Back to debates
          </button>
        </div>
      </div>
    );
  }

  const category = DEBATE_CATEGORIES.find((c) => c.id === debate.category);
  const formatDisplay = debate.format === "timed" ? "⚡ Live Debate" : "📝 Async Debate";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/debates")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to debates
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{category?.emoji || "✨"}</span>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{category?.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{formatDisplay}</div>
            </div>
          </div>
          <DebateStatus status={debate.status} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{debate.topic}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{debate.resolution}</p>

        {/* Participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Creator */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">Creator</div>
            <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">
              {debate.creator.basename}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Reputation: {parseFloat(debate.creator.debaterReputation).toFixed(1)}
            </div>
          </div>

          {/* Challenger */}
          {debate.challenger ? (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="text-sm text-green-600 dark:text-green-400 mb-2">Challenger</div>
              <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                {debate.challenger.basename}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Reputation: {parseFloat(debate.challenger.debaterReputation).toFixed(1)}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium text-gray-900 dark:text-white">Waiting for opponent</div>
                {canJoinDebate() && (
                  <button
                    onClick={handleJoinDebate}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Join This Debate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Prize Pool */}
        <div className="bg-gradient-to-r from-yellow-50 to-green-50 dark:from-yellow-950 dark:to-green-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Prize Pool</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {parseFloat(debate.prizePool || debate.stakeAmount).toFixed(0)} USDC
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stake Amount</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {parseFloat(debate.stakeAmount).toFixed(0)} USDC each
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Info */}
      {debate.contractAddress && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Blockchain Info</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Contract:</span>
              <code className="ml-2 text-gray-900 dark:text-white">{debate.contractAddress}</code>
            </div>
            {debate.transactionHash && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">Transaction:</span>
                <code className="ml-2 text-gray-900 dark:text-white">{debate.transactionHash}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Winner */}
      {debate.winner && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Winner</h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {debate.winner.basename}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

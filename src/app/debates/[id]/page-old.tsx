"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DebateStatus } from "@/components/debate/DebateStatus";
import { DEBATE_CATEGORIES, ERROR_MESSAGES } from "@/lib/constants";
import { useJoinDebate } from "@/hooks/useJoinDebate";
import { useUSDCBalance } from "@/components/web3/USDCBalance";
import { ArgumentForm } from "@/components/debate/ArgumentForm";
import { DebateTimeline } from "@/components/debate/DebateTimeline";

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
  const { balance: usdcBalance } = useUSDCBalance();
  const { joinDebate: joinDebateOnChain, approveUSDC, isApproving, isJoining } = useJoinDebate();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [txStep, setTxStep] = useState<"idle" | "approving" | "joining" | "saving">("idle");
  const [arguments, setArguments] = useState<any[]>([]);
  const [isSubmittingArg, setIsSubmittingArg] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchDebate(params.id as string);
      fetchArguments(params.id as string);
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

  const fetchArguments = async (id: string) => {
    try {
      const response = await fetch(`/api/debates/${id}/arguments`);
      if (response.ok) {
        const data = await response.json();
        setArguments(data.arguments || []);
      }
    } catch (err) {
      console.error("Failed to fetch arguments:", err);
    }
  };

  const handleSubmitArgument = async (content: string) => {
    if (!debate || !user) return;

    setIsSubmittingArg(true);
    try {
      // Calculate next round number
      const userArgs = arguments.filter((arg) => arg.userId === user.id);
      const nextRound = userArgs.length + 1;

      const response = await fetch(`/api/debates/${debate.id}/arguments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          userId: user.id,
          roundNumber: nextRound,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit argument");
      }

      // Refresh arguments
      await fetchArguments(debate.id);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmittingArg(false);
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
    if (!debate || !user || !debate.contractAddress) return;

    setJoinError(null);
    const stakeAmount = parseFloat(debate.stakeAmount);

    try {
      // Validation
      if (stakeAmount > usdcBalance) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
      }

      // Step 1: Approve USDC
      setTxStep("approving");
      await approveUSDC(debate.contractAddress, stakeAmount);

      // Step 2: Join debate on-chain
      setTxStep("joining");
      await joinDebateOnChain({
        debatePoolAddress: debate.contractAddress,
        stakeAmount,
        debateId: debate.id,
        onSuccess: async (txHash) => {
          // Step 3: Update database
          setTxStep("saving");
          const response = await fetch(`/api/debates/${debate.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              challengerId: user.id,
              transactionHash: txHash,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update debate in database");
          }

          // Refresh debate data
          await fetchDebate(debate.id);
          setTxStep("idle");
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join debate");
      setTxStep("idle");
    }
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

      {/* Join Error */}
      {joinError && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{joinError}</p>
        </div>
      )}

      {/* Transaction Progress */}
      {txStep !== "idle" && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {txStep === "approving" && "Step 1/3: Approving USDC..."}
                {txStep === "joining" && "Step 2/3: Joining debate on-chain..."}
                {txStep === "saving" && "Step 3/3: Updating database..."}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Please confirm the transaction in your wallet
              </p>
            </div>
          </div>
        </div>
      )}

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
                    disabled={isApproving || isJoining || txStep !== "idle"}
                    className="mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {txStep !== "idle" ? "Joining..." : "Join This Debate"}
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

      {/* Arguments Timeline */}
      {debate.status === "active" && debate.challenger && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Arguments</h2>
          <DebateTimeline
            arguments={arguments}
            creatorId={debate.creator.id}
            challengerId={debate.challenger?.id}
          />

          {/* Submit Argument Form (only for participants) */}
          {user && (debate.creator.id === user.id || debate.challenger?.id === user.id) && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Submit Your Next Argument
              </h3>
              <ArgumentForm
                debateId={debate.id}
                roundNumber={arguments.filter((arg) => arg.userId === user.id).length + 1}
                onSubmit={handleSubmitArgument}
                isSubmitting={isSubmittingArg}
              />
            </div>
          )}
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

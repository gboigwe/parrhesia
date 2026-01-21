/**
 * Batch Voting Component
 * Allows users to vote on multiple arguments in a single transaction
 */

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { createBatchVoteBatch } from "@/lib/transactions/debateBatch";
import { TransactionWrapper } from "@/components/onchain/TransactionWrapper";

interface Argument {
  id: string;
  text: string;
  author: string;
}

interface BatchVotingProps {
  debatePoolAddress: `0x${string}`;
  arguments: Argument[];
  onSuccess?: () => void;
}

export function BatchVoting({
  debatePoolAddress,
  arguments: args,
  onSuccess,
}: BatchVotingProps) {
  const { address } = useAccount();
  const [selectedVotes, setSelectedVotes] = useState<
    Record<string, boolean | null>
  >({});

  const handleVote = (argumentId: string, vote: boolean | null) => {
    setSelectedVotes((prev) => ({
      ...prev,
      [argumentId]: vote,
    }));
  };

  const selectedArguments = Object.entries(selectedVotes)
    .filter(([_, vote]) => vote !== null)
    .map(([id, vote]) => ({ id, vote: vote! }));

  const canSubmit = selectedArguments.length > 0;

  const handleBatchSubmit = () => {
    if (!canSubmit) return;

    const argumentIds = selectedArguments.map((arg) => arg.id);
    const votes = selectedArguments.map((arg) => arg.vote);

    const batchCalls = createBatchVoteBatch(
      debatePoolAddress,
      argumentIds,
      votes
    );

    // TransactionWrapper will handle the batch execution
    return batchCalls;
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Batch Voting
        </h3>
        <p className="text-sm text-blue-700">
          Select multiple arguments to vote on them all in a single gasless transaction
        </p>
      </div>

      <div className="space-y-3">
        {args.map((arg) => (
          <div
            key={arg.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <p className="text-sm mb-3">{arg.text}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(arg.id, true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  selectedVotes[arg.id] === true
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-50"
                }`}
              >
                ✓ Upvote
              </button>
              <button
                onClick={() => handleVote(arg.id, false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                  selectedVotes[arg.id] === false
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50"
                }`}
              >
                ✗ Downvote
              </button>
              {selectedVotes[arg.id] !== undefined && (
                <button
                  onClick={() => handleVote(arg.id, null)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedArguments.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-purple-900">
                {selectedArguments.length} vote(s) selected
              </p>
              <p className="text-sm text-purple-700">
                Submit all votes in one gasless transaction
              </p>
            </div>
          </div>

          <TransactionWrapper
            contracts={handleBatchSubmit()}
            buttonText={`Submit ${selectedArguments.length} Votes`}
            onSuccess={() => {
              setSelectedVotes({});
              onSuccess?.();
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg"
          />
        </div>
      )}

      {!canSubmit && (
        <p className="text-center text-gray-500 text-sm">
          Select at least one argument to vote
        </p>
      )}
    </div>
  );
}

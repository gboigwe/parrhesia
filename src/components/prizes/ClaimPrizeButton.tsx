/**
 * Claim Prize Button Component
 * Interactive button for claiming USDC prizes
 */

"use client";

import { useState } from "react";
import { usePrizeClaim } from "@/hooks/usePrizeClaim";

interface ClaimPrizeButtonProps {
  debateId: string;
  contractAddress: string;
  disabled?: boolean;
}

export function ClaimPrizeButton({
  debateId,
  contractAddress,
  disabled = false,
}: ClaimPrizeButtonProps) {
  const { claimPrize, isClaiming, isSuccess, error, data } = usePrizeClaim();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = async () => {
    try {
      claimPrize(
        { debateId, contractAddress },
        {
          onSuccess: () => {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          },
        }
      );
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  if (isSuccess && showSuccess && data) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎉</span>
          <h3 className="font-bold text-green-800">Prize Claimed!</h3>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          {parseFloat(data.amount) / 1e6} USDC claimed successfully
        </p>
        <a
          href={`https://basescan.org/tx/${data.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View on Basescan ↗
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClaim}
        disabled={disabled || isClaiming}
        className={`w-full px-6 py-3 rounded-lg font-bold text-white transition-all ${
          disabled || isClaiming
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 active:scale-95"
        }`}
      >
        {isClaiming ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner />
            Claiming Prize...
          </span>
        ) : (
          "Claim Prize"
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded p-3">
          <p className="text-sm text-red-800 font-semibold">Claim Failed</p>
          <p className="text-sm text-gray-700 mt-1">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      )}

      {isClaiming && (
        <p className="text-xs text-gray-500 text-center">
          Waiting for transaction confirmation on Base...
        </p>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

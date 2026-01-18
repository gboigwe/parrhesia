/**
 * Prize Claim Status Component
 * Shows current status of prize claim
 */

"use client";

import type { PrizeClaimStatus } from "@/lib/prizes/types";

interface ClaimStatusProps {
  status: PrizeClaimStatus;
}

export function ClaimStatus({ status }: ClaimStatusProps) {
  const getStatusColor = () => {
    switch (status.status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case "confirmed":
        return "✓";
      case "pending":
        return "⏳";
      case "failed":
        return "✗";
      default:
        return "○";
    }
  };

  const getStatusLabel = () => {
    switch (status.status) {
      case "confirmed":
        return "Prize Claimed";
      case "pending":
        return "Claim Pending";
      case "failed":
        return "Claim Failed";
      default:
        return "Prize Available";
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getStatusIcon()}</span>
        <div className="flex-1">
          <h3 className="font-bold">{getStatusLabel()}</h3>

          {status.status === "confirmed" && status.transactionHash && (
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                Amount: {status.amount ? `${parseFloat(status.amount) / 1e6} USDC` : "N/A"}
              </p>
              <a
                href={`https://basescan.org/tx/${status.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                View on Basescan ↗
              </a>
            </div>
          )}

          {status.status === "pending" && (
            <p className="text-sm mt-1">
              Transaction is being confirmed on Base...
            </p>
          )}

          {status.status === "failed" && status.error && (
            <p className="text-sm mt-1">{status.error}</p>
          )}

          {status.status === "unclaimed" && (
            <p className="text-sm mt-1">
              You can claim your prize now
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

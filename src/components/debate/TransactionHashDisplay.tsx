/**
 * Transaction Hash Display Component
 * Shows transaction hash with link to Basescan
 */

"use client";

interface TransactionHashDisplayProps {
  hash: string;
  label?: string;
  chainId?: number;
}

export function TransactionHashDisplay({
  hash,
  label = "Transaction",
  chainId = 8453,
}: TransactionHashDisplayProps) {
  const explorerUrl =
    chainId === 8453
      ? `https://basescan.org/tx/${hash}`
      : `https://sepolia.basescan.org/tx/${hash}`;

  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">{label}:</span>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline font-mono"
      >
        {shortHash}
      </a>
      <span className="text-gray-400">↗</span>
    </div>
  );
}

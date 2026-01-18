/**
 * Transaction Receipt Component
 * Displays detailed transaction information
 */

"use client";

interface TransactionReceiptProps {
  transactionHash: string;
  blockNumber: number;
  amount: string;
  timestamp?: Date;
  gasUsed?: string;
}

export function TransactionReceipt({
  transactionHash,
  blockNumber,
  amount,
  timestamp,
  gasUsed,
}: TransactionReceiptProps) {
  const formattedAmount = parseFloat(amount) / 1e6;
  const basescanUrl = `https://basescan.org/tx/${transactionHash}`;

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">✓</span>
        <h3 className="text-xl font-bold text-green-800">
          Transaction Confirmed
        </h3>
      </div>

      <div className="space-y-3">
        <ReceiptRow label="Amount" value={`${formattedAmount} USDC`} />

        <ReceiptRow
          label="Transaction Hash"
          value={
            <a
              href={basescanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-mono text-sm break-all"
            >
              {transactionHash}
            </a>
          }
        />

        <ReceiptRow label="Block Number" value={blockNumber.toString()} />

        {timestamp && (
          <ReceiptRow
            label="Timestamp"
            value={new Date(timestamp).toLocaleString()}
          />
        )}

        {gasUsed && (
          <ReceiptRow
            label="Gas Used"
            value={`${parseInt(gasUsed).toLocaleString()} gas`}
          />
        )}

        <ReceiptRow label="Network" value="Base Mainnet" />
      </div>

      <div className="mt-6 pt-4 border-t">
        <a
          href={basescanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span>View Full Details on Basescan</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}

interface ReceiptRowProps {
  label: string;
  value: React.ReactNode;
}

function ReceiptRow({ label, value }: ReceiptRowProps) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
        {label}:
      </span>
      <span className="text-sm text-gray-900 text-right flex-1">{value}</span>
    </div>
  );
}

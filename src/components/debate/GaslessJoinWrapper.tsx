/**
 * Gasless Join Wrapper
 * Integrates paymaster for gasless join transactions
 */

"use client";

import { usePaymasterStatus } from "@/hooks/useGaslessDebate";

interface GaslessJoinWrapperProps {
  children: React.ReactNode;
}

export function GaslessJoinWrapper({ children }: GaslessJoinWrapperProps) {
  const { isAvailable } = usePaymasterStatus();

  return (
    <div>
      {isAvailable && (
        <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-2 text-sm text-green-800">
          ✓ Gasless transaction enabled
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * OnchainKit Transaction Wrapper
 * Wraps debate transactions with OnchainKit UI and status tracking
 */

"use client";

import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";
import { type ContractFunctionParameters } from "viem";
import { usePaymasterStatus } from "@/hooks/useGaslessDebate";

interface TransactionWrapperProps {
  contracts: ContractFunctionParameters[];
  buttonText?: string;
  onSuccess?: (receipt: unknown) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Transaction wrapper with automatic paymaster integration
 */
export function TransactionWrapper({
  contracts,
  buttonText = "Execute Transaction",
  onSuccess,
  onError,
  className,
}: TransactionWrapperProps) {
  const { isAvailable: isPaymasterAvailable } = usePaymasterStatus();

  const handleOnStatus = (status: LifecycleStatus) => {
    if (status.statusName === "success") {
      onSuccess?.(status.statusData);
    } else if (status.statusName === "error") {
      onError?.(new Error(status.statusData?.message || "Transaction failed"));
    }
  };

  return (
    <Transaction
      contracts={contracts as any}
      onStatus={handleOnStatus}
      chainId={8453} // Base mainnet
    >
      <TransactionButton
        text={buttonText}
        className={className}
      />
      {isPaymasterAvailable && (
        <TransactionSponsor />
      )}
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}

/**
 * Create debate transaction
 */
export function CreateDebateTransaction({
  factoryAddress,
  stakeAmount,
  onSuccess,
  onError,
}: {
  factoryAddress: `0x${string}`;
  stakeAmount: bigint;
  onSuccess?: (receipt: unknown) => void;
  onError?: (error: Error) => void;
}) {
  const contracts = [
    {
      address: factoryAddress,
      abi: [], // Add DebateFactoryABI
      functionName: "createDebate",
      args: [stakeAmount],
    },
  ];

  return (
    <TransactionWrapper
      contracts={contracts}
      buttonText="Create Debate"
      onSuccess={onSuccess}
      onError={onError}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
    />
  );
}

/**
 * Join debate transaction
 */
export function JoinDebateTransaction({
  debatePoolAddress,
  onSuccess,
  onError,
}: {
  debatePoolAddress: `0x${string}`;
  onSuccess?: (receipt: unknown) => void;
  onError?: (error: Error) => void;
}) {
  const contracts = [
    {
      address: debatePoolAddress,
      abi: [], // Add DebatePoolABI
      functionName: "stake",
      args: [],
    },
  ];

  return (
    <TransactionWrapper
      contracts={contracts}
      buttonText="Join Debate"
      onSuccess={onSuccess}
      onError={onError}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
    />
  );
}

/**
 * Batch transaction (join + submit)
 */
export function BatchTransaction({
  contracts,
  buttonText = "Execute Batch",
  onSuccess,
  onError,
}: {
  contracts: ContractFunctionParameters[];
  buttonText?: string;
  onSuccess?: (receipt: unknown) => void;
  onError?: (error: Error) => void;
}) {
  return (
    <TransactionWrapper
      contracts={contracts}
      buttonText={buttonText}
      onSuccess={onSuccess}
      onError={onError}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg"
    />
  );
}

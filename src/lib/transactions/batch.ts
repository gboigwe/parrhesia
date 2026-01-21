/**
 * Batch Transaction Utilities (EIP-5792)
 * Enable atomic multi-transaction operations for better UX
 */

import { type Address, type Hex, encodeFunctionData } from "viem";
import { type WriteContractsParameters } from "wagmi/experimental";

/**
 * Single contract call in a batch
 */
export interface BatchCall {
  address: Address;
  abi: readonly unknown[];
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
}

/**
 * Batch transaction result
 */
export interface BatchResult {
  id: string;
  calls: BatchCall[];
  status: "pending" | "confirmed" | "failed";
}

/**
 * Encode a batch call to calldata
 */
export function encodeBatchCall(call: BatchCall): {
  to: Address;
  data: Hex;
  value?: bigint;
} {
  const data = encodeFunctionData({
    abi: call.abi,
    functionName: call.functionName,
    args: call.args,
  });

  return {
    to: call.address,
    data,
    value: call.value,
  };
}

/**
 * Prepare batch calls for sendCalls (EIP-5792)
 */
export function prepareBatchCalls(calls: BatchCall[]): WriteContractsParameters["contracts"] {
  return calls.map((call) => ({
    address: call.address,
    abi: call.abi,
    functionName: call.functionName,
    args: call.args,
    value: call.value,
  }));
}

/**
 * Calculate estimated gas for batch
 * Simple sum of individual call estimates + buffer
 */
export function estimateBatchGas(individualEstimates: bigint[]): bigint {
  const total = individualEstimates.reduce((sum, gas) => sum + gas, 0n);
  // Add 20% buffer for batch overhead
  return (total * 12n) / 10n;
}

/**
 * Batch transaction error with call index
 */
export class BatchTransactionError extends Error {
  constructor(
    message: string,
    public callIndex: number,
    public call: BatchCall,
    public originalError?: Error
  ) {
    super(`Batch transaction failed at call ${callIndex}: ${message}`);
    this.name = "BatchTransactionError";
  }
}

/**
 * Validate batch calls before execution
 */
export function validateBatchCalls(calls: BatchCall[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (calls.length === 0) {
    errors.push("Batch must contain at least one call");
  }

  if (calls.length > 10) {
    errors.push("Batch cannot contain more than 10 calls");
  }

  calls.forEach((call, index) => {
    if (!call.address || call.address === "0x") {
      errors.push(`Call ${index}: Invalid contract address`);
    }

    if (!call.abi || call.abi.length === 0) {
      errors.push(`Call ${index}: ABI is required`);
    }

    if (!call.functionName) {
      errors.push(`Call ${index}: Function name is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

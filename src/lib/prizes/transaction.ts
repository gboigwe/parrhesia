/**
 * Prize Claim Transaction Builder
 */

import { writeContract, estimateGas, waitForTransactionReceipt } from "wagmi/actions";
import { DEBATE_POOL_ABI } from "../contracts/debatePoolABI";
import { GAS_LIMITS, TRANSACTION_TIMEOUTS } from "./constants";

export async function buildClaimTransaction(
  contractAddress: string,
  config: any
) {
  return {
    address: contractAddress as `0x${string}`,
    abi: DEBATE_POOL_ABI,
    functionName: "claimPrize",
    args: [],
  };
}

export async function estimateClaimGas(
  contractAddress: string,
  userAddress: string,
  config: any
): Promise<bigint> {
  try {
    const gasEstimate = await estimateGas(config, {
      address: contractAddress as `0x${string}`,
      abi: DEBATE_POOL_ABI,
      functionName: "claimPrize",
      account: userAddress as `0x${string}`,
    });

    const gasWithBuffer = (gasEstimate * 120n) / 100n;
    return gasWithBuffer;
  } catch (error) {
    console.error("Gas estimation failed:", error);
    return GAS_LIMITS.CLAIM_PRIZE;
  }
}

export async function executeClaimTransaction(
  contractAddress: string,
  config: any
): Promise<`0x${string}`> {
  const hash = await writeContract(config, {
    address: contractAddress as `0x${string}`,
    abi: DEBATE_POOL_ABI,
    functionName: "claimPrize",
    gas: GAS_LIMITS.CLAIM_PRIZE,
  });

  return hash;
}

export async function waitForClaimConfirmation(
  transactionHash: `0x${string}`,
  config: any
) {
  const receipt = await waitForTransactionReceipt(config, {
    hash: transactionHash,
    confirmations: 2,
    timeout: TRANSACTION_TIMEOUTS.CONFIRMATION,
  });

  return receipt;
}

export async function claimPrizeWithConfirmation(
  contractAddress: string,
  config: any
) {
  const hash = await executeClaimTransaction(contractAddress, config);

  const receipt = await waitForClaimConfirmation(hash, config);

  return {
    transactionHash: hash,
    blockNumber: Number(receipt.blockNumber),
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status,
  };
}

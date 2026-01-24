"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { USDCABI } from "@/lib/contracts/abis/USDCABI";
import { DebatePoolABI } from "@/lib/contracts/abis/DebatePoolABI";
import { USDC_ADDRESSES } from "@/lib/constants";
import { BLOCKCHAIN_CONFIG } from "@/lib/blockchain/constants";
import { waitForConfirmation, extractOpponentFromLogs } from "@/lib/blockchain/transactions";
import { baseSepolia } from "wagmi/chains";

type JoinDebateStatus = 'idle' | 'signing' | 'confirming' | 'syncing' | 'success' | 'error';

interface JoinDebateParams {
  debatePoolAddress: string;
  stakeAmount: number;
  debateId: string;
}

interface JoinDebateResult {
  transactionHash: string;
  blockNumber: bigint;
  opponentAddress: string;
}

/**
 * Hook for joining debates with blockchain confirmation before database update
 * 
 * BREAKING CHANGE: Now waits for blockchain confirmation (2 blocks) before updating database.
 * This prevents the synchronization issues from issue #25.
 * 
 * Flow:
 * 1. signing: User signs transaction in wallet
 * 2. confirming: Waiting for 2 block confirmations on Base
 * 3. syncing: Updating database with confirmed data
 * 4. success: Join complete
 * 
 * @example
 * const { joinDebate, status, error, transactionHash } = useJoinDebate();
 * 
 * await joinDebate({
 *   debatePoolAddress: '0x...',
 *   stakeAmount: 100,
 *   debateId: '123'
 * });
 */
export function useJoinDebate() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  const [status, setStatus] = useState<JoinDebateStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();

  const usdcAddress =
    chainId === baseSepolia.id ? USDC_ADDRESSES.BASE_SEPOLIA : USDC_ADDRESSES.BASE_MAINNET;

  /**
   * Approve USDC spending for the DebatePool contract
   * Now waits for blockchain confirmation before proceeding
   */
  const approveUSDC = async (debatePoolAddress: string, stakeAmount: number) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    console.log('[useJoinDebate] Starting USDC approval...', {
      debatePoolAddress,
      stakeAmount,
      usdcAddress,
      chainId,
    });

    try {
      setStatus('signing');
      
      // Convert stake amount to USDC units (6 decimals)
      const amount = parseUnits(stakeAmount.toString(), 6);

      // Request approval transaction
      const hash = await writeContractAsync({
        address: usdcAddress as `0x${string}`,
        abi: USDCABI,
        functionName: "approve",
        args: [debatePoolAddress as `0x${string}`, amount],
      });

      console.log('[useJoinDebate] Approval transaction submitted:', hash);
      setTransactionHash(hash);
      setStatus('confirming');

      // Wait for blockchain confirmation
      const confirmation = await waitForConfirmation(hash);

      if (!confirmation.success) {
        throw new Error(confirmation.error || 'Transaction failed');
      }

      console.log('[useJoinDebate] Approval confirmed at block:', confirmation.blockNumber);
      return hash;
    } catch (err) {
      const error = err as Error;
      console.error('[useJoinDebate] Approval failed:', error);
      setError(error);
      setStatus('error');
      throw error;
    }
  };

  /**
   * Join debate on-chain with blockchain confirmation
   * 
   * IMPORTANT: Blockchain transaction MUST succeed before database update
   * This is the source of truth for debate participation.
   */
  const joinDebate = async ({
    debatePoolAddress,
    stakeAmount,
    debateId,
  }: JoinDebateParams): Promise<JoinDebateResult> => {
    if (!address) {
      const error = new Error("Wallet not connected");
      setError(error);
      setStatus('error');
      throw error;
    }

    console.log('[useJoinDebate] Starting debate join...', {
      debateId,
      debatePoolAddress,
      stakeAmount,
      opponent: address,
      chainId,
    });

    try {
      // Reset state
      setError(null);
      setTransactionHash(undefined);
      setStatus('signing');

      // Submit join transaction
      const hash = await writeContractAsync({
        address: debatePoolAddress as `0x${string}`,
        abi: DebatePoolABI,
        functionName: "joinDebate",
      });

      console.log('[useJoinDebate] Join transaction submitted:', hash);
      setTransactionHash(hash);
      setStatus('confirming');

      // Wait for blockchain confirmation (2 blocks)
      const confirmation = await waitForConfirmation(hash);

      if (!confirmation.success || !confirmation.receipt) {
        throw new Error(confirmation.error || 'Transaction failed on blockchain');
      }

      console.log('[useJoinDebate] Transaction confirmed at block:', confirmation.blockNumber);

      // Extract opponent address from transaction logs
      const opponentAddress = extractOpponentFromLogs(confirmation.receipt, DebatePoolABI);

      if (!opponentAddress) {
        console.warn('[useJoinDebate] Could not extract opponent from logs, using wallet address');
      }

      const blockNumber = confirmation.blockNumber!;
      const opponent = opponentAddress || address;

      console.log('[useJoinDebate] Extracted opponent:', opponent);

      // Update database with confirmed blockchain data
      setStatus('syncing');
      console.log('[useJoinDebate] Syncing to database...', {
        debateId,
        opponent,
        transactionHash: hash,
        blockNumber: blockNumber.toString(),
      });

      const response = await fetch(`/api/debates/${debateId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opponent,
          transactionHash: hash,
          blockNumber: blockNumber.toString(),
          chainId: BLOCKCHAIN_CONFIG.chainId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update database: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[useJoinDebate] Database updated successfully:', data);

      setStatus('success');

      return {
        transactionHash: hash,
        blockNumber,
        opponentAddress: opponent,
      };
    } catch (err) {
      const error = err as Error;
      console.error('[useJoinDebate] Join failed:', {
        error: error.message,
        debateId,
        address,
      });
      
      setError(error);
      setStatus('error');
      throw error;
    }
  };

  // Helper computed values
  const isLoading = status === 'signing' || status === 'confirming' || status === 'syncing';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return {
    joinDebate,
    approveUSDC,
    status,
    error,
    transactionHash,
    isLoading,
    isSuccess,
    isError,
  };
}

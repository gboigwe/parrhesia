/**
 * Join Debate Validation Hook
 * Validates all requirements before allowing user to join a debate
 */

"use client";

import { useState, useEffect } from "react";
import { useAccount, useConfig, useChainId } from "wagmi";
import { type Address, parseUnits } from "viem";
import { getUSDCBalance, hasSufficientBalance } from "@/lib/tokens/balance";

interface DebateData {
  id: string;
  status: string;
  creatorId: string;
  challengerId?: string | null;
  stakeAmount: number;
  expiresAt?: Date | null;
}

interface ValidationResult {
  canJoin: boolean;
  reasons: string[];
  checks: {
    isWalletConnected: boolean;
    isNotCreator: boolean;
    isNotChallenger: boolean;
    isDebatePending: boolean;
    hasNotExpired: boolean;
    hasSufficientBalance: boolean;
  };
}

export function useJoinDebateValidation(
  debate: DebateData | null,
  userId?: string
) {
  const { address, isConnected } = useAccount();
  const config = useConfig();
  const chainId = useChainId();

  const [validation, setValidation] = useState<ValidationResult>({
    canJoin: false,
    reasons: [],
    checks: {
      isWalletConnected: false,
      isNotCreator: false,
      isNotChallenger: false,
      isDebatePending: false,
      hasNotExpired: false,
      hasSufficientBalance: false,
    },
  });

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    async function validateJoin() {
      if (!debate || !address) {
        setValidation({
          canJoin: false,
          reasons: ["Wallet not connected or debate not found"],
          checks: {
            isWalletConnected: !!address,
            isNotCreator: false,
            isNotChallenger: false,
            isDebatePending: false,
            hasNotExpired: false,
            hasSufficientBalance: false,
          },
        });
        return;
      }

      setIsChecking(true);
      const reasons: string[] = [];

      // Check 1: Wallet connected
      const isWalletConnected = isConnected && !!address;
      if (!isWalletConnected) {
        reasons.push("Please connect your wallet");
      }

      // Check 2: Not the creator
      const isNotCreator = userId !== debate.creatorId;
      if (!isNotCreator) {
        reasons.push("You cannot join your own debate");
      }

      // Check 3: Not already the challenger
      const isNotChallenger = !debate.challengerId || userId !== debate.challengerId;
      if (!isNotChallenger) {
        reasons.push("You already joined this debate");
      }

      // Check 4: Debate is pending
      const isDebatePending = debate.status === "pending";
      if (!isDebatePending) {
        reasons.push("This debate has already started or ended");
      }

      // Check 5: Debate hasn't expired
      const hasNotExpired = !debate.expiresAt || new Date(debate.expiresAt) > new Date();
      if (!hasNotExpired) {
        reasons.push("This debate has expired");
      }

      // Check 6: Sufficient USDC balance
      let hasSufficientBalance = false;
      if (address && debate.stakeAmount) {
        try {
          const balance = await getUSDCBalance(address, chainId, config);
          const required = parseUnits(debate.stakeAmount.toString(), 6);
          hasSufficientBalance = balance.raw >= required;

          if (!hasSufficientBalance) {
            reasons.push(
              `Insufficient USDC balance. Need ${debate.stakeAmount} USDC, have ${balance.formatted} USDC`
            );
          }
        } catch (error) {
          reasons.push("Unable to check USDC balance");
        }
      }

      const canJoin =
        isWalletConnected &&
        isNotCreator &&
        isNotChallenger &&
        isDebatePending &&
        hasNotExpired &&
        hasSufficientBalance;

      setValidation({
        canJoin,
        reasons,
        checks: {
          isWalletConnected,
          isNotCreator,
          isNotChallenger,
          isDebatePending,
          hasNotExpired,
          hasSufficientBalance,
        },
      });

      setIsChecking(false);
    }

    validateJoin();
  }, [debate, userId, address, isConnected, chainId, config]);

  return {
    ...validation,
    isChecking,
  };
}

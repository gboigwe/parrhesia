/**
 * Blockchain Verification
 * Functions to verify database data against Base blockchain state
 */

import { createPublicClient, http } from "viem";
import { BLOCKCHAIN_CONFIG } from "./constants";
import { db } from "@/lib/db";
import { debates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Field discrepancy between database and blockchain
 */
export interface FieldDiscrepancy {
  field: string;
  database: string | null;
  blockchain: string | null;
}

/**
 * Result of debate verification against blockchain
 */
export interface VerificationResult {
  verified: boolean;
  reason?: string;
  discrepancies: FieldDiscrepancy[];
  onChainData?: any;
  dbData?: any;
}

/**
 * Result of prize claim eligibility check
 */
export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  onChainWinner?: string;
  prizeAmount?: bigint;
  alreadyClaimed?: boolean;
}

/**
 * On-chain debate state structure
 * Adjust based on your actual contract structure
 */
interface OnChainDebateState {
  creator: string;
  opponent: string;
  stake: bigint;
  winner: string;
  status: number; // 0: pending, 1: active, 2: voting, 3: finalized
  prizeClaimed: boolean;
  prizeAmount: bigint;
}

// Create public client for blockchain reads
const publicClient = createPublicClient({
  chain: BLOCKCHAIN_CONFIG.chain,
  transport: http(BLOCKCHAIN_CONFIG.rpcUrl),
});

/**
 * Verify debate data against blockchain
 * Compares database state with on-chain state to detect discrepancies
 * 
 * @param debateId - Debate ID to verify
 * @returns Verification result with discrepancies if any
 */
export async function verifyDebateOnChain(
  debateId: string
): Promise<VerificationResult> {
  try {
    console.log(`[Verification] Verifying debate ${debateId} against blockchain...`);

    // Fetch debate from database
    const debate = await db.query.debates.findFirst({
      where: eq(debates.id, debateId),
    });

    if (!debate) {
      console.log(`[Verification] Debate ${debateId} not found in database`);
      return {
        verified: false,
        reason: "Debate not found in database",
        discrepancies: [],
      };
    }

    // Check if debate has contract address
    if (!debate.contractAddress) {
      console.log(`[Verification] Debate ${debateId} has no contract address`);
      return {
        verified: false,
        reason: "No contract address",
        discrepancies: [],
        dbData: debate,
      };
    }

    // Read on-chain state
    // Note: Adjust ABI and function name based on your actual contract
    let onChainState: OnChainDebateState;
    
    try {
      // This is a placeholder - replace with your actual contract ABI and function
      const result = await publicClient.readContract({
        address: debate.contractAddress as `0x${string}`,
        abi: [
          {
            name: "getDebateState",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [
              { name: "creator", type: "address" },
              { name: "opponent", type: "address" },
              { name: "stake", type: "uint256" },
              { name: "winner", type: "address" },
              { name: "status", type: "uint8" },
              { name: "prizeClaimed", type: "bool" },
              { name: "prizeAmount", type: "uint256" },
            ],
          },
        ],
        functionName: "getDebateState",
      }) as [string, string, bigint, string, number, boolean, bigint];

      onChainState = {
        creator: result[0],
        opponent: result[1],
        stake: result[2],
        winner: result[3],
        status: result[4],
        prizeClaimed: result[5],
        prizeAmount: result[6],
      };
    } catch (error) {
      console.error(`[Verification] Error reading on-chain state:`, error);
      return {
        verified: false,
        reason: "Failed to read on-chain state",
        discrepancies: [],
        dbData: debate,
      };
    }

    console.log(`[Verification] On-chain state retrieved successfully`);

    // Compare database vs blockchain
    const discrepancies: FieldDiscrepancy[] = [];

    // Check creator
    if (
      debate.creatorId &&
      debate.creatorId.toLowerCase() !== onChainState.creator.toLowerCase()
    ) {
      discrepancies.push({
        field: "creator",
        database: debate.creatorId,
        blockchain: onChainState.creator,
      });
    }

    // Check opponent/challenger
    if (debate.challengerId && onChainState.opponent !== "0x0000000000000000000000000000000000000000") {
      if (debate.challengerId.toLowerCase() !== onChainState.opponent.toLowerCase()) {
        discrepancies.push({
          field: "opponent",
          database: debate.challengerId,
          blockchain: onChainState.opponent,
        });
      }
    }

    // Check stake amount (convert to same units)
    const dbStake = BigInt(Math.floor(parseFloat(debate.stakeAmount) * 1e6)); // Assuming 6 decimals
    if (dbStake !== onChainState.stake) {
      discrepancies.push({
        field: "stake",
        database: debate.stakeAmount,
        blockchain: onChainState.stake.toString(),
      });
    }

    // Check winner (if set on-chain)
    if (
      onChainState.winner !== "0x0000000000000000000000000000000000000000" &&
      debate.onChainWinner
    ) {
      if (debate.onChainWinner.toLowerCase() !== onChainState.winner.toLowerCase()) {
        discrepancies.push({
          field: "winner",
          database: debate.onChainWinner,
          blockchain: onChainState.winner,
        });
      }
    }

    // Check status mapping
    const onChainStatusMap: Record<number, string> = {
      0: "pending",
      1: "active",
      2: "voting",
      3: "completed",
    };
    const onChainStatusString = onChainStatusMap[onChainState.status] || "unknown";
    
    if (debate.status !== onChainStatusString && onChainState.status >= 3) {
      // Only flag if blockchain says finalized but DB doesn't
      discrepancies.push({
        field: "status",
        database: debate.status,
        blockchain: onChainStatusString,
      });
    }

    // Check prize claimed status
    if (debate.prizeClaimed && !onChainState.prizeClaimed) {
      discrepancies.push({
        field: "prizeClaimed",
        database: "true",
        blockchain: "false",
      });
    }

    const verified = discrepancies.length === 0;

    if (verified) {
      console.log(`[Verification] Debate ${debateId} verified - no discrepancies found`);
    } else {
      console.log(`[Verification] Debate ${debateId} has ${discrepancies.length} discrepancies:`);
      discrepancies.forEach((d) => {
        console.log(`  - ${d.field}: DB=${d.database}, Chain=${d.blockchain}`);
      });
    }

    return {
      verified,
      discrepancies,
      onChainData: onChainState,
      dbData: debate,
    };
  } catch (error) {
    console.error(`[Verification] Error verifying debate ${debateId}:`, error);
    return {
      verified: false,
      reason: error instanceof Error ? error.message : "Unknown error",
      discrepancies: [],
    };
  }
}

/**
 * Verify if a user is eligible to claim prize
 * Checks on-chain state to prevent unauthorized or duplicate claims
 * 
 * @param debateId - Debate ID
 * @param claimer - Address attempting to claim
 * @returns Eligibility result with reason
 */
export async function verifyPrizeClaimEligibility(
  debateId: string,
  claimer: string
): Promise<EligibilityResult> {
  try {
    console.log(`[Verification] Checking prize claim eligibility for ${claimer} on debate ${debateId}`);

    // Fetch debate from database
    const debate = await db.query.debates.findFirst({
      where: eq(debates.id, debateId),
    });

    if (!debate) {
      return {
        eligible: false,
        reason: "Debate not found in database",
      };
    }

    if (!debate.contractAddress) {
      return {
        eligible: false,
        reason: "Debate has no contract address",
      };
    }

    // Read on-chain state
    let onChainState: OnChainDebateState;
    
    try {
      const result = await publicClient.readContract({
        address: debate.contractAddress as `0x${string}`,
        abi: [
          {
            name: "getDebateState",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [
              { name: "creator", type: "address" },
              { name: "opponent", type: "address" },
              { name: "stake", type: "uint256" },
              { name: "winner", type: "address" },
              { name: "status", type: "uint8" },
              { name: "prizeClaimed", type: "bool" },
              { name: "prizeAmount", type: "uint256" },
            ],
          },
        ],
        functionName: "getDebateState",
      }) as [string, string, bigint, bigint, number, boolean, bigint];

      onChainState = {
        creator: result[0],
        opponent: result[1],
        stake: result[2],
        winner: result[3] as any,
        status: result[4],
        prizeClaimed: result[5],
        prizeAmount: result[6],
      };
    } catch (error) {
      console.error(`[Verification] Error reading on-chain state:`, error);
      return {
        eligible: false,
        reason: "Failed to read on-chain state",
      };
    }

    // Check if debate is finalized (status 3)
    if (onChainState.status < 3) {
      return {
        eligible: false,
        reason: "Debate not yet finalized on-chain",
        onChainWinner: onChainState.winner,
        prizeAmount: onChainState.prizeAmount,
        alreadyClaimed: onChainState.prizeClaimed,
      };
    }

    // Check if prize already claimed
    if (onChainState.prizeClaimed) {
      return {
        eligible: false,
        reason: "Prize already claimed on-chain",
        onChainWinner: onChainState.winner,
        prizeAmount: onChainState.prizeAmount,
        alreadyClaimed: true,
      };
    }

    // Check if claimer is the winner
    if (claimer.toLowerCase() !== onChainState.winner.toLowerCase()) {
      return {
        eligible: false,
        reason: "Claimer is not the on-chain winner",
        onChainWinner: onChainState.winner,
        prizeAmount: onChainState.prizeAmount,
        alreadyClaimed: false,
      };
    }

    // All checks passed
    console.log(`[Verification] User ${claimer} is eligible to claim prize for debate ${debateId}`);
    console.log(`  Prize amount: ${onChainState.prizeAmount.toString()}`);

    return {
      eligible: true,
      reason: "Eligible to claim prize",
      onChainWinner: onChainState.winner,
      prizeAmount: onChainState.prizeAmount,
      alreadyClaimed: false,
    };
  } catch (error) {
    console.error(`[Verification] Error checking eligibility:`, error);
    return {
      eligible: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Batch verify multiple debates
 * Useful for periodic verification sweeps
 * 
 * @param debateIds - Array of debate IDs to verify
 * @returns Array of verification results
 */
export async function batchVerifyDebates(
  debateIds: string[]
): Promise<Map<string, VerificationResult>> {
  console.log(`[Verification] Batch verifying ${debateIds.length} debates...`);
  
  const results = new Map<string, VerificationResult>();
  
  for (const debateId of debateIds) {
    const result = await verifyDebateOnChain(debateId);
    results.set(debateId, result);
  }
  
  const unverified = Array.from(results.values()).filter((r) => !r.verified).length;
  console.log(`[Verification] Batch verification complete: ${unverified}/${debateIds.length} unverified`);
  
  return results;
}

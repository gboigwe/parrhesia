/**
 * Transaction confirmation and event parsing helpers
 * Handles Base blockchain transaction confirmations and event extraction
 */

import { waitForTransactionReceipt } from "wagmi/actions";
import { type TransactionReceipt, decodeEventLog, type Abi, type Log } from "viem";
import { BLOCKCHAIN_CONFIG, BLOCKCHAIN_CONSTANTS } from "./constants";
import { wagmiConfig } from "@/lib/wagmi";

/**
 * Transaction confirmation result
 */
export interface TransactionConfirmation {
  success: boolean;
  receipt?: TransactionReceipt;
  blockNumber?: bigint;
  contractAddress?: `0x${string}` | null;
  error?: Error;
}

/**
 * Wait for transaction confirmation on Base blockchain
 * 
 * @param hash - Transaction hash to wait for
 * @returns Promise with confirmation details
 * 
 * @example
 * ```typescript
 * const confirmation = await waitForConfirmation(txHash);
 * if (confirmation.success) {
 *   console.log('Confirmed at block:', confirmation.blockNumber);
 * }
 * ```
 */
export async function waitForConfirmation(
  hash: `0x${string}`
): Promise<TransactionConfirmation> {
  try {
    console.log(`⏳ Waiting for Base confirmation: ${hash}`);
    console.log(`   Chain: ${BLOCKCHAIN_CONFIG.chainName} (${BLOCKCHAIN_CONFIG.chainId})`);
    console.log(`   Required confirmations: ${BLOCKCHAIN_CONSTANTS.REQUIRED_CONFIRMATIONS}`);

    // Wait for transaction receipt with required confirmations
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      hash,
      chainId: BLOCKCHAIN_CONFIG.chainId,
      confirmations: BLOCKCHAIN_CONSTANTS.REQUIRED_CONFIRMATIONS,
      timeout: BLOCKCHAIN_CONSTANTS.TRANSACTION_TIMEOUT,
    });

    // Check if transaction was successful
    if (receipt.status === "success") {
      console.log(`✅ Transaction confirmed at block ${receipt.blockNumber}`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`   Contract address: ${receipt.contractAddress || "N/A"}`);

      return {
        success: true,
        receipt,
        blockNumber: receipt.blockNumber,
        contractAddress: receipt.contractAddress,
      };
    } else {
      console.log(`❌ Transaction reverted: ${hash}`);
      console.log(`   Block: ${receipt.blockNumber}`);

      return {
        success: false,
        receipt,
        blockNumber: receipt.blockNumber,
        error: new Error("Transaction reverted on-chain"),
      };
    }
  } catch (error) {
    // Handle timeout errors
    if (error instanceof Error && error.message.includes("timeout")) {
      console.error(`⏱️  Transaction timeout after ${BLOCKCHAIN_CONSTANTS.TRANSACTION_TIMEOUT}ms: ${hash}`);
      return {
        success: false,
        error: new Error(`Transaction confirmation timeout after ${BLOCKCHAIN_CONSTANTS.TRANSACTION_TIMEOUT}ms`),
      };
    }

    // Handle other errors
    console.error(`❌ Error waiting for confirmation: ${hash}`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error waiting for confirmation"),
    };
  }
}

/**
 * Extract debate ID from DebateCreated event logs
 * 
 * @param receipt - Transaction receipt containing logs
 * @param abi - Contract ABI for event decoding
 * @returns Debate ID as string
 * @throws Error if DebateCreated event not found or parsing fails
 * 
 * @example
 * ```typescript
 * const debateId = extractDebateIdFromLogs(receipt, debateFactoryAbi);
 * console.log('Created debate:', debateId);
 * ```
 */
export function extractDebateIdFromLogs(
  receipt: TransactionReceipt,
  abi: Abi
): string {
  try {
    // Find DebateCreated event in logs
    const debateCreatedEvent = receipt.logs.find((log: Log) => {
      try {
        const decoded = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        });
        return decoded.eventName === "DebateCreated";
      } catch {
        return false;
      }
    });

    if (!debateCreatedEvent) {
      console.error("❌ DebateCreated event not found in transaction logs");
      console.error(`   Transaction: ${receipt.transactionHash}`);
      console.error(`   Total logs: ${receipt.logs.length}`);
      throw new Error("DebateCreated event not found in transaction logs");
    }

    // Decode the event
    const decoded = decodeEventLog({
      abi,
      data: debateCreatedEvent.data,
      topics: debateCreatedEvent.topics,
    });

    // Extract debateId from event args
    const debateId = (decoded.args as any).debateId;
    
    if (!debateId) {
      console.error("❌ debateId not found in DebateCreated event args");
      console.error("   Event args:", decoded.args);
      throw new Error("debateId not found in DebateCreated event");
    }

    // Convert to string (handles BigInt or number)
    const debateIdString = debateId.toString();
    console.log(`🎯 Extracted debate ID: ${debateIdString}`);
    
    return debateIdString;
  } catch (error) {
    console.error("❌ Error extracting debate ID from logs:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      throw error;
    }
    
    throw new Error(
      `Failed to parse DebateCreated event: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Extract opponent address from DebateJoined event logs
 * 
 * @param receipt - Transaction receipt containing logs
 * @param abi - Contract ABI for event decoding
 * @returns Opponent address as string
 * @throws Error if DebateJoined event not found or parsing fails
 * 
 * @example
 * ```typescript
 * const opponent = extractOpponentFromLogs(receipt, debatePoolAbi);
 * console.log('Opponent joined:', opponent);
 * ```
 */
export function extractOpponentFromLogs(
  receipt: TransactionReceipt,
  abi: Abi
): string {
  try {
    // Find DebateJoined event in logs
    const debateJoinedEvent = receipt.logs.find((log: Log) => {
      try {
        const decoded = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        });
        return decoded.eventName === "DebateJoined";
      } catch {
        return false;
      }
    });

    if (!debateJoinedEvent) {
      console.error("❌ DebateJoined event not found in transaction logs");
      console.error(`   Transaction: ${receipt.transactionHash}`);
      console.error(`   Total logs: ${receipt.logs.length}`);
      throw new Error("DebateJoined event not found in transaction logs");
    }

    // Decode the event
    const decoded = decodeEventLog({
      abi,
      data: debateJoinedEvent.data,
      topics: debateJoinedEvent.topics,
    });

    // Extract opponent address from event args
    const opponent = (decoded.args as any).opponent || (decoded.args as any).challenger;
    
    if (!opponent) {
      console.error("❌ Opponent address not found in DebateJoined event args");
      console.error("   Event args:", decoded.args);
      throw new Error("Opponent address not found in DebateJoined event");
    }

    // Convert to string
    const opponentAddress = opponent.toString();
    console.log(`🤝 Extracted opponent address: ${opponentAddress}`);
    
    return opponentAddress;
  } catch (error) {
    console.error("❌ Error extracting opponent from logs:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      throw error;
    }
    
    throw new Error(
      `Failed to parse DebateJoined event: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Extract winner address from DebateCompleted event logs
 * 
 * @param receipt - Transaction receipt containing logs
 * @param abi - Contract ABI for event decoding
 * @returns Winner address as string
 * @throws Error if DebateCompleted event not found or parsing fails
 */
export function extractWinnerFromLogs(
  receipt: TransactionReceipt,
  abi: Abi
): string {
  try {
    // Find DebateCompleted event in logs
    const debateCompletedEvent = receipt.logs.find((log: Log) => {
      try {
        const decoded = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        });
        return decoded.eventName === "DebateCompleted";
      } catch {
        return false;
      }
    });

    if (!debateCompletedEvent) {
      console.error("❌ DebateCompleted event not found in transaction logs");
      console.error(`   Transaction: ${receipt.transactionHash}`);
      throw new Error("DebateCompleted event not found in transaction logs");
    }

    // Decode the event
    const decoded = decodeEventLog({
      abi,
      data: debateCompletedEvent.data,
      topics: debateCompletedEvent.topics,
    });

    // Extract winner address from event args
    const winner = (decoded.args as any).winner;
    
    if (!winner) {
      console.error("❌ Winner address not found in DebateCompleted event args");
      console.error("   Event args:", decoded.args);
      throw new Error("Winner address not found in DebateCompleted event");
    }

    // Convert to string
    const winnerAddress = winner.toString();
    console.log(`🏆 Extracted winner address: ${winnerAddress}`);
    
    return winnerAddress;
  } catch (error) {
    console.error("❌ Error extracting winner from logs:", error);
    
    if (error instanceof Error && error.message.includes("not found")) {
      throw error;
    }
    
    throw new Error(
      `Failed to parse DebateCompleted event: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get transaction details with retry logic
 * Useful for checking transaction status before waiting for confirmation
 * 
 * @param hash - Transaction hash
 * @param maxRetries - Maximum number of retries (default: 3)
 * @returns Transaction receipt or null if not found
 */
export async function getTransactionWithRetry(
  hash: `0x${string}`,
  maxRetries: number = BLOCKCHAIN_CONSTANTS.MAX_SYNC_RETRIES
): Promise<TransactionReceipt | null> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: BLOCKCHAIN_CONFIG.chainId,
        timeout: BLOCKCHAIN_CONSTANTS.RETRY_DELAY,
      });
      
      return receipt;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      
      if (attempt < maxRetries) {
        console.log(`   Retry ${attempt}/${maxRetries} after ${BLOCKCHAIN_CONSTANTS.RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, BLOCKCHAIN_CONSTANTS.RETRY_DELAY));
      }
    }
  }
  
  console.error(`❌ Failed to get transaction after ${maxRetries} attempts:`, lastError);
  return null;
}

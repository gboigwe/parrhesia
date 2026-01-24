/**
 * Blockchain Event Listener Service
 * Listens to Base blockchain events in real-time and syncs with database
 */

import { createPublicClient, http, parseAbiItem, type PublicClient } from "viem";
import { BLOCKCHAIN_CONFIG } from "./constants";

/**
 * Event listener for debate-related blockchain events
 * Watches for DebateCreated, DebateJoined, PrizeClaimed, and DebateFinalized events
 */
class DebateEventListener {
  private client: PublicClient;
  private isListening: boolean = false;
  private unwatchFunctions: (() => void)[] = [];

  constructor() {
    // Create public client for Base blockchain
    this.client = createPublicClient({
      chain: BLOCKCHAIN_CONFIG.chain,
      transport: http(BLOCKCHAIN_CONFIG.rpcUrl),
    });

    console.log("[EventListener] Initialized");
    console.log(`  Chain: ${BLOCKCHAIN_CONFIG.chainName} (${BLOCKCHAIN_CONFIG.chainId})`);
    console.log(`  RPC: ${BLOCKCHAIN_CONFIG.rpcUrl}`);
  }

  /**
   * Start listening to all blockchain events
   */
  public async startListening(): Promise<void> {
    if (this.isListening) {
      console.log("[EventListener] Already listening to events");
      return;
    }

    if (!BLOCKCHAIN_CONFIG.debateFactoryAddress) {
      console.error("[EventListener] Cannot start: DEBATE_FACTORY_ADDRESS not configured");
      return;
    }

    console.log("[EventListener] Starting Base blockchain event listener...");
    this.isListening = true;

    // Start watching all events
    this.watchDebateCreated();
    this.watchDebateJoined();
    this.watchPrizeClaimed();
    this.watchDebateFinalized();

    console.log("[EventListener] All event watchers active");
  }

  /**
   * Watch for DebateCreated events
   * Emitted when a new debate is created on-chain
   */
  private watchDebateCreated(): void {
    try {
      const unwatch = this.client.watchContractEvent({
        address: BLOCKCHAIN_CONFIG.debateFactoryAddress!,
        event: parseAbiItem(
          "event DebateCreated(uint256 indexed debateId, address indexed creator, uint256 stake, address poolAddress)"
        ),
        onLogs: async (logs: any[]) => {
          for (const log of logs) {
            try {
              const { debateId, creator, stake, poolAddress } = log.args as {
                debateId: bigint;
                creator: string;
                stake: bigint;
                poolAddress: string;
              };

              console.log("[EventListener] DebateCreated event detected");
              console.log(`  Debate ID: ${debateId.toString()}`);
              console.log(`  Creator: ${creator}`);
              console.log(`  Stake: ${stake.toString()}`);
              console.log(`  Pool Address: ${poolAddress}`);
              console.log(`  Transaction: ${log.transactionHash}`);
              console.log(`  Block: ${log.blockNumber}`);

              // Sync with database
              const response = await fetch("/api/blockchain/sync/debate-created", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  debateId: debateId.toString(),
                  creator,
                  stake: stake.toString(),
                  contractAddress: poolAddress,
                  transactionHash: log.transactionHash,
                  blockNumber: Number(log.blockNumber),
                  timestamp: new Date().toISOString(),
                }),
              });

              if (!response.ok) {
                const error = await response.text();
                console.error(`[EventListener] Failed to sync DebateCreated: ${error}`);
              } else {
                console.log(`[EventListener] DebateCreated synced successfully: ${debateId.toString()}`);
              }
            } catch (error) {
              console.error("[EventListener] Error processing DebateCreated event:", error);
            }
          }
        },
        onError: (error: Error) => {
          console.error("[EventListener] Error watching DebateCreated events:", error);
        },
      });

      this.unwatchFunctions.push(unwatch);
      console.log("[EventListener] Watching DebateCreated events");
    } catch (error) {
      console.error("[EventListener] Failed to setup DebateCreated watcher:", error);
    }
  }

  /**
   * Watch for DebateJoined events
   * Emitted when an opponent joins a debate
   */
  private watchDebateJoined(): void {
    try {
      const unwatch = this.client.watchContractEvent({
        address: BLOCKCHAIN_CONFIG.debateFactoryAddress!,
        event: parseAbiItem(
          "event DebateJoined(uint256 indexed debateId, address indexed opponent)"
        ),
        onLogs: async (logs: any[]) => {
          for (const log of logs) {
            try {
              const { debateId, opponent } = log.args as {
                debateId: bigint;
                opponent: string;
              };

              console.log("[EventListener] DebateJoined event detected");
              console.log(`  Debate ID: ${debateId.toString()}`);
              console.log(`  Opponent: ${opponent}`);
              console.log(`  Transaction: ${log.transactionHash}`);
              console.log(`  Block: ${log.blockNumber}`);

              // Sync with database
              const response = await fetch("/api/blockchain/sync/debate-joined", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  debateId: debateId.toString(),
                  opponent,
                  transactionHash: log.transactionHash,
                  blockNumber: Number(log.blockNumber),
                  timestamp: new Date().toISOString(),
                }),
              });

              if (!response.ok) {
                const error = await response.text();
                console.error(`[EventListener] Failed to sync DebateJoined: ${error}`);
              } else {
                console.log(`[EventListener] DebateJoined synced successfully: ${debateId.toString()}`);
              }
            } catch (error) {
              console.error("[EventListener] Error processing DebateJoined event:", error);
            }
          }
        },
        onError: (error: Error) => {
          console.error("[EventListener] Error watching DebateJoined events:", error);
        },
      });

      this.unwatchFunctions.push(unwatch);
      console.log("[EventListener] Watching DebateJoined events");
    } catch (error) {
      console.error("[EventListener] Failed to setup DebateJoined watcher:", error);
    }
  }

  /**
   * Watch for PrizeClaimed events
   * Emitted when a winner claims their prize
   */
  private watchPrizeClaimed(): void {
    try {
      const unwatch = this.client.watchContractEvent({
        address: BLOCKCHAIN_CONFIG.debateFactoryAddress!,
        event: parseAbiItem(
          "event PrizeClaimed(uint256 indexed debateId, address indexed winner, uint256 amount)"
        ),
        onLogs: async (logs: any[]) => {
          for (const log of logs) {
            try {
              const { debateId, winner, amount } = log.args as {
                debateId: bigint;
                winner: string;
                amount: bigint;
              };

              console.log("[EventListener] PrizeClaimed event detected");
              console.log(`  Debate ID: ${debateId.toString()}`);
              console.log(`  Winner: ${winner}`);
              console.log(`  Amount: ${amount.toString()}`);
              console.log(`  Transaction: ${log.transactionHash}`);
              console.log(`  Block: ${log.blockNumber}`);

              // Sync with database
              const response = await fetch("/api/blockchain/sync/prize-claimed", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  debateId: debateId.toString(),
                  winner,
                  amount: amount.toString(),
                  transactionHash: log.transactionHash,
                  blockNumber: Number(log.blockNumber),
                  timestamp: new Date().toISOString(),
                }),
              });

              if (!response.ok) {
                const error = await response.text();
                console.error(`[EventListener] Failed to sync PrizeClaimed: ${error}`);
              } else {
                console.log(`[EventListener] PrizeClaimed synced successfully: ${debateId.toString()}`);
              }
            } catch (error) {
              console.error("[EventListener] Error processing PrizeClaimed event:", error);
            }
          }
        },
        onError: (error: Error) => {
          console.error("[EventListener] Error watching PrizeClaimed events:", error);
        },
      });

      this.unwatchFunctions.push(unwatch);
      console.log("[EventListener] Watching PrizeClaimed events");
    } catch (error) {
      console.error("[EventListener] Failed to setup PrizeClaimed watcher:", error);
    }
  }

  /**
   * Watch for DebateFinalized events
   * Emitted when a debate is finalized with a winner
   */
  private watchDebateFinalized(): void {
    try {
      const unwatch = this.client.watchContractEvent({
        address: BLOCKCHAIN_CONFIG.debateFactoryAddress!,
        event: parseAbiItem(
          "event DebateFinalized(uint256 indexed debateId, address indexed winner, uint256 totalVotes)"
        ),
        onLogs: async (logs: any[]) => {
          for (const log of logs) {
            try {
              const { debateId, winner, totalVotes } = log.args as {
                debateId: bigint;
                winner: string;
                totalVotes: bigint;
              };

              console.log("[EventListener] DebateFinalized event detected");
              console.log(`  Debate ID: ${debateId.toString()}`);
              console.log(`  Winner: ${winner}`);
              console.log(`  Total Votes: ${totalVotes.toString()}`);
              console.log(`  Transaction: ${log.transactionHash}`);
              console.log(`  Block: ${log.blockNumber}`);

              // Sync with database
              const response = await fetch("/api/blockchain/sync/debate-finalized", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  debateId: debateId.toString(),
                  onChainWinner: winner,
                  totalVotes: totalVotes.toString(),
                  transactionHash: log.transactionHash,
                  blockNumber: Number(log.blockNumber),
                  timestamp: new Date().toISOString(),
                }),
              });

              if (!response.ok) {
                const error = await response.text();
                console.error(`[EventListener] Failed to sync DebateFinalized: ${error}`);
              } else {
                console.log(`[EventListener] DebateFinalized synced successfully: ${debateId.toString()}`);
              }
            } catch (error) {
              console.error("[EventListener] Error processing DebateFinalized event:", error);
            }
          }
        },
        onError: (error: Error) => {
          console.error("[EventListener] Error watching DebateFinalized events:", error);
        },
      });

      this.unwatchFunctions.push(unwatch);
      console.log("[EventListener] Watching DebateFinalized events");
    } catch (error) {
      console.error("[EventListener] Failed to setup DebateFinalized watcher:", error);
    }
  }

  /**
   * Stop listening to all blockchain events
   */
  public stopListening(): void {
    if (!this.isListening) {
      console.log("[EventListener] Not currently listening");
      return;
    }

    console.log("[EventListener] Stopping event listener...");

    // Call all unwatch functions to stop listening
    for (const unwatch of this.unwatchFunctions) {
      try {
        unwatch();
      } catch (error) {
        console.error("[EventListener] Error stopping watcher:", error);
      }
    }

    this.unwatchFunctions = [];
    this.isListening = false;

    console.log("[EventListener] Stopped all event watchers");
  }

  /**
   * Check if the listener is currently active
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Get the public client instance
   */
  public getClient(): PublicClient {
    return this.client;
  }
}

// Export singleton instance
export const debateEventListener = new DebateEventListener();

// Export class for testing
export { DebateEventListener };

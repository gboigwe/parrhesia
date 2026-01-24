/**
 * Event Listener Service
 * Manages blockchain event listener initialization
 */

import { debateEventListener } from "@/lib/blockchain/eventListener";

/**
 * Initialize the blockchain event listener
 * This should only run on the server side
 */
export async function initializeEventListener(): Promise<void> {
  // Check if running on server
  if (typeof window !== "undefined") {
    console.log("[EventListenerService] Skipping initialization - running in browser");
    return;
  }

  try {
    console.log("[EventListenerService] Initializing blockchain event listener...");
    
    // Check if already listening
    if (debateEventListener.getIsListening()) {
      console.log("[EventListenerService] Event listener already active");
      return;
    }

    // Start listening to blockchain events
    await debateEventListener.startListening();
    
    console.log("[EventListenerService] Blockchain event listener initialized successfully");
  } catch (error) {
    console.error("[EventListenerService] Failed to initialize event listener:", error);
    
    // Don't throw - we don't want to crash the server if event listener fails
    // The app can still function without real-time event listening
    console.error("[EventListenerService] App will continue without real-time blockchain sync");
  }
}

/**
 * Stop the blockchain event listener
 * Useful for cleanup or testing
 */
export async function stopEventListener(): Promise<void> {
  try {
    console.log("[EventListenerService] Stopping blockchain event listener...");
    debateEventListener.stopListening();
    console.log("[EventListenerService] Event listener stopped successfully");
  } catch (error) {
    console.error("[EventListenerService] Error stopping event listener:", error);
  }
}

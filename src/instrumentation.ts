/**
 * Next.js Instrumentation
 * Runs once when the server starts
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

import { initializeEventListener } from "@/lib/services/eventListenerService";
import { startReconciliationService } from "@/lib/blockchain/reconciliation";

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[Instrumentation] Server starting - initializing services...");
    
    try {
      // Initialize blockchain event listener
      await initializeEventListener();
      
      // Start reconciliation service (runs every 5 minutes)
      startReconciliationService(5);
      
      console.log("[Instrumentation] All services initialized successfully");
    } catch (error) {
      console.error("[Instrumentation] Error during service initialization:", error);
      // Don't throw - allow server to start even if services fail
    }
  }
}

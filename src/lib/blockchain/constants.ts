/**
 * Blockchain configuration constants
 * Manages Base mainnet and Base Sepolia testnet configurations
 */

import { base, baseSepolia } from "viem/chains";

/**
 * Blockchain network configuration
 */
export interface BlockchainConfig {
  chainId: number;
  chainName: string;
  chain: typeof base | typeof baseSepolia;
  rpcUrl: string;
  blockExplorerUrl: string;
  debateFactoryAddress: `0x${string}` | undefined;
  usdcAddress: `0x${string}` | undefined;
  requiredConfirmations: number;
  transactionTimeout: number;
  isProduction: boolean;
}

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

// Get contract addresses from environment variables
const DEBATE_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_DEBATE_FACTORY_ADDRESS as `0x${string}` | undefined;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` | undefined;

// Validate critical addresses
if (!DEBATE_FACTORY_ADDRESS) {
  console.warn(
    "⚠️  WARNING: NEXT_PUBLIC_DEBATE_FACTORY_ADDRESS is not set. " +
    "Blockchain interactions will fail. Please set this in your .env file."
  );
}

if (!USDC_ADDRESS) {
  console.warn(
    "⚠️  WARNING: NEXT_PUBLIC_USDC_ADDRESS is not set. " +
    "USDC transactions will fail. Please set this in your .env file."
  );
}

// Base mainnet configuration
const BASE_MAINNET_CONFIG = {
  chainId: 8453,
  chainName: "Base",
  chain: base,
  rpcUrl: process.env.BASE_RPC_URL || "https://mainnet.base.org",
  blockExplorerUrl: "https://basescan.org",
  debateFactoryAddress: DEBATE_FACTORY_ADDRESS,
  usdcAddress: USDC_ADDRESS,
  requiredConfirmations: 2, // Base has 2-second blocks
  transactionTimeout: 60000, // 60 seconds
  isProduction: true,
} as const;

// Base Sepolia testnet configuration
const BASE_SEPOLIA_CONFIG = {
  chainId: 84532,
  chainName: "Base Sepolia",
  chain: baseSepolia,
  rpcUrl: process.env.BASE_RPC_URL || "https://sepolia.base.org",
  blockExplorerUrl: "https://sepolia.basescan.org",
  debateFactoryAddress: DEBATE_FACTORY_ADDRESS,
  usdcAddress: USDC_ADDRESS,
  requiredConfirmations: 2, // Same block time as mainnet
  transactionTimeout: 60000, // 60 seconds
  isProduction: false,
} as const;

/**
 * Current blockchain configuration based on NODE_ENV
 * - production: Base mainnet (chain ID 8453)
 * - development: Base Sepolia testnet (chain ID 84532)
 */
export const BLOCKCHAIN_CONFIG: BlockchainConfig = isProduction
  ? BASE_MAINNET_CONFIG
  : BASE_SEPOLIA_CONFIG;

/**
 * Export individual configs for direct access
 */
export const BASE_MAINNET = BASE_MAINNET_CONFIG;
export const BASE_SEPOLIA = BASE_SEPOLIA_CONFIG;

/**
 * Blockchain constants
 */
export const BLOCKCHAIN_CONSTANTS = {
  // Confirmation settings
  REQUIRED_CONFIRMATIONS: 2,
  TRANSACTION_TIMEOUT: 60000,
  
  // Block times (in milliseconds)
  BLOCK_TIME: 2000, // 2 seconds
  
  // Polling intervals
  SYNC_INTERVAL: 30000, // 30 seconds - how often to sync debates
  TRANSACTION_POLL_INTERVAL: 2000, // 2 seconds - how often to poll pending transactions
  
  // Retry settings
  MAX_SYNC_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
  
  // Gas settings (optional overrides)
  DEFAULT_GAS_MULTIPLIER: 1.2, // 20% buffer for gas estimation
} as const;

/**
 * Sync status thresholds
 */
export const SYNC_THRESHOLDS = {
  // How long before a "confirmed" debate should be re-synced
  STALE_SYNC_THRESHOLD: 3600000, // 1 hour in milliseconds
  
  // Maximum age for sync errors before clearing
  ERROR_RETENTION_PERIOD: 86400000, // 24 hours in milliseconds
  
  // How many blocks behind before forcing a full sync
  BLOCK_LAG_THRESHOLD: 100,
} as const;

/**
 * Helper function to format block explorer URL
 */
export const getBlockExplorerUrl = (
  type: "tx" | "address" | "block",
  value: string
): string => {
  const baseUrl = BLOCKCHAIN_CONFIG.blockExplorerUrl;
  switch (type) {
    case "tx":
      return `${baseUrl}/tx/${value}`;
    case "address":
      return `${baseUrl}/address/${value}`;
    case "block":
      return `${baseUrl}/block/${value}`;
    default:
      return baseUrl;
  }
};

/**
 * Helper function to validate if an address is configured
 */
export const isContractConfigured = (
  contract: "factory" | "usdc"
): boolean => {
  switch (contract) {
    case "factory":
      return !!BLOCKCHAIN_CONFIG.debateFactoryAddress;
    case "usdc":
      return !!BLOCKCHAIN_CONFIG.usdcAddress;
    default:
      return false;
  }
};

/**
 * Helper function to get current chain info
 */
export const getChainInfo = () => ({
  id: BLOCKCHAIN_CONFIG.chainId,
  name: BLOCKCHAIN_CONFIG.chainName,
  isTestnet: !BLOCKCHAIN_CONFIG.isProduction,
  explorer: BLOCKCHAIN_CONFIG.blockExplorerUrl,
  rpc: BLOCKCHAIN_CONFIG.rpcUrl,
});

// Log current configuration on load (only in development)
if (isDevelopment) {
  console.log("🔗 Blockchain Configuration:");
  console.log(`  Network: ${BLOCKCHAIN_CONFIG.chainName} (Chain ID: ${BLOCKCHAIN_CONFIG.chainId})`);
  console.log(`  RPC: ${BLOCKCHAIN_CONFIG.rpcUrl}`);
  console.log(`  Explorer: ${BLOCKCHAIN_CONFIG.blockExplorerUrl}`);
  console.log(`  Debate Factory: ${BLOCKCHAIN_CONFIG.debateFactoryAddress || "NOT SET"}`);
  console.log(`  USDC Address: ${BLOCKCHAIN_CONFIG.usdcAddress || "NOT SET"}`);
}

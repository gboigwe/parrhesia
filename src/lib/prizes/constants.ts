/**
 * Prize Distribution Constants
 */

export const PRIZE_CONSTANTS = {
  PLATFORM_FEE_PERCENTAGE: 5,
  WINNER_PERCENTAGE: 95,
  MIN_CLAIM_AMOUNT: "0.01",
  MAX_GAS_PRICE: "100",
  CONFIRMATIONS_REQUIRED: 2,
  CLAIM_TIMEOUT_MS: 300000,
} as const;

export const CLAIM_STATUS = {
  UNCLAIMED: "unclaimed",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
} as const;

export const CLAIM_ERRORS = {
  NOT_WINNER: "You are not the winner of this debate",
  ALREADY_CLAIMED: "Prize has already been claimed",
  DEBATE_NOT_FINALIZED: "Debate has not been finalized yet",
  INSUFFICIENT_BALANCE: "Contract has insufficient balance",
  INVALID_DEBATE: "Invalid debate ID",
  TRANSACTION_FAILED: "Transaction failed on blockchain",
  WALLET_NOT_CONNECTED: "Wallet not connected",
  WRONG_NETWORK: "Please switch to Base network",
  GAS_ESTIMATION_FAILED: "Failed to estimate gas",
  TIMEOUT: "Transaction timed out",
} as const;

export const GAS_LIMITS = {
  CLAIM_PRIZE: 200000n,
  APPROVE_TOKEN: 100000n,
  FALLBACK: 250000n,
} as const;

export const TRANSACTION_TIMEOUTS = {
  APPROVAL: 60000,
  CLAIM: 120000,
  CONFIRMATION: 300000,
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,
  MAX_DELAY: 10000,
} as const;

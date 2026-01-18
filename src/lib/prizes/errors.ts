/**
 * Prize Claim Error Handling
 */

import { CLAIM_ERRORS } from "./constants";

export class PrizeClaimError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = "PrizeClaimError";
  }
}

export function parseContractError(error: any): PrizeClaimError {
  const errorString = error.toString().toLowerCase();

  if (errorString.includes("notwinner")) {
    return new PrizeClaimError(
      CLAIM_ERRORS.NOT_WINNER,
      "NOT_WINNER",
      error
    );
  }

  if (errorString.includes("alreadyclaimed")) {
    return new PrizeClaimError(
      CLAIM_ERRORS.ALREADY_CLAIMED,
      "ALREADY_CLAIMED",
      error
    );
  }

  if (errorString.includes("debatenotfinalized")) {
    return new PrizeClaimError(
      CLAIM_ERRORS.DEBATE_NOT_FINALIZED,
      "NOT_FINALIZED",
      error
    );
  }

  if (errorString.includes("insufficientbalance")) {
    return new PrizeClaimError(
      CLAIM_ERRORS.INSUFFICIENT_BALANCE,
      "INSUFFICIENT_BALANCE",
      error
    );
  }

  if (errorString.includes("user rejected")) {
    return new PrizeClaimError(
      "Transaction was rejected by user",
      "USER_REJECTED",
      error
    );
  }

  if (errorString.includes("gas")) {
    return new PrizeClaimError(
      CLAIM_ERRORS.GAS_ESTIMATION_FAILED,
      "GAS_ERROR",
      error
    );
  }

  return new PrizeClaimError(
    CLAIM_ERRORS.TRANSACTION_FAILED,
    "UNKNOWN_ERROR",
    error
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof PrizeClaimError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return CLAIM_ERRORS.TRANSACTION_FAILED;
}

export function isRetryableError(error: PrizeClaimError): boolean {
  const retryableCodes = ["GAS_ERROR", "TIMEOUT", "NETWORK_ERROR"];
  return retryableCodes.includes(error.code);
}

export function logClaimError(
  debateId: string,
  userAddress: string,
  error: PrizeClaimError
): void {
  console.error("Prize claim failed:", {
    debateId,
    userAddress,
    errorCode: error.code,
    errorMessage: error.message,
    details: error.details,
    timestamp: new Date().toISOString(),
  });
}

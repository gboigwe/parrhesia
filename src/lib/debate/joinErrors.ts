/**
 * Join Debate Error Handling
 * Parse and handle errors during join flow
 */

export enum JoinErrorCode {
  WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  APPROVAL_FAILED = "APPROVAL_FAILED",
  JOIN_TRANSACTION_FAILED = "JOIN_TRANSACTION_FAILED",
  DATABASE_UPDATE_FAILED = "DATABASE_UPDATE_FAILED",
  DEBATE_NOT_FOUND = "DEBATE_NOT_FOUND",
  DEBATE_NOT_PENDING = "DEBATE_NOT_PENDING",
  ALREADY_JOINED = "ALREADY_JOINED",
  CANNOT_JOIN_OWN_DEBATE = "CANNOT_JOIN_OWN_DEBATE",
  DEBATE_EXPIRED = "DEBATE_EXPIRED",
  UNKNOWN = "UNKNOWN",
}

export class JoinDebateError extends Error {
  constructor(
    message: string,
    public code: JoinErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = "JoinDebateError";
  }
}

const ERROR_MESSAGES: Record<JoinErrorCode, string> = {
  [JoinErrorCode.WALLET_NOT_CONNECTED]:
    "Please connect your wallet to join the debate",
  [JoinErrorCode.INSUFFICIENT_BALANCE]:
    "Insufficient USDC balance to join this debate",
  [JoinErrorCode.APPROVAL_FAILED]:
    "Failed to approve USDC. Please try again",
  [JoinErrorCode.JOIN_TRANSACTION_FAILED]:
    "Join transaction failed. Please try again",
  [JoinErrorCode.DATABASE_UPDATE_FAILED]:
    "Transaction succeeded but database update failed",
  [JoinErrorCode.DEBATE_NOT_FOUND]:
    "Debate not found",
  [JoinErrorCode.DEBATE_NOT_PENDING]:
    "This debate is not open for joining",
  [JoinErrorCode.ALREADY_JOINED]:
    "You have already joined this debate",
  [JoinErrorCode.CANNOT_JOIN_OWN_DEBATE]:
    "You cannot join your own debate",
  [JoinErrorCode.DEBATE_EXPIRED]:
    "This debate has expired",
  [JoinErrorCode.UNKNOWN]:
    "An unexpected error occurred. Please try again",
};

export function getJoinErrorMessage(code: JoinErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[JoinErrorCode.UNKNOWN];
}

export function parseJoinError(error: unknown): JoinDebateError {
  if (error instanceof JoinDebateError) {
    return error;
  }

  const errorString = String(error).toLowerCase();

  if (errorString.includes("wallet") || errorString.includes("not connected")) {
    return new JoinDebateError(
      getJoinErrorMessage(JoinErrorCode.WALLET_NOT_CONNECTED),
      JoinErrorCode.WALLET_NOT_CONNECTED,
      error
    );
  }

  if (errorString.includes("insufficient")) {
    return new JoinDebateError(
      getJoinErrorMessage(JoinErrorCode.INSUFFICIENT_BALANCE),
      JoinErrorCode.INSUFFICIENT_BALANCE,
      error
    );
  }

  if (errorString.includes("approval")) {
    return new JoinDebateError(
      getJoinErrorMessage(JoinErrorCode.APPROVAL_FAILED),
      JoinErrorCode.APPROVAL_FAILED,
      error
    );
  }

  if (errorString.includes("already") && errorString.includes("joined")) {
    return new JoinDebateError(
      getJoinErrorMessage(JoinErrorCode.ALREADY_JOINED),
      JoinErrorCode.ALREADY_JOINED,
      error
    );
  }

  if (errorString.includes("expired")) {
    return new JoinDebateError(
      getJoinErrorMessage(JoinErrorCode.DEBATE_EXPIRED),
      JoinErrorCode.DEBATE_EXPIRED,
      error
    );
  }

  return new JoinDebateError(
    getJoinErrorMessage(JoinErrorCode.UNKNOWN),
    JoinErrorCode.UNKNOWN,
    error
  );
}

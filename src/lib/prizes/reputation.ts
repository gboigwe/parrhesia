/**
 * Reputation Update Service
 * Updates user reputation after prize claim
 */

export interface ReputationUpdate {
  userId: string;
  debateId: string;
  points: number;
  reason: string;
}

export async function updateReputationOnClaim(
  userId: string,
  debateId: string,
  prizeAmount: string
): Promise<void> {
  try {
    const basePoints = 10;
    const amountBonus = Math.floor(parseFloat(prizeAmount) / 1e6);
    const totalPoints = basePoints + amountBonus;

    const response = await fetch("/api/reputation/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        debateId,
        points: totalPoints,
        reason: "prize_claim",
      }),
    });

    if (!response.ok) {
      console.error("Failed to update reputation");
    }
  } catch (error) {
    console.error("Reputation update error:", error);
  }
}

export function calculatePrizeReputationBonus(prizeAmount: string): number {
  const usdcAmount = parseFloat(prizeAmount) / 1e6;

  if (usdcAmount >= 1000) return 100;
  if (usdcAmount >= 500) return 50;
  if (usdcAmount >= 100) return 25;
  if (usdcAmount >= 50) return 15;
  if (usdcAmount >= 10) return 10;

  return 5;
}

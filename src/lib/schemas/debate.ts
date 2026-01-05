import { z } from "zod";
import { DEBATE_TIMING } from "@/lib/debate/constants";

/**
 * Debate creation form validation schema
 */
export const createDebateSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters")
    .trim(),

  category: z.enum([
    "politics",
    "technology",
    "science",
    "philosophy",
    "economics",
    "social",
    "entertainment",
    "sports",
    "other",
  ]),

  format: z.enum(["timed", "async"]),

  stakeAmount: z
    .number()
    .min(
      DEBATE_TIMING.MIN_STAKE_AMOUNT,
      `Minimum stake is ${DEBATE_TIMING.MIN_STAKE_AMOUNT} USDC`
    )
    .max(
      DEBATE_TIMING.MAX_STAKE_AMOUNT,
      `Maximum stake is ${DEBATE_TIMING.MAX_STAKE_AMOUNT} USDC`
    ),

  // For timed debates
  duration: z
    .number()
    .min(
      DEBATE_TIMING.LIVE_DEBATE_MIN_DURATION,
      `Minimum duration is ${DEBATE_TIMING.LIVE_DEBATE_MIN_DURATION} minutes`
    )
    .max(
      DEBATE_TIMING.LIVE_DEBATE_MAX_DURATION,
      `Maximum duration is ${DEBATE_TIMING.LIVE_DEBATE_MAX_DURATION} minutes`
    )
    .optional(),

  // For async debates
  roundDuration: z
    .number()
    .min(12, "Minimum round duration is 12 hours")
    .max(72, "Maximum round duration is 72 hours")
    .optional(),

  maxRounds: z
    .number()
    .min(3, "Minimum 3 rounds")
    .max(10, "Maximum 10 rounds")
    .optional(),

  votingDuration: z
    .number()
    .min(24, "Minimum voting duration is 24 hours")
    .max(168, "Maximum voting duration is 168 hours (7 days)")
    .default(DEBATE_TIMING.DEFAULT_VOTING_DURATION),
});

export type CreateDebateFormData = z.infer<typeof createDebateSchema>;

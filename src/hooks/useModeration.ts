/**
 * Moderation Hook
 * React Query hooks for content moderation
 */

import { useMutation } from "@tanstack/react-query";
import type { ModerationResult, ViolationType } from "@/lib/ai/moderator/types";

interface CheckContentParams {
  contentId: string;
  userId: string;
  content: string;
  debateTopic?: string;
  previousContent?: string[];
  userHistory?: {
    warningCount: number;
    violationTypes: string[];
    recentViolations: number;
  };
}

interface FlagContentParams {
  contentId: string;
  reportedBy: string;
  reason: ViolationType;
  description?: string;
}

interface SubmitAppealParams {
  userId: string;
  moderationResultId: string;
  reason: string;
}

export function useModeration() {
  const mutation = useMutation({
    mutationFn: async (
      params: CheckContentParams
    ): Promise<ModerationResult> => {
      const response = await fetch("/api/moderation/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to moderate content");
      }

      return response.json();
    },
  });

  return {
    checkContent: mutation.mutate,
    checkContentAsync: mutation.mutateAsync,
    isChecking: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

export function useFlagContent() {
  const mutation = useMutation({
    mutationFn: async (params: FlagContentParams) => {
      const response = await fetch("/api/moderation/flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to flag content");
      }

      return response.json();
    },
  });

  return {
    flagContent: mutation.mutate,
    flagContentAsync: mutation.mutateAsync,
    isFlagging: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

export function useSubmitAppeal() {
  const mutation = useMutation({
    mutationFn: async (params: SubmitAppealParams) => {
      const response = await fetch("/api/moderation/appeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit appeal");
      }

      return response.json();
    },
  });

  return {
    submitAppeal: mutation.mutate,
    submitAppealAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

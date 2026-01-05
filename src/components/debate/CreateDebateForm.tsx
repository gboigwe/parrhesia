"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDebateSchema, type CreateDebateFormData } from "@/lib/schemas/debate";
import { DEBATE_TIMING } from "@/lib/debate/constants";

const CATEGORIES = [
  { id: "politics", label: "Politics", emoji: "🏛️" },
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "philosophy", label: "Philosophy", emoji: "🤔" },
  { id: "economics", label: "Economics", emoji: "💰" },
  { id: "social", label: "Social Issues", emoji: "👥" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "other", label: "Other", emoji: "📌" },
] as const;

export function CreateDebateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<CreateDebateFormData>>({
    title: "",
    description: "",
    category: "politics",
    format: "async",
    stakeAmount: DEBATE_TIMING.MIN_STAKE_AMOUNT,
    votingDuration: DEBATE_TIMING.DEFAULT_VOTING_DURATION,
    roundDuration: 24,
    maxRounds: 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStep, setTxStep] = useState<
    "idle" | "approving" | "creating" | "confirming"
  >("idle");

  const handleChange = (
    field: keyof CreateDebateFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createDebateSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      setTxStep("approving");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTxStep("creating");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTxStep("confirming");
      const response = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error("Failed to create debate");
      }

      const { debateId } = await response.json();
      router.push(`/debates/${debateId}`);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create debate",
      });
      setTxStep("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card variant="elevated">
        <CardContent className="p-6 space-y-6">
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.submit}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Debate Title *
            </label>
            <Input
              placeholder="Is Bitcoin the future of money?"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.title?.length || 0}/200
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <Textarea
              placeholder="Describe your debate topic and position..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.description?.length || 0}/2000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Debate Format *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange("format", "timed")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.format === "timed"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                }`}
              >
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  Live Debate
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Real-time debate session
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange("format", "async")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.format === "async"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                }`}
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  Async Debate
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Extended response time
                </div>
              </button>
            </div>
          </div>

          {formData.format === "async" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Round Duration (hours)
                  </label>
                  <Input
                    type="number"
                    value={formData.roundDuration}
                    onChange={(e) =>
                      handleChange("roundDuration", Number(e.target.value))
                    }
                    min={12}
                    max={72}
                  />
                  {errors.roundDuration && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.roundDuration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Rounds
                  </label>
                  <Input
                    type="number"
                    value={formData.maxRounds}
                    onChange={(e) =>
                      handleChange("maxRounds", Number(e.target.value))
                    }
                    min={3}
                    max={10}
                  />
                  {errors.maxRounds && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.maxRounds}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {formData.format === "timed" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  handleChange("duration", Number(e.target.value))
                }
                min={DEBATE_TIMING.LIVE_DEBATE_MIN_DURATION}
                max={DEBATE_TIMING.LIVE_DEBATE_MAX_DURATION}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.duration}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stake Amount (USDC) *
            </label>
            <Input
              type="number"
              value={formData.stakeAmount}
              onChange={(e) =>
                handleChange("stakeAmount", Number(e.target.value))
              }
              min={DEBATE_TIMING.MIN_STAKE_AMOUNT}
              max={DEBATE_TIMING.MAX_STAKE_AMOUNT}
              step={1}
            />
            {errors.stakeAmount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.stakeAmount}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Min: {DEBATE_TIMING.MIN_STAKE_AMOUNT} USDC • Max:{" "}
              {DEBATE_TIMING.MAX_STAKE_AMOUNT} USDC
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Voting Duration (hours)
            </label>
            <Input
              type="number"
              value={formData.votingDuration}
              onChange={(e) =>
                handleChange("votingDuration", Number(e.target.value))
              }
              min={24}
              max={168}
            />
            {errors.votingDuration && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.votingDuration}
              </p>
            )}
          </div>

          {txStep !== "idle" && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {txStep === "approving" && "Approving USDC..."}
                    {txStep === "creating" && "Creating debate on-chain..."}
                    {txStep === "confirming" && "Confirming transaction..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Debate..." : "Create Debate"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DEBATE_CATEGORIES, DEBATE_CONFIG, ERROR_MESSAGES } from "@/lib/constants";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { USDCBalance, useUSDCBalance } from "@/components/web3/USDCBalance";

interface CreateDebateFormProps {
  onSuccess?: (debateId: string) => void;
}

export function CreateDebateForm({ onSuccess }: CreateDebateFormProps) {
  return (
    <AuthGuard requireAuth requireBasename>
      <CreateDebateFormContent onSuccess={onSuccess} />
    </AuthGuard>
  );
}

function CreateDebateFormContent({ onSuccess }: CreateDebateFormProps) {
  const { user } = useAuth();
  const { balance: usdcBalance, isLoading: balanceLoading } = useUSDCBalance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "crypto",
    format: "live" as "live" | "async",
    stakeAmount: DEBATE_CONFIG.MIN_STAKE_USDC,
    duration: 60, // minutes for live, days for async
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (formData.title.length < 10) {
        throw new Error("Title must be at least 10 characters");
      }

      if (formData.description.length < 50) {
        throw new Error("Description must be at least 50 characters");
      }

      if (
        formData.stakeAmount < DEBATE_CONFIG.MIN_STAKE_USDC ||
        formData.stakeAmount > DEBATE_CONFIG.MAX_STAKE_USDC
      ) {
        throw new Error(
          `Stake must be between ${DEBATE_CONFIG.MIN_STAKE_USDC} and ${DEBATE_CONFIG.MAX_STAKE_USDC} USDC`
        );
      }

      // Check sufficient balance
      if (formData.stakeAmount > usdcBalance) {
        throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
      }

      // Create debate via API
      const response = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          creatorId: user?.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create debate");
      }

      const { debateId } = await response.json();

      // Success
      if (onSuccess) {
        onSuccess(debateId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create debate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Debate Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Is Bitcoin the future of money?"
          required
          minLength={10}
          maxLength={200}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formData.title.length}/200</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder="Describe the debate topic, your position, and what you hope to discuss..."
          rows={4}
          required
          minLength={50}
          maxLength={1000}
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formData.description.length}/1000</p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          {DEBATE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Debate Format *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, format: "live" })}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              formData.format === "live"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            }`}
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">⚡ Live Debate</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Real-time debate with scheduled start
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, format: "async" })}
            className={`p-4 border-2 rounded-lg text-left transition-colors ${
              formData.format === "async"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
            }`}
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">📝 Async Debate</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Take turns with time between rounds
            </div>
          </button>
        </div>
      </div>

      {/* Stake Amount */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="stake" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stake Amount (USDC) *
          </label>
          <USDCBalance showLabel={false} />
        </div>
        <input
          type="number"
          id="stake"
          value={formData.stakeAmount}
          onChange={(e) => setFormData({ ...formData, stakeAmount: Number(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          min={DEBATE_CONFIG.MIN_STAKE_USDC}
          max={DEBATE_CONFIG.MAX_STAKE_USDC}
          step="1"
          required
          disabled={balanceLoading}
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Min: {DEBATE_CONFIG.MIN_STAKE_USDC} USDC • Max: {DEBATE_CONFIG.MAX_STAKE_USDC} USDC
          </p>
          {formData.stakeAmount > usdcBalance && (
            <p className="text-sm text-red-600 dark:text-red-400">Insufficient balance</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isSubmitting ? "Creating Debate..." : "Create Debate & Stake"}
      </button>
    </form>
  );
}

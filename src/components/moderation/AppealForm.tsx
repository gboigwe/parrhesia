/**
 * Appeal Form Component
 * Form for submitting moderation appeals
 */

"use client";

import { useState } from "react";
import { useSubmitAppeal } from "@/hooks/useModeration";
import { APPEAL_REASONS } from "@/lib/ai/moderator/constants";

interface AppealFormProps {
  moderationResultId: string;
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AppealForm({
  moderationResultId,
  userId,
  onSuccess,
  onCancel,
}: AppealFormProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const { submitAppeal, isSubmitting, isSuccess, error } = useSubmitAppeal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reason = selectedReason === "other" ? customReason : selectedReason;

    if (!reason) return;

    submitAppeal(
      {
        userId,
        moderationResultId,
        reason,
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="font-bold text-green-800 mb-2">Appeal Submitted</h3>
        <p className="text-sm text-gray-700">
          Your appeal has been submitted and will be reviewed shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-bold mb-2">Appeal Moderation Decision</h3>
        <p className="text-sm text-gray-600 mb-4">
          If you believe this content was incorrectly flagged, please select a reason below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Reason for Appeal
        </label>
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className="w-full border rounded-lg p-2"
          required
        >
          <option value="">Select a reason...</option>
          {APPEAL_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
          <option value="other">Other (please specify)</option>
        </select>
      </div>

      {selectedReason === "other" && (
        <div>
          <label className="block text-sm font-semibold mb-2">
            Explain your reason
          </label>
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows={4}
            placeholder="Please provide details about why this decision should be overturned..."
            required
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded p-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Failed to submit appeal"}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !selectedReason}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Appeal"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

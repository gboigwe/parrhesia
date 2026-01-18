/**
 * Flag Button Component
 * Button for users to flag inappropriate content
 */

"use client";

import { useState } from "react";
import { useFlagContent } from "@/hooks/useModeration";
import { VIOLATION_TYPES } from "@/lib/ai/moderator/constants";
import type { ViolationType } from "@/lib/ai/moderator/types";

interface FlagButtonProps {
  contentId: string;
  reportedBy: string;
}

export function FlagButton({ contentId, reportedBy }: FlagButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ViolationType | "">("");
  const [description, setDescription] = useState("");

  const { flagContent, isFlagging, isSuccess } = useFlagContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) return;

    flagContent(
      {
        contentId,
        reportedBy,
        reason: selectedReason,
        description,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            setIsOpen(false);
            setSelectedReason("");
            setDescription("");
          }, 2000);
        },
      }
    );
  };

  if (isSuccess && isOpen) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-sm">
        <p className="text-green-800 font-semibold">✓ Content flagged for review</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1"
      >
        <span>🚩</span>
        <span>Flag</span>
      </button>

      {isOpen && (
        <div className="mt-2 border rounded-lg p-4 bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-2">Report Content</h4>
              <p className="text-xs text-gray-600 mb-3">
                Help us maintain a civil debate environment
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Violation Type
              </label>
              <select
                value={selectedReason}
                onChange={(e) =>
                  setSelectedReason(e.target.value as ViolationType)
                }
                className="w-full text-sm border rounded p-2"
                required
              >
                <option value="">Select reason...</option>
                <option value={VIOLATION_TYPES.PROFANITY}>
                  Inappropriate Language
                </option>
                <option value={VIOLATION_TYPES.HATE_SPEECH}>
                  Hate Speech
                </option>
                <option value={VIOLATION_TYPES.PERSONAL_ATTACK}>
                  Personal Attack
                </option>
                <option value={VIOLATION_TYPES.SPAM}>Spam</option>
                <option value={VIOLATION_TYPES.OFF_TOPIC}>Off Topic</option>
                <option value={VIOLATION_TYPES.THREATENING}>
                  Threatening
                </option>
                <option value={VIOLATION_TYPES.HARASSMENT}>
                  Harassment
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm border rounded p-2"
                rows={2}
                placeholder="Provide more context..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isFlagging || !selectedReason}
                className="flex-1 bg-red-600 text-white text-sm px-3 py-2 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isFlagging ? "Submitting..." : "Submit Report"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

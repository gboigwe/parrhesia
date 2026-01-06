import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VOTING_CRITERIA } from "@/lib/voting/constants";

interface VoteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  winner: "creator" | "challenger";
  winnerName: string;
  scores: Record<string, number>;
  weightedTotal: number;
  feedback?: string;
  isSubmitting?: boolean;
}

export function VoteConfirmationModal({
  open,
  onClose,
  onConfirm,
  winner,
  winnerName,
  scores,
  weightedTotal,
  feedback,
  isSubmitting = false,
}: VoteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Your Vote</DialogTitle>
          <DialogDescription>
            Please review your vote before submitting. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Winner */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Vote:
            </p>
            <div
              className={`p-4 rounded-lg border-2 ${
                winner === "creator"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-red-500 bg-red-50 dark:bg-red-950"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    winner === "creator" ? "bg-blue-600" : "bg-red-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {winnerName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {winner === "creator" ? "Proposition" : "Opposition"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Criteria Scores:
            </p>
            <div className="space-y-2">
              {VOTING_CRITERIA.map((criterion) => {
                const score = scores[criterion.key];
                return (
                  <div
                    key={criterion.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        {criterion.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {criterion.weight}%
                      </Badge>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {score}/10
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weighted Total */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                Weighted Total Score:
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {weightedTotal.toFixed(1)}/10
              </span>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Feedback:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {feedback}
              </p>
            </div>
          )}

          {/* Warning */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your vote is final and cannot be changed</li>
                  <li>Votes are recorded on-chain for transparency</li>
                  <li>Your vote will be public after voting ends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Review Again
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm & Submit Vote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

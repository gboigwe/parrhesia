import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VOTING_CRITERIA } from "@/lib/voting/constants";

interface VoteSummaryPanelProps {
  scores: Record<string, number>;
  winner: "creator" | "challenger";
  creatorName: string;
  challengerName: string;
}

export function VoteSummaryPanel({
  scores,
  winner,
  creatorName,
  challengerName,
}: VoteSummaryPanelProps) {
  // Calculate weighted total score
  const calculateWeightedScore = (): number => {
    let totalScore = 0;
    VOTING_CRITERIA.forEach((criterion) => {
      const score = scores[criterion.key] || 0;
      const weightedScore = (score * criterion.weight) / 100;
      totalScore += weightedScore;
    });
    return Number(totalScore.toFixed(2));
  };

  const totalScore = calculateWeightedScore();

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-blue-600 dark:text-blue-400";
    if (score >= 4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Vote Summary
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your scores will be weighted according to criteria importance
          </p>
        </div>

        {/* Winner Selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Your Vote Goes To:
          </p>
          <div
            className={`p-4 rounded-lg border-2 ${
              winner === "creator"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                winner === "creator" ? "bg-blue-600" : "bg-red-600"
              }`}>
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
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {winner === "creator" ? creatorName : challengerName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {winner === "creator" ? "Proposition" : "Opposition"}
                </p>
              </div>
              <svg
                className={`w-8 h-8 ${
                  winner === "creator"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-red-600 dark:text-red-400"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scores Breakdown */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Criteria Scores:
          </p>
          <div className="space-y-2">
            {VOTING_CRITERIA.map((criterion) => {
              const score = scores[criterion.key] || 0;
              return (
                <div
                  key={criterion.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {criterion.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {criterion.weight}%
                    </Badge>
                  </div>
                  <span className={`font-semibold ${getScoreColor(score)}`}>
                    {score.toFixed(0)}/10
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weighted Total */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              Weighted Total Score:
            </span>
            <span className={`text-2xl font-bold ${getScoreColor(totalScore)}`}>
              {totalScore.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Out of 10.0 (weighted by criteria importance)
          </p>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💡 Your vote is final and cannot be changed</p>
          <p>🔒 Votes are recorded on-chain for transparency</p>
        </div>
      </CardContent>
    </Card>
  );
}

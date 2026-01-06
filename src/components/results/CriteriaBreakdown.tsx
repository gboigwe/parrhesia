"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VOTING_CRITERIA } from "@/lib/voting/constants";

interface Vote {
  winnerId: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
}

interface CriteriaBreakdownProps {
  votes: Vote[];
  creatorId: string;
  challengerId: string;
  creatorName: string;
  challengerName: string;
}

export function CriteriaBreakdown({
  votes,
  creatorId,
  challengerId,
  creatorName,
  challengerName,
}: CriteriaBreakdownProps) {
  const creatorVotes = votes.filter((v) => v.winnerId === creatorId);
  const challengerVotes = votes.filter((v) => v.winnerId === challengerId);

  const calculateAverage = (votes: Vote[], criterionKey: string): number => {
    if (votes.length === 0) return 0;
    const sum = votes.reduce(
      (acc, vote) => acc + (vote[criterionKey as keyof Vote] as number),
      0
    );
    return sum / votes.length;
  };

  const criteriaScores = VOTING_CRITERIA.map((criterion) => {
    const creatorAvg = calculateAverage(creatorVotes, criterion.key);
    const challengerAvg = calculateAverage(challengerVotes, criterion.key);

    return {
      ...criterion,
      creatorAvg,
      challengerAvg,
    };
  });

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-blue-600 dark:text-blue-400";
    if (score >= 4) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBarColor = (score: number): string => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criteria Breakdown</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Average scores across all voting criteria
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {criteriaScores.map((criterion) => (
            <div key={criterion.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {criterion.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({criterion.weight}%)
                  </span>
                </div>
              </div>

              {/* Creator Score */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {creatorName}
                  </span>
                  <span
                    className={`text-xs font-semibold ${getScoreColor(
                      criterion.creatorAvg
                    )}`}
                  >
                    {criterion.creatorAvg > 0
                      ? criterion.creatorAvg.toFixed(2)
                      : "N/A"}{" "}
                    / 10
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      criterion.creatorAvg > 0 ? getBarColor(criterion.creatorAvg) : ""
                    }`}
                    style={{
                      width: `${criterion.creatorAvg > 0 ? (criterion.creatorAvg / 10) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Challenger Score */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {challengerName}
                  </span>
                  <span
                    className={`text-xs font-semibold ${getScoreColor(
                      criterion.challengerAvg
                    )}`}
                  >
                    {criterion.challengerAvg > 0
                      ? criterion.challengerAvg.toFixed(2)
                      : "N/A"}{" "}
                    / 10
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      criterion.challengerAvg > 0
                        ? getBarColor(criterion.challengerAvg)
                        : ""
                    }`}
                    style={{
                      width: `${criterion.challengerAvg > 0 ? (criterion.challengerAvg / 10) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Criteria Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Scoring Criteria
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VOTING_CRITERIA.map((criterion) => (
              <div key={criterion.key} className="text-xs">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {criterion.name} ({criterion.weight}%)
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

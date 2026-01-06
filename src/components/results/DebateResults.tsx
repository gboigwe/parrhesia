"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VOTING_CRITERIA } from "@/lib/voting/constants";

interface Vote {
  id: string;
  winnerId: string;
  totalScore: string;
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
  userId: string;
  feedback?: string;
}

interface Participant {
  id: string;
  basename: string;
  address: string;
}

interface DebateResultsProps {
  votes: Vote[];
  creator: Participant;
  challenger: Participant;
  winnerId: string | null;
  isTie: boolean;
}

export function DebateResults({
  votes,
  creator,
  challenger,
  winnerId,
  isTie,
}: DebateResultsProps) {
  const creatorVotes = votes.filter((v) => v.winnerId === creator.id);
  const challengerVotes = votes.filter((v) => v.winnerId === challenger.id);
  const totalVotes = votes.length;

  const creatorPercentage =
    totalVotes > 0 ? (creatorVotes.length / totalVotes) * 100 : 0;
  const challengerPercentage =
    totalVotes > 0 ? (challengerVotes.length / totalVotes) * 100 : 0;

  const creatorAvgScore =
    creatorVotes.length > 0
      ? creatorVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
        creatorVotes.length
      : 0;

  const challengerAvgScore =
    challengerVotes.length > 0
      ? challengerVotes.reduce((sum, v) => sum + parseFloat(v.totalScore), 0) /
        challengerVotes.length
      : 0;

  const winner = winnerId === creator.id ? creator : winnerId === challenger.id ? challenger : null;

  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      <Card className="border-2 border-blue-500 dark:border-blue-400">
        <CardContent className="p-6">
          <div className="text-center">
            {isTie ? (
              <>
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  It's a Tie!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Both debaters performed equally well
                </p>
              </>
            ) : winner ? (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {winner.basename} Wins!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Congratulations on a well-argued debate
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Results Pending
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Not enough votes to determine a winner
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vote Count Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Votes
              </span>
              <Badge variant="secondary">{totalVotes}</Badge>
            </div>

            {/* Creator Votes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {creator.basename}
                  </span>
                  {winnerId === creator.id && !isTie && (
                    <Badge variant="default" className="bg-green-600">
                      Winner
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {creatorVotes.length} votes ({creatorPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${creatorPercentage}%` }}
                />
              </div>
              {creatorVotes.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Avg Score: {creatorAvgScore.toFixed(2)}/10
                </p>
              )}
            </div>

            {/* Challenger Votes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {challenger.basename}
                  </span>
                  {winnerId === challenger.id && !isTie && (
                    <Badge variant="default" className="bg-green-600">
                      Winner
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {challengerVotes.length} votes ({challengerPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-purple-600 dark:bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${challengerPercentage}%` }}
                />
              </div>
              {challengerVotes.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Avg Score: {challengerAvgScore.toFixed(2)}/10
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

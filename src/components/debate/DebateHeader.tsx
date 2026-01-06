import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "./CategoryBadge";
import { DebateStatus } from "./DebateStatus";
import { StakeDisplay } from "./StakeDisplay";

interface DebateHeaderProps {
  debate: {
    id: string;
    topic: string;
    resolution: string;
    category: string;
    status: string;
    stakeAmount: string;
    prizePool?: string;
    format: string;
    createdAt: Date;
    startTime?: Date | null;
    endTime?: Date | null;
    votingEndsAt?: Date | null;
    creator: {
      id: string;
      basename: string;
    };
    challenger?: {
      id: string;
      basename: string;
    } | null;
  };
}

export function DebateHeader({ debate }: DebateHeaderProps) {
  const prizePool = debate.prizePool || (parseFloat(debate.stakeAmount) * 2).toString();

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Status & Category Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <DebateStatus status={debate.status} />
            <CategoryBadge category={debate.category} />
          </div>
          <Badge variant="outline" className="text-xs">
            {debate.format === "timed" ? "⚡ Live" : "📝 Async"}
          </Badge>
        </div>

        {/* Topic */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {debate.topic}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {debate.resolution}
          </p>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* Creator (Pro) */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Proposition
              </p>
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {debate.creator.basename}
              </p>
            </div>
          </div>

          {/* VS */}
          <div className="px-4 py-2 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              VS
            </span>
          </div>

          {/* Challenger (Con) */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Opposition
              </p>
              {debate.challenger ? (
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {debate.challenger.basename}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Awaiting opponent
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              {debate.challenger ? (
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
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
              ) : (
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Stakes & Prize Pool */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Stake Per Side
            </p>
            <StakeDisplay amount={debate.stakeAmount} size="lg" />
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Prize Pool
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${prizePool} <span className="text-sm font-normal">USDC</span>
            </p>
          </div>
        </div>

        {/* Timestamps */}
        {(debate.startTime || debate.endTime || debate.votingEndsAt) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {debate.startTime && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Started: {new Date(debate.startTime).toLocaleDateString()}
                </span>
              </div>
            )}
            {debate.endTime && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Ends: {new Date(debate.endTime).toLocaleDateString()}
                </span>
              </div>
            )}
            {debate.votingEndsAt && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Voting ends: {new Date(debate.votingEndsAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

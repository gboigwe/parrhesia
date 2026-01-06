import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareDebate } from "./ShareDebate";

interface DebateInfoSidebarProps {
  debate: {
    id: string;
    topic: string;
    status: string;
    format: string;
    stakeAmount: string;
    prizePool?: string;
    createdAt: Date;
    startTime?: Date | null;
    endTime?: Date | null;
    creator: {
      id: string;
      basename: string;
    };
    challenger?: {
      id: string;
      basename: string;
    } | null;
  };
  onJoinDebate?: () => void;
  canJoin?: boolean;
  isJoining?: boolean;
}

export function DebateInfoSidebar({
  debate,
  onJoinDebate,
  canJoin = false,
  isJoining = false,
}: DebateInfoSidebarProps) {
  const prizePool = debate.prizePool || (parseFloat(debate.stakeAmount) * 2).toString();

  return (
    <div className="space-y-4">
      {/* Debate Info Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Debate Info
          </h3>

          {/* Format */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Format
            </p>
            <Badge variant="outline">
              {debate.format === "timed" ? "⚡ Live Debate" : "📝 Async Debate"}
            </Badge>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Status
            </p>
            <Badge
              variant={
                debate.status === "active"
                  ? "default"
                  : debate.status === "pending"
                  ? "outline"
                  : "secondary"
              }
            >
              {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
            </Badge>
          </div>

          {/* Stake */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Stake Required
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${debate.stakeAmount} <span className="text-sm font-normal">USDC</span>
            </p>
          </div>

          {/* Prize Pool */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Prize Pool
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              ${prizePool} <span className="text-sm font-normal">USDC</span>
            </p>
          </div>

          {/* Created Date */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Created
            </p>
            <p className="text-sm text-gray-900 dark:text-white">
              {new Date(debate.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Start Time */}
          {debate.startTime && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Started
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(debate.startTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {/* End Time */}
          {debate.endTime && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Ends
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(debate.endTime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Join Button */}
      {canJoin && onJoinDebate && (
        <Button
          onClick={onJoinDebate}
          disabled={isJoining}
          className="w-full"
          variant="primary"
          size="lg"
        >
          {isJoining ? "Joining..." : `Join Debate (${debate.stakeAmount} USDC)`}
        </Button>
      )}

      {/* Participants Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Participants
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Proposition
              </p>
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {debate.creator.basename}
              </p>
            </div>
          </div>

          {/* Challenger */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              {debate.challenger ? (
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
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
                  className="w-5 h-5 text-gray-400"
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
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Opposition
              </p>
              {debate.challenger ? (
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {debate.challenger.basename}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Awaiting opponent
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Share
          </h3>
          <ShareDebate debateId={debate.id} topic={debate.topic} />
        </CardContent>
      </Card>

      {/* Rules Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Debate Rules
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Arguments must be 50-500 words</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Cite credible sources when possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Maintain respectful discourse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Address opponent's points directly</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

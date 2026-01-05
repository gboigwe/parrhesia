import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  basename: string;
  avatar?: string;
  reputation: number;
  wins: number;
  losses: number;
  totalDebates: number;
}

interface ParticipantInfoProps {
  participant: Participant;
  role: "creator" | "challenger";
  isWinner?: boolean;
  className?: string;
}

export function ParticipantInfo({
  participant,
  role,
  isWinner = false,
  className,
}: ParticipantInfoProps) {
  const winRate = participant.totalDebates > 0
    ? ((participant.wins / participant.totalDebates) * 100).toFixed(1)
    : "0.0";

  const roleConfig = {
    creator: {
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      badgeVariant: "primary" as const,
      badgeLabel: "Creator",
    },
    challenger: {
      bgColor: "bg-purple-50 dark:bg-purple-950",
      borderColor: "border-purple-200 dark:border-purple-800",
      badgeVariant: "secondary" as const,
      badgeLabel: "Challenger",
    },
  };

  const config = roleConfig[role];

  return (
    <Card
      variant="bordered"
      className={cn(
        config.bgColor,
        config.borderColor,
        isWinner && "ring-2 ring-yellow-400 dark:ring-yellow-600",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={participant.avatar}
              alt={participant.basename}
              fallback={participant.basename[0].toUpperCase()}
              size="lg"
            />
            {isWinner && (
              <div className="absolute -top-1 -right-1 text-2xl">
                <Æ
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                {participant.basename}
              </h3>
              <Badge variant={config.badgeVariant} size="sm">
                {config.badgeLabel}
              </Badge>
              {isWinner && (
                <Badge variant="success" size="sm">
                  Winner
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Reputation</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {participant.reputation}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Win Rate</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {winRate}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Wins</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {participant.wins}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Debates</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {participant.totalDebates}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

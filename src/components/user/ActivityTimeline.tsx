import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type ActivityType =
  | "debate_created"
  | "debate_joined"
  | "debate_won"
  | "debate_lost"
  | "debate_draw"
  | "vote_cast"
  | "badge_earned"
  | "reputation_gained"
  | "reputation_lost"
  | "follow"
  | "followed";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: {
    debateId?: string;
    debateTitle?: string;
    amount?: number;
    badgeName?: string;
    userId?: string;
    username?: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
  maxItems?: number;
  showAll?: boolean;
  className?: string;
}

const activityConfig: Record<
  ActivityType,
  { icon: string; color: string; bg: string }
> = {
  debate_created: {
    icon: "(",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  debate_joined: {
    icon: ">",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
  debate_won: {
    icon: "<Æ",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
  },
  debate_lost: {
    icon: "=É",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
  },
  debate_draw: {
    icon: ">",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
  },
  vote_cast: {
    icon: "=ó",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950",
  },
  badge_earned: {
    icon: "<–",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950",
  },
  reputation_gained: {
    icon: "",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
  },
  reputation_lost: {
    icon: "",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
  },
  follow: {
    icon: "=d",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  followed: {
    icon: "<‰",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

export function ActivityTimeline({
  activities,
  maxItems = 20,
  showAll = false,
  className,
}: ActivityTimelineProps) {
  const displayActivities = showAll
    ? activities
    : activities.slice(0, maxItems);

  return (
    <Card variant="elevated" className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Badge variant="outline">{activities.length} events</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No recent activity. Start debating!
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            {/* Activities */}
            <div className="space-y-4">
              {displayActivities.map((activity, index) => {
                const config = activityConfig[activity.type];
                const isLast = index === displayActivities.length - 1;

                return (
                  <div key={activity.id} className="relative pl-14">
                    {/* Timeline Dot */}
                    <div
                      className={cn(
                        "absolute left-4 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs",
                        config.bg,
                        "ring-4 ring-white dark:ring-gray-900"
                      )}
                    >
                      {config.icon}
                    </div>

                    {/* Activity Content */}
                    <div
                      className={cn(
                        "p-4 rounded-lg transition-colors hover:shadow-sm",
                        config.bg
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={cn("font-semibold text-sm", config.color)}
                        >
                          {activity.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>

                      {activity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {activity.description}
                        </p>
                      )}

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="flex items-center gap-3 text-xs">
                          {activity.metadata.debateId &&
                            activity.metadata.debateTitle && (
                              <Link
                                href={`/debates/${activity.metadata.debateId}`}
                                className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                              >
                                {activity.metadata.debateTitle}
                              </Link>
                            )}
                          {activity.metadata.amount !== undefined && (
                            <Badge
                              variant={
                                activity.metadata.amount > 0
                                  ? "success"
                                  : "destructive"
                              }
                              size="sm"
                            >
                              {activity.metadata.amount > 0 ? "+" : ""}
                              {activity.metadata.amount}
                            </Badge>
                          )}
                          {activity.metadata.badgeName && (
                            <Badge variant="primary" size="sm">
                              {activity.metadata.badgeName}
                            </Badge>
                          )}
                          {activity.metadata.username && (
                            <Link
                              href={`/profile/${activity.metadata.userId}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              @{activity.metadata.username}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!showAll && activities.length > maxItems && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all {activities.length} activities ’
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

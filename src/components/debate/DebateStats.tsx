import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DebateStatsProps {
  totalDebates: number;
  activeDebates: number;
  totalPrizePool: number;
  totalVoters: number;
  className?: string;
}

export function DebateStats({
  totalDebates,
  activeDebates,
  totalPrizePool,
  totalVoters,
  className,
}: DebateStatsProps) {
  const stats = [
    {
      label: "Total Debates",
      value: totalDebates.toLocaleString(),
      icon: "”",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Active Now",
      value: activeDebates.toLocaleString(),
      icon: "=%",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
    {
      label: "Total Prize Pool",
      value: `$${totalPrizePool.toLocaleString()}`,
      icon: "=°",
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      label: "Community Voters",
      value: totalVoters.toLocaleString(),
      icon: "=e",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat) => (
        <Card key={stat.label} variant="elevated">
          <CardContent className={cn("p-6", stat.bg)}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{stat.icon}</span>
              <span className={cn("text-3xl font-bold", stat.color)}>
                {stat.value}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

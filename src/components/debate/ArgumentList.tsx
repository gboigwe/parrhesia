import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArgumentCard } from "./ArgumentCard";

interface Argument {
  id: string;
  content: string;
  wordCount: number;
  roundNumber: number;
  createdAt: Date;
  user: {
    id: string;
    basename: string;
  };
  sources?: string[];
}

interface ArgumentListProps {
  arguments: Argument[];
  creatorId: string;
  challengerId?: string | null;
  emptyMessage?: string;
}

export function ArgumentList({
  arguments: args,
  creatorId,
  challengerId,
  emptyMessage = "No arguments yet. Be the first to make your case!",
}: ArgumentListProps) {
  if (args.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Arguments Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group arguments by round
  const argumentsByRound = args.reduce((acc, arg) => {
    const round = arg.roundNumber;
    if (!acc[round]) {
      acc[round] = { pro: [], con: [] };
    }

    if (arg.user.id === creatorId) {
      acc[round].pro.push(arg);
    } else if (arg.user.id === challengerId) {
      acc[round].con.push(arg);
    }

    return acc;
  }, {} as Record<number, { pro: Argument[]; con: Argument[] }>);

  const rounds = Object.keys(argumentsByRound)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {rounds.map((roundNum) => {
        const { pro, con } = argumentsByRound[roundNum];

        return (
          <div key={roundNum} className="space-y-4">
            {/* Round Header */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm font-semibold px-4 py-1">
                Round {roundNum}
              </Badge>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Arguments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pro (Creator) Side */}
              <div className="space-y-3">
                {pro.length > 0 ? (
                  pro.map((arg) => (
                    <ArgumentCard
                      key={arg.id}
                      argument={arg}
                      side="pro"
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    Awaiting proposition argument
                  </div>
                )}
              </div>

              {/* Con (Challenger) Side */}
              <div className="space-y-3">
                {con.length > 0 ? (
                  con.map((arg) => (
                    <ArgumentCard
                      key={arg.id}
                      argument={arg}
                      side="con"
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    Awaiting opposition argument
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Argument Count Summary */}
      <div className="flex items-center justify-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {args.filter((a) => a.user.id === creatorId).length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Pro Arguments
          </p>
        </div>
        <div className="w-px h-10 bg-gray-300 dark:bg-gray-600" />
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {challengerId ? args.filter((a) => a.user.id === challengerId).length : 0}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Con Arguments
          </p>
        </div>
        <div className="w-px h-10 bg-gray-300 dark:bg-gray-600" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {rounds.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Rounds
          </p>
        </div>
      </div>
    </div>
  );
}

import { ArgumentCard } from "./ArgumentCard";

interface Argument {
  id: string;
  content: string;
  wordCount: number;
  roundNumber: number;
  postedAt: Date;
  userId: string;
  user: {
    basename: string;
    debaterReputation: string;
  };
}

interface DebateTimelineProps {
  arguments: Argument[];
  creatorId: string;
  challengerId?: string | null;
}

export function DebateTimeline({ arguments: args, creatorId, challengerId }: DebateTimelineProps) {
  // Group arguments by round
  const argumentsByRound = args.reduce((acc, arg) => {
    if (!acc[arg.roundNumber]) {
      acc[arg.roundNumber] = [];
    }
    acc[arg.roundNumber].push(arg);
    return acc;
  }, {} as Record<number, Argument[]>);

  const rounds = Object.keys(argumentsByRound)
    .map(Number)
    .sort((a, b) => a - b);

  if (args.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No arguments submitted yet. Be the first to present your case!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {rounds.map((roundNum) => (
        <div key={roundNum} className="space-y-4">
          {/* Round Header */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{roundNum}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Round {roundNum}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {argumentsByRound[roundNum].length} argument
                {argumentsByRound[roundNum].length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Arguments in this round */}
          <div className="ml-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
            {argumentsByRound[roundNum]
              .sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime())
              .map((arg) => (
                <ArgumentCard
                  key={arg.id}
                  argument={arg}
                  isCreator={arg.userId === creatorId}
                  showRound={false}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

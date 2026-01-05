interface Vote {
  argumentQuality: number;
  rebuttalStrength: number;
  clarity: number;
  evidence: number;
  persuasiveness: number;
}

interface VoteBreakdownProps {
  votes: Vote[];
  title: string;
}

export function VoteBreakdown({ votes, title }: VoteBreakdownProps) {
  if (votes.length === 0) {
    return null;
  }

  const avgScores = {
    argumentQuality: votes.reduce((sum, v) => sum + v.argumentQuality, 0) / votes.length,
    rebuttalStrength: votes.reduce((sum, v) => sum + v.rebuttalStrength, 0) / votes.length,
    clarity: votes.reduce((sum, v) => sum + v.clarity, 0) / votes.length,
    evidence: votes.reduce((sum, v) => sum + v.evidence, 0) / votes.length,
    persuasiveness: votes.reduce((sum, v) => sum + v.persuasiveness, 0) / votes.length,
  };

  const criteria = [
    { key: "argumentQuality", label: "Argument Quality", color: "bg-blue-500" },
    { key: "rebuttalStrength", label: "Rebuttal Strength", color: "bg-green-500" },
    { key: "clarity", label: "Clarity", color: "bg-yellow-500" },
    { key: "evidence", label: "Evidence", color: "bg-purple-500" },
    { key: "persuasiveness", label: "Persuasiveness", color: "bg-pink-500" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h4 className="font-bold text-gray-900 dark:text-white mb-4">{title}</h4>
      <div className="space-y-4">
        {criteria.map(({ key, label, color }) => {
          const score = avgScores[key as keyof typeof avgScores];
          const percentage = (score / 10) * 100;

          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {score.toFixed(1)} / 10
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

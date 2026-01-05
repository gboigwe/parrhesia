import { VOTING_WEIGHTS } from "@/lib/constants";

interface Criteria {
  name: string;
  weight: number;
  description: string;
}

const CRITERIA: Criteria[] = [
  {
    name: "Argument Quality",
    weight: VOTING_WEIGHTS.ARGUMENT_QUALITY,
    description: "Strength and coherence of main arguments presented",
  },
  {
    name: "Rebuttal Strength",
    weight: VOTING_WEIGHTS.REBUTTAL_STRENGTH,
    description: "Effectiveness in addressing opponent's points",
  },
  {
    name: "Clarity",
    weight: VOTING_WEIGHTS.CLARITY,
    description: "Clarity of communication and structure",
  },
  {
    name: "Evidence",
    weight: VOTING_WEIGHTS.EVIDENCE,
    description: "Use of credible sources and factual support",
  },
  {
    name: "Persuasiveness",
    weight: VOTING_WEIGHTS.PERSUASIVENESS,
    description: "Overall persuasive impact and delivery",
  },
];

export function VotingCriteria() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Voting Criteria
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Rate each debater on these criteria (1-10). Your final vote is weighted automatically.
      </p>

      <div className="space-y-3">
        {CRITERIA.map((criteria) => (
          <div
            key={criteria.name}
            className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {criteria.name}
                </h4>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                  {criteria.weight}%
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {criteria.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> Consider the entire debate, not just individual arguments.
          Focus on who presented the stronger overall case.
        </p>
      </div>
    </div>
  );
}

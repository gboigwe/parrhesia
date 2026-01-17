/**
 * AI Judge Results Display
 * Shows AI-powered debate analysis and verdict
 */

"use client";

import type { AIJudgeVerdict } from "@/lib/ai/judge/types";
import { SCORING_CRITERIA } from "@/lib/ai/judge/constants";

interface AIJudgeResultsProps {
  verdict: AIJudgeVerdict;
}

export function AIJudgeResults({ verdict }: AIJudgeResultsProps) {
  const winner =
    verdict.winner === "creator"
      ? "Creator"
      : verdict.winner === "challenger"
      ? "Challenger"
      : "Tie";

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Judge Verdict</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Confidence:</span>
          <span className="font-semibold">
            {Math.round(verdict.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Winner</p>
          <p className="text-3xl font-bold text-purple-700">{winner}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ScoreCard
          title="Creator"
          analysis={verdict.creatorAnalysis}
          isWinner={verdict.winner === "creator"}
        />
        <ScoreCard
          title="Challenger"
          analysis={verdict.challengerAnalysis}
          isWinner={verdict.winner === "challenger"}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Reasoning</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{verdict.reasoning}</p>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Judged on {new Date(verdict.judgedAt).toLocaleString()}
      </div>
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  analysis: AIJudgeVerdict["creatorAnalysis"];
  isWinner: boolean;
}

function ScoreCard({ title, analysis, isWinner }: ScoreCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        isWinner ? "border-purple-500 bg-purple-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-2xl font-bold text-purple-600">
          {analysis.overallScore.toFixed(1)}
        </div>
      </div>

      <div className="space-y-2">
        <ScoreBar
          label="Argument Quality"
          score={analysis.argumentQuality}
          weight={SCORING_CRITERIA.ARGUMENT_QUALITY.weight}
        />
        <ScoreBar
          label="Rebuttal Strength"
          score={analysis.rebuttalStrength}
          weight={SCORING_CRITERIA.REBUTTAL_STRENGTH.weight}
        />
        <ScoreBar
          label="Clarity"
          score={analysis.clarity}
          weight={SCORING_CRITERIA.CLARITY.weight}
        />
        <ScoreBar
          label="Evidence"
          score={analysis.evidence}
          weight={SCORING_CRITERIA.EVIDENCE.weight}
        />
        <ScoreBar
          label="Persuasiveness"
          score={analysis.persuasiveness}
          weight={SCORING_CRITERIA.PERSUASIVENESS.weight}
        />
      </div>

      {analysis.fallaciesDetected.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-semibold text-red-600 mb-1">
            Fallacies Detected
          </p>
          <div className="flex flex-wrap gap-1">
            {analysis.fallaciesDetected.map((fallacy, i) => (
              <span
                key={i}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
              >
                {fallacy.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  weight: number;
}

function ScoreBar({ label, score, weight }: ScoreBarProps) {
  const percentage = (score / 10) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">
          {label} ({Math.round(weight * 100)}%)
        </span>
        <span className="font-semibold">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

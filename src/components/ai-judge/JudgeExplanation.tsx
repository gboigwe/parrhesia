/**
 * Judge Explanation Component
 * Detailed breakdown of AI analysis with strengths and weaknesses
 */

"use client";

import type { AIJudgeAnalysis } from "@/lib/ai/judge/types";
import { FALLACY_DESCRIPTIONS } from "@/lib/ai/judge/constants";

interface JudgeExplanationProps {
  analysis: AIJudgeAnalysis;
  side: "creator" | "challenger";
}

export function JudgeExplanation({ analysis, side }: JudgeExplanationProps) {
  const title = side === "creator" ? "Creator" : "Challenger";

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold">{title} Analysis</h3>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Overall Assessment</h4>
        <p className="text-gray-700 whitespace-pre-wrap">
          {analysis.explanation}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span>✓</span>
            <span>Strengths</span>
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
            <span>!</span>
            <span>Areas for Improvement</span>
          </h4>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {analysis.fallaciesDetected.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-red-700 mb-3">
            Logical Fallacies Detected ({analysis.fallaciesDetected.length})
          </h4>
          <div className="space-y-2">
            {analysis.fallaciesDetected.map((fallacy, i) => (
              <div
                key={i}
                className="bg-red-50 border border-red-200 p-3 rounded"
              >
                <p className="font-semibold text-red-800 capitalize">
                  {fallacy.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-gray-600">
                  {FALLACY_DESCRIPTIONS[fallacy] || "Unknown fallacy type"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.factCheckResults && analysis.factCheckResults.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Fact Check Results</h4>
          <div className="space-y-3">
            {analysis.factCheckResults.map((result, i) => (
              <FactCheckCard key={i} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FactCheckCardProps {
  result: {
    claim: string;
    verdict: "true" | "false" | "partially_true" | "unverified";
    confidence: number;
    sources: string[];
  };
}

function FactCheckCard({ result }: FactCheckCardProps) {
  const verdictColors = {
    true: "bg-green-50 border-green-200 text-green-800",
    false: "bg-red-50 border-red-200 text-red-800",
    partially_true: "bg-yellow-50 border-yellow-200 text-yellow-800",
    unverified: "bg-gray-50 border-gray-200 text-gray-800",
  };

  const verdictLabels = {
    true: "True",
    false: "False",
    partially_true: "Partially True",
    unverified: "Unverified",
  };

  return (
    <div className={`border p-3 rounded ${verdictColors[result.verdict]}`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold">{verdictLabels[result.verdict]}</p>
        <span className="text-xs">
          {Math.round(result.confidence * 100)}% confidence
        </span>
      </div>
      <p className="text-sm mb-2">{result.claim}</p>
      {result.sources.length > 0 && (
        <div className="text-xs">
          <p className="font-semibold mb-1">Sources:</p>
          <ul className="space-y-1">
            {result.sources.map((source, i) => (
              <li key={i} className="truncate">
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

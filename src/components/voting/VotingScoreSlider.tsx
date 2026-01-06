"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VotingScoreSliderProps {
  criterion: {
    key: string;
    name: string;
    weight: number;
    description: string;
    tips: string;
  };
  value: number;
  onChange: (value: number) => void;
  minScore?: number;
  maxScore?: number;
}

export function VotingScoreSlider({
  criterion,
  value,
  onChange,
  minScore = 1,
  maxScore = 10,
}: VotingScoreSliderProps) {
  const [showTips, setShowTips] = useState(false);

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Very Good";
    if (score >= 5) return "Good";
    if (score >= 3) return "Fair";
    return "Poor";
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {criterion.name}
              </h3>
              <Badge variant="outline" className="text-xs">
                {criterion.weight}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {criterion.description}
            </p>
          </div>
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm ml-4"
            type="button"
          >
            {showTips ? "Hide" : "Tips"}
          </button>
        </div>

        {/* Tips */}
        {showTips && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 {criterion.tips}
            </p>
          </div>
        )}

        {/* Slider */}
        <div className="space-y-4">
          {/* Value Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {value.toFixed(0)}
              </span>
              <span className={`text-sm font-medium ${getScoreColor(value).replace('bg-', 'text-')}`}>
                {getScoreLabel(value)}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / {maxScore}
            </span>
          </div>

          {/* Slider Input */}
          <div className="relative">
            <input
              type="range"
              min={minScore}
              max={maxScore}
              step={1}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, ${getScoreColor(value)} 0%, ${getScoreColor(value)} ${((value - minScore) / (maxScore - minScore)) * 100}%, rgb(229 231 235) ${((value - minScore) / (maxScore - minScore)) * 100}%, rgb(229 231 235) 100%)`,
              }}
            />
            {/* Score Markers */}
            <div className="flex justify-between mt-2">
              {Array.from({ length: maxScore - minScore + 1 }, (_, i) => i + minScore).map((score) => (
                <button
                  key={score}
                  onClick={() => onChange(score)}
                  className={`text-xs transition-colors ${
                    value === score
                      ? "text-gray-900 dark:text-white font-semibold"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                  type="button"
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Score Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChange(3)}
              className="px-3 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              type="button"
            >
              Poor (3)
            </button>
            <button
              onClick={() => onChange(5)}
              className="px-3 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
              type="button"
            >
              Fair (5)
            </button>
            <button
              onClick={() => onChange(7)}
              className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              type="button"
            >
              Good (7)
            </button>
            <button
              onClick={() => onChange(9)}
              className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              type="button"
            >
              Excellent (9)
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

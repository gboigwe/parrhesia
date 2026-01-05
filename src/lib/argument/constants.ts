/**
 * Argument-related constants and configuration
 */

export const ARGUMENT_TIPS = [
  "Structure your argument with a clear thesis, supporting evidence, and conclusion",
  "Cite credible sources to strengthen your position",
  "Address potential counterarguments to show depth of understanding",
  "Use clear, concise language and avoid logical fallacies",
  "Stay focused on the debate topic and avoid personal attacks",
  "Include specific examples and data to support your claims",
];

export const FORMATTING_GUIDE = {
  bold: "**text** for emphasis",
  italic: "*text* for subtle emphasis",
  quote: "> text for quoted material",
  list: "- text for bullet points",
};

export const WORD_COUNT_RECOMMENDATIONS = {
  opening: { min: 300, max: 500, description: "Establish your position clearly" },
  rebuttal: { min: 250, max: 400, description: "Address opponent's points" },
  closing: { min: 200, max: 350, description: "Summarize and reinforce" },
};

export const COMMON_FALLACIES = [
  { name: "Ad Hominem", description: "Attacking the person instead of the argument" },
  { name: "Straw Man", description: "Misrepresenting opponent's position" },
  { name: "Appeal to Authority", description: "Relying solely on authority without evidence" },
  { name: "False Dichotomy", description: "Presenting only two options when more exist" },
  { name: "Hasty Generalization", description: "Drawing broad conclusions from limited data" },
];

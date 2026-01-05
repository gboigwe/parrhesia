/**
 * Base Design System Colors
 * Matching Base L2 brand colors and OnchainKit design system
 */

export const BASE_COLORS = {
  // Primary Base Blue
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#0052FF", // Base brand blue
    600: "#0047E0",
    700: "#003CC1",
    800: "#0031A3",
    900: "#002685",
    950: "#001A5C",
  },

  // Secondary colors
  secondary: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },

  // Success (Green)
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Warning (Yellow/Amber)
  warning: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
  },

  // Error (Red)
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Gray/Neutral
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },
} as const;

/**
 * Semantic color tokens
 */
export const SEMANTIC_COLORS = {
  background: {
    light: BASE_COLORS.gray[50],
    dark: BASE_COLORS.gray[950],
  },
  foreground: {
    light: BASE_COLORS.gray[900],
    dark: BASE_COLORS.gray[50],
  },
  muted: {
    light: BASE_COLORS.gray[100],
    dark: BASE_COLORS.gray[800],
  },
  border: {
    light: BASE_COLORS.gray[200],
    dark: BASE_COLORS.gray[700],
  },
  input: {
    light: BASE_COLORS.gray[300],
    dark: BASE_COLORS.gray[700],
  },
  ring: {
    light: BASE_COLORS.primary[500],
    dark: BASE_COLORS.primary[400],
  },
} as const;

/**
 * Debate-specific colors
 */
export const DEBATE_COLORS = {
  creator: {
    light: BASE_COLORS.primary[100],
    dark: BASE_COLORS.primary[950],
    accent: BASE_COLORS.primary[500],
  },
  challenger: {
    light: "#fef3c7", // Amber 100
    dark: "#78350f", // Amber 950
    accent: "#f59e0b", // Amber 500
  },
  voter: {
    light: BASE_COLORS.secondary[100],
    dark: BASE_COLORS.secondary[950],
    accent: BASE_COLORS.secondary[500],
  },
} as const;

/**
 * Status colors
 */
export const STATUS_COLORS = {
  pending: {
    bg: BASE_COLORS.gray[100],
    text: BASE_COLORS.gray[700],
    border: BASE_COLORS.gray[300],
  },
  active: {
    bg: BASE_COLORS.primary[100],
    text: BASE_COLORS.primary[700],
    border: BASE_COLORS.primary[300],
  },
  voting: {
    bg: BASE_COLORS.secondary[100],
    text: BASE_COLORS.secondary[700],
    border: BASE_COLORS.secondary[300],
  },
  completed: {
    bg: BASE_COLORS.success[100],
    text: BASE_COLORS.success[700],
    border: BASE_COLORS.success[300],
  },
  cancelled: {
    bg: BASE_COLORS.error[100],
    text: BASE_COLORS.error[700],
    border: BASE_COLORS.error[300],
  },
} as const;

/**
 * Gradient definitions
 */
export const GRADIENTS = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-400",
  secondary: "bg-gradient-to-r from-purple-600 to-purple-400",
  success: "bg-gradient-to-r from-green-600 to-green-400",
  warning: "bg-gradient-to-r from-yellow-600 to-yellow-400",
  error: "bg-gradient-to-r from-red-600 to-red-400",
  base: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
  debate: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
} as const;

/**
 * Shadow definitions
 */
export const SHADOWS = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

/**
 * Responsive design utilities and breakpoint helpers
 */

/**
 * Breakpoint definitions (matching Tailwind CSS defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Container max widths
 */
export const CONTAINER_MAX_WIDTHS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * Spacing scale
 */
export const SPACING = {
  0: "0px",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
} as const;

/**
 * Font sizes
 */
export const FONT_SIZES = {
  xs: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1rem", // 16px
  },
  sm: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.25rem", // 20px
  },
  base: {
    fontSize: "1rem", // 16px
    lineHeight: "1.5rem", // 24px
  },
  lg: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.75rem", // 28px
  },
  xl: {
    fontSize: "1.25rem", // 20px
    lineHeight: "1.75rem", // 28px
  },
  "2xl": {
    fontSize: "1.5rem", // 24px
    lineHeight: "2rem", // 32px
  },
  "3xl": {
    fontSize: "1.875rem", // 30px
    lineHeight: "2.25rem", // 36px
  },
  "4xl": {
    fontSize: "2.25rem", // 36px
    lineHeight: "2.5rem", // 40px
  },
  "5xl": {
    fontSize: "3rem", // 48px
    lineHeight: "1",
  },
} as const;

/**
 * Border radius scale
 */
export const BORDER_RADIUS = {
  none: "0px",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

/**
 * Z-index scale
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  max: 9999,
} as const;

/**
 * Animation durations
 */
export const ANIMATION_DURATION = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const;

/**
 * Animation easing functions
 */
export const ANIMATION_EASING = {
  linear: "linear",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

/**
 * Grid columns
 */
export const GRID_COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;

/**
 * Common responsive patterns
 */
export const RESPONSIVE_PATTERNS = {
  // Stack on mobile, side-by-side on desktop
  stackToRow: "flex flex-col md:flex-row",

  // Full width on mobile, contained on desktop
  fullToContained: "w-full lg:max-w-7xl lg:mx-auto",

  // Single column on mobile, grid on desktop
  singleToGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",

  // Hidden on mobile, visible on desktop
  hideOnMobile: "hidden md:block",

  // Visible on mobile, hidden on desktop
  showOnMobile: "block md:hidden",

  // Responsive padding
  responsivePadding: "px-4 sm:px-6 lg:px-8",

  // Responsive text sizes
  responsiveHeading: "text-2xl sm:text-3xl lg:text-4xl",
  responsiveBody: "text-sm sm:text-base",
} as const;

/**
 * Media query helper
 */
export const mediaQuery = (breakpoint: Breakpoint): string => {
  return `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`;
};

/**
 * Check if viewport matches breakpoint (client-side only)
 */
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`).matches;
};

/**
 * Container queries (experimental)
 */
export const CONTAINER_QUERIES = {
  xs: "@container (min-width: 20rem)",
  sm: "@container (min-width: 24rem)",
  md: "@container (min-width: 28rem)",
  lg: "@container (min-width: 32rem)",
  xl: "@container (min-width: 36rem)",
} as const;

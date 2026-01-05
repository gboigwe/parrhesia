/**
 * UI Component Library Exports
 * Import components from this file for consistency
 */

// Base components
export { Button } from "./button";
export type { ButtonProps } from "./button";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
export type { CardProps } from "./card";

export { Input } from "./input";
export type { InputProps } from "./input";

export { Textarea } from "./textarea";
export type { TextareaProps } from "./textarea";

export { Badge } from "./badge";
export type { BadgeProps } from "./badge";

export { Avatar, AvatarGroup } from "./avatar";
export type { AvatarProps } from "./avatar";

// Interactive components
export {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
export type { DialogProps } from "./dialog";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";
export type { DropdownMenuProps } from "./dropdown-menu";

export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export type { TabsProps } from "./tabs";

// Feedback components
export { toast, useToast, ToastProvider } from "./toast";
export type { Toast } from "./toast";

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
} from "./skeleton";
export type { SkeletonProps } from "./skeleton";

// Design system
export {
  BASE_COLORS,
  SEMANTIC_COLORS,
  DEBATE_COLORS,
  STATUS_COLORS,
  GRADIENTS,
  SHADOWS,
} from "@/lib/design/colors";

export {
  BREAKPOINTS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  Z_INDEX,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  RESPONSIVE_PATTERNS,
  mediaQuery,
  useBreakpoint,
} from "@/lib/design/responsive";

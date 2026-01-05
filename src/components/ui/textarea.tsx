import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, characterCount, maxLength, value, ...props }, ref) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      if (characterCount && typeof value === "string") {
        setCount(value.length);
      }
    }, [value, characterCount]);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border bg-white dark:bg-gray-800 px-3 py-2 text-sm transition-colors",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-gray-300 dark:border-gray-700 focus-visible:ring-blue-600",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex justify-between items-center mt-1.5">
          <div className="flex-1">
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
          {characterCount && maxLength && (
            <p className={cn(
              "text-xs ml-2",
              count > maxLength ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            )}>
              {count} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

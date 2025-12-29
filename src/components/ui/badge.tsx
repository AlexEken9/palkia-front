import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-palkia-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-palkia-500 text-white",
        secondary:
          "border-transparent bg-silver-100 text-silver-900 dark:bg-silver-800 dark:text-silver-100",
        destructive:
          "border-transparent bg-red-500 text-white",
        outline:
          "border-silver-300 text-silver-700 dark:border-silver-700 dark:text-silver-300",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        palkia:
          "border-transparent bg-palkia-100 text-palkia-800 dark:bg-palkia-900/30 dark:text-palkia-400",
        pearl:
          "border-transparent bg-pearl-100 text-pearl-800 dark:bg-pearl-900/30 dark:text-pearl-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

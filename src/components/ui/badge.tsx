import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-palkia-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-palkia-500 to-palkia-600 text-white shadow-sm shadow-palkia-500/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-red-500 text-white shadow-sm shadow-red-500/20",
        outline:
          "text-muted-foreground border-border",
        success:
          "border-transparent bg-green-500/15 text-green-700 dark:text-green-400",
        warning:
          "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
        palkia:
          "border-transparent bg-palkia-500/15 text-palkia-700 dark:text-palkia-300 border border-palkia-200 dark:border-palkia-800",
        pearl:
          "border-transparent bg-muted text-muted-foreground",
        glass:
          "border-border/20 bg-card/30 backdrop-blur-sm text-foreground",
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

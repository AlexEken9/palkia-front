import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palkia-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "btn-palkia text-white",
        glass:
          "glass hover:bg-white/20 hover:border-palkia-300 text-foreground dark:text-white dark:hover:bg-white/10",
        destructive:
          "bg-red-500/80 text-white shadow-sm hover:bg-red-600 backdrop-blur-sm",
        outline:
          "border border-border bg-transparent hover:bg-palkia-50 hover:border-palkia-300 dark:hover:bg-palkia-900/20 text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 backdrop-blur-sm",
        ghost:
          "hover:bg-palkia-100/50 hover:text-palkia-700 dark:hover:bg-palkia-900/30 dark:hover:text-palkia-300",
        link: "text-palkia-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

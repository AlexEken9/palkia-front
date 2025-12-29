import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palkia-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-palkia-500 text-white shadow-lg shadow-palkia-500/25 hover:bg-palkia-600 hover:shadow-xl hover:shadow-palkia-500/30",
        gradient:
          "bg-gradient-to-r from-palkia-500 to-pearl-500 text-white shadow-lg shadow-palkia-500/25 hover:from-palkia-600 hover:to-pearl-600",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-silver-300 bg-transparent hover:bg-silver-100 hover:border-palkia-300 dark:border-silver-700 dark:hover:bg-silver-800",
        secondary:
          "bg-silver-100 text-silver-900 hover:bg-silver-200 dark:bg-silver-800 dark:text-silver-100 dark:hover:bg-silver-700",
        ghost:
          "hover:bg-silver-100 hover:text-palkia-600 dark:hover:bg-silver-800",
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

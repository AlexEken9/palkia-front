import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-silver-200 dark:bg-silver-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

import { Skeleton } from "@/components/ui/skeleton";
import { AccountCard } from "./AccountCard";

export function AccountSkeletonHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>
      <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
    </div>
  );
}

interface AccountSkeletonCardProps {
  rows?: number;
  className?: string;
}

export function AccountSkeletonCard({
  rows = 3,
  className,
}: AccountSkeletonCardProps) {
  return (
    <AccountCard className={className}>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 rounded-md"
            style={{ width: `${100 - i * 10}%` }}
          />
        ))}
      </div>
    </AccountCard>
  );
}

interface AccountSkeletonGridProps {
  count?: number;
  cols?: 1 | 2 | 3 | 4;
}

const colsMap: Record<NonNullable<AccountSkeletonGridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

export function AccountSkeletonGrid({
  count = 4,
  cols = 2,
}: AccountSkeletonGridProps) {
  return (
    <div className={`grid gap-4 ${colsMap[cols]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <AccountSkeletonCard key={i} rows={3} />
      ))}
    </div>
  );
}

export function AccountSkeletonOrderRow() {
  return (
    <AccountCard padding="md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>
    </AccountCard>
  );
}

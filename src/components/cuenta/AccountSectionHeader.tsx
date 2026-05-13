import * as React from "react";
import { cn } from "@/lib/utils";

interface AccountSectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AccountSectionHeader({
  title,
  description,
  action,
  className,
}: AccountSectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <h1 className="font-display text-[26px] sm:text-[30px] lg:text-[32px] font-normal tracking-tight text-foreground leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-prose">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 sm:pb-1">{action}</div>}
    </header>
  );
}

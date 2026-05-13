import * as React from "react";
import { cn } from "@/lib/utils";

interface AccountCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

const paddingMap: Record<NonNullable<AccountCardProps["padding"]>, string> = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function AccountCard({
  as: Tag = "div",
  padding = "md",
  interactive = false,
  className,
  children,
  ...props
}: AccountCardProps) {
  return (
    <Tag
      className={cn(
        "bg-white rounded-2xl border border-neutral-200/70 shadow-sm",
        paddingMap[padding],
        interactive &&
          "transition-all duration-200 hover:border-primary/30 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface AccountCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

export function AccountCardHeader({
  icon,
  title,
  action,
  className,
  ...props
}: AccountCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 mb-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <span className="text-muted-foreground shrink-0" aria-hidden>
            {icon}
          </span>
        )}
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em]">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

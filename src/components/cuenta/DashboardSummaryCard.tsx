import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AccountCard } from "./AccountCard";
import { cn } from "@/lib/utils";

interface DashboardSummaryCardProps {
  icon: React.ReactNode;
  title: string;
  href?: string;
  cta?: string;
  className?: string;
  children: React.ReactNode;
}

export function DashboardSummaryCard({
  icon,
  title,
  href,
  cta,
  className,
  children,
}: DashboardSummaryCardProps) {
  return (
    <AccountCard
      as="section"
      padding="md"
      className={cn("flex flex-col gap-4 h-full", className)}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"
          aria-hidden
        >
          {icon}
        </span>
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {title}
        </h2>
      </div>

      <div className="flex-1 min-w-0">{children}</div>

      {href && cta && (
        <div className="pt-1">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
          >
            {cta}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </AccountCard>
  );
}

interface DashboardSummaryEmptyProps {
  message: string;
  className?: string;
}

export function DashboardSummaryEmpty({
  message,
  className,
}: DashboardSummaryEmptyProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{message}</p>
  );
}

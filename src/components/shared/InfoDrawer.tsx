"use client";

import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface InfoDrawerProps {
  title: string;
  triggerText: ReactNode;
  children: ReactNode;
  className?: string;
}

export function InfoDrawer({ title, triggerText, children, className }: InfoDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn("text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
        >
          {triggerText}
        </button>
      </SheetTrigger>
      {/* className assumes tailwind container sizes for drawers */}
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-6 w-full">
            {children}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

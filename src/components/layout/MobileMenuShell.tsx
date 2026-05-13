"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import MobileMenu from "@/components/layout/MobileMenu";
import { EdgeSwipeOpener } from "@/components/layout/EdgeSwipeOpener";

interface MobileMenuShellProps {
  collections?: any[];
}

export function MobileMenuShell({ collections }: MobileMenuShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" strokeWidth={1.5} />
      </button>
      <EdgeSwipeOpener onOpen={() => setOpen(true)} />
      <MobileMenu collections={collections} open={open} onOpenChange={setOpen} />
    </>
  );
}

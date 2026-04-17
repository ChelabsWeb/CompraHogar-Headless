"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

interface MobileFilterDrawerProps {
  children: React.ReactNode;
}

const EXCLUDED_PARAMS = ["page", "sort", "q", "cursor", "direction", "after", "before", "first", "last"];

export function MobileFilterDrawer({ children }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Contar filtros activos (excluyendo paginación, sort, búsqueda)
  let activeCount = 0;
  searchParams.forEach((_, key) => {
    if (!EXCLUDED_PARAMS.includes(key)) activeCount++;
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Gatillo Flotante (FAB) */}
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full px-6 py-5 text-[14px] font-semibold bg-primary text-white shadow-[0_8px_24px_rgba(33,100,93,0.35)] transition-transform duration-300 ease-out hover:scale-105 active:scale-95 lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span
              className="ml-1 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-white text-primary text-[11px] font-bold leading-none"
              aria-label={`${activeCount} filtros activos`}
            >
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="flex h-[min(85vh,760px)] flex-col rounded-t-[20px] p-0"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            Filtros
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-2 rounded-full bg-primary text-white text-[11px] font-bold leading-none">
                {activeCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          {children}
        </div>

        <SheetFooter className="sticky bottom-0 z-10 border-t bg-background p-4 pb-8 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <SheetClose asChild>
            <Button size="lg" className="w-full rounded-xl text-base shadow-md h-12">
              Mostrar resultados
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

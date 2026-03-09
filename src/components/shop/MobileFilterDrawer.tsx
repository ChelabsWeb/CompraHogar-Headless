"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
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

export function MobileFilterDrawer({ children }: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Gatillo Flotante (Floating Action Button) */}
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full px-8 py-6 text-[15px] font-semibold bg-primary text-white shadow-xl transition-transform duration-300 ease-out hover:scale-105 active:scale-95 lg:hidden"
        >
          <Filter className="size-5" />
          Filtrar Resultados
        </Button>
      </SheetTrigger>

      {/* 
        Drawer Inferior: Ocupa el 85% de la pantalla.
        Se aplica `will-change-transform` por defecto en Radix para fluidez.
        Usamos bordes redondeados en la parte superior para un "Native App Feel".
      */}
      <SheetContent
        side="bottom"
        className="flex h-[85vh] flex-col rounded-t-[20px] p-0"
      >
        {/* Cabecera Fija */}
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-xl font-bold">Filtros</SheetTitle>
        </SheetHeader>

        {/* 
          Área de Contenido Scrolleable
          Independiente del scroll de la página (overscroll-contain evita el 'scroll chaining' en móviles)
        */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
          {children}
        </div>

        {/* Footer Fijo con el Call to Action */}
        <SheetFooter className="sticky bottom-0 z-10 border-t bg-background p-4 pb-8 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <SheetClose asChild>
            <Button size="lg" className="w-full rounded-xl text-base shadow-md h-12">
              Mostrar Resultados
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

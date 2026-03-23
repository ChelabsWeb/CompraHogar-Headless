"use client"

import * as React from "react"
import { Drawer as VaulDrawer } from "vaul"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  side?: "right" | "left"
}

export function Drawer({ isOpen, onClose, title, children, className, side = "right" }: DrawerProps) {
  return (
    <VaulDrawer.Root 
      open={isOpen} 
      onOpenChange={(open) => !open && onClose()} 
      direction={side}
      shouldScaleBackground={false}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
        <VaulDrawer.Content
          className={cn(
            "fixed bottom-0 top-0 z-[110] flex h-full w-[400px] max-w-[85vw] flex-col bg-background shadow-2xl outline-none",
            side === "right" ? "right-0 rounded-l-2xl" : "left-0 rounded-r-2xl",
            className
          )}
        >
          <div className="flex items-center justify-between border-b px-6 py-4">
            {title && (
              <VaulDrawer.Title className="text-xl font-semibold text-foreground">
                {title}
              </VaulDrawer.Title>
            )}
            <VaulDrawer.Description className="sr-only">
              {title ? `Contenido de ${title}` : "Contenido del panel lateral"}
            </VaulDrawer.Description>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar panel</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}

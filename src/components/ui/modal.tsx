"use client"

import * as React from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  hideCloseButton?: boolean
}

// Hook: detects mobile viewport (≤768px). Updates on resize / orientation change.
// SSR-safe: defaults to `false` until mounted, then reflects real viewport.
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])
  return isMobile
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  hideCloseButton,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false)
  const isMobile = useIsMobile()

  React.useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!mounted) return null

  // On mobile, dragging the sheet down past 100px or with downward velocity > 500
  // closes it — same threshold Vaul uses for snap-to-close.
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose()
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex justify-center",
            isMobile ? "items-end" : "items-center"
          )}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet content — animation + chrome differ between mobile and desktop */}
          {isMobile ? (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative z-50 w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-left shadow-2xl touch-pan-y",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Grabber — visible affordance for drag-to-close */}
              <div
                aria-hidden
                className="sticky top-0 z-10 flex justify-center bg-background pt-3 pb-1"
              >
                <span className="h-1.5 w-9 rounded-full bg-slate-300" />
              </div>

              <div className="px-5 pt-2">
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cerrar</span>
                  </button>
                )}

                {title && (
                  <h3 className="text-xl font-semibold leading-6 text-foreground mb-2 pr-10">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {description}
                  </p>
                )}

                <div>{children}</div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-background p-6 text-left align-middle shadow-xl",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cerrar</span>
                </button>
              )}

              {title && (
                <h3 className="text-xl font-semibold leading-6 text-foreground mb-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {description}
                </p>
              )}

              <div>{children}</div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

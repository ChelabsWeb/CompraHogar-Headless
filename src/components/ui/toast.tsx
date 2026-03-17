"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

export type ToastVariant = "default" | "success" | "error" | "info"

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, "id">) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toast = React.useCallback(
    ({ title, description, variant = "default" }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { id, title, description, variant }
      setToasts((prev) => [...prev, newToast])

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    },
    []
  )

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:w-auto sm:flex-col gap-3">
            <AnimatePresence>
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// --- Internal Component ---
function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const isDesc = !!toast.description

  const variants = {
    default: "bg-background border-border text-foreground",
    success: "bg-green-50/90 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    error: "bg-red-50/90 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
    info: "bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30 dark:text-primary",
  }

  const icons = {
    default: null,
    success: <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />,
    error: <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />,
    info: <Info className="mt-0.5 h-5 w-5 text-primary dark:text-primary/80 shrink-0" />,
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "pointer-events-auto relative flex w-full max-w-md items-start items-center gap-3 overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all",
        variants[toast.variant || "default"]
      )}
    >
      {toast.variant !== "default" && icons[toast.variant || "default"]}
      
      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm leading-none">{toast.title}</p>
        {isDesc && (
          <p className="text-sm opacity-80 leading-snug">{toast.description}</p>
        )}
      </div>

      <button
        onClick={onRemove}
        className="shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </motion.div>
  )
}

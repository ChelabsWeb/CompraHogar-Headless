"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AccordionProps {
  items: {
    id: string
    title: React.ReactNode
    content: React.ReactNode
  }[]
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  className?: string
}

export function Accordion({ items, type = "single", defaultValue, className }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  )

  const toggleItem = (id: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]))
    } else {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      )
    }
  }

  return (
    <div className={cn("w-full divide-y divide-border", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)
        return (
          <div key={item.id} className="py-4">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between text-left font-medium text-slate-900 transition-all hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
              aria-expanded={isOpen}
            >
              {item.title}
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-300 text-slate-500",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto", marginTop: 12 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden text-sm text-slate-600 dark:text-slate-400"
                >
                  {item.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
} | null>(null)

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [activeTab, setInternalActiveTab] = React.useState(value || defaultValue || "")

  const setActiveTab = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalActiveTab(newValue)
      }
      onValueChange?.(newValue)
    },
    [value, onValueChange]
  )

  // Sync external value
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalActiveTab(value)
    }
  }, [value])

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500",
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  className,
  children,
  disabled = false,
}: {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be inside Tabs")

  const isActive = context.activeTab === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-slate-900 shadow-sm"
          : "hover:bg-slate-200/50 hover:text-slate-900",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be inside Tabs")

  if (context.activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-1",
        className
      )}
    >
      {children}
    </div>
  )
}

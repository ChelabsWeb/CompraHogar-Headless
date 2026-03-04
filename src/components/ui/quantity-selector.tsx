"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  disabled?: boolean
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className={cn("inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-l-lg rounded-r-none hover:bg-slate-50 focus-visible:z-10 disabled:opacity-50"
        disabled={disabled || value <= min}
        onClick={handleDecrement}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4 text-slate-600" />
      </Button>
      
      <div className="flex h-10 min-w-12 items-center justify-center border-x border-slate-200 px-3 text-sm font-medium text-slate-900">
        {value}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-l-none rounded-r-lg hover:bg-slate-50 focus-visible:z-10 disabled:opacity-50"
        disabled={disabled || value >= max}
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4 text-slate-600" />
      </Button>
    </div>
  )
}

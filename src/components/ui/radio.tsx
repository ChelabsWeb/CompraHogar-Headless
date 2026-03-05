"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center justify-center">
        <input
          type="radio"
          className={cn(
            "peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 bg-white transition-all checked:border-primary hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:checked:border-slate-300",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100 peer-disabled:bg-slate-400" />
      </div>
    )
  }
)
Radio.displayName = "Radio"

export { Radio }

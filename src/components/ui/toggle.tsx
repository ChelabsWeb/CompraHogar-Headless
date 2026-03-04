"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary",
        chip: "rounded-lg border border-slate-200 bg-white hover:bg-slate-50 data-[state=on]:bg-orange-50 data-[state=on]:border-orange-500 data-[state=on]:text-orange-700 dark:bg-slate-900 dark:border-slate-800 dark:data-[state=on]:bg-orange-900/30 dark:data-[state=on]:text-orange-400 dark:data-[state=on]:border-orange-500/50",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-10 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, defaultPressed = false, onPressedChange, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(defaultPressed)

    // Allow controlled or uncontrolled
    const state = pressed !== undefined ? pressed : isPressed

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (pressed === undefined) {
        setIsPressed(!state)
      }
      onPressedChange?.(!state)
      props.onClick?.(e)
    }

    return (
      <button
        type="button"
        ref={ref}
        data-state={state ? "on" : "off"}
        aria-pressed={state}
        className={cn(toggleVariants({ variant, size, className }))}
        onClick={handleClick}
        {...props}
      />
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }

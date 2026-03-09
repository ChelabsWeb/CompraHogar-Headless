"use client"

import * as React from "react"
import { Globe } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const LOCALE_OPTIONS = [
  { value: "es-UY", label: "ES / UYU", flag: "🇺🇾" },
  { value: "en-US", label: "EN / USD", flag: "🇺🇸" },
  { value: "es-AR", label: "ES / ARS", flag: "🇦🇷" },
]

interface LocaleSwitcherProps {
  className?: string
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const [selectedLocale, setSelectedLocale] = React.useState(LOCALE_OPTIONS[0].value)

  const selectedOption = React.useMemo(
    () => LOCALE_OPTIONS.find((opt) => opt.value === selectedLocale) || LOCALE_OPTIONS[0],
    [selectedLocale]
  )

  return (
    <Select value={selectedLocale} onValueChange={setSelectedLocale}>
      <SelectTrigger
        className={cn(
          "h-8 w-auto min-w-[5rem] gap-1.5 border-none bg-transparent px-2 shadow-none hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:ring-offset-0",
          className
        )}
        aria-label="Select language and currency"
      >
        <Globe className="size-3.5 text-muted-foreground hidden sm:inline-block" />
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-sm leading-none" aria-hidden="true">
            {selectedOption.flag}
          </span>
          <span className="hidden sm:inline-block">
            {selectedOption.label}
          </span>
          {/* Mobile view just shows the flag */}
          <span className="sm:hidden tracking-wider font-semibold">
            {selectedOption.label.split(" / ")[1]} {/* E.g. UYU */}
          </span>
        </span>
      </SelectTrigger>
      
      <SelectContent 
        position="popper" 
        sideOffset={4}
        align="end" 
        className="w-[130px] rounded-xl shadow-lg border-border/50 backdrop-blur-md bg-background/95"
      >
        <SelectGroup>
          {LOCALE_OPTIONS.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer text-xs rounded-lg my-0.5 focus:bg-accent/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{option.flag}</span>
                <span className="font-medium text-foreground/80">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

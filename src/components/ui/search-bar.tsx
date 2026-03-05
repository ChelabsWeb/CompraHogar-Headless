"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (query: string) => void
  onChange?: (query: string) => void
  onClear?: () => void
  isLoading?: boolean
  debounceMs?: number
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, onChange, onClear, isLoading = false, debounceMs = 300, ...props }, ref) => {
    const [query, setQuery] = React.useState(props.defaultValue?.toString() || props.value?.toString() || "")
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Merge refs
    const setRefs = React.useCallback(
      (node: HTMLInputElement) => {
        inputRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    // Debounce logic for onChange
    React.useEffect(() => {
      if (!onChange) return

      const handler = setTimeout(() => {
        onChange(query)
      }, debounceMs)

      return () => clearTimeout(handler)
    }, [query, debounceMs, onChange])

    const handleClear = () => {
      setQuery("")
      onClear?.()
      onChange?.("")
      inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        e.preventDefault()
        onSearch(query)
      }
      props.onKeyDown?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    }

    const renderRightIcon = () => {
      if (isLoading) {
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      }
      if (query.length > 0) {
        return (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 text-slate-500" />
          </button>
        )
      }
      return null
    }

    return (
      <Input
        ref={setRefs}
        value={props.value !== undefined ? props.value : query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn("h-11 rounded-lg", className)}
        iconLeft={<Search className="h-4 w-4" />}
        iconRight={renderRightIcon()}
        {...props}
      />
    )
  }
)
SearchBar.displayName = "SearchBar"

export { SearchBar }

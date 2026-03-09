"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useStoreFilters } from "@/hooks/useStoreFilters"

// --- Helper Components for the Filter Sidebar ---

export interface FilterSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function FilterSection({ title, children, className }: FilterSectionProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h3 className="text-[16px] font-semibold text-slate-800 mb-3">{title}</h3>
      <div className="flex flex-col gap-2.5">
        {children}
      </div>
    </div>
  )
}

import { Checkbox } from "@/components/ui/checkbox"

export interface FilterItemProps {
  label: string
  count?: number
  // Permite override manual, pero si no se pasa, lee de la URL
  isActive?: boolean
  // Si se proveen paramKey y paramValue, el componente maneja la URL automáticamente
  paramKey?: string
  paramValue?: string
  // Callback opcional si se quiere manejar el click manualmente
  onClick?: () => void
}

export function FilterItem({ label, count, isActive, paramKey, paramValue, onClick }: FilterItemProps) {
  const searchParams = useSearchParams()
  const { toggleFilter } = useStoreFilters()

  // Determinar si está activo basado en la prop `isActive` o leyendo la URL si tenemos la key/value
  const isFilterActive = isActive !== undefined 
    ? isActive 
    : (paramKey && paramValue ? searchParams.getAll(paramKey).includes(paramValue) : false)

  const handleClick = (e?: React.MouseEvent | React.ChangeEvent) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (onClick) {
      onClick()
      return
    }

    if (paramKey && paramValue) {
      toggleFilter(paramKey, paramValue)
    }
  }

  return (
    <label
      onClick={(e) => {
        // Evitamos el doble trigger del label + checkbox
        if ((e.target as HTMLElement).tagName !== 'INPUT') {
            handleClick(e);
        }
      }}
      className={cn(
        "flex items-center justify-between text-left group w-full transition-all duration-200 border rounded-lg px-3 py-2 cursor-pointer",
        isFilterActive 
          ? "border-primary bg-primary/5 font-medium text-primary shadow-sm" 
          : "border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox 
           checked={isFilterActive} 
           onChange={handleClick} 
           className="w-4 h-4 rounded-sm data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:border-primary border-slate-300"
        />
        <span className="text-[14px]">{label}</span>
      </div>
      {count !== undefined && (
        <span className={cn(
          "text-[13px] transition-colors",
          isFilterActive ? "text-primary/80" : "text-slate-400 group-hover:text-slate-500"
        )}>
          ({count})
        </span>
      )}
    </label>
  )
}

export interface PriceRangeFilterProps {
  onApply?: (min: number | undefined, max: number | undefined) => void
  minParamKey?: string
  maxParamKey?: string
}

export function PriceRangeFilter({ onApply, minParamKey = "minPrice", maxParamKey = "maxPrice" }: PriceRangeFilterProps) {
  const searchParams = useSearchParams()
  const { setMultipleFilters } = useStoreFilters()

  // Rehidratación visual inicial desde la URL
  const [min, setMin] = React.useState<string>(searchParams.get(minParamKey) || "")
  const [max, setMax] = React.useState<string>(searchParams.get(maxParamKey) || "")

  // Mantener los inputs sincronizados si la URL cambia por fuera (ej: botón "Limpiar filtros")
  React.useEffect(() => {
    setMin(searchParams.get(minParamKey) || "")
    setMax(searchParams.get(maxParamKey) || "")
  }, [searchParams, minParamKey, maxParamKey])

  const handleApply = () => {
    if (onApply) {
      const minVal = min ? parseInt(min, 10) : undefined
      const maxVal = max ? parseInt(max, 10) : undefined
      onApply(minVal, maxVal)
      return
    }

    setMultipleFilters({
      [minParamKey]: min || undefined,
      [maxParamKey]: max || undefined,
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply()
    }
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      <Input
        type="number"
        placeholder="Mín"
        value={min}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMin(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-10 text-sm w-24 px-2"
        min={0}
      />
      <span className="text-slate-300">-</span>
      <Input
        type="number"
        placeholder="Máx"
        value={max}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMax(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-10 text-sm w-24 px-2"
        min={0}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleApply}
        className="shrink-0 h-10 w-10 text-slate-500 rounded-full"
        aria-label="Aplicar rango de precio"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

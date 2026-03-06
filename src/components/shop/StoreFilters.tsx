"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type FilterValue = {
  id: string;
  label: string;
  count: number;
  input: string; // JSON string representando el objeto ProductFilter devuelto por Shopify
};

export type Filter = {
  id: string;
  label: string;
  type: "LIST" | "PRICE_RANGE" | "BOOLEAN";
  values: FilterValue[];
};

interface StoreFiltersProps {
  filters: Filter[];
}

export function StoreFilters({ filters }: StoreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Mantenemos el estado de qué grupos de filtros están expandidos
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
  );

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Crea el nuevo query string combinando los filtros existentes y la nueva interacción
  const createQueryString = useCallback(
    (inputValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const activeFilters = params.getAll("filter");
      
      params.delete("filter"); // Limpiamos la clave para reconstruirla

      if (activeFilters.includes(inputValue)) {
        // Desmarcar: Agregar todos menos el clickeado
        activeFilters.filter((v) => v !== inputValue).forEach((v) => params.append("filter", v));
      } else {
        // Marcar: Mantener los que estaban y agregar el nuevo
        activeFilters.forEach((v) => params.append("filter", v));
        params.append("filter", inputValue);
      }

      // IMPORTANTE: Al filtrar, eliminamos el cursor para volver a la página 1
      params.delete("cursor");
      params.delete("direction");

      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (inputValue: string) => {
    const queryString = createQueryString(inputValue);
    // Utilizamos { scroll: false } para que la página no salte hacia arriba al filtrar
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const isFilterActive = (inputValue: string) => {
    return searchParams.getAll("filter").includes(inputValue);
  };

  return (
    <div className="flex flex-col gap-6">
      {filters.map((filter) => {
        // Excluimos filtros que no tienen valores disponibles para simplificar la UI
        if (!filter.values || filter.values.length === 0) return null;

        return (
          <div key={filter.id} className="border-b border-slate-200 pb-6 last:border-0">
            <button
              className="flex w-full items-center justify-between py-2 text-left"
              onClick={() => toggleExpanded(filter.id)}
            >
              <h3 className="text-[16px] font-semibold text-slate-900 leading-tight">
                {filter.label}
              </h3>
              {expanded[filter.id] ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </button>

            {expanded[filter.id] && (
              <div className="mt-4 flex flex-col gap-3">
                
                {/* Renderizado para los filtros de tipo Lista (Checkboxes) */}
                {filter.type === "LIST" &&
                  filter.values.map((val) => (
                    <label
                      key={val.id}
                      className="group flex cursor-pointer text-[14px] items-center text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={isFilterActive(val.input)}
                        onChange={() => handleFilterChange(val.input)}
                      />
                      <span className="ml-3 flex-1 pt-[1px]">{val.label}</span>
                      <span className="text-slate-400 text-xs">({val.count})</span>
                    </label>
                  ))}

                {/* Renderizado para PRICE_RANGE u otros tipos */}
                {/* Puedes conectar aquí tu componente `<PriceRangeFilter />` si la iteración evalúa filter.type === 'PRICE_RANGE' */}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

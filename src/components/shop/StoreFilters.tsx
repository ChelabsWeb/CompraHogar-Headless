"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useStoreFilters } from "../../hooks/useStoreFilters";
import { FilterLink } from "@/components/ui/FilterLink";

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
  const searchParams = useSearchParams();
  const { toggleFilter } = useStoreFilters();

  // Mantenemos el estado de qué grupos de filtros están expandidos
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    filters.reduce((acc, filter) => ({ ...acc, [filter.id]: true }), {})
  );

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterChange = (inputValue: string) => {
    toggleFilter("filter", inputValue);
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
                
                {/* Renderizado para los filtros de tipo Lista (Checkboxes) con FilterLink */}
                {filter.type === "LIST" &&
                  filter.values.map((val) => {
                    const isActive = isFilterActive(val.input);
                    return (
                      <FilterLink
                        key={val.id}
                        filterKey="filter"
                        filterValue={val.input}
                        className="group flex cursor-pointer text-[14px] items-center text-slate-700 hover:text-slate-900 transition-colors"
                        nofollow={true}
                        prefetch={false}
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isActive
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isActive && (
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                              className="h-3 w-3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`ml-3 flex-1 pt-[1px] ${isActive ? "font-medium" : ""}`}>{val.label}</span>
                        <span className="text-slate-400 text-xs">({val.count})</span>
                      </FilterLink>
                    );
                  })}

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

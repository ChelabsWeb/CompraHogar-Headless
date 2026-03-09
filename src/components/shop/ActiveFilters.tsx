"use client";

import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useStoreFilters } from "../../hooks/useStoreFilters";

export default function ActiveFilters() {
  const searchParams = useSearchParams();
  const { removeFilter, clearFilters } = useStoreFilters();

  // Lista blanca de parámetros a excluir de los badges (ej: paginación, ordenamiento, búsqueda por texto).
  const EXCLUDED_PARAMS = ["page", "sort", "q", "cursor", "direction", "after", "before", "first", "last"];

  // Extraer y decodificar todos los searchParams excluyendo los de la lista blanca.
  const activeFilters: { key: string; value: string }[] = [];

  searchParams.forEach((value, key) => {
    if (!EXCLUDED_PARAMS.includes(key)) {
      activeFilters.push({ key, value });
    }
  });

  // Si no hay filtros seleccionados, evitamos renderizar el contenedor vacío.
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-neutral-500">
        Filtros aplicados:
      </span>

      {activeFilters.map((filter, idx) => (
        <span
          key={`${filter.key}-${filter.value}-${idx}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-800 bg-neutral-100 rounded-full border border-neutral-200"
        >
          <span className="capitalize text-neutral-500">
            {filter.key.replace(/-/g, " ")}:
          </span>
          <span className="font-semibold">{filter.value}</span>
          
          <button
            type="button"
            onClick={() => removeFilter(filter.key, filter.value)}
            className="p-0.5 ml-1 text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 rounded-full"
            aria-label={`Remover filtro ${filter.key} ${filter.value}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}

      {/* Botón Clear All */}
      <button
        type="button"
        onClick={clearFilters}
        className="ml-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4 focus:outline-none"
      >
        Limpiar todos
      </button>
    </div>
  );
}

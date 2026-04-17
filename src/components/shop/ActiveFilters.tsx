"use client";

import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useStoreFilters } from "../../hooks/useStoreFilters";

const EXCLUDED_PARAMS = ["page", "sort", "q", "cursor", "direction", "after", "before", "first", "last"];

/**
 * Shopify devuelve filtros como JSON strings, ej:
 *   {"productType":"Grifería"}
 *   {"price":{"min":1000,"max":5000}}
 *   {"variantOption":{"name":"Color","value":"Blanco"}}
 * Parseamos para mostrar un label humano sin ruido técnico.
 */
function humanizeFilterValue(rawValue: string): { key: string; label: string } {
  try {
    const parsed = JSON.parse(rawValue);

    if (parsed.price) {
      const { min, max } = parsed.price;
      const fmt = (n: number) => `$${Math.round(n).toLocaleString("es-UY")}`;
      if (min != null && max != null) return { key: "Precio", label: `${fmt(min)} – ${fmt(max)}` };
      if (min != null) return { key: "Precio", label: `Desde ${fmt(min)}` };
      if (max != null) return { key: "Precio", label: `Hasta ${fmt(max)}` };
    }

    if (parsed.variantOption) {
      return { key: String(parsed.variantOption.name || ""), label: String(parsed.variantOption.value || "") };
    }

    if (parsed.productType) return { key: "Tipo", label: String(parsed.productType) };
    if (parsed.productVendor) return { key: "Marca", label: String(parsed.productVendor) };
    if (parsed.available != null) return { key: "Disponibilidad", label: parsed.available ? "En stock" : "Sin stock" };
    if (parsed.tag) return { key: "Etiqueta", label: String(parsed.tag) };
  } catch {
    /* no-op: no era JSON, seguimos con fallback */
  }

  // Fallback: mostrar el valor raw truncado
  return { key: "Filtro", label: rawValue.length > 40 ? rawValue.slice(0, 40) + "…" : rawValue };
}

export default function ActiveFilters() {
  const searchParams = useSearchParams();
  const { removeFilter, clearFilters } = useStoreFilters();

  const activeFilters: { paramKey: string; rawValue: string; displayKey: string; displayLabel: string }[] = [];

  searchParams.forEach((value, key) => {
    if (!EXCLUDED_PARAMS.includes(key)) {
      const { key: displayKey, label: displayLabel } = humanizeFilterValue(value);
      activeFilters.push({ paramKey: key, rawValue: value, displayKey, displayLabel });
    }
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {activeFilters.map((filter, idx) => (
        <span
          key={`${filter.paramKey}-${filter.rawValue}-${idx}`}
          className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-[12px] font-medium text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:border-slate-300 transition-colors"
        >
          <span className="text-slate-400 text-[11px]">{filter.displayKey}:</span>
          <span className="text-slate-900">{filter.displayLabel}</span>
          <button
            type="button"
            onClick={() => removeFilter(filter.paramKey, filter.rawValue)}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={`Remover filtro ${filter.displayKey} ${filter.displayLabel}`}
          >
            <X className="w-3 h-3" strokeWidth={2.5} />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={clearFilters}
        className="ml-1 text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
      >
        Limpiar todos
      </button>
    </div>
  );
}

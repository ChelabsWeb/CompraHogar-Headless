"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export default function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lista blanca de parámetros a excluir de los badges (ej: paginación, ordenamiento, búsqueda por texto).
  const EXCLUDED_PARAMS = ["page", "sort", "q"];

  // 1. Extraer y decodificar todos los searchParams excluyendo los de la lista blanca.
  const activeFilters: { key: string; value: string }[] = [];

  // EXPLICACIÓN DE ARRAYS EN LA URL:
  // En Next.js `useSearchParams()`, si la URL tiene un array de parámetros (ej: `?color=Red&color=Blue`),
  // el objeto searchParams contiene múltiples entradas para la misma llave.
  // Al usar `searchParams.forEach((value, key)`, iterará automáticamente sobre cada uno de esos
  // valores individuales (primero {key: 'color', value: 'Red'} y luego {key: 'color', value: 'Blue'}),
  // permitiendo que tratemos cada filtro aplicado como un Badge independiente.
  searchParams.forEach((value, key) => {
    if (!EXCLUDED_PARAMS.includes(key)) {
      activeFilters.push({ key, value });
    }
  });

  // Si no hay filtros seleccionados, evitamos renderizar el contenedor vacío.
  if (activeFilters.length === 0) return null;

  // Remover un filtro individual.
  const handleRemoveFilter = (filterKey: string, filterValue: string) => {
    // Creamos una nueva instancia de URLSearchParams para manipularla.
    const newParams = new URLSearchParams();

    // Reconstituimos la URL iterando sobre los parámetros actuales.
    // Al ser arrays potenciales, debemos comparar tanto la LLAVE como el VALOR
    // para solo eliminar la instancia específica que el usuario quiere borrar 
    // y no todo el array de 'color', por ejemplo.
    searchParams.forEach((value, key) => {
      if (key === filterKey && value === filterValue) {
        return; // Omitimos el filtro que queremos remover
      }
      newParams.append(key, value);
    });

    // 3. Volvemos al path actual con la nueva query reconstituida, sin hacer scroll hacia arriba.
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Botón "Clear All": Borra todos los filtros menos los excluidos.
  const handleClearAll = () => {
    const newParams = new URLSearchParams();

    // Opcional: Si queremos mantener los parámetros estructurales (como page o sort)
    // al limpiar los filtros, los re-agregamos a los nuevos params.
    EXCLUDED_PARAMS.forEach((key) => {
      const values = searchParams.getAll(key);
      values.forEach((val) => newParams.append(key, val));
    });

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // 2. Construir la UI dinámica
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
            {/* Opcional: puedes formatear la llave si tiene guiones bajos o camelCase */}
            {filter.key.replace(/-/g, " ")}:
          </span>
          <span className="font-semibold">{filter.value}</span>
          
          <button
            type="button"
            onClick={() => handleRemoveFilter(filter.key, filter.value)}
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
        onClick={handleClearAll}
        className="ml-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4 focus:outline-none"
      >
        Limpiar todos
      </button>
    </div>
  );
}

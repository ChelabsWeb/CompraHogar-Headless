import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type FilterKey = string;
export type FilterValue = string;

export interface UseStoreFiltersReturn {
  /**
   * Agrega o remueve un filtro específico basado en su key y value.
   */
  toggleFilter: (key: FilterKey, value: FilterValue) => void;
  
  /**
   * Establece un filtro con un valor específico (reemplazando cualquier existente).
   */
  setFilter: (key: FilterKey, value: FilterValue) => void;

  /**
   * Establece múltiples filtros a la vez, o los remueve si el valor es undefined.
   */
  setMultipleFilters: (filters: Record<string, string | undefined>) => void;

  /**
   * Remueve un filtro completamente (todas sus instancias) o un valor específico.
   */
  removeFilter: (key: FilterKey, value?: FilterValue) => void;

  /**
   * Limpia todos los filtros activos, manteniendo el orden y la búsqueda textual.
   */
  clearFilters: () => void;
  
  /**
   * Cambia el criterio de ordenamiento de los productos.
   */
  setSort: (value: string) => void;
  
  /**
   * Aplica una búsqueda textual y, opcionalmente, purga los filtros para evitar
   * choques en Storefront API.
   */
  setSearchQuery: (query: string) => void;
}

export function useStoreFilters(): UseStoreFiltersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Utilidad centralizada para actualizar SearchParams preservando
   * la inmutabilidad y purgando siempre la paginación activa.
   */
  const createQueryStringAndPush = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      
      updater(params);
      
      // Regla fundamental: Siempre que cambia un parámetro de filtrado/ordenamiento/búsqueda,
      // se debe purgar la paginación para evitar errores de Storefront API 
      // al solicitar cursores o páginas que pueden ya no existir en la colección modificada.
      params.delete('page');
      params.delete('cursor');
      params.delete('direction');
      params.delete('after');
      params.delete('before');
      params.delete('first');
      params.delete('last');

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleFilter = useCallback(
    (key: FilterKey, value: FilterValue) => {
      createQueryStringAndPush((params) => {
        const currentValues = params.getAll(key);
        
        if (currentValues.includes(value)) {
          // Remover el valor particular del filtro de forma segura
          params.delete(key);
          currentValues
            .filter((v) => v !== value)
            .forEach((v) => params.append(key, v));
        } else {
          // Agregar el nuevo valor al filtro existente
          params.append(key, value);
        }
      });
    },
    [createQueryStringAndPush]
  );

  const setFilter = useCallback(
    (key: FilterKey, value: FilterValue) => {
      createQueryStringAndPush((params) => {
        params.set(key, value);
      });
    },
    [createQueryStringAndPush]
  );

  const setMultipleFilters = useCallback(
    (filters: Record<string, string | undefined>) => {
      createQueryStringAndPush((params) => {
        Object.entries(filters).forEach(([key, value]) => {
          if (value === undefined) {
            params.delete(key);
          } else {
            params.set(key, value);
          }
        });
      });
    },
    [createQueryStringAndPush]
  );

  const removeFilter = useCallback(
    (key: FilterKey, value?: FilterValue) => {
      createQueryStringAndPush((params) => {
        if (value === undefined) {
          params.delete(key);
        } else {
          const currentValues = params.getAll(key);
          params.delete(key);
          currentValues
            .filter((v) => v !== value)
            .forEach((v) => params.append(key, v));
        }
      });
    },
    [createQueryStringAndPush]
  );

  const clearFilters = useCallback(() => {
    createQueryStringAndPush((params) => {
      // Removemos todos los parámetros excepto búsquedas u orden
      const preserveKeys = ['q', 'sort'];
      const keysToDelete: string[] = [];
      
      params.forEach((_, key) => {
        if (!preserveKeys.includes(key)) {
          keysToDelete.push(key);
        }
      });
      
      keysToDelete.forEach((key) => params.delete(key));
    });
  }, [createQueryStringAndPush]);

  const setSort = useCallback(
    (value: string) => {
      createQueryStringAndPush((params) => {
        if (value) {
          params.set('sort', value);
        } else {
          params.delete('sort');
        }
      });
    },
    [createQueryStringAndPush]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      createQueryStringAndPush((params) => {
        if (query) {
          params.set('q', query);
        } else {
          params.delete('q');
        }
        
        // Bonus track: Purgar filtros activos al realizar una nueva búsqueda textual
        // para minimizar el riesgo de un set vacío o error en base de datos.
        const preserveKeys = ['q', 'sort'];
        const keysToDelete: string[] = [];
        params.forEach((_, key) => {
          if (!preserveKeys.includes(key)) {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach((key) => params.delete(key));
      });
    },
    [createQueryStringAndPush]
  );

  return {
    toggleFilter,
    setFilter,
    setMultipleFilters,
    removeFilter,
    clearFilters,
    setSort,
    setSearchQuery,
  };
}

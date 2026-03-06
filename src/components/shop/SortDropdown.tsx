'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortDropdownProps {
  /** Valor inicial de ordenamiento obtenido desde el servidor */
  currentSort?: string;
}

export function SortDropdown({ currentSort = 'relevance' }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    // 1. Clonar los parámetros de búsqueda actuales para mantener filtros activos
    const params = new URLSearchParams(searchParams.toString());
    
    // 2. Actualizar o eliminar la llave 'sort'
    if (value === 'relevance') {
      // Si vuelve por defecto, limpiamos la URL
      params.delete('sort');
    } else {
      params.set('sort', value);
    }

    // 3. Empujar la nueva URL sin hacer scroll hacia arriba (App Router)
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px] bg-white h-9 border-slate-200">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Más relevantes</SelectItem>
        <SelectItem value="price-asc">Menor precio</SelectItem>
        <SelectItem value="price-desc">Mayor precio</SelectItem>
        <SelectItem value="newest">Más recientes</SelectItem>
      </SelectContent>
    </Select>
  );
}

'use client';

import { useStoreFilters } from '@/hooks/useStoreFilters';
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
  const { setSort } = useStoreFilters();

  const handleSortChange = (value: string) => {
    // Si vuelve por defecto (relevance), limpiamos la URL
    setSort(value === 'relevance' ? '' : value);
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

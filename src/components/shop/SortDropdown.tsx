'use client';

import { ArrowUpDown } from 'lucide-react';
import { useStoreFilters } from '@/hooks/useStoreFilters';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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
    setSort(value === 'relevance' ? '' : value);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px] sm:w-[200px] bg-white h-10 border-slate-200 text-[13px] font-medium text-slate-700 rounded-lg shadow-sm hover:border-slate-300 transition-colors gap-2 [&>svg:last-child]:opacity-60">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
          <SelectValue placeholder="Ordenar por" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-200 shadow-lg min-w-[200px]">
        <SelectItem value="relevance" className="text-[13px] cursor-pointer">
          Más relevantes
        </SelectItem>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            Precio
          </SelectLabel>
          <SelectItem value="price-asc" className="text-[13px] cursor-pointer">
            Menor precio
          </SelectItem>
          <SelectItem value="price-desc" className="text-[13px] cursor-pointer">
            Mayor precio
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="newest" className="text-[13px] cursor-pointer">
          Más recientes
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

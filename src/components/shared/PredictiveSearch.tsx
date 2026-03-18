"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { predictiveSearchAction, PredictiveSearchResult } from "@/app/actions/search";

// Hook para detectar clics fuera del componente
function useOutsideAlerter(ref: React.RefObject<HTMLDivElement | null>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

// Hook de debounce riguroso
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Fetcher para SWR envolviendo la Server Action
const searchFetcher = async ([key, query]: [string, string]) => {
  return await predictiveSearchAction(query, 6);
};

interface PredictiveSearchProps {
  placeholder?: string;
  className?: string;
  hideBorder?: boolean;
}

export function PredictiveSearch({ placeholder = "Buscar productos, marcas y más...", className = "", hideBorder = false }: PredictiveSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(containerRef, () => {
    setIsOpen(false);
  });

  // 1. Debounce riguroso de al menos 400ms
  const debouncedQuery = useDebounce(query, 400);

  // Local State Fetching since we removed SWR
  const [results, setResults] = useState<PredictiveSearchResult[]>([]);
  const [isSWRValidating, setIsSWRValidating] = useState(false);
  
  const shouldFetch = debouncedQuery.trim().length > 0;

  useEffect(() => {
    let active = true;

    if (!shouldFetch) {
      setResults([]);
      setIsSWRValidating(false);
      return;
    }

    const fetchData = async () => {
      setIsSWRValidating(true);
      try {
        const data = await searchFetcher(['predictive-search', debouncedQuery.trim()]);
        if (active) {
          setResults(data || []);
        }
      } catch (error) {
        console.error("Predictive search error:", error);
      } finally {
        if (active) {
          setIsSWRValidating(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [debouncedQuery, shouldFetch]);

  const isTyping = query !== debouncedQuery;
  const isLoading = (shouldFetch && isSWRValidating) || (query.trim().length > 0 && isTyping);

  // Limpiar estados cuando el input queda totalmente vacío ""
  useEffect(() => {
    if (query.trim() === "") {
      setIsOpen(false);
    }
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          className={`w-full h-full pl-10 pr-12 text-slate-900 focus-visible:ring-0 ${hideBorder ? 'border-0 bg-transparent shadow-none rounded-none' : 'h-10 rounded-full bg-white shadow-sm border-slate-200'}`}
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        
        <div className="absolute right-0 top-0 h-full flex items-center pr-3 gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : query.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Results Dropdown Modal */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-[100] transition-all max-h-[400px] flex flex-col">
          {isLoading && (!results || results.length === 0) ? (
            <div className="p-8 flex flex-col items-center justify-center text-sm text-slate-500 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              <span>Buscando resultados...</span>
            </div>
          ) : results && results.length > 0 ? (
            <ul className="py-2 overflow-y-auto">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100 shrink-0">
                      {product.featuredImage?.url ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Search className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
                        {product.title}
                      </p>
                      <p className="text-sm font-semibold text-[#21645d] mt-0.5">
                        {product.priceRange?.minVariantPrice ? 
                          formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
                          : null}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : !isTyping && debouncedQuery === query ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No se encontraron resultados para "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

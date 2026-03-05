"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { predictiveSearchAction, PredictiveSearchResult } from "@/app/actions/search";

// Custom hook to detect clicks outside
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

interface PredictiveSearchProps {
  placeholder?: string;
  className?: string;
}

export function PredictiveSearch({ placeholder = "Buscar productos, marcas y más...", className = "" }: PredictiveSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<PredictiveSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(containerRef, () => {
    setIsOpen(false);
  });

  // Debounce the query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Fetch results when debounced query changes
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        const data = await predictiveSearchAction(debouncedQuery, 6);
        setResults(data);
      } catch (error) {
        console.error("Error fetching predictive search:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
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
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          className="w-full h-10 pl-10 pr-12 rounded-full border-0 bg-white text-slate-900 shadow-sm"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        
        <div className="absolute right-0 top-0 h-10 flex items-center pr-3">
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
      {isOpen && (query.trim().length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-[100] transition-all max-h-[400px] overflow-y-auto">
          {isLoading && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Buscando resultados...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
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
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </p>
                      <p className="text-sm font-semibold text-[#21645d] mt-0.5">
                        {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No se encontraron resultados para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

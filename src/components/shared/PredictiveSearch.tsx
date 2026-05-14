"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Search, Loader2, X } from "lucide-react";
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

// Detect mobile viewport (≤768px). SSR-safe: stays `false` until mount.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
}

// Fetcher para SWR envolviendo la Server Action
const searchFetcher = async ([, query]: [string, string]) => {
  return await predictiveSearchAction(query, 6);
};

interface PredictiveSearchProps {
  placeholder?: string;
  className?: string;
  hideBorder?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function PredictiveSearch({ placeholder = "Buscar productos, marcas y más...", className = "", hideBorder = false, inputRef }: PredictiveSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = nothing highlighted

  const router = useRouter();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(containerRef, () => {
    setIsOpen(false);
    setActiveIndex(-1);
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
          setActiveIndex(-1); // reset highlight when new results arrive
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
      setActiveIndex(-1);
    }
  }, [query]);

  // Lock body scroll while mobile fullscreen dropdown is open — prevents
  // background scroll bleed-through on iOS Safari while typing.
  useEffect(() => {
    if (!isMobile) return;
    if (isOpen && query.trim().length > 0) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobile, isOpen, query]);

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Keyboard navigation: ↑/↓ moves selection, Enter selects, Escape closes.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim().length > 0) {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const selected = results[activeIndex];
        router.push(`/products/${selected.handle}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  // Dropdown chrome differs between mobile (fullscreen takeover) and desktop
  // (floating dropdown below the input). The CONTENT is identical so we
  // compose it once and slot it into the right shell.
  const showDropdown = isOpen && query.trim().length > 0;

  const dropdownContent = (
    <>
      {isLoading && (!results || results.length === 0) ? (
        <div className="p-8 flex flex-col items-center justify-center text-sm text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span>Buscando resultados...</span>
        </div>
      ) : results && results.length > 0 ? (
        <>
          <ul className="py-2 overflow-y-auto flex-1" role="listbox" aria-label="Resultados de búsqueda">
            {results.map((product, index) => {
              const resultPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || "0");
              const resultInstallments = resultPrice > 1000 ? (resultPrice / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 }) : null;
              const isActive = index === activeIndex;

              return (
                <li key={product.id} role="option" aria-selected={isActive}>
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center gap-4 px-4 py-2.5 transition-colors group ${isActive ? "bg-primary/5" : "hover:bg-slate-50"}`}
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                      {product.featuredImage?.url ? (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Search className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate transition-colors ${isActive ? "text-primary" : "text-slate-900 group-hover:text-primary"}`}>
                        {product.title}
                      </p>
                      <p className="text-[15px] font-semibold text-slate-800 mt-0.5">
                        {product.priceRange?.minVariantPrice ?
                          formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
                          : null}
                      </p>
                      {resultInstallments && (
                        <p className="text-[11px] text-green-600 font-medium">
                          12x ${resultInstallments} sin interés
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 border-t border-slate-100 text-sm font-semibold text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors shrink-0"
          >
            Ver todos los resultados
            <Search className="w-3.5 h-3.5" />
          </Link>
        </>
      ) : !isTyping && debouncedQuery === query ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      ) : null}
    </>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className={`relative w-full h-full flex items-center ${hideBorder ? '' : 'bg-white rounded-xl border border-slate-300'}`}>
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
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
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="predictive-search-results"
          aria-autocomplete="list"
          className="w-full h-full bg-transparent pl-11 pr-12 text-base md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <div className="absolute right-0 top-0 h-full flex items-center pr-3 gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : query.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile: fullscreen takeover below the header. Desktop: floating dropdown. */}
      {showDropdown && isMobile && (
        <>
          {/* Backdrop covering the rest of the viewport below the header */}
          <div
            className="fixed inset-x-0 top-0 bottom-0 bg-black/20 backdrop-blur-[2px] z-[55] animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
          <div
            id="predictive-search-results"
            className="fixed inset-x-0 top-[56px] bottom-0 bg-white z-[60] flex flex-col shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
            role="dialog"
            aria-label="Resultados de búsqueda"
          >
            {dropdownContent}
          </div>
        </>
      )}

      {showDropdown && !isMobile && (
        <div
          id="predictive-search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-[100] transition-all max-h-[400px] flex flex-col"
          role="dialog"
          aria-label="Resultados de búsqueda"
        >
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

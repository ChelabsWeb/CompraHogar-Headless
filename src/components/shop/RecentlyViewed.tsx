"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { SnapCarousel } from "@/components/shop/SnapCarousel";
import { getRecentlyViewedProducts } from "@/app/actions/recently-viewed";
import type { ShopifyProduct } from "@/lib/types";

interface RecentEntry {
  id: string;
  viewedAt: number;
}

const STORAGE_KEY = "comprahogar-recently-viewed";
const MAX_ITEMS = 10;

function readStorage(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw)
      ? raw.filter(
          (e): e is RecentEntry =>
            e &&
            typeof e === "object" &&
            typeof e.id === "string" &&
            typeof e.viewedAt === "number"
        )
      : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: RecentEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ITEMS)));
  } catch {
    // Silent fail
  }
}

/**
 * Track a product view. Only stores `{ id, viewedAt }` — full data is refetched.
 */
export function trackProductView(product: { id: string }) {
  if (typeof window === "undefined") return;
  const entries = readStorage();
  const filtered = entries.filter((e) => e.id !== product.id);
  filtered.unshift({ id: product.id, viewedAt: Date.now() });
  writeStorage(filtered);
}

export function RecentlyViewed({ excludeHandle }: { excludeHandle?: string }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const entries = readStorage();
      const ids = entries.slice(0, MAX_ITEMS).map((e) => e.id);
      if (ids.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setLoaded(true);
        }
        return;
      }
      const fetched = await getRecentlyViewedProducts(ids);
      const filtered = excludeHandle
        ? fetched.filter((p) => p.handle !== excludeHandle)
        : fetched;
      if (!cancelled) {
        setProducts(filtered);
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [excludeHandle]);

  if (!loaded || products.length < 2) return null;

  return (
    <div className="w-full mt-8 lg:mt-12">
      <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">
        Visto recientemente
      </h2>
      <SnapCarousel
        ariaLabel="Productos vistos recientemente"
        trackClassName="gap-3 md:gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </SnapCarousel>
    </div>
  );
}

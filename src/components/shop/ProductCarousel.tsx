"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { SnapCarousel } from "@/components/shop/SnapCarousel";
import type { ShopifyProduct } from "@/lib/types";

interface ProductCarouselProps {
  title: string;
  products: Array<ShopifyProduct | { node: ShopifyProduct }>;
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full py-8 mt-4 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">
          {title}
        </h2>
      </div>

      <SnapCarousel
        ariaLabel={title}
        trackClassName="gap-4 pb-6 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {products.map((entry) => {
          const node = "node" in entry ? entry.node : entry;
          return (
            <div
              key={node.id}
              className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0"
            >
              <ProductCard product={node} />
            </div>
          );
        })}
      </SnapCarousel>
    </div>
  );
}

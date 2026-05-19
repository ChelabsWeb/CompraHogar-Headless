"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { SnapCarousel } from "@/components/shop/SnapCarousel";
import type { ShopifyProduct } from "@/lib/types";

interface CollectionShowcaseProps {
  title: string;
  handle: string;
  description?: string;
  bannerImage?: string;
  bannerColor?: string;
  products: Array<ShopifyProduct | { node: ShopifyProduct }>;
}

export function CollectionShowcase({
  title,
  handle,
  description,
  bannerImage,
  bannerColor = "from-primary to-primary/80",
  products,
}: CollectionShowcaseProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">
          {title}
        </h2>
        <Link
          href={`/collections/${handle}`}
          className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Ver todo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <SnapCarousel
        ariaLabel={title}
        trackClassName="gap-3 md:gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
      >
        {/* Collection Banner Card */}
        <Link
          href={`/collections/${handle}`}
          className="relative min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] snap-start shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${bannerColor}`} />
          {bannerImage && (
            <div className="absolute inset-0">
              <Image
                src={bannerImage}
                alt={title}
                fill
                className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                sizes="260px"
              />
            </div>
          )}
          <div className="relative z-10 h-full min-h-[360px] p-5 md:p-6 flex flex-col justify-end">
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-white/70 text-xs md:text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-white/90 text-xs md:text-sm font-medium group-hover:gap-2 transition-all">
              Explorar <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* Product Cards */}
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
    </section>
  );
}

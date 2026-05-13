"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { QuickAddButton } from "@/components/shop/QuickAddButton";
import type { ShopifyProduct } from "@/lib/types";

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

function ProductCardInner({ product, priority = false }: ProductCardProps) {
  const priceAmount = Number(product.priceRange?.minVariantPrice?.amount || 0);
  const compareAtPrice = Number(
    product.compareAtPriceRange?.maxVariantPrice?.amount || 0
  );
  const hasDiscount = compareAtPrice > priceAmount && priceAmount > 0;
  const discountPercent = hasDiscount
    ? Math.round((1 - priceAmount / compareAtPrice) * 100)
    : 0;
  const price = priceAmount.toLocaleString("es-UY");

  const heroImage = product.featuredImage ?? product.images?.edges?.[0]?.node;

  // Sold-out: every variant has availableForSale === false.
  // Defensive: products without variant data are treated as available.
  const variants = product.variants?.edges?.map((e: any) => e.node) ?? [];
  const isSoldOut =
    variants.length > 0 &&
    variants.every((v: any) => v.availableForSale === false);

  return (
    <Card className="group bg-white rounded-2xl border-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col p-0">
      <Link
        href={`/products/${product.handle}`}
        className="flex-1 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Image area */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-white to-slate-50 flex items-center justify-center overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.altText || product.title}
              fill
              className="object-contain p-3 sm:p-4 lg:p-5 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium text-xs">
              CH
            </div>
          )}

          {/* Discount badge — only when compareAt > price */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center bg-red-500 text-white text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-full">
              −{discountPercent}%
            </span>
          )}

          {/* Heart favorite — FavoriteButton owns its own frosted disk style */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton productId={product.id} size="sm" />
          </div>

          {/* Quick-add button — bottom-right inside image */}
          <QuickAddButton product={product} disabled={isSoldOut} />
        </div>

        {/* Info section */}
        <div className="px-3 pt-3 pb-3.5 flex flex-col gap-1.5">
          <h3 className="text-[14px] font-medium text-slate-900 leading-snug line-clamp-2 min-h-[36px]">
            {product.title}
          </h3>
          {priceAmount > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-bold text-slate-900 tracking-tight">
                ${price}
              </span>
              {hasDiscount && (
                <span className="text-[12px] font-medium text-slate-400 line-through">
                  ${compareAtPrice.toLocaleString("es-UY")}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[13px] font-medium text-slate-500">
              Consultar precio
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
  return prev.product.id === next.product.id && prev.priority === next.priority;
});

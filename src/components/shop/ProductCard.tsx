"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { QuickAddButton } from "@/components/shop/QuickAddButton";
import { ProductCardShipping } from "@/components/shop/ProductCardShipping";
import type { ShopifyProduct } from "@/lib/types";

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
}

const INSTALLMENT_THRESHOLD = 1000;
const INSTALLMENT_COUNT = 12;

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

  const variants = product.variants?.edges?.map((e) => e.node) ?? [];
  const isSoldOut =
    variants.length > 0 &&
    variants.every((v) => v.availableForSale === false);

  const installmentLabel =
    priceAmount > INSTALLMENT_THRESHOLD
      ? `${INSTALLMENT_COUNT} cuotas de $${(priceAmount / INSTALLMENT_COUNT).toLocaleString(
          "es-UY",
          { maximumFractionDigits: 0 }
        )} sin interés`
      : null;

  return (
    <Card className="group bg-white rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300 overflow-hidden flex flex-col p-0">
      <Link
        href={`/products/${product.handle}`}
        className="flex-1 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-2xl"
      >
        {/* Image area — FULL BLEED, sin padding */}
        <div className="relative w-full aspect-square bg-gradient-to-b from-white to-slate-50 overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.altText || product.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-300">
              <ImageOff className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.25} />
              <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400">
                Sin imagen
              </span>
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-2 left-2 z-10 inline-flex items-center bg-red-500 text-white text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-full">
              −{discountPercent}%
            </span>
          )}

          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton productId={product.id} size="sm" />
          </div>

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

          {installmentLabel && (
            <span className="text-[11px] text-emerald-700 font-medium">
              {installmentLabel}
            </span>
          )}

          <ProductCardShipping priceAmount={priceAmount} />
        </div>
      </Link>
    </Card>
  );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
  return prev.product.id === next.product.id && prev.priority === next.priority;
});

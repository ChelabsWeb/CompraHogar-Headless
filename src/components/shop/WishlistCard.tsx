"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Loader2 } from "lucide-react";
import { FavoriteButton } from "@/components/shop/FavoriteButton";

export interface WishlistCardProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  variants: {
    edges: {
      node: { id: string };
    }[];
  };
}

interface WishlistCardProps {
  product: WishlistCardProduct;
  isAdding: boolean;
  onAddToCart: (product: WishlistCardProduct) => void;
}

export function WishlistCard({
  product,
  isAdding,
  onAddToCart,
}: WishlistCardProps) {
  const priceAmount = Number(
    product.priceRange?.minVariantPrice?.amount || 0
  );
  const price = priceAmount.toLocaleString("es-UY");

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group rounded-xl overflow-hidden bg-white shadow-sm border border-neutral-200/60 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {product.featuredImage?.url ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
            Sin imagen
          </div>
        )}

        <FavoriteButton
          productId={product.id}
          className="absolute top-2 right-2"
        />

        {!product.availableForSale && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900/85 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        {priceAmount > 0 ? (
          <div className="flex items-start gap-0.5 mb-1 font-display tracking-tight">
            <span className="text-[11px] sm:text-sm font-normal text-foreground mt-0.5">
              $
            </span>
            <span className="text-[18px] sm:text-[22px] font-normal text-foreground leading-none">
              {price}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground mb-1">
            Consultar precio
          </span>
        )}

        <h3 className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1 leading-snug">
          {product.title}
        </h3>

        {product.availableForSale && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isAdding}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            aria-label={`Agregar ${product.title} al carrito`}
          >
            {isAdding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" aria-hidden />
            )}
            Agregar al carrito
          </button>
        )}
      </div>
    </Link>
  );
}

export function WishlistCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-neutral-200/60 animate-pulse">
      <div className="aspect-[4/3] bg-neutral-100" />
      <div className="p-3 space-y-2">
        <div className="h-5 bg-neutral-100 rounded w-2/3" />
        <div className="h-4 bg-neutral-100 rounded w-full" />
        <div className="h-4 bg-neutral-100 rounded w-4/5" />
        <div className="h-8 bg-neutral-100 rounded w-full mt-2" />
      </div>
    </div>
  );
}

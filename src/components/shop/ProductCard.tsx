"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProductQuickView } from "@/components/shop/ProductQuickView";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import type { ShopifyProduct, ShopifyImage } from "@/lib/types";

interface ProductCardProps {
    product: ShopifyProduct;
    priority?: boolean;
}

function ProductCardInner({ product, priority = false }: ProductCardProps) {
    const priceAmount = Number(product.priceRange?.minVariantPrice?.amount || 0);
    const price = priceAmount.toLocaleString("es-UY");
    const compareAtPrice = Number(product.compareAtPriceRange?.maxVariantPrice?.amount || 0);
    const hasDiscount = compareAtPrice > priceAmount;
    const discountPercent = hasDiscount ? Math.round((1 - priceAmount / compareAtPrice) * 100) : 0;
    const installments = (priceAmount / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 });

    const images: ShopifyImage[] = product.images?.edges?.length
        ? product.images.edges.map((e) => e.node)
        : product.featuredImage
            ? [product.featuredImage]
            : [];

    return (
        <Card className="group bg-white rounded-lg border-none shadow-[0_1px_2px_0_rgba(0,0,0,0.15)] transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer p-0">
            <Link href={`/products/${product.handle}`} className="flex-1 flex flex-col outline-none">
                {/* Image Carousel Container */}
                <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 flex items-center justify-center overflow-hidden">
                    {images.length > 0 ? (
                        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar overscroll-x-contain">
                            {images.map((img, index) => (
                                <div key={index} className="w-full h-full shrink-0 snap-center relative">
                                    <Image
                                        src={img.url}
                                        alt={img.altText || product.title}
                                        fill
                                        className="object-contain p-2 sm:p-4 lg:p-5 group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        priority={priority && index === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium text-xs">
                            CH
                        </div>
                    )}

                    {images.length > 1 && (
                        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                            {images.map((_, idx) => (
                                <div key={idx} className="w-1 h-1 rounded-full bg-slate-300/80" />
                            ))}
                        </div>
                    )}

                    {hasDiscount && (
                        <span className="absolute top-2 left-2 z-10 bg-secondary text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded">
                            -{discountPercent}%
                        </span>
                    )}

                    <FavoriteButton productId={product.id} className="absolute top-2 right-2" />
                    <ProductQuickView product={product} />
                </div>

                {/* Info */}
                <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col flex-1 min-h-[100px] sm:min-h-[120px]">
                    {priceAmount > 0 ? (
                        <div className="mb-1 sm:mb-2">
                            {hasDiscount && (
                                <span className="text-[11px] sm:text-[13px] text-slate-400 line-through font-normal">
                                    $ {compareAtPrice.toLocaleString("es-UY")}
                                </span>
                            )}
                            <div className="flex items-start gap-0.5 sm:gap-1">
                                <span className="text-[11px] sm:text-sm font-normal text-slate-800 mt-0.5 sm:mt-1">$</span>
                                <span className="text-[18px] sm:text-[24px] lg:text-[26px] font-normal text-slate-800 leading-none">{price}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-1 mb-1">
                            <span className="text-[14px] sm:text-[18px] font-medium text-slate-500 leading-none">Consultar precio</span>
                        </div>
                    )}

                    {priceAmount > 1000 && (
                        <span className="text-[11px] sm:text-[13px] text-green-600 mb-1.5 sm:mb-2 leading-tight font-medium">
                            <span className="hidden sm:inline">Mismo precio en </span>12x ${installments} sin interés
                        </span>
                    )}

                    {priceAmount > 2000 && (
                        <span className="inline-flex items-center text-[#00a650] text-[11px] sm:text-[12px] font-bold mb-1.5 sm:mb-2 w-fit bg-[#00a650]/8 px-1.5 py-0.5 rounded">
                            Envío gratis
                        </span>
                    )}

                    <h3 className="text-[13px] sm:text-[14px] text-slate-800 font-normal leading-snug line-clamp-2 mt-auto group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    <div
                        className="jdgm-widget jdgm-preview-badge"
                        data-id={product.id.split("/").pop()}
                        data-handle={product.handle}
                        style={{ minHeight: '18px' }}
                    />
                </div>
            </Link>
        </Card>
    );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
    return prev.product.id === next.product.id && prev.priority === next.priority;
});

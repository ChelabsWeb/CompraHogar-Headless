"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductQuickView } from "@/components/shop/ProductQuickView";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { CompareButton } from "@/components/shop/CompareButton";
import type { ShopifyProduct, ShopifyImage } from "@/lib/types";

interface ProductCardProps {
    product: ShopifyProduct;
    priority?: boolean;
}

// Threshold (UYU) above which the product qualifies for free shipping.
// Keep aligned with ShippingCalculator's FREE_SHIPPING_THRESHOLD.
const FREE_SHIPPING_THRESHOLD = 4000;
// Threshold below which installments become marketing noise rather than value.
const INSTALLMENTS_MIN_PRICE = 1000;

function ProductCardInner({ product, priority = false }: ProductCardProps) {
    const priceAmount = Number(product.priceRange?.minVariantPrice?.amount || 0);
    const compareAtPrice = Number(product.compareAtPriceRange?.maxVariantPrice?.amount || 0);
    const hasDiscount = compareAtPrice > priceAmount;
    const discountPercent = hasDiscount ? Math.round((1 - priceAmount / compareAtPrice) * 100) : 0;
    const price = priceAmount.toLocaleString("es-UY");
    const installments = (priceAmount / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 });
    const showInstallments = priceAmount >= INSTALLMENTS_MIN_PRICE;
    const showFreeShipping = priceAmount >= FREE_SHIPPING_THRESHOLD;

    const images: ShopifyImage[] = product.images?.edges?.length
        ? product.images.edges.map((e) => e.node)
        : product.featuredImage
            ? [product.featuredImage]
            : [];

    return (
        <Card className="group bg-white rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] hover:border-slate-200 transition-[box-shadow,border-color] duration-300 overflow-hidden flex flex-col p-0">
            <Link href={`/products/${product.handle}`} className="flex-1 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-xl">
                {/* Image Carousel */}
                <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 flex items-center justify-center overflow-hidden">
                    {images.length > 0 ? (
                        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar overscroll-x-contain">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    // overflow-hidden prevents the 1.03x hover scale from bleeding
                                    // into the next slide inside the snap scroll container.
                                    className="w-full h-full shrink-0 snap-start relative overflow-hidden"
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.altText || (images.length > 1 ? `${product.title} — imagen ${index + 1} de ${images.length}` : product.title)}
                                        fill
                                        className="object-contain p-3 sm:p-5 lg:p-6 transition-transform duration-500 group-hover:scale-[1.03]"
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

                    {/* Image pagination indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
                            {images.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === 0 ? "w-4 bg-primary/80 shadow-sm" : "w-1.5 bg-slate-400/60"
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Discount badge */}
                    {hasDiscount && (
                        <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center bg-secondary text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                            -{discountPercent}%
                        </span>
                    )}

                    {/* Top-right actions */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                        <FavoriteButton productId={product.id} />
                        <CompareButton productId={product.id} />
                    </div>
                    <ProductQuickView product={product} />
                </div>

                {/* Info section */}
                <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1 gap-1.5 sm:gap-2">
                    {/* Price block */}
                    {priceAmount > 0 ? (
                        <div className="flex flex-col gap-0.5">
                            {hasDiscount && (
                                <span className="text-[11px] sm:text-[12px] text-slate-400 line-through font-normal leading-none">
                                    $ {compareAtPrice.toLocaleString("es-UY")}
                                </span>
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="text-[20px] sm:text-[26px] lg:text-[28px] font-semibold text-slate-900 leading-none tracking-tight">
                                    ${price}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <span className="text-[14px] sm:text-[16px] font-medium text-slate-500">Consultar precio</span>
                    )}

                    {/* Installments */}
                    {showInstallments && (
                        <span className="text-[12px] sm:text-[13px] text-emerald-700 font-medium leading-tight">
                            12x ${installments} sin interés
                        </span>
                    )}

                    {/* Free shipping */}
                    {showFreeShipping && (
                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-semibold text-emerald-700 w-fit">
                            <Truck className="w-3 h-3" strokeWidth={2.5} />
                            Envío gratis
                        </span>
                    )}

                    {/* Title — pushed to bottom to align across cards */}
                    <h3 className="text-[13px] sm:text-[14px] text-slate-700 font-normal leading-snug line-clamp-2 mt-auto pt-2 group-hover:text-slate-900 transition-colors">
                        {product.title}
                    </h3>

                    {/* Reviews widget */}
                    <div
                        className="jdgm-widget jdgm-preview-badge"
                        data-id={product.id.split("/").pop()}
                        data-handle={product.handle}
                        style={{ minHeight: "18px" }}
                    />
                </div>
            </Link>
        </Card>
    );
}

export const ProductCard = memo(ProductCardInner, (prev, next) => {
    return prev.product.id === next.product.id && prev.priority === next.priority;
});

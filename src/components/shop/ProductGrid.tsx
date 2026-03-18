"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductQuickView } from "@/components/shop/ProductQuickView";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import ActiveFilters from "@/components/shop/ActiveFilters";
import { useState, useTransition } from "react";
import { loadMoreCollectionProducts } from "@/app/actions/collection";
import { EmptyState } from "@/components/shop/EmptyState";
import type { ShopifyProductEdge, ShopifyPageInfo, ShopifyImage } from "@/lib/types";


interface ProductGridProps {
    products: ShopifyProductEdge[];
    pageInfo?: ShopifyPageInfo;
    collectionHandle?: string;
    filters?: unknown[];
    sortKey?: string;
    reverse?: boolean;
}

export function ProductGrid({ 
    products: initialProducts, 
    pageInfo: initialPageInfo, 
    collectionHandle, 
    filters, 
    sortKey, 
    reverse 
}: ProductGridProps) {
    const [products, setProducts] = useState(initialProducts);
    const [pageInfo, setPageInfo] = useState(initialPageInfo);
    const [isPending, startTransition] = useTransition();

    if (!products || products.length === 0) {
        return <EmptyState />;
    }

    const handleLoadMore = () => {
        if (!pageInfo?.hasNextPage || !pageInfo?.endCursor || !collectionHandle) return;

        startTransition(async () => {
            try {
                const nextData = await loadMoreCollectionProducts(
                    collectionHandle,
                    pageInfo.endCursor,
                    24,
                    filters,
                    sortKey,
                    reverse
                );
                
                if (nextData?.edges) {
                    setProducts(prev => [...prev, ...nextData.edges]);
                    setPageInfo(nextData.pageInfo);
                }
            } catch (error) {
                console.error("Failed to load more products:", error);
            }
        });
    };

    return (
        <div className="flex flex-col w-full">
            <ActiveFilters />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6">
                {products.map(({ node }, i) => {
                const currency = node.priceRange?.minVariantPrice?.currencyCode || "USD";
                const priceAmount = Number(node.priceRange?.minVariantPrice?.amount || 0);
                const price = priceAmount.toLocaleString("es-UY");

                // ML specific logic: if price is over a certain amount, show installments
                const installments = (priceAmount / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 });

                // Get all available images or fallback to featured image
                const images: ShopifyImage[] = node.images?.edges?.length
                    ? node.images.edges.map((e) => e.node)
                    : node.featuredImage
                        ? [node.featuredImage]
                        : [];

                return (
                    <Card key={node.handle} className="group bg-white rounded-lg border-none shadow-[0_1px_2px_0_rgba(0,0,0,0.15)] transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer">
                        <Link href={`/products/${node.handle}`} className="flex-1 flex flex-col outline-none">

                            {/* Image Carousel Container - CSS Snap */}
                            <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 flex items-center justify-center overflow-hidden">
                                {images.length > 0 ? (
                                    <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar overscroll-x-contain">
                                        {images.map((img, index) => (
                                            <div key={index} className="w-full h-full shrink-0 snap-center relative">
                                                <Image
                                                    src={img.url}
                                                    alt={img.altText || node.title}
                                                    fill
                                                    className="object-contain p-2 sm:p-4 lg:p-5 group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    priority={i < 4 && index === 0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium text-xs">
                                        CH
                                    </div>
                                )}

                                {/* Pagination Dots (Visible only if > 1 image) */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                                        {images.map((_, idx) => (
                                            <div key={idx} className="w-1 h-1 rounded-full bg-slate-300/80" />
                                        ))}
                                    </div>
                                )}

                                <FavoriteButton productId={node.id} className="absolute top-2 right-2" />

                                <ProductQuickView product={node} />
                            </div>

                            {/* Information Container - Optimized for Mobile Grid */}
                            <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col flex-1">

                                {/* Price */}
                                {priceAmount > 0 ? (
                                    <div className="flex items-start gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                                        <span className="text-[11px] sm:text-sm font-normal text-slate-800 mt-0.5 sm:mt-1">$</span>
                                        <span className="text-[18px] sm:text-[24px] lg:text-[26px] font-normal text-slate-800 leading-none">{price}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-1 mb-1">
                                        <span className="text-[14px] sm:text-[18px] font-medium text-slate-500 leading-none">Consultar precio</span>
                                    </div>
                                )}

                                {/* Installments */}
                                {priceAmount > 1000 && (
                                    <span className="text-[11px] sm:text-[13px] text-green-600 mb-1.5 sm:mb-2 leading-tight font-medium">
                                        <span className="hidden sm:inline">Mismo precio en </span>12x ${installments} sin interés
                                    </span>
                                )}

                                {/* Free Shipping Trust Signal */}
                                {priceAmount > 2000 && (
                                    <span className="inline-flex items-center text-[#00a650] text-[11px] sm:text-[12px] font-bold mb-1.5 sm:mb-2 w-fit bg-[#00a650]/8 px-1.5 py-0.5 rounded">
                                        Envío gratis
                                    </span>
                                )}

                                {/* Title */}
                                <h3 className="text-[14px] text-slate-800 font-normal leading-snug line-clamp-2 mt-auto group-hover:text-primary transition-colors">
                                    {node.title}
                                </h3>
                            </div>
                        </Link>
                    </Card>
                );
            })}
            </div>

            {/* Load More Button */}
            {pageInfo?.hasNextPage && (
                <div className="flex justify-center mt-12 mb-4 w-full">
                    <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleLoadMore} 
                        disabled={isPending}
                        className="w-full sm:w-auto px-8 py-6 rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm bg-white font-medium disabled:opacity-70"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin text-slate-400" />
                                Cargando más productos...
                            </>
                        ) : (
                            "Cargar más productos"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

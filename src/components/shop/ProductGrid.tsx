"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Star, Zap, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductQuickView } from "@/components/shop/ProductQuickView";
import ActiveFilters from "@/components/shop/ActiveFilters";
import { useState, useTransition } from "react";
import { loadMoreCollectionProducts } from "@/app/actions/collection";
import { EmptyState } from "@/components/shop/EmptyState";

function FavoriteButton() {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
            }}
            className={`absolute top-1 right-1 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm z-10 shadow-sm border border-slate-100/50 transition-colors ${
                isFavorite 
                    ? 'text-orange-500 hover:text-orange-600 bg-orange-50' 
                    : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'
            }`}
        >
            <Star className={`w-4 h-4 transition-all ${isFavorite ? 'fill-orange-500 text-orange-500 scale-110' : ''}`} />
        </Button>
    );
}


interface PageInfo {
    hasNextPage: boolean;
    endCursor: string;
}

interface ProductGridProps {
    products: any[];
    pageInfo?: PageInfo;
    collectionHandle?: string;
    filters?: any[];
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map(({ node }: any, i: number) => {
                const currency = node.priceRange?.minVariantPrice?.currencyCode || "USD";
                const priceAmount = Number(node.priceRange?.minVariantPrice?.amount || 0);
                const price = priceAmount.toLocaleString("es-UY");

                // ML specific logic: if price is over a certain amount, show installments
                const installments = (priceAmount / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 });

                return (
                    <Card key={node.handle} className="group bg-white rounded-md border border-slate-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer">
                        <Link href={`/products/${node.handle}`} className="flex-1 flex flex-col outline-none">

                            {/* Image Container - Aspect 4/3, white background */}
                            <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 p-4 flex items-center justify-center">
                                {node.featuredImage ? (
                                    <Image
                                        src={node.featuredImage.url}
                                        alt={node.featuredImage.altText || node.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 1024px) 50vw, 25vw"
                                        priority={i < 4}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium text-xs">
                                        CH
                                    </div>
                                )}

                                {/* Favorite Star Icon placeholder (ML style) */}
                                <FavoriteButton />

                                <ProductQuickView product={node} />
                            </div>

                            {/* Information Container - ML Styling */}
                            <div className="p-4 flex flex-col flex-1">

                                {/* Price */}
                                {priceAmount > 0 ? (
                                    <div className="flex items-start gap-1 mb-1">
                                        <span className="text-sm font-normal text-slate-800 mt-1">$</span>
                                        <span className="text-[24px] font-normal text-slate-800 leading-none">{price}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-1 mb-1">
                                        <span className="text-[18px] font-medium text-slate-500 leading-none">Consultar precio</span>
                                    </div>
                                )}

                                {/* Installments */}
                                {priceAmount > 1000 && (
                                    <span className="text-[13px] text-green-500 mb-2">
                                        Mismo precio en 12 cuotas de ${installments}
                                    </span>
                                )}

                                {/* Free Shipping Trust Signal */}
                                {priceAmount > 2000 && (
                                    <div className="inline-flex items-center gap-1 bg-[#e6f5f0] text-[#008b6a] px-2 py-0.5 rounded-md text-[12px] font-semibold border border-[#b2e1d0] w-fit mb-2 mt-1">
                                        Llega gratis mañana
                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                )}

                                {/* Title */}
                                <h3 className="text-[14px] text-slate-500 font-normal leading-tight line-clamp-2 mt-auto group-hover:text-orange-500 transition-colors">
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

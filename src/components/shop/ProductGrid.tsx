"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import ActiveFilters from "@/components/shop/ActiveFilters";
import { useState, useTransition } from "react";
import { loadMoreCollectionProducts } from "@/app/actions/collection";
import { EmptyState } from "@/components/shop/EmptyState";
import type { ShopifyProductEdge, ShopifyPageInfo } from "@/lib/types";


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
                    pageInfo.endCursor!,
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
                {products.map(({ node }, i) => (
                    <ProductCard key={node.handle} product={node} priority={i < 4} />
                ))}
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

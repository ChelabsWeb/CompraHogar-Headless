"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, GitCompare, ArrowRight } from "lucide-react";
import { useCompare } from "./CompareProvider";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";

interface MiniProduct {
    id: string;
    title: string;
    handle: string;
    featuredImage: { url: string; altText: string | null } | null;
}

export function CompareBar() {
    const { items, remove, clear, count, max } = useCompare();
    const [products, setProducts] = useState<MiniProduct[]>([]);

    useEffect(() => {
        if (items.length === 0) {
            // Diferimos el clear al siguiente paint para no caer en
            // react-hooks/set-state-in-effect (cascading renders).
            const rafId = requestAnimationFrame(() => setProducts([]));
            return () => cancelAnimationFrame(rafId);
        }
        let cancelled = false;
        shopifyFetch({
            query: getProductsByIdsQuery,
            variables: { ids: items },
        })
            .then(({ body }) => {
                if (cancelled) return;
                const fetched: MiniProduct[] =
                    body.data?.nodes?.filter(Boolean) || [];
                setProducts(fetched);
            })
            .catch(() => {
                if (!cancelled) setProducts([]);
            });
        return () => {
            cancelled = true;
        };
    }, [items]);

    if (count === 0) return null;

    const canCompare = count >= 2;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] animate-[fadeUp_0.25s_ease-out]">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 sm:gap-4">
                <div className="hidden sm:flex items-center gap-2 text-[#21645d] font-semibold shrink-0">
                    <GitCompare className="w-5 h-5" />
                    <span className="text-sm">
                        Comparar ({count}/{max})
                    </span>
                </div>

                <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden group"
                            title={product.title}
                        >
                            {product.featuredImage?.url ? (
                                <Image
                                    src={product.featuredImage.url}
                                    alt={
                                        product.featuredImage.altText ||
                                        product.title
                                    }
                                    fill
                                    className="object-contain p-1"
                                    sizes="64px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                    Sin img
                                </div>
                            )}
                            <button
                                type="button"
                                aria-label={`Quitar ${product.title} del comparador`}
                                onClick={() => remove(product.id)}
                                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white text-slate-600 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.2)] border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                            >
                                <X className="w-2.5 h-2.5" strokeWidth={2.5} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={clear}
                        className="hidden sm:inline-flex text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                    >
                        Vaciar
                    </button>
                    {canCompare ? (
                        <Link
                            href="/comparar"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#21645d] text-white text-sm font-medium hover:bg-[#1a504a] transition-colors"
                        >
                            Comparar
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <span className="text-xs text-slate-500 px-2">
                            Agregá 1 más
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

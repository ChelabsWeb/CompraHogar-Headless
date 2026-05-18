"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { SnapCarousel } from "@/components/shop/SnapCarousel";

interface RecentProduct {
    id: string;
    handle: string;
    title: string;
    price: number;
    image?: string;
    imageAlt?: string;
}

const STORAGE_KEY = "comprahogar-recently-viewed";
const MAX_ITEMS = 10;

export function trackProductView(product: RecentProduct) {
    if (typeof window === "undefined") return;
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
        const filtered = stored.filter((p) => p.id !== product.id);
        filtered.unshift(product);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
    } catch {
        // Silent fail on storage errors
    }
}

export function RecentlyViewed({ excludeHandle }: { excludeHandle?: string }) {
    const [products, setProducts] = useState<RecentProduct[]>([]);

    useEffect(() => {
        let next: RecentProduct[] | null = null;
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
            const filtered = excludeHandle ? stored.filter((p) => p.handle !== excludeHandle) : stored;
            next = filtered.slice(0, 8);
        } catch {
            // Silent fail
        }
        if (!next) return;
        const list = next;
        // Defer al siguiente paint para no caer en react-hooks/set-state-in-effect.
        const rafId = requestAnimationFrame(() => setProducts(list));
        return () => cancelAnimationFrame(rafId);
    }, [excludeHandle]);

    if (products.length < 2) return null;

    return (
        <div className="w-full mt-8 lg:mt-12">
            <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-4">Visto recientemente</h2>
            <SnapCarousel
                ariaLabel="Productos vistos recientemente"
                trackClassName="gap-3 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
            >
                {products.map((product) => {
                    const price = product.price.toLocaleString("es-UY");
                    const installments = product.price > 1000 ? (product.price / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 }) : null;

                    return (
                        <Card key={product.id} className="min-w-[160px] max-w-[160px] md:min-w-[200px] md:max-w-[200px] snap-start shrink-0 group bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer p-0">
                            <Link href={`/products/${product.handle}`} className="flex-1 flex flex-col outline-none">
                                <div className="relative w-full aspect-square bg-white flex items-center justify-center">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.imageAlt || product.title}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            sizes="200px"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">CH</div>
                                    )}
                                </div>
                                <div className="p-2.5 flex flex-col flex-1 border-t border-slate-50">
                                    <div className="flex items-start gap-0.5 mb-0.5">
                                        <span className="text-[10px] text-slate-800 mt-0.5">$</span>
                                        <span className="text-[16px] font-normal text-slate-800 leading-none">{price}</span>
                                    </div>
                                    {installments && (
                                        <span className="text-[10px] text-green-600 font-medium mb-1">
                                            12x ${installments} s/int
                                        </span>
                                    )}
                                    {product.price > 2000 && (
                                        <span className="inline-flex items-center text-[#00a650] text-[9px] font-bold w-fit bg-[#00a650]/8 px-1 py-0.5 rounded mb-1">
                                            <Truck className="w-2.5 h-2.5 mr-0.5" /> Envío gratis
                                        </span>
                                    )}
                                    <h3 className="text-[11px] md:text-[12px] text-slate-600 font-normal leading-snug line-clamp-2 mt-auto group-hover:text-primary transition-colors">
                                        {product.title}
                                    </h3>
                                </div>
                            </Link>
                        </Card>
                    );
                })}
            </SnapCarousel>
        </div>
    );
}

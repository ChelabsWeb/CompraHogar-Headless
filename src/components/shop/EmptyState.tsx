"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SearchX, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import { Button } from "@/components/ui/button";
import { getPopularProducts } from "@/app/actions/collection";

export function EmptyState() {
    const pathname = usePathname();
    const [recommendations, setRecommendations] = useState<any[]>([]);

    useEffect(() => {
        let cancelled = false;
        getPopularProducts(8)
            .then((edges) => {
                if (!cancelled) setRecommendations(edges);
            })
            .catch(() => {
                if (!cancelled) setRecommendations([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-700 pb-12 pt-8">
            {/* Main Empty State Content */}
            <div className="max-w-2xl w-full text-center px-4 py-8 md:py-16 flex flex-col items-center">
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-orange-100/60 rounded-full blur-3xl animate-pulse delay-75 duration-3000" />
                    <div className="bg-gradient-to-br from-orange-50 to-amber-100/50 p-8 rounded-full shadow-inner relative border border-orange-200/50 group-hover:scale-105 transition-transform duration-500 ease-out">
                        <SearchX className="w-20 h-20 text-orange-500 drop-shadow-sm" strokeWidth={1} />
                    </div>
                    {/* Decorative floating icon */}
                    <div className="absolute -top-3 -right-6 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-full p-3 animate-bounce flex items-center justify-center duration-3000">
                        <SlidersHorizontal className="w-5 h-5 text-slate-400" strokeWidth={2} />
                    </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 font-outfit">
                    ¡Ups! No hay resultados directos
                </h2>

                <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
                    Parece que tus filtros son un poco estrictos. Intenta ajustarlos para revelar un mundo de herramientas y productos increíbles.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full bg-slate-900 hover:bg-orange-500 text-white transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-orange-500/25 px-8 h-14 text-base font-medium group"
                    >
                        <Link href={pathname || "/collection"}>
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1.5 transition-transform duration-300" />
                            Limpiar Filtros
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Recommendations Section — hidden if empty so we never show a bare title */}
            {recommendations.length > 0 && (
                <div className="w-full max-w-[1400px] mx-auto px-4 mt-4 opacity-0 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-forwards relative z-10 bg-white/50 rounded-3xl pt-2 pb-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
                    <ProductCarousel
                        title="🔥 Quizás te interese lo más popular..."
                        products={recommendations}
                    />
                </div>
            )}
        </div>
    );
}

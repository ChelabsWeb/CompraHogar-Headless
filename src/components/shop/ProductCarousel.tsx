"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductQuickView } from "@/components/shop/ProductQuickView";

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
            className={`absolute top-2 right-2 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm z-10 shadow-sm border border-slate-100/50 transition-colors ${
                isFavorite 
                    ? 'text-orange-500 hover:text-orange-600 bg-orange-50' 
                    : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'
            }`}
        >
            <Star className={`w-4 h-4 transition-all ${isFavorite ? 'fill-orange-500 text-orange-500 scale-110' : ''}`} />
        </Button>
    );
}

interface ProductCarouselProps {
    title: string;
    products: any[];
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="w-full py-8 mt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">{title}</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                {products.map((product) => {
                    // Extract data whether it's wrapped in a node or not
                    const node = product.node || product;
                    
                    const currency = node.priceRange?.minVariantPrice?.currencyCode || "USD";
                    const priceAmount = Number(node.priceRange?.minVariantPrice?.amount || 0);
                    const price = priceAmount.toLocaleString("es-UY");
                    const installments = (priceAmount / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 });

                    return (
                        <Card key={node.id} className="min-w-[260px] max-w-[260px] lg:min-w-[280px] lg:max-w-[280px] snap-center shrink-0 group bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer">
                            <Link href={`/products/${node.handle}`} className="flex-1 flex flex-col outline-none">
                                <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 p-4 flex items-center justify-center">
                                    {node.featuredImage ? (
                                        <Image
                                            src={node.featuredImage.url}
                                            alt={node.featuredImage.altText || node.title}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            sizes="280px"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 font-medium text-xs">
                                            CH
                                        </div>
                                    )}
                                    <FavoriteButton />
                                    <ProductQuickView product={node} />
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-[14px] text-slate-600 font-normal leading-tight line-clamp-2 mb-3 group-hover:text-orange-500 transition-colors">
                                        {node.title}
                                    </h3>
                                    
                                    <div className="mt-auto">
                                        {priceAmount > 0 ? (
                                            <div className="flex items-start gap-1 mb-1">
                                                <span className="text-sm font-normal text-slate-800 mt-1">$</span>
                                                <span className="text-[22px] font-medium text-slate-900 leading-none">{price}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-1 mb-1">
                                                <span className="text-[16px] font-medium text-slate-500 leading-none">Consultar precio</span>
                                            </div>
                                        )}

                                        {priceAmount > 1000 && (
                                            <span className="text-[12px] text-green-600 mb-2 block">
                                                en 12 cuotas de ${installments}
                                            </span>
                                        )}

                                        {priceAmount > 2000 && (
                                            <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold mt-1">
                                                Llega gratis mañana
                                                <Zap className="w-3" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

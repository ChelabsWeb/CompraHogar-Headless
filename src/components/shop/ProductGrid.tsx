"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Star, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProductGrid({ products }: { products: any[] }) {
    if (!products || products.length === 0) return null;

    return (
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

                                {/* Favorite Heart Icon placeholder (ML style) */}
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors z-10 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
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
                                    <span className="text-[13px] font-semibold text-green-500 mb-2 flex items-center gap-1">
                                        Llega gratis mañana <Zap className="w-3 h-3 fill-green-500" />
                                    </span>
                                )}

                                {/* Title */}
                                <h3 className="text-[14px] text-slate-500 font-normal leading-tight line-clamp-2 mt-auto group-hover:text-blue-500 transition-colors">
                                    {node.title}
                                </h3>
                            </div>
                        </Link>
                    </Card>
                );
            })}
        </div>
    );
}

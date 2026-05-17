"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { SnapCarousel } from "@/components/shop/SnapCarousel";

interface CollectionShowcaseProps {
    title: string;
    handle: string;
    description?: string;
    bannerImage?: string;
    bannerColor?: string;
    products: any[];
}

export function CollectionShowcase({ title, handle, description, bannerImage, bannerColor = "from-primary to-primary/80", products }: CollectionShowcaseProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="w-full">
            {/* Collection Banner */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">{title}</h2>
                <Link href={`/collections/${handle}`} className="flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">
                    Ver todo <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Banner + Products Row */}
            <SnapCarousel
                ariaLabel={title}
                trackClassName="gap-3 md:gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
            >
                {/* Collection Banner Card */}
                <Link
                    href={`/collections/${handle}`}
                    className="relative min-w-[200px] max-w-[200px] md:min-w-[260px] md:max-w-[260px] lg:min-w-[280px] lg:max-w-[280px] snap-start shrink-0 rounded-xl overflow-hidden group cursor-pointer"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${bannerColor}`} />
                    {bannerImage && (
                        <div className="absolute inset-0">
                            <Image src={bannerImage} alt={title} fill className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" sizes="280px" />
                        </div>
                    )}
                    <div className="relative z-10 h-full min-h-[320px] md:min-h-[380px] p-5 md:p-6 flex flex-col justify-end">
                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-2">{title}</h3>
                        {description && (
                            <p className="text-white/70 text-xs md:text-sm line-clamp-2 mb-3">{description}</p>
                        )}
                        <span className="inline-flex items-center gap-1 text-white/90 text-xs md:text-sm font-medium group-hover:gap-2 transition-all">
                            Explorar <ChevronRight className="w-4 h-4" />
                        </span>
                    </div>
                </Link>

                {/* Product Cards */}
                {products.map((edge: any) => {
                    const node = edge.node || edge;
                    const priceAmount = Number(node.priceRange?.minVariantPrice?.amount || 0);
                    const price = priceAmount.toLocaleString("es-UY");
                    const compareAtPrice = Number(node.compareAtPriceRange?.maxVariantPrice?.amount || 0);
                    const hasDiscount = compareAtPrice > priceAmount;
                    const discountPercent = hasDiscount ? Math.round((1 - priceAmount / compareAtPrice) * 100) : 0;
                    const installments = (priceAmount / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 });

                    return (
                        <Card key={node.id} className="min-w-[180px] max-w-[180px] md:min-w-[220px] md:max-w-[220px] lg:min-w-[240px] lg:max-w-[240px] snap-start shrink-0 group bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer p-0">
                            <Link href={`/products/${node.handle}`} className="flex-1 flex flex-col outline-none">
                                <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
                                    {node.featuredImage ? (
                                        <Image
                                            src={node.featuredImage.url}
                                            alt={node.featuredImage.altText || node.title}
                                            fill
                                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                                            sizes="240px"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">CH</div>
                                    )}
                                    {hasDiscount && (
                                        <Badge className="absolute top-2 left-2 z-10 bg-secondary text-white border-none font-bold px-1.5 py-0.5 text-[10px]">
                                            -{discountPercent}%
                                        </Badge>
                                    )}
                                    <FavoriteButton productId={node.id} className="absolute top-2 right-2" />
                                </div>

                                <div className="p-3 flex flex-col flex-1 border-t border-slate-50">
                                    {hasDiscount && (
                                        <span className="text-[11px] text-slate-400 line-through">$ {compareAtPrice.toLocaleString("es-UY")}</span>
                                    )}
                                    {priceAmount > 0 && (
                                        <div className="flex items-start gap-0.5 mb-0.5">
                                            <span className="text-[10px] text-slate-800 mt-0.5">$</span>
                                            <span className="text-[18px] md:text-[20px] font-normal text-slate-800 leading-none">{price}</span>
                                        </div>
                                    )}
                                    {priceAmount > 1000 && (
                                        <span className="text-[10px] md:text-[11px] text-emerald-700 font-medium mb-1">
                                            12x ${installments} sin interés
                                        </span>
                                    )}
                                    {priceAmount > 2000 && (
                                        <span className="inline-flex items-center text-emerald-800 text-[10px] font-bold w-fit bg-[#00a650]/10 px-1 py-0.5 rounded mb-1">
                                            <Truck className="w-2.5 h-2.5 mr-0.5" /> Envío gratis
                                        </span>
                                    )}
                                    <h3 className="text-[12px] md:text-[13px] text-slate-600 font-normal leading-snug line-clamp-2 mt-auto group-hover:text-primary transition-colors">
                                        {node.title}
                                    </h3>
                                </div>
                            </Link>
                        </Card>
                    );
                })}
            </SnapCarousel>
        </section>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProductGrid({ products }: { products: any[] }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[420px]">
            {products.map(({ node }: any, i: number) => {
                // Keep a slightly featured first item but much cleaner
                let customSpans = "";
                if (i === 0) customSpans = "sm:col-span-2 lg:col-span-2";

                return (
                    <Link
                        key={node.handle}
                        href={`/products/${node.handle}`}
                        className={`group outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl block h-full ${customSpans}`}
                    >
                        <Card className="h-full flex flex-col overflow-hidden transition-colors hover:border-primary/50">
                            {/* Image Container */}
                            <div className="relative w-full aspect-[4/3] bg-secondary/5 flex items-center justify-center p-8 border-b">
                                {node.featuredImage ? (
                                    <Image
                                        src={node.featuredImage.url}
                                        alt={node.featuredImage.altText || node.title}
                                        fill
                                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-in-out mix-blend-multiply"
                                        sizes={i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                                        priority={i < 4}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-xs transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                                        CH
                                    </div>
                                )}

                                {/* Tag for the first item */}
                                {i === 0 && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <Badge variant="default" className="text-[10px] tracking-widest uppercase">
                                            Nuevo Ingreso
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Information Container */}
                            <CardContent className="flex-1 flex flex-col justify-start p-5 pb-2">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                                        {node.title}
                                    </h3>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-5 pt-0 border-t mx-5 mt-auto flex items-center justify-between border-border/50 bg-card">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-4">
                                    ID: {node.handle.slice(0, 8)}
                                </span>
                                <span className="text-sm font-bold text-primary mt-4">
                                    {node.priceRange.minVariantPrice.currencyCode} ${Number(node.priceRange.minVariantPrice.amount).toFixed(2)}
                                </span>
                            </CardFooter>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}

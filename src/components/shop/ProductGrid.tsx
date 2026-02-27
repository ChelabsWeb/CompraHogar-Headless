"use client";

import Image from "next/image";
import Link from "next/link";

export function ProductGrid({ products }: { products: Record<string, unknown>[] }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(({ node }: Record<string, any>) => {
                const price = Number(node.priceRange.minVariantPrice.amount).toFixed(2);
                const currency = node.priceRange.minVariantPrice.currencyCode;

                return (
                    <Link
                        key={node.handle}
                        href={`/products/${node.handle}`}
                        className="group flex flex-col gap-3"
                    >
                        {/* Image Box - Light Grey Background */}
                        <div className="relative w-full aspect-[4/5] bg-secondary flex items-center justify-center overflow-hidden">
                            {node.featuredImage ? (
                                <Image
                                    src={node.featuredImage.url}
                                    alt={node.featuredImage.altText || node.title}
                                    fill
                                    className="object-contain object-center scale-90 group-hover:scale-100 transition-transform duration-500 ease-out"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            ) : (
                                <div className="text-muted-foreground text-xs uppercase">Sin imagen</div>
                            )}
                        </div>

                        {/* Product Info - Strictly Left Aligned */}
                        <div className="flex flex-col gap-1 text-left px-1">
                            <h3 className="font-bold text-[14px] md:text-[15px] text-foreground leading-tight line-clamp-2">
                                {node.title}
                            </h3>
                            <p className="text-muted-foreground text-[14px]">
                                {currency} ${price}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

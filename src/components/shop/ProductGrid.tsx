"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ProductGrid({ products }: { products: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4 p-4">
            {products.map(({ node }: any, i: number) => {
                const isFeatured = i === 0; // Make the first item featured/larger

                return (
                    <Link
                        key={node.handle}
                        href={`/products/${node.handle}`}
                        className={`group relative overflow-hidden bg-white/5 rounded-2xl block ${isFeatured ? "md:col-span-2 md:row-span-2 aspect-[16/10] md:aspect-auto" : "aspect-[4/5]"
                            }`}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />

                        {node.featuredImage && (
                            <Image
                                src={node.featuredImage.url}
                                alt={node.featuredImage.altText || node.title}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                                priority={isFeatured}
                            />
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex justify-between items-end">
                            <div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="overflow-hidden"
                                >
                                    <h3 className={`font-semibold tracking-tight text-white drop-shadow-lg ${isFeatured ? 'text-4xl md:text-5xl mb-2' : 'text-xl mb-1'}`}>
                                        {node.title}
                                    </h3>
                                </motion.div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <p className="text-white/80 font-medium">
                                        {node.priceRange.minVariantPrice.currencyCode} ${Number(node.priceRange.minVariantPrice.amount).toFixed(2)}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <ArrowUpRight className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

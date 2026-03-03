"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductView({ product }: { product: any }) {
    const images = product.images?.edges || [];
    const price = product.priceRange?.minVariantPrice;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("8");
    const [selectedColor, setSelectedColor] = useState("blue");

    const activeImage = images[activeImageIndex]?.node;

    return (
        <div className="min-h-screen bg-muted/50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="bg-card w-full max-w-6xl rounded-2xl shadow-xl flex flex-col md:flex-row relative overflow-hidden border">

                {/* Close Button (Simulated from reference) */}
                <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors z-50">
                    <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Highly Rated Badge */}
                <div className="absolute top-8 left-8 md:left-40 z-20">
                    <Badge className="bg-black hover:bg-black/80 text-white rounded-md px-3 py-1.5 text-xs font-semibold gap-1.5 flex items-center">
                        <Star className="w-3.5 h-3.5 fill-white" /> Highly Rated
                    </Badge>
                </div>

                {/* LEFT SIDE: Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row p-6 md:p-8 gap-6 w-full md:w-[55%]">

                    {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 w-full md:w-24 shrink-0">
                        {images.map(({ node }: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveImageIndex(i)}
                                className={`relative aspect-square w-20 md:w-full rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImageIndex === i ? "border-primary" : "border-transparent hover:border-border"} bg-secondary/10`}
                            >
                                <Image
                                    src={node.url}
                                    alt={node.altText || `Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover mix-blend-multiply p-2"
                                    sizes="100px"
                                />
                            </button>
                        ))}
                        {images.length === 0 && (
                            <div className="aspect-square w-20 md:w-full rounded-xl bg-muted border-2 border-transparent"></div>
                        )}
                    </div>

                    {/* Main Image */}
                    <div className="relative flex-1 bg-secondary/5 rounded-2xl flex items-center justify-center overflow-hidden min-h-[400px]">
                        {activeImage ? (
                            <Image
                                src={activeImage.url}
                                alt={activeImage.altText || product.title}
                                fill
                                priority
                                className="object-contain p-8 mix-blend-multiply transition-opacity duration-500"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="text-muted-foreground text-sm">No Image Available</div>
                        )}

                        {/* Arrows (Simulated) */}
                        <div className="absolute bottom-6 right-6 flex items-center gap-2">
                            <button
                                onClick={() => setActiveImageIndex(prev => Math.max(0, prev - 1))}
                                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                                disabled={activeImageIndex === 0}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setActiveImageIndex(prev => Math.min(images.length - 1, prev + 1))}
                                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                                disabled={activeImageIndex === images.length - 1}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Product Info */}
                <div className="w-full md:w-[45%] flex flex-col p-6 md:p-12 md:pl-6 justify-center">

                    <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-4">
                        {product.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="text-2xl font-bold">
                            {price?.currencyCode} ${Number(price?.amount || 0).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-4 h-4 text-[#e77600] fill-[#e77600]" />
                            ))}
                            <span className="text-sm font-semibold text-foreground ml-2">(458 reviews)</span>
                        </div>
                    </div>

                    <div
                        className="text-muted-foreground text-sm leading-relaxed mb-8 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />

                    {/* Color Selector */}
                    <div className="mb-8">
                        <p className="text-sm font-semibold mb-3">Color:</p>
                        <div className="flex items-center gap-3">
                            {/* Dummy colors for layout purposes */}
                            <button
                                onClick={() => setSelectedColor("blue")}
                                className={`w-8 h-8 rounded-full bg-[#52559e] ${selectedColor === 'blue' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            />
                            <button
                                onClick={() => setSelectedColor("orange")}
                                className={`w-8 h-8 rounded-full bg-[#c25a1b] ${selectedColor === 'orange' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            />
                            <button
                                onClick={() => setSelectedColor("green")}
                                className={`w-8 h-8 rounded-full bg-[#1b8c3c] ${selectedColor === 'green' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-8">
                        <p className="text-sm font-semibold mb-3">Select Size :</p>
                        <div className="flex items-center gap-2">
                            {["7", "8", "9", "10", "11"].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-10 rounded-md border text-sm font-medium transition-colors ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-background hover:border-foreground'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <Button size="lg" className="flex-1 bg-black text-white hover:bg-black/90 font-bold h-12 rounded-lg">
                            Add to Bag
                        </Button>
                        <Button variant="outline" size="lg" className="flex-1 font-bold h-12 rounded-lg border-border hover:bg-muted hidden sm:flex">
                            Add to Wishlist
                        </Button>
                    </div>

                </div>
            </div>
        </div >
    );
}

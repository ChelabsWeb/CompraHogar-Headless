"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { useCart } from "@/components/cart/CartProvider";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";

interface WishlistProduct {
    id: string;
    title: string;
    handle: string;
    availableForSale: boolean;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    featuredImage: {
        url: string;
        altText: string | null;
    } | null;
    variants: {
        edges: {
            node: {
                id: string;
            };
        }[];
    };
}

function SkeletonCard() {
    return (
        <div className="rounded-xl overflow-hidden bg-white shadow-sm animate-pulse">
            <div className="aspect-[4/3] bg-slate-100" />
            <div className="p-3 space-y-2">
                <div className="h-5 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
                <div className="h-8 bg-slate-100 rounded w-full mt-2" />
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Heart className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-lg font-semibold text-slate-700 mb-1">
                No tenes favoritos aun
            </h2>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
                Cuando encuentres productos que te gusten, toca el corazon para guardarlos aqui.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#21645d] text-white text-sm font-medium hover:bg-[#1a504a] transition-colors"
            >
                Explorar productos
            </Link>
        </div>
    );
}

export default function FavoritosPage() {
    const { items } = useWishlist();
    const { addToCart, setIsCartOpen } = useCart();
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const fetchProducts = useCallback(async (ids: string[]) => {
        if (ids.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: getProductsByIdsQuery,
                variables: { ids },
            });
            const fetched: WishlistProduct[] =
                body.data?.nodes?.filter(Boolean) || [];
            setProducts(fetched);
        } catch (error) {
            console.error("Error fetching wishlist products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(items);
    }, [items, fetchProducts]);

    const handleAddToCart = async (product: WishlistProduct) => {
        const variantId = product.variants?.edges?.[0]?.node?.id;
        if (!variantId) return;

        setAddingToCart(product.id);
        try {
            await addToCart(variantId, 1);
            setIsCartOpen(true);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(null);
        }
    };

    // Show empty state when not loading and no items
    if (!loading && items.length === 0) {
        return (
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Mis Favoritos
                    </h1>
                    <p className="text-sm text-slate-500">0 producto(s)</p>
                </div>
                <EmptyState />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Mis Favoritos
                </h1>
                <p className="text-sm text-slate-500">
                    {items.length} producto(s)
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: items.length || 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => {
                        const priceAmount = Number(
                            product.priceRange?.minVariantPrice?.amount || 0
                        );
                        const price = priceAmount.toLocaleString("es-UY");
                        const isAdding = addingToCart === product.id;

                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.handle}`}
                                className="group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                    {product.featuredImage?.url ? (
                                        <Image
                                            src={product.featuredImage.url}
                                            alt={
                                                product.featuredImage.altText ||
                                                product.title
                                            }
                                            fill
                                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
                                            Sin imagen
                                        </div>
                                    )}

                                    <FavoriteButton
                                        productId={product.id}
                                        className="absolute top-2 right-2"
                                    />

                                    {/* Sold out overlay */}
                                    {!product.availableForSale && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-slate-900/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                                Agotado
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3 flex flex-col flex-1">
                                    {/* Price */}
                                    {priceAmount > 0 ? (
                                        <div className="flex items-start gap-0.5 mb-1">
                                            <span className="text-[11px] sm:text-sm font-normal text-slate-800 mt-0.5">
                                                $
                                            </span>
                                            <span className="text-[18px] sm:text-[22px] font-normal text-slate-800 leading-none">
                                                {price}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500 mb-1">
                                            Consultar precio
                                        </span>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-sm text-slate-600 line-clamp-2 mb-3 flex-1">
                                        {product.title}
                                    </h3>

                                    {/* Add to cart button */}
                                    {product.availableForSale && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                            disabled={isAdding}
                                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#21645d] text-white text-xs sm:text-sm font-medium hover:bg-[#1a504a] transition-colors disabled:opacity-60"
                                        >
                                            {isAdding ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                            )}
                                            Agregar al carrito
                                        </button>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

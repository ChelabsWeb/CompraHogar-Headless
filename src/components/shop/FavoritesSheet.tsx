"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { useWishlist } from "./WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";

interface FavoritesSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

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

export function FavoritesSheet({ isOpen, onClose }: FavoritesSheetProps) {
    const { items, toggle } = useWishlist();
    const { addToCart, setIsCartOpen } = useCart();
    const [products, setProducts] = useState<WishlistProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || items.length === 0) {
            if (items.length === 0) setProducts([]);
            return;
        }

        let cancelled = false;

        async function fetchProducts() {
            setIsLoading(true);
            try {
                const { body } = await shopifyFetch({
                    query: getProductsByIdsQuery,
                    variables: { ids: items },
                    cache: "no-store",
                });

                if (!cancelled && body?.data?.nodes) {
                    // Filter out null nodes (deleted products)
                    const validProducts = body.data.nodes.filter(
                        (node: WishlistProduct | null) => node !== null && node.id
                    );
                    setProducts(validProducts);
                }
            } catch (error) {
                console.error("Error fetching wishlist products:", error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, [isOpen, items]);

    const handleAddToCart = async (product: WishlistProduct) => {
        const firstVariantId = product.variants.edges[0]?.node?.id;
        if (!firstVariantId) return;

        setAddingToCart(product.id);
        try {
            await addToCart(firstVariantId, 1);
            setIsCartOpen(true);
            onClose();
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Favoritos" side="right">
            {isLoading ? (
                /* Loading skeletons */
                <div className="space-y-4 -mx-6 px-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-3 bg-slate-200 rounded w-1/3" />
                                <div className="h-3 bg-slate-200 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full text-center -mx-6 px-6">
                    <Heart className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-1">
                        No tenes favoritos aun
                    </p>
                    <p className="text-sm text-slate-500 mb-6">
                        Agrega productos a tu lista de favoritos para verlos aca.
                    </p>
                    <Link
                        href="/"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 bg-[#21645d] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#1a534d] transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Explorar productos
                    </Link>
                </div>
            ) : (
                /* Products list */
                <div className="flex flex-col h-full -mx-6">
                    <div className="flex-1 overflow-y-auto px-6 space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex gap-3 py-3 border-b border-slate-100 last:border-0"
                            >
                                {/* Thumbnail */}
                                <Link
                                    href={`/products/${product.handle}`}
                                    onClick={onClose}
                                    className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0"
                                >
                                    {product.featuredImage ? (
                                        <Image
                                            src={product.featuredImage.url}
                                            alt={product.featuredImage.altText || product.title}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                    )}
                                </Link>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/products/${product.handle}`}
                                        onClick={onClose}
                                        className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-[#21645d] transition-colors"
                                    >
                                        {product.title}
                                    </Link>

                                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                                        ${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString("es-AR")}
                                    </p>

                                    <div className="flex items-center justify-between mt-1.5">
                                        <div className="flex items-center gap-2">
                                            {product.availableForSale ? (
                                                <span className="text-xs text-emerald-600 font-medium">
                                                    En stock
                                                </span>
                                            ) : (
                                                <span className="text-xs text-red-500 font-medium">
                                                    Agotado
                                                </span>
                                            )}

                                            <button
                                                className="text-xs bg-[#21645d] text-white rounded-lg px-3 py-1.5 hover:bg-[#1a534d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={
                                                    !product.availableForSale ||
                                                    addingToCart === product.id
                                                }
                                            >
                                                {addingToCart === product.id
                                                    ? "Agregando..."
                                                    : "Agregar al carrito"}
                                            </button>
                                        </div>

                                        <button
                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                            onClick={() => toggle(product.id)}
                                            aria-label={`Quitar ${product.title} de favoritos`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 mt-auto">
                        <Link
                            href="/cuenta/favoritos"
                            onClick={onClose}
                            className="text-sm font-medium text-[#21645d] hover:underline"
                        >
                            Ver todos &rarr;
                        </Link>
                    </div>
                </div>
            )}
        </Drawer>
    );
}

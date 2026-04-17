"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Loader2, GitCompare, ArrowLeft } from "lucide-react";
import { useCompare } from "@/components/shop/CompareProvider";
import { useCart } from "@/components/cart/CartProvider";
import { shopifyFetch } from "@/lib/shopify";

interface CompareProduct {
    id: string;
    title: string;
    handle: string;
    availableForSale: boolean;
    priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange?: {
        maxVariantPrice: { amount: string; currencyCode: string };
    };
    featuredImage: { url: string; altText: string | null } | null;
    variants: { edges: { node: { id: string } }[] };
    material?: { value: string } | null;
    rendimiento?: { value: string } | null;
    instruccionesLavado?: { value: string } | null;
}

const compareProductsQuery = `
  query compareProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        compareAtPriceRange {
          maxVariantPrice { amount currencyCode }
        }
        featuredImage { url altText }
        variants(first: 1) {
          edges { node { id } }
        }
        material: metafield(namespace: "custom", key: "material") { value }
        rendimiento: metafield(namespace: "custom", key: "rendimiento") { value }
        instruccionesLavado: metafield(namespace: "custom", key: "instrucciones_de_cuidado") { value }
      }
    }
  }
`;

function formatPrice(amount: string | number): string {
    const n = Number(amount || 0);
    return n.toLocaleString("es-UY");
}

export default function CompararPage() {
    const { items, remove, clear, count } = useCompare();
    const { addToCart, setIsCartOpen } = useCart();
    const [products, setProducts] = useState<CompareProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);

    const fetchProducts = useCallback(async (ids: string[]) => {
        if (ids.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: compareProductsQuery,
                variables: { ids },
            });
            const fetched: CompareProduct[] =
                body.data?.nodes?.filter(Boolean) || [];
            const ordered = ids
                .map((id) => fetched.find((p) => p.id === id))
                .filter((p): p is CompareProduct => !!p);
            setProducts(ordered);
        } catch (error) {
            console.error("Error fetching compare products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(items);
    }, [items, fetchProducts]);

    const handleAddToCart = async (product: CompareProduct) => {
        const variantId = product.variants?.edges?.[0]?.node?.id;
        if (!variantId) return;
        setAddingId(product.id);
        try {
            await addToCart(variantId, 1);
            setIsCartOpen(true);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingId(null);
        }
    };

    if (!loading && count === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <GitCompare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    No tenés productos para comparar
                </h1>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    Agregá hasta 4 productos al comparador desde el catálogo
                    para verlos lado a lado.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#21645d] text-white text-sm font-medium hover:bg-[#1a504a] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Explorar productos
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#21645d]" />
                Cargando comparación...
            </div>
        );
    }

    const rows: Array<{
        label: string;
        render: (p: CompareProduct) => React.ReactNode;
    }> = [
        {
            label: "Precio",
            render: (p) => {
                const price = Number(p.priceRange?.minVariantPrice?.amount || 0);
                const compareAt = Number(
                    p.compareAtPriceRange?.maxVariantPrice?.amount || 0
                );
                const hasDiscount = compareAt > price;
                return (
                    <div>
                        {hasDiscount && (
                            <div className="text-xs text-slate-400 line-through">
                                $ {formatPrice(compareAt)}
                            </div>
                        )}
                        <div className="text-xl font-semibold text-slate-900">
                            {price > 0 ? `$ ${formatPrice(price)}` : "Consultar"}
                        </div>
                        {hasDiscount && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-white bg-secondary px-1.5 py-0.5 rounded">
                                -{Math.round((1 - price / compareAt) * 100)}%
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            label: "Cuotas sin interés",
            render: (p) => {
                const price = Number(p.priceRange?.minVariantPrice?.amount || 0);
                if (price <= 1000) return <span className="text-slate-400">—</span>;
                const cuota = (price / 12).toLocaleString("es-UY", {
                    maximumFractionDigits: 0,
                });
                return (
                    <span className="text-green-600 text-sm font-medium">
                        12x ${cuota}
                    </span>
                );
            },
        },
        {
            label: "Envío",
            render: (p) => {
                const price = Number(p.priceRange?.minVariantPrice?.amount || 0);
                return price > 2000 ? (
                    <span className="text-[#00a650] text-xs font-bold bg-[#00a650]/8 px-2 py-0.5 rounded">
                        Envío gratis
                    </span>
                ) : (
                    <span className="text-slate-500 text-sm">A calcular</span>
                );
            },
        },
        {
            label: "Disponibilidad",
            render: (p) =>
                p.availableForSale ? (
                    <span className="text-green-600 text-sm font-medium">
                        En stock
                    </span>
                ) : (
                    <span className="text-slate-400 text-sm">Agotado</span>
                ),
        },
        {
            label: "Material",
            render: (p) =>
                p.material?.value ? (
                    <span className="text-slate-700 text-sm">
                        {p.material.value}
                    </span>
                ) : (
                    <span className="text-slate-300 text-sm">—</span>
                ),
        },
        {
            label: "Rendimiento",
            render: (p) =>
                p.rendimiento?.value ? (
                    <span className="text-slate-700 text-sm">
                        {p.rendimiento.value}
                    </span>
                ) : (
                    <span className="text-slate-300 text-sm">—</span>
                ),
        },
        {
            label: "Cuidado",
            render: (p) =>
                p.instruccionesLavado?.value ? (
                    <span className="text-slate-700 text-sm">
                        {p.instruccionesLavado.value}
                    </span>
                ) : (
                    <span className="text-slate-300 text-sm">—</span>
                ),
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-28">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <GitCompare className="w-7 h-7 text-[#21645d]" />
                        Comparar productos
                    </h1>
                    <p className="text-sm text-slate-500">
                        {count} producto{count !== 1 ? "s" : ""} en comparación
                    </p>
                </div>
                <button
                    type="button"
                    onClick={clear}
                    className="text-sm text-slate-500 hover:text-red-600 transition-colors"
                >
                    Vaciar comparación
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full min-w-[640px]">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="sticky left-0 bg-slate-50 p-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32 sm:w-40">
                                Producto
                            </th>
                            {products.map((product) => (
                                <th
                                    key={product.id}
                                    className="p-4 text-left min-w-[200px] align-top"
                                >
                                    <div className="relative">
                                        <button
                                            type="button"
                                            aria-label={`Quitar ${product.title} del comparador`}
                                            onClick={() => remove(product.id)}
                                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <Link
                                            href={`/products/${product.handle}`}
                                            className="block group"
                                        >
                                            <div className="relative w-full aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3">
                                                {product.featuredImage?.url ? (
                                                    <Image
                                                        src={
                                                            product.featuredImage
                                                                .url
                                                        }
                                                        alt={
                                                            product.featuredImage
                                                                .altText ||
                                                            product.title
                                                        }
                                                        fill
                                                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                                                        sizes="200px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-[#21645d] transition-colors">
                                                {product.title}
                                            </h3>
                                        </Link>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.label}
                                className="border-b border-slate-100 last:border-0"
                            >
                                <td className="sticky left-0 bg-slate-50 p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider align-top">
                                    {row.label}
                                </td>
                                {products.map((product) => (
                                    <td
                                        key={product.id}
                                        className="p-4 align-top"
                                    >
                                        {row.render(product)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="sticky left-0 bg-slate-50 p-4" />
                            {products.map((product) => (
                                <td key={product.id} className="p-4">
                                    {product.availableForSale ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={addingId === product.id}
                                            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#21645d] text-white text-xs sm:text-sm font-medium hover:bg-[#1a504a] transition-colors disabled:opacity-60"
                                        >
                                            {addingId === product.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                            )}
                                            Agregar
                                        </button>
                                    ) : (
                                        <span className="block text-center text-xs text-slate-400">
                                            Agotado
                                        </span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

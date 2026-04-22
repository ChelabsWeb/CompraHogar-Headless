"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Calculator,
    Loader2,
    ShoppingCart,
    Info,
    Paintbrush,
    ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import { shopifyFetch } from "@/lib/shopify";

const DEFAULT_YIELD_M2_PER_LITER = 10;
const DEFAULT_PACKAGE_LITERS = 4;

interface PintProduct {
    id: string;
    title: string;
    handle: string;
    availableForSale: boolean;
    featuredImage: { url: string; altText: string | null } | null;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    rendimiento?: { value: string } | null;
    variants: {
        edges: { node: { id: string; title: string; availableForSale: boolean } }[];
    };
}

const paintCollectionQuery = `
  query paintCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            availableForSale
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            rendimiento: metafield(namespace: "custom", key: "rendimiento") { value }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

type PaintType = "interior" | "exterior";
type Openings = "none" | "few" | "many";

const OPENINGS_DISCOUNT: Record<Openings, number> = {
    none: 0,
    few: 0.1,
    many: 0.2,
};

function parseYield(raw: string | undefined): number {
    if (!raw) return DEFAULT_YIELD_M2_PER_LITER;
    const match = raw.match(/(\d+(?:[.,]\d+)?)/);
    if (!match) return DEFAULT_YIELD_M2_PER_LITER;
    const n = parseFloat(match[1].replace(",", "."));
    return isFinite(n) && n > 0 ? n : DEFAULT_YIELD_M2_PER_LITER;
}

function parsePackageLiters(title: string): number {
    const match = title.match(/(\d+(?:[.,]\d+)?)\s*L\b/i);
    if (match) {
        const n = parseFloat(match[1].replace(",", "."));
        if (isFinite(n) && n > 0) return n;
    }
    return DEFAULT_PACKAGE_LITERS;
}

function formatPrice(amount: number | string): string {
    return Number(amount || 0).toLocaleString("es-UY");
}

export default function CotizadorPinturaPage() {
    const { addToCart, setIsCartOpen } = useCart();

    const [ancho, setAncho] = useState("");
    const [largo, setLargo] = useState("");
    const [alto, setAlto] = useState("2.5");
    const [manos, setManos] = useState<1 | 2 | 3>(2);
    const [tipo, setTipo] = useState<PaintType>("interior");
    const [aberturas, setAberturas] = useState<Openings>("few");

    const [products, setProducts] = useState<PintProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingId, setAddingId] = useState<string | null>(null);

    const fetchProducts = useCallback(async (handle: string) => {
        setLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: paintCollectionQuery,
                variables: { handle, first: 20 },
            });
            const edges = body.data?.collection?.products?.edges || [];
            const fetched: PintProduct[] = edges
                .map((e: { node: PintProduct }) => e.node)
                .filter((p: PintProduct) => p.availableForSale);
            setProducts(fetched);
        } catch (error) {
            console.error("Error fetching paint products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handle =
            tipo === "interior" ? "pinturas-de-interior" : "pinturas-de-exterior";
        fetchProducts(handle);
    }, [tipo, fetchProducts]);

    const calculation = useMemo(() => {
        const a = parseFloat(ancho);
        const l = parseFloat(largo);
        const h = parseFloat(alto);
        if (!isFinite(a) || !isFinite(l) || !isFinite(h) || a <= 0 || l <= 0 || h <= 0) {
            return null;
        }
        const perimeter = (a + l) * 2;
        const wallArea = perimeter * h;
        const effectiveArea = wallArea * (1 - OPENINGS_DISCOUNT[aberturas]);
        return {
            perimeter,
            wallArea,
            effectiveArea,
            totalCoverageArea: effectiveArea * manos,
        };
    }, [ancho, largo, alto, aberturas, manos]);

    const handleAddToCart = async (
        product: PintProduct,
        quantity: number
    ) => {
        const variantId = product.variants?.edges?.[0]?.node?.id;
        if (!variantId || quantity < 1) return;
        setAddingId(product.id);
        try {
            await addToCart(variantId, quantity);
            setIsCartOpen(true);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setAddingId(null);
        }
    };

    const hasCalc = calculation !== null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
            <div className="mb-8">
                <nav className="text-xs text-slate-500 mb-2">
                    <Link href="/" className="hover:text-[#21645d]">
                        Inicio
                    </Link>{" "}
                    / <span className="text-slate-700">Cotizador de pintura</span>
                </nav>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 flex items-center gap-3">
                    <Paintbrush className="w-8 h-8 text-[#21645d]" />
                    Cotizador de pintura
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                    Ingresá las dimensiones de tu ambiente y calculamos
                    automáticamente cuántos litros de pintura necesitás y qué
                    productos te conviene comprar.
                </p>
            </div>

            <div className="grid lg:grid-cols-[360px_1fr] gap-6 lg:gap-8">
                <aside className="lg:sticky lg:top-28 self-start bg-white rounded-xl border border-slate-200 p-5 space-y-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <Calculator className="w-5 h-5 text-[#21645d]" />
                        Tus medidas
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                Ancho (m)
                            </label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                placeholder="3.5"
                                value={ancho}
                                onChange={(e) => setAncho(e.target.value)}
                                min="0"
                                step="0.1"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                Largo (m)
                            </label>
                            <Input
                                type="number"
                                inputMode="decimal"
                                placeholder="4.2"
                                value={largo}
                                onChange={(e) => setLargo(e.target.value)}
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Alto (m)
                        </label>
                        <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="2.5"
                            value={alto}
                            onChange={(e) => setAlto(e.target.value)}
                            min="0"
                            step="0.1"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Tipo de pintura
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(["interior", "exterior"] as const).map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setTipo(opt)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                                        tipo === opt
                                            ? "bg-[#21645d] text-white border-[#21645d]"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-[#21645d]"
                                    }`}
                                >
                                    {opt === "interior" ? "Interior" : "Exterior"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Manos de pintura
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {([1, 2, 3] as const).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setManos(n)}
                                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                                        manos === n
                                            ? "bg-[#21645d] text-white border-[#21645d]"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-[#21645d]"
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                            Puertas y ventanas
                        </label>
                        <div className="flex flex-col gap-2">
                            {(
                                [
                                    ["none", "Ninguna"],
                                    ["few", "Pocas (–10%)"],
                                    ["many", "Muchas (–20%)"],
                                ] as [Openings, string][]
                            ).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setAberturas(value)}
                                    className={`text-left py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                                        aberturas === value
                                            ? "bg-[#21645d] text-white border-[#21645d]"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-[#21645d]"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {hasCalc && (
                        <div className="pt-4 border-t border-slate-100 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Pared total</span>
                                <span className="font-medium text-slate-800">
                                    {calculation.wallArea.toFixed(1)} m²
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    Efectivo (con aberturas)
                                </span>
                                <span className="font-medium text-slate-800">
                                    {calculation.effectiveArea.toFixed(1)} m²
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">
                                    A cubrir ({manos} manos)
                                </span>
                                <span className="font-bold text-[#21645d]">
                                    {calculation.totalCoverageArea.toFixed(1)} m²
                                </span>
                            </div>
                        </div>
                    )}
                </aside>

                <section>
                    {!hasCalc ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center">
                            <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <h2 className="text-lg font-semibold text-slate-700 mb-1">
                                Completá las medidas
                            </h2>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                Ingresá ancho, largo y alto del ambiente para
                                ver los productos sugeridos con cantidades
                                calculadas.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center py-20 text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#21645d]" />
                            Cargando pinturas {tipo}...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-10 text-center">
                            <p className="text-sm text-slate-500">
                                No encontramos pinturas {tipo} disponibles en
                                este momento.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {products.length} productos sugeridos
                                </h2>
                                <Link
                                    href={`/collections/${
                                        tipo === "interior"
                                            ? "pinturas-de-interior"
                                            : "pinturas-de-exterior"
                                    }`}
                                    className="text-xs text-[#21645d] hover:underline inline-flex items-center gap-1"
                                >
                                    Ver catálogo completo
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {products.map((product) => {
                                    const yieldValue = parseYield(
                                        product.rendimiento?.value
                                    );
                                    const hasDeclaredYield =
                                        !!product.rendimiento?.value;
                                    const packageLiters = parsePackageLiters(
                                        product.title
                                    );
                                    const litersNeeded =
                                        calculation.totalCoverageArea / yieldValue;
                                    const packages = Math.max(
                                        1,
                                        Math.ceil(litersNeeded / packageLiters)
                                    );
                                    const unitPrice = Number(
                                        product.priceRange?.minVariantPrice?.amount ||
                                            0
                                    );
                                    const subtotal = unitPrice * packages;
                                    const isAdding = addingId === product.id;

                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <Link
                                                href={`/products/${product.handle}`}
                                                className="relative aspect-[4/3] bg-slate-50 block"
                                            >
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
                                                        className="object-contain p-4"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="p-4 flex flex-col flex-1">
                                                <Link
                                                    href={`/products/${product.handle}`}
                                                    className="font-medium text-slate-800 line-clamp-2 hover:text-[#21645d] transition-colors mb-1"
                                                >
                                                    {product.title}
                                                </Link>
                                                <p className="text-xs text-slate-500 mb-3">
                                                    Rendimiento:{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {yieldValue} m²/L
                                                    </span>
                                                    {!hasDeclaredYield && (
                                                        <span className="ml-1 text-slate-400">
                                                            (estimado)
                                                        </span>
                                                    )}
                                                </p>

                                                <div className="bg-[#21645d]/5 border border-[#21645d]/15 rounded-lg p-3 mb-3">
                                                    <div className="text-[11px] uppercase tracking-wide text-[#21645d] font-semibold mb-1">
                                                        Necesitás
                                                    </div>
                                                    <div className="text-[#21645d] font-bold text-lg leading-tight">
                                                        {litersNeeded.toFixed(1)} L
                                                    </div>
                                                    <div className="text-xs text-slate-600 mt-1">
                                                        ≈ {packages} envase
                                                        {packages !== 1 ? "s" : ""}{" "}
                                                        de {packageLiters} L
                                                    </div>
                                                </div>

                                                <div className="flex items-baseline gap-1 mb-3">
                                                    <span className="text-xs text-slate-500">
                                                        Precio unitario
                                                    </span>
                                                    <span className="text-sm font-medium text-slate-800">
                                                        $ {formatPrice(unitPrice)}
                                                    </span>
                                                </div>

                                                <div className="flex items-baseline gap-1 mb-4">
                                                    <span className="text-xs text-slate-500">
                                                        Subtotal estimado
                                                    </span>
                                                    <span className="text-base font-bold text-slate-900">
                                                        $ {formatPrice(subtotal)}
                                                    </span>
                                                </div>

                                                <Button
                                                    type="button"
                                                    disabled={isAdding}
                                                    onClick={() =>
                                                        handleAddToCart(
                                                            product,
                                                            packages
                                                        )
                                                    }
                                                    className="mt-auto w-full bg-[#f3843e] hover:bg-[#e07534] text-white"
                                                >
                                                    {isAdding ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : (
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                    )}
                                                    Agregar {packages} al carrito
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
                                * Los cálculos son estimativos. El rendimiento
                                real puede variar según el tipo de superficie,
                                porosidad y condiciones de aplicación. Te
                                recomendamos comprar un 10% extra para retoques.
                            </p>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

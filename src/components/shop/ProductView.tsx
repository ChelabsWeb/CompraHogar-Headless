"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck, Ruler, ArrowRight, X, Zap, Play, Box, Loader2, ShoppingCart } from "lucide-react";
import { FavoriteButton } from "@/components/shop/FavoriteButton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/CartProvider";
import { pushDatalayerEvent } from "@/lib/analytics";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { MaterialsCalculator } from "./MaterialsCalculator";
import { ShippingCalculator } from "@/components/shop/ShippingCalculator";
import { InfoDrawer } from "@/components/shared/InfoDrawer";
import type { ShopifyProduct, ShopifyMediaNode, ShopifyMediaSource, ShopifySelectedOption, ShopifyProductOption, ShopifyVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductViewProps {
    product: ShopifyProduct;
    isQuickView?: boolean;
    onClose?: () => void;
}

export function ProductView({ product, isQuickView = false, onClose }: ProductViewProps) {
    const { addToCart, isCartLoading, checkoutUrl } = useCart();
    // Use media.edges if available, otherwise fallback to images.edges or featuredImage (e.g. in QuickView from grid data)
    const mediaRaw = product.media?.edges || [];
    const media: { node: ShopifyMediaNode }[] = mediaRaw.length > 0
        ? mediaRaw
        : ((product as any).images?.edges?.length > 0)
            ? (product as any).images.edges.map(({ node }: { node: any }) => ({
                node: { mediaContentType: 'IMAGE' as const, image: node, previewImage: node, alt: node.altText }
            }))
            : (product as any).featuredImage
                ? [{ node: { mediaContentType: 'IMAGE' as const, image: (product as any).featuredImage, previewImage: (product as any).featuredImage, alt: (product as any).featuredImage?.altText } }]
                : [];
    const price = product.priceRange?.minVariantPrice;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isVariantChanging, setIsVariantChanging] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const galleryRef = useRef<HTMLDivElement>(null);

    const options = product.options || [];
    const variants = product.variants?.edges || [];

    // Find initial variant
    const initialVariant = variants.find(({ node }: { node: ShopifyVariant }) => node.availableForSale)?.node || variants[0]?.node;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialStates: Record<string, string> = {};
        if (initialVariant && initialVariant.selectedOptions) {
            initialVariant.selectedOptions.forEach((opt: ShopifySelectedOption) => {
                initialStates[opt.name] = opt.value;
            });
        } else {
            options.forEach((opt: ShopifyProductOption) => {
                initialStates[opt.name] = opt.values[0];
            });
        }
        return initialStates;
    });

    const activeMedia = media[activeImageIndex]?.node;

    // Gallery navigation
    const goToImage = useCallback((index: number) => {
        if (index < 0 || index >= media.length) return;
        setActiveImageIndex(index);
        if (galleryRef.current) {
            const child = galleryRef.current.children[index] as HTMLElement;
            child?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [media.length]);

    const goNext = useCallback(() => goToImage(activeImageIndex + 1), [activeImageIndex, goToImage]);
    const goPrev = useCallback(() => goToImage(activeImageIndex - 1), [activeImageIndex, goToImage]);

    // Zoom on hover (desktop only, not QuickView)
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isQuickView) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    }, [isQuickView]);

    const renderMedia = (node: ShopifyMediaNode | undefined) => {
        if (!node) return <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sin Media</div>;

        if (node.mediaContentType === 'VIDEO') {
            const videoSource = node.sources?.find((s: ShopifyMediaSource) => s.format === 'mp4') || node.sources?.[0];
            return (
                <video
                    src={videoSource?.url}
                    title={node.alt || product.title}
                    playsInline
                    muted
                    loop
                    controls
                    className="w-full h-full object-contain bg-white"
                />
            );
        }

        if (node.mediaContentType === 'MODEL_3D') {
            const modelSource = node.sources?.find((s: ShopifyMediaSource) => s.format === 'glb') || node.sources?.[0];
            const ModelViewer = "model-viewer" as any;
            return (
                <>
                    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
                    <ModelViewer
                        src={modelSource?.url}
                        alt={node.alt || product.title}
                        auto-rotate="true"
                        camera-controls="true"
                        ar="true"
                        shadow-intensity="1"
                        style={{ width: '100%', height: '100%', backgroundColor: 'white' }}
                    >
                    </ModelViewer>
                </>
            );
        }

        // Fallback to IMAGE
        const imageUrl = node.image?.url || node.previewImage?.url;
        if (!imageUrl) return <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sin Media</div>;
        return (
            <Image
                src={imageUrl}
                alt={node.alt || node.previewImage?.altText || product.title}
                fill
                priority
                className={cn(
                    "object-contain z-0 pointer-events-none transition-transform duration-300 ease-out",
                    !isQuickView && isZoomed ? "scale-[2]" : "scale-100"
                )}
                style={!isQuickView && isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                sizes="(max-width: 1024px) 100vw, 55vw"
            />
        );
    }

    // Compute current variant
    const currentVariant = variants.find(({ node }: { node: ShopifyVariant }) => {
        if (!node.selectedOptions) return false;
        return node.selectedOptions.every((opt: ShopifySelectedOption) => selectedOptions[opt.name] === opt.value);
    })?.node || initialVariant;

    const displayPrice = currentVariant?.price || price;

    const handleOptionChange = (name: string, value: string) => {
        setIsVariantChanging(true);
        setSelectedOptions((prev) => ({
            ...prev,
            [name]: value
        }));
        setTimeout(() => setIsVariantChanging(false), 250);
    };

    const isOutOfStock = !currentVariant?.availableForSale;

    const [backInStockSent, setBackInStockSent] = useState(false);
    const handleBackInStockSubmit = async (email: string) => {
        try {
            const res = await fetch("/api/back-in-stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, variantId: currentVariant?.id }),
            });
            if (res.ok) setBackInStockSent(true);
        } catch {}
    };

    const productExternalId = product.id.split("/").pop();

    const isM2Product = product.tags?.some((tag: string) => tag.toLowerCase() === "m2" || tag.toLowerCase() === "rendimiento");
    const yieldPerUnit = parseFloat(product.rendimiento?.value ?? '') || 1.44;
    const unitName = product.tags?.some((tag: string) => tag.toLowerCase() === "rendimiento") ? "Litros" : "m²";
    const packagingName = product.tags?.some((tag: string) => tag.toLowerCase() === "rendimiento") ? "Lata" : "Caja";

    return (
        <div className={cn("w-full flex flex-col lg:flex-row bg-transparent text-slate-900", isQuickView ? "pb-4" : "pb-32 lg:pb-8")}>

            {/* LADO IZQUIERDO: Galeria de Fotos Inmersiva */}
            <div className={cn("w-full lg:w-[55%] relative flex flex-col bg-transparent", isQuickView ? "p-5 pt-8 flex items-center justify-center" : "pb-6 lg:pb-0")}>
                {/* Badge Superior */}
                <div className={cn("absolute top-6 lg:top-10 left-6 lg:left-10 z-20 flex flex-col gap-2 pointer-events-none", isQuickView && "hidden")}>
                    <Badge variant="default" className="shadow-lg backdrop-blur-md px-4 py-1.5 uppercase tracking-widest text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Grado Premium
                    </Badge>
                </div>

                {/* Imagen Principal */}
                <div
                    ref={galleryRef}
                    className={cn(
                        "relative flex items-center justify-center w-full mx-auto group overflow-x-auto snap-x snap-mandatory no-scrollbar",
                        isQuickView
                            ? "aspect-square rounded-2xl bg-slate-50/80 overflow-hidden"
                            : "aspect-square lg:aspect-[4/3] mb-2 lg:mb-8 bg-slate-50/80 rounded-2xl lg:rounded-3xl border border-slate-100 overflow-hidden cursor-zoom-in"
                    )}
                    onScroll={(e) => {
                        const { scrollLeft, clientWidth } = e.currentTarget;
                        const index = Math.round(scrollLeft / clientWidth);
                        if (index !== activeImageIndex) setActiveImageIndex(index);
                    }}
                    onMouseEnter={() => !isQuickView && setIsZoomed(true)}
                    onMouseLeave={() => { setIsZoomed(false); }}
                    onMouseMove={handleMouseMove}
                >
                    {media.length > 0 ? (
                        media.map((item: { node: ShopifyMediaNode }, idx: number) => (
                            <div key={idx} className="w-full h-full shrink-0 snap-center relative flex items-center justify-center">
                                {renderMedia(item.node)}
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                             <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sin Media</span>
                        </div>
                    )}

                    {/* Desktop Navigation Arrows */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className={cn(
                                    "hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-all",
                                    activeImageIndex === 0 && "opacity-0 pointer-events-none"
                                )}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className={cn(
                                    "hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-all",
                                    activeImageIndex === media.length - 1 && "opacity-0 pointer-events-none"
                                )}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {media.length > 1 && (
                        <div className="absolute bottom-3 right-3 z-20 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {activeImageIndex + 1}/{media.length}
                        </div>
                    )}
                </div>

                {/* Mobile Indicator Dots */}
                {media.length > 1 && (
                    <div className="flex lg:hidden justify-center gap-1.5 mt-2 mb-4 w-full bg-transparent items-center">
                        {media.map((_: { node: ShopifyMediaNode }, idx: number) => {
                            const isActive = activeImageIndex === idx;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={false}
                                    animate={{
                                        width: isActive ? 16 : 6,
                                        backgroundColor: isActive ? "#f97316" : "#cbd5e1"
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="h-1.5 rounded-full"
                                />
                            );
                        })}
                    </div>
                )}

                {/* Miniaturas Inferiores (Film Strip) - Desktop Only */}
                {!isQuickView && (
                    <div className="hidden lg:flex flex-wrap gap-3 px-2 z-20 mb-8 lg:mb-0 justify-center max-w-xl mx-auto">
                        {media.map(({ node }: { node: ShopifyMediaNode }, i: number) => {
                            const isVideo = node.mediaContentType === 'VIDEO';
                            const is3D = node.mediaContentType === 'MODEL_3D';
                            const thumbnailUrl = node.previewImage?.url || node.image?.url;

                            return (
                                <button
                                    key={i}
                                    onClick={() => goToImage(i)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${activeImageIndex === i ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md" : "border border-slate-200 opacity-60 hover:opacity-100 hover:scale-105"} bg-white flex items-center justify-center`}
                                >
                                    {thumbnailUrl && (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={node.alt || `Vista ${i + 1}`}
                                            fill
                                            className="object-cover transition-transform"
                                            sizes="80px"
                                        />
                                    )}
                                    {isVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                                            <Play className="w-8 h-8 text-white drop-shadow-md fill-white/80" />
                                        </div>
                                    )}
                                    {is3D && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                                            <Box className="w-8 h-8 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* LADO DERECHO: Especificaciones & Compra (Buy Box ML Style) */}
            <div className={cn(
                "w-full lg:w-[45%] flex flex-col bg-transparent p-5 lg:px-12 lg:py-6",
                !isQuickView && "lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
            )}>

                {/* Meta info & Title */}
                <div className="mb-2 text-[12px] text-slate-500 font-medium tracking-wide flex items-center justify-between">
                    <span>Nuevo</span>
                    <div className="flex gap-2 items-center">
                        <FavoriteButton productId={product.id} size="md" />
                        {isQuickView && onClose && (
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-11 w-11 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                <h1 className="text-xl lg:text-[22px] font-semibold text-slate-900 leading-tight mb-2">
                    {product.title}
                </h1>

                {/* Stars placeholder — will be connected to real reviews */}
                <div className="mb-4" />

                {/* Price Section ML Style */}
                <div className={`mb-4 flex flex-col transition-all duration-300 ${isVariantChanging ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
                    <span className="text-[40px] font-light text-slate-900 leading-none flex items-start tracking-tight">
                        <span className="text-[20px] mt-2 mr-1">$</span>
                        {Number(displayPrice?.amount || 0).toLocaleString("es-UY")}
                    </span>
                    <span className="text-[16px] font-medium mt-1 text-green-600">
                        en 12x ${(Number(displayPrice?.amount || 0) / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 })} sin interés
                    </span>
                    <div className="mt-2 flex items-center justify-start">
                        <InfoDrawer
                            title="Medios de Pago"
                            triggerText="Ver los medios de pago"
                            className="text-[14px] text-primary hover:text-primary/80 font-medium p-0 h-auto justify-start no-underline hover:underline"
                        >
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Tarjetas de Crédito</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-8 bg-[#1434CB] rounded flex items-center justify-center text-white font-bold text-xs italic">
                                                    VISA
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Visa Crédito</p>
                                                    <p className="text-xs text-muted-foreground">Hasta 12 cuotas sin interés</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-8 bg-zinc-100 rounded flex items-center justify-center overflow-hidden">
                                                    <div className="absolute left-2 w-5 h-5 rounded-full bg-[#EB001B]/80 mix-blend-multiply"></div>
                                                    <div className="absolute right-2 w-5 h-5 rounded-full bg-[#F79E1B]/80 mix-blend-multiply"></div>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Mastercard</p>
                                                    <p className="text-xs text-muted-foreground">Hasta 6 cuotas fijas</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Transferencia o Efectivo</h3>
                                    <div className="p-5 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                                        <p className="text-sm text-green-800 dark:text-green-300">
                                            Obtén un <span className="font-bold text-green-900 dark:text-green-100 italic">15% de descuento adicional</span> abonando mediante transferencia bancaria, depósito o en efectivo de forma física.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </InfoDrawer>
                    </div>
                </div>

                {/* Options / Selectors */}
                <div className="flex flex-col gap-4 mb-5">
                    {options.map((option: ShopifyProductOption) => {
                        if (option.name === 'Title' && option.values[0] === 'Default Title') return null;
                        const isColor = option.name.toLowerCase().includes('color');

                        return (
                            <div key={option.name}>
                                <p className="text-[14px] font-semibold text-slate-900 mb-2">
                                    {option.name}: <span className="font-normal text-slate-600">{selectedOptions[option.name]}</span>
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {option.values.map((value: string) => {
                                        const isSelected = selectedOptions[option.name] === value;

                                        if (isColor) {
                                            let bgColor = value.toLowerCase().replace(/\s+/g, '');
                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() => handleOptionChange(option.name, value)}
                                                    className={`w-11 h-11 rounded-full border-2 transition-all p-0.5 ${isSelected ? 'border-primary' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: bgColor }} />
                                                    <span className="sr-only">{value}</span>
                                                </button>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={value}
                                                variant={isSelected ? "default" : "outline"}
                                                onClick={() => handleOptionChange(option.name, value)}
                                                className={`min-w-[44px] h-11 ${isSelected ? '' : 'text-slate-600'}`}
                                            >
                                                {value}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quantity and Actions */}
                <div className={`mt-auto flex flex-col gap-4 transition-colors ${isOutOfStock ? 'bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm' : 'bg-transparent border border-transparent p-0'}`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-2">
                        <span className={`text-sm font-medium w-24 shrink-0 ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>Cantidad</span>
                        <div className={`${isOutOfStock ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} disabled={isOutOfStock} />
                        </div>
                        {isOutOfStock ? (
                            <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200 shadow-none font-semibold">AGOTADO</Badge>
                        ) : (
                            <span className="text-xs text-slate-500">Stock disponible</span>
                        )}
                    </div>

                    {!isOutOfStock && isM2Product && (
                        <div className="py-2 border-b border-slate-100 mb-2">
                           <MaterialsCalculator
                             yieldPerUnit={yieldPerUnit}
                             unitName={unitName}
                             packagingName={packagingName}
                             onAddToCart={async (calcQuantity) => {
                                 if (currentVariant?.id) {
                                     pushDatalayerEvent({
                                         event: 'add_to_cart',
                                         ecommerce: {
                                             currency: displayPrice?.currencyCode || 'USD',
                                             value: Number(displayPrice?.amount || 0),
                                             items: [{
                                                 item_id: currentVariant.id,
                                                 item_name: product.title,
                                                 price: Number(displayPrice?.amount || 0),
                                                 quantity: calcQuantity,
                                                 item_variant: currentVariant.title !== 'Default Title' ? currentVariant.title : undefined
                                             }]
                                         }
                                     });
                                     await addToCart(currentVariant.id, calcQuantity);
                                     setIsCartOpen(true);
                                 }
                             }}
                           />
                        </div>
                    )}

                    {!isOutOfStock ? (
                        <div className="hidden lg:flex flex-col gap-2 relative">
                            {/* Desktop ML Style Buttons */}
                            <Button
                                size={isQuickView ? "default" : "lg"}
                                className={`w-full text-base font-semibold h-[48px] rounded-md transition-all duration-300 bg-orange-500 hover:bg-orange-600 text-white ${isVariantChanging ? 'opacity-80' : ''}`}
                                onClick={async () => {
                                    if (currentVariant?.id) {
                                        const url = await addToCart(currentVariant.id, quantity);
                                        if (url) window.location.href = url;
                                        else if (checkoutUrl) window.location.href = checkoutUrl;
                                        else setIsCartOpen(true);
                                    }
                                }}
                                disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                            >
                                {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin" /> : "Comprar ahora"}
                            </Button>
                            <Button
                                variant="secondary"
                                size={isQuickView ? "default" : "lg"}
                                className={`w-full text-base font-semibold h-[48px] rounded-md transition-all duration-300 bg-orange-50 hover:bg-orange-100 text-orange-600 border-0 ${isVariantChanging ? 'opacity-80' : ''}`}
                                onClick={async () => {
                                    if (currentVariant?.id) {
                                        await addToCart(currentVariant.id, quantity);
                                        setIsCartOpen(true);
                                    }
                                }}
                                disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                            >
                                {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin" /> : (isCartLoading ? "Agregando..." : "Agregar al carrito")}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2 border-t border-slate-200/60 mt-2">
                            <div>
                                <h3 className="text-[15px] font-semibold text-slate-900 mb-1">¿Te avisamos cuando vuelva?</h3>
                                <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">Dejanos tu email y te notificaremos apenas ingrese nuevo stock de esta variante.</p>
                            </div>
                            {backInStockSent ? (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                    <Zap className="w-4 h-4 shrink-0" />
                                    <span className="text-sm font-medium">¡Listo! Te avisaremos cuando vuelva a estar disponible.</span>
                                </div>
                            ) : (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleBackInStockSubmit((e.currentTarget.elements.namedItem('email') as HTMLInputElement).value);
                                    }}
                                    className="flex flex-col sm:flex-row gap-2.5"
                                >
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Tu correo electrónico"
                                        required
                                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all shadow-sm"
                                    />
                                    <Button type="submit" size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm h-auto py-2.5">
                                        Avisarme
                                    </Button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* QuickView: Link to full product page */}
                    {isQuickView && (
                        <Link
                            href={`/products/${product.handle}`}
                            className="flex items-center justify-center gap-2 text-sm text-primary font-medium hover:underline mt-2 py-2"
                            onClick={onClose}
                        >
                            Ver producto completo <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}

                    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>

                {/* Shipping Calculator */}
                {!isQuickView && (
                <div className="mb-6 mt-4 relative z-10 w-full">
                    <ShippingCalculator />
                </div>
                )}

                {/* Returns Highlight ML Style */}
                <div className={cn("mb-5 flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200", isQuickView && "hidden")}>
                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 mt-0.5 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        <div className="flex flex-col">
                            <InfoDrawer title="Devoluciones" triggerText="Devolución gratis" className="text-[14px] text-primary hover:text-primary/80 font-medium p-0 h-auto justify-start no-underline hover:underline">
                                <div className="space-y-4 text-sm text-slate-600">
                                    <p>
                                        Queremos que estés 100% satisfecho con tu compra. Si no es lo que esperabas, <span className="font-medium text-slate-900">puedes devolverlo de forma gratuita</span> dentro de los 30 días posteriores a la recepción.
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2 mt-4">
                                        <li>El producto debe estar en su embalaje original.</li>
                                        <li>No debe presentar daños ni marcas de uso indebido.</li>
                                        <li>Conservar recibo o factura de compra.</li>
                                    </ul>
                                </div>
                            </InfoDrawer>
                            <span className="text-[14px] font-normal text-slate-500 mt-0.5">Tenés 30 días desde que lo recibís.</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 mt-2">
                        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="text-[14px] text-primary font-medium cursor-pointer hover:underline">Compra Protegida</span>
                            <span className="text-[14px] font-normal text-slate-500 mt-0.5">Recibí el producto que esperabas o te devolvemos tu dinero.</span>
                        </div>
                    </div>
                </div>

                {/* Judge.me Reviews */}
                <div className={cn("mt-12 pt-8 border-t border-slate-200", isQuickView && "hidden")}>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Opiniones de clientes</h2>
                    <div
                        className="jdgm-widget jdgm-review-widget"
                        data-id={productExternalId}
                        data-handle={product.handle}
                    />
                </div>

                {/* Tabs: Description, Specs, Warranty */}
                <div className={cn("mb-6", isQuickView && "hidden")}>
                    <Tabs defaultValue="description">
                        <TabsList className="flex w-full overflow-x-auto no-scrollbar justify-start border-b border-slate-200 rounded-none bg-transparent p-0 h-auto">
                            <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2.5 px-4">Descripción</TabsTrigger>
                            <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2.5 px-4">Ficha Técnica</TabsTrigger>
                            <TabsTrigger value="warranty" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2.5 px-4">Garantía</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="p-4 bg-slate-50 rounded-b-xl border border-t-0 border-slate-100 text-sm text-slate-700 leading-relaxed mt-0">
                            {product.descriptionHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} className="prose prose-sm max-w-none prose-slate" />
                            ) : (
                                <p>{product.description || "No hay descripción disponible para este producto."}</p>
                            )}
                        </TabsContent>

                        <TabsContent value="specs" className="p-4 bg-slate-50 rounded-b-xl border border-t-0 border-slate-100 mt-0 text-sm">
                            {(product?.material?.value || product?.instruccionesLavado?.value) ? (
                                <dl className="space-y-2">
                                    {product?.material?.value && (
                                        <div className="flex justify-between pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                                            <dt className="text-slate-500 font-medium">Material</dt>
                                            <dd className="text-slate-900 text-right">
                                                {product.material.value.trim().startsWith('[')
                                                    ? (() => { try { return JSON.parse(product.material.value).join(', '); } catch { return product.material.value; } })()
                                                    : product.material.value}
                                            </dd>
                                        </div>
                                    )}
                                    {product?.instruccionesLavado?.value && (
                                        <div className="flex justify-between pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                                            <dt className="text-slate-500 font-medium">Cuidado</dt>
                                            <dd className="text-slate-900 text-right">
                                                {product.instruccionesLavado.value.trim().startsWith('[')
                                                    ? (() => { try { return JSON.parse(product.instruccionesLavado.value).join(', '); } catch { return product.instruccionesLavado.value; } })()
                                                    : product.instruccionesLavado.value}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">No hay especificaciones técnicas adicionales.</p>
                            )}
                        </TabsContent>

                        <TabsContent value="warranty" className="p-4 bg-slate-50 rounded-b-xl border border-t-0 border-slate-100 mt-0 text-sm text-slate-700 space-y-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-900 leading-none mb-1">Compra Protegida</p>
                                    <p className="text-slate-600 text-[13px]">Recibe el producto que esperabas o te devolvemos tu dinero.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 shrink-0 mt-0.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-slate-900 leading-none mb-1">Garantía del vendedor</p>
                                    <p className="text-slate-600 text-[13px]">6 meses de garantía de fábrica frente a defectos de manufactura.</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>

            {/* Sticky Buy Box Movil (App Native Style ML) */}
            {!isQuickView && !isOutOfStock && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-[100] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex flex-col gap-2"
                >
                    <Button
                        size="lg"
                        className={`w-full h-[48px] text-base font-semibold rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 ${isVariantChanging ? 'opacity-80' : ''}`}
                        onClick={async () => {
                            if (currentVariant?.id) {
                                const url = await addToCart(currentVariant.id, quantity);
                                if (url) window.location.href = url;
                                else if (checkoutUrl) window.location.href = checkoutUrl;
                                else setIsCartOpen(true);
                            }
                        }}
                        disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                    >
                        {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Comprar ahora"}
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        className={`w-full h-[48px] text-base font-semibold rounded-md bg-orange-50 hover:bg-orange-100 text-orange-600 border-0 transition-all duration-300 ${isVariantChanging ? 'opacity-80' : ''}`}
                        onClick={async () => {
                            if (currentVariant?.id) {
                                await addToCart(currentVariant.id, quantity);
                                setIsCartOpen(true);
                            }
                        }}
                        disabled={isCartLoading || !currentVariant?.id || isVariantChanging}
                    >
                        {isVariantChanging ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Agregar al carrito"}
                    </Button>
                </motion.div>
            )}
        </div>
    );
}

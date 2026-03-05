"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Ruler, ArrowRight, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/CartProvider";


export function ProductView({ product, isQuickView = false, onClose }: { product: any, isQuickView?: boolean, onClose?: () => void }) {
    const { addToCart, isCartLoading, checkoutUrl } = useCart();
    const images = product.images?.edges || [];
    const price = product.priceRange?.minVariantPrice;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const options = product.options || [];
    const variants = product.variants?.edges || [];

    // Find initial variant
    const initialVariant = variants.find(({ node }: any) => node.availableForSale)?.node || variants[0]?.node;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialStates: Record<string, string> = {};
        if (initialVariant && initialVariant.selectedOptions) {
            initialVariant.selectedOptions.forEach((opt: any) => {
                initialStates[opt.name] = opt.value;
            });
        } else {
            options.forEach((opt: any) => {
                initialStates[opt.name] = opt.values[0];
            });
        }
        return initialStates;
    });

    const activeImage = images[activeImageIndex]?.node;

    // Compute current variant
    const currentVariant = variants.find(({ node }: any) => {
        if (!node.selectedOptions) return false;
        return node.selectedOptions.every((opt: any) => selectedOptions[opt.name] === opt.value);
    })?.node || initialVariant;

    const displayPrice = currentVariant?.price || price;

    const handleOptionChange = (name: string, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="w-full flex flex-col lg:flex-row h-full lg:min-h-[60vh] bg-white text-slate-900 overflow-hidden rounded-3xl lg:border border-slate-200">

            {/* LADO IZQUIERDO: Galería de Fotos Inmersiva */}
            <div className="w-full lg:w-[55%] relative flex flex-col bg-slate-50 border-r border-slate-200 pb-6 lg:pb-0">
                {/* Badge Superior */}
                <div className="absolute top-6 lg:top-10 left-6 lg:left-10 z-20 flex flex-col gap-2 pointer-events-none">
                    <Badge variant="default" className="shadow-lg backdrop-blur-md px-4 py-1.5 uppercase tracking-widest text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Grado Premium
                    </Badge>
                </div>

                {/* Imagen Principal Masiva */}
                <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[50vh] lg:min-h-full w-full group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-200/50 z-10" />

                    {activeImage ? (
                        <Image
                            src={activeImage.url}
                            alt={activeImage.altText || product.title}
                            fill
                            priority
                            className="object-contain p-12 lg:p-24 transition-transform duration-700 ease-out group-hover:scale-105 z-0 pointer-events-none"
                            sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                    ) : (
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sin Imagen</div>
                    )}

                    {/* Controles de navefación superpuestos estilo cámara */}
                    {!isQuickView && images.length > 1 && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setActiveImageIndex(prev => Math.max(0, prev - 1))}
                                className="rounded-full bg-white/80 backdrop-blur-md shadow-sm border-slate-200"
                                disabled={activeImageIndex === 0}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setActiveImageIndex(prev => Math.min(images.length - 1, prev + 1))}
                                className="rounded-full bg-white/80 backdrop-blur-md shadow-sm border-slate-200"
                                disabled={activeImageIndex === images.length - 1}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Miniaturas Inferiores (Film Strip) */}
                {!isQuickView && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 flex gap-3 px-6 overflow-x-auto no-scrollbar max-w-full z-20">
                        {images.map(({ node }: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveImageIndex(i)}
                                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${activeImageIndex === i ? "border-2 border-[#f3843e] scale-110 shadow-lg" : "border border-slate-200 opacity-60 hover:opacity-100"} bg-white`}
                            >
                                <Image
                                    src={node.url}
                                    alt={node.altText || `Vista ${i + 1}`}
                                    fill
                                    className="object-cover transition-transform"
                                    sizes="64px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* LADO DERECHO: Especificaciones & Compra (Buy Box ML Style) */}
            <div className="w-full lg:w-[45%] flex flex-col h-full lg:max-h-[85vh] overflow-y-auto bg-white p-5 lg:p-6 custom-scrollbar">

                {/* Meta info & Title */}
                <div className="mb-2 text-[13px] text-slate-500 flex items-center justify-between">
                    <span>Nuevo | 1024 vendidos</span>
                    <div className="flex gap-2 items-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`rounded-full h-8 w-8 transition-colors ${isFavorite ? 'text-orange-500 hover:text-orange-600 bg-orange-50' : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'}`}
                        >
                            <Star className={`w-4 h-4 transition-all ${isFavorite ? 'fill-orange-500 text-orange-500 scale-110' : ''}`} />
                        </Button>
                        {isQuickView && onClose && (
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>
                </div>

                <h1 className="text-xl lg:text-[22px] font-semibold text-slate-900 leading-tight mb-2">
                    {product.title}
                </h1>

                {/* Stars Trust Signal */}
                <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                    </div>
                    <span className="text-[14px] text-primary font-normal hover:underline cursor-pointer">(24)</span>
                </div>

                {/* Price Section */}
                <div className="mb-4 flex flex-col pb-4 border-b border-slate-100">
                    <span className="text-[36px] font-light text-slate-900 leading-none flex items-start">
                        <span className="text-2xl mt-1.5 mr-1">$</span>
                        {Number(displayPrice?.amount || 0).toLocaleString("es-UY")}
                    </span>
                    <span className="text-[15px] font-normal text-slate-800 mt-2">
                        Mismo precio en <span className="text-green-500">12 cuotas de ${(Number(displayPrice?.amount || 0) / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 })}</span>
                    </span>
                    <a href="#" className="text-[13px] text-orange-500 mt-1 hover:text-orange-600">Ver los medios de pago</a>
                </div>

                {/* Free Shipping Highlight */}
                <div className="mb-4 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-green-500">Llega gratis mañana</span>
                        <span className="text-[13px] text-slate-500 mt-0.5">Comprando dentro de las próximas 5 hs</span>
                        <a href="#" className="text-[13px] text-orange-500 mt-0.5 hover:text-orange-600">Enviar a Capital Federal</a>
                    </div>
                </div>

                {/* Returns Highlight */}
                <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 mt-0.5 ml-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-normal text-slate-900"><span className="text-green-500 font-medium">Devolución gratis.</span> Tenés 30 días desde que lo recibís.</span>
                        <a href="#" className="text-[13px] text-orange-500 mt-0.5 hover:text-orange-600">Conocer más</a>
                    </div>
                </div>

                {/* Options / Selectors */}
                <div className="flex flex-col gap-4 mb-5">
                    {options.map((option: any) => {
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
                                                    className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${isSelected ? 'border-primary' : 'border-slate-200 hover:border-slate-300'}`}
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
                                                className={`min-w-16 h-10 ${isSelected ? '' : 'text-slate-600'}`}
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

                {/* Botones de Acción */}
                <div className="flex flex-col gap-3 mt-auto">
                    <Button 
                        size={isQuickView ? "default" : "lg"} 
                        className="w-full text-base"
                        onClick={async () => {
                            if (currentVariant?.id) {
                                const url = await addToCart(currentVariant.id, 1);
                                if (url) {
                                    window.location.href = url;
                                } else if (checkoutUrl) {
                                    window.location.href = checkoutUrl;
                                } else {
                                    setIsCartOpen(true);
                                }
                            }
                        }}
                        disabled={isCartLoading || !currentVariant?.id}
                    >
                        Comprar ahora
                    </Button>
                    <Button 
                        variant="secondary" 
                        size={isQuickView ? "default" : "lg"} 
                        className="w-full text-base"
                        onClick={async () => {
                            if (currentVariant?.id) {
                                await addToCart(currentVariant.id, 1);
                                setIsCartOpen(true);
                            }
                        }}
                        disabled={isCartLoading || !currentVariant?.id}
                    >
                        {isCartLoading ? "Agregando..." : "Agregar al carrito"}
                    </Button>
                    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>

            </div>
        </div>
    );
}

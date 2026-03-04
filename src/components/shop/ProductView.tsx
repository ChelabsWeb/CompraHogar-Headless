"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Ruler, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/cart/CartSheet";


export function ProductView({ product }: { product: any }) {
    const images = product.images?.edges || [];
    const price = product.priceRange?.minVariantPrice;

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
        <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-white text-slate-900 overflow-hidden rounded-3xl border border-slate-200 shadow-xl">

            {/* LADO IZQUIERDO: Galería de Fotos Inmersiva */}
            <div className="w-full lg:w-[55%] relative flex flex-col bg-slate-50 border-r border-slate-200 pb-6 lg:pb-0">
                {/* Badge Superior */}
                <div className="absolute top-6 lg:top-10 left-6 lg:left-10 z-20 flex flex-col gap-2 pointer-events-none">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#21645d]/20 bg-[#21645d]/10 backdrop-blur-md text-[#21645d] text-[10px] font-bold tracking-widest uppercase">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Grado Premium
                    </span>
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
                    {images.length > 1 && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                            <button
                                onClick={() => setActiveImageIndex(prev => Math.max(0, prev - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm disabled:opacity-30 disabled:hover:bg-white/80"
                                disabled={activeImageIndex === 0}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setActiveImageIndex(prev => Math.min(images.length - 1, prev + 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-900 hover:bg-white transition-all shadow-sm disabled:opacity-30 disabled:hover:bg-white/80"
                                disabled={activeImageIndex === images.length - 1}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Miniaturas Inferiores (Film Strip) */}
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
            </div>

            {/* LADO DERECHO: Especificaciones & Compra (Buy Box ML Style) */}
            <div className="w-full lg:w-[45%] flex flex-col h-[calc(100vh-80px)] overflow-y-auto bg-white p-6 lg:p-8">

                {/* Meta info & Title */}
                <div className="mb-2 text-[13px] text-slate-500 flex items-center justify-between">
                    <span>Nuevo | 1024 vendidos</span>
                    <div className="flex gap-2">
                        {/* Favorite & Share Icons placeholder */}
                        <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition-colors">
                            <Star className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <h1 className="text-xl lg:text-[22px] font-semibold text-slate-900 leading-tight mb-2">
                    {product.title}
                </h1>

                {/* Stars Trust Signal */}
                <div className="flex items-center gap-1.5 mb-6">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                        ))}
                    </div>
                    <span className="text-[14px] text-blue-500 font-normal hover:underline cursor-pointer">(24)</span>
                </div>

                {/* Price Section */}
                <div className="mb-6 flex flex-col">
                    <span className="text-[36px] font-light text-slate-900 leading-none flex items-start">
                        <span className="text-2xl mt-1.5 mr-1">$</span>
                        {Number(displayPrice?.amount || 0).toLocaleString("es-UY")}
                    </span>
                    <span className="text-[15px] font-normal text-slate-800 mt-2">
                        Mismo precio en <span className="text-green-500">12 cuotas de ${(Number(displayPrice?.amount || 0) / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 })}</span>
                    </span>
                    <a href="#" className="text-[13px] text-blue-500 mt-1 hover:text-blue-600">Ver los medios de pago</a>
                </div>

                {/* Free Shipping Highlight */}
                <div className="mb-8 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-green-500">Llega gratis mañana</span>
                        <span className="text-[13px] text-slate-500 mt-0.5">Comprando dentro de las próximas 5 hs</span>
                        <a href="#" className="text-[13px] text-blue-500 mt-0.5 hover:text-blue-600">Enviar a Capital Federal</a>
                    </div>
                </div>

                {/* Returns Highlight */}
                <div className="mb-6 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 mt-0.5 ml-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-normal text-slate-900"><span className="text-green-500 font-medium">Devolución gratis.</span> Tenés 30 días desde que lo recibís.</span>
                        <a href="#" className="text-[13px] text-blue-500 mt-0.5 hover:text-blue-600">Conocer más</a>
                    </div>
                </div>

                {/* Options / Selectors */}
                <div className="flex flex-col gap-5 mb-8">
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
                                                    className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${isSelected ? 'border-blue-500' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: bgColor }} />
                                                    <span className="sr-only">{value}</span>
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                key={value}
                                                onClick={() => handleOptionChange(option.name, value)}
                                                className={`px-4 py-2 min-w-16 rounded-md border text-[14px] transition-colors ${isSelected
                                                    ? 'bg-blue-50 text-blue-500 border-blue-500 font-semibold'
                                                    : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 font-medium'
                                                    }`}
                                            >
                                                {value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Botones de Acción ML */}
                <div className="flex flex-col gap-3 mt-auto">
                    <Button size="lg" className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[16px] rounded-md transition-colors">
                        Comprar ahora
                    </Button>
                    <CartSheet>
                        <Button variant="secondary" size="lg" className="w-full h-12 bg-blue-100/50 hover:bg-blue-100 text-blue-500 font-semibold text-[16px] rounded-md transition-colors">
                            Agregar al carrito
                        </Button>
                    </CartSheet>
                </div>

                {/* Seller Trust info */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-[14px] font-semibold text-slate-900 mb-4">Información sobre el vendedor</p>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <ShieldCheck className="w-6 h-6 text-[#21645d]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-slate-900">CompraHogar Oficial</span>
                            <span className="text-[13px] text-slate-500">MercadoLíder Platinum</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

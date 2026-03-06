"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Ruler, ArrowRight, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/CartProvider";
import { pushDatalayerEvent } from "@/lib/analytics";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info } from "lucide-react";


export function ProductView({ product, isQuickView = false, onClose }: { product: any, isQuickView?: boolean, onClose?: () => void }) {
    const { addToCart, isCartLoading, checkoutUrl } = useCart();
    const images = product.images?.edges || [];
    const price = product.priceRange?.minVariantPrice;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

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
        <div className="w-full flex flex-col lg:flex-row bg-transparent text-slate-900">

            {/* LADO IZQUIERDO: Galería de Fotos Inmersiva */}
            <div className="w-full lg:w-[55%] relative flex flex-col bg-transparent pb-6 lg:pb-0">
                {/* Badge Superior */}
                <div className="absolute top-6 lg:top-10 left-6 lg:left-10 z-20 flex flex-col gap-2 pointer-events-none">
                    <Badge variant="default" className="shadow-lg backdrop-blur-md px-4 py-1.5 uppercase tracking-widest text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Grado Premium
                    </Badge>
                </div>

                {/* Imagen Principal Pura */}
                <div className="relative flex items-center justify-center w-full aspect-square lg:aspect-[4/3] mx-auto mb-8 group bg-white rounded-3xl overflow-hidden">
                    {activeImage ? (
                        <Image
                            src={activeImage.url}
                            alt={activeImage.altText || product.title}
                            fill
                            priority
                            className="object-contain transition-transform duration-700 ease-out z-0 pointer-events-none"
                            sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                    ) : (
                        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sin Imagen</div>
                    )}
                </div>

                {/* Miniaturas Inferiores (Film Strip) */}
                {!isQuickView && (
                    <div className="flex flex-wrap gap-3 px-2 z-20 mb-8 lg:mb-0 justify-center max-w-xl mx-auto">
                        {images.map(({ node }: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => setActiveImageIndex(i)}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${activeImageIndex === i ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md" : "border border-slate-200 opacity-60 hover:opacity-100 hover:scale-105"} bg-white`}
                            >
                                <Image
                                    src={node.url}
                                    alt={node.altText || `Vista ${i + 1}`}
                                    fill
                                    className="object-cover transition-transform"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* LADO DERECHO: Especificaciones & Compra (Buy Box ML Style) */}
            <div className="w-full lg:w-[45%] flex flex-col bg-transparent p-5 lg:px-12 lg:py-6">

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

                {/* Quantity and Actions */}
                <div className="mt-auto flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-2">
                        <span className="text-sm font-medium text-slate-900 w-24 shrink-0">Cantidad</span>
                        <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
                        <span className="text-xs text-slate-500">Stock disponible</span>
                    </div>

                    <div className="flex flex-col gap-3">
                    <Button 
                        size={isQuickView ? "default" : "lg"} 
                        className="w-full text-base"
                        onClick={async () => {
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
                                            quantity: quantity,
                                            item_variant: currentVariant.title !== 'Default Title' ? currentVariant.title : undefined
                                        }]
                                    }
                                });
                                const url = await addToCart(currentVariant.id, quantity);
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
                                pushDatalayerEvent({
                                    event: 'add_to_cart',
                                    ecommerce: {
                                        currency: displayPrice?.currencyCode || 'USD',
                                        value: Number(displayPrice?.amount || 0),
                                        items: [{
                                            item_id: currentVariant.id,
                                            item_name: product.title,
                                            price: Number(displayPrice?.amount || 0),
                                            quantity: quantity,
                                            item_variant: currentVariant.title !== 'Default Title' ? currentVariant.title : undefined
                                        }]
                                    }
                                });
                                await addToCart(currentVariant.id, quantity);
                                setIsCartOpen(true);
                            }
                        }}
                        disabled={isCartLoading || !currentVariant?.id}
                    >
                        {isCartLoading ? "Agregando..." : "Agregar al carrito"}
                    </Button>
                    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>
                {/* Free Shipping Highlight using Alert component */}
                <div className="mb-6">
                    <Alert variant="success" className="bg-emerald-50 border-emerald-100 text-emerald-800">
                        {/* <Truck className="h-4 w-4" /> SVG fallback since Truck isn't imported from lucide initially unless we add it, Using original SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        <AlertTitle className="text-[15px] font-medium text-emerald-700">Llega gratis mañana</AlertTitle>
                        <AlertDescription className="text-[13px] text-emerald-600/80 mt-0.5">
                            Comprando dentro de las próximas 5 hs. <a href="#" className="font-medium underline hover:text-emerald-700">Ver opciones de envío</a>
                        </AlertDescription>
                    </Alert>
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

                {/* Tabs: Description, Specs, Warranty */}
                <div className="mb-6">
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

            </div>
        </div>
    );
}

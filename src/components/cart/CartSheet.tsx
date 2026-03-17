"use client";

import { Drawer } from "@/components/ui/drawer";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, subtotal, estimatedShipping, updateQuantity, removeFromCart, checkoutUrl, isCartLoading, applyDiscountCode, applyGiftCard } = useCart();
    const [discountCode, setDiscountCode] = useState("");
    const [isApplyingCode, setIsApplyingCode] = useState(false);
    const [discountStatus, setDiscountStatus] = useState<{ message: string; isError: boolean } | null>(null);

    const freeShippingGoal = 300000;
    const progress = Math.min((subtotal / freeShippingGoal) * 100, 100);
    const amountLeft = freeShippingGoal - subtotal;

    const handleApplyCode = async () => {
        if (!discountCode.trim()) return;
        setIsApplyingCode(true);
        setDiscountStatus(null);
        
        // Primero intentamos como código de descuento
        let res = await applyDiscountCode(discountCode);
        
        if (res.success) {
            setDiscountStatus({ message: "Descuento aplicado con éxito.", isError: false });
            setDiscountCode("");
        } else {
            // Si el descuento falla, intentamos aplicarlo como tarjeta de regalo
            const giftRes = await applyGiftCard(discountCode);
            
            if (giftRes.success) {
                setDiscountStatus({ message: "Tarjeta de regalo aplicada con éxito.", isError: false });
                setDiscountCode("");
            } else {
                // Mostramos el mensaje de error del primer intento porque es más probable
                setDiscountStatus({ message: res.error || giftRes.error || "Código inválido.", isError: true });
            }
        }
        setIsApplyingCode(false);
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Mi Carrito"
            side="right"
        >
            {items.length > 0 ? (
                <div className="flex flex-col h-full -mx-6">
                    {/* Free Shipping Progress */}
                    <div className="px-6 py-4 bg-muted/50 border-b">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {progress >= 100
                                    ? <span className="text-primary flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Envío gratuito alcanzado</span>
                                    : <>Faltan <span className="font-bold text-foreground">${amountLeft.toLocaleString("es-AR")}</span> para envío gratis</>
                                }
                            </span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-20 h-20 bg-muted rounded-md border flex-shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image.url}
                                            alt={item.image.altText || item.productTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                            <ShoppingCart className="w-6 h-6 opacity-30" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1">
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.productType}</span>
                                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 mt-0.5">
                                        {item.productTitle}
                                    </h3>
                                    {item.variantTitle !== "Default Title" && (
                                        <span className="text-xs text-slate-500 mt-1">{item.variantTitle}</span>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <div className="flex items-center border rounded-md h-[44px]">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-full w-[44px] rounded-none"
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                disabled={isCartLoading}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-full w-[44px] rounded-none"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={isCartLoading}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-sm">
                                                ${(item.price * item.quantity).toLocaleString("es-AR")}
                                            </span>
                                            <Button 
                                                variant="link" 
                                                className="h-[44px] px-2 text-[10px] text-muted-foreground hover:text-destructive -mr-2"
                                                onClick={() => removeFromCart(item.id)}
                                                disabled={isCartLoading}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-background mt-auto">
                        {/* Bloque de Código de Descuento */}
                        <div className="mb-6 space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Descuento / Tarjeta de Regalo"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 uppercase"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                    disabled={isApplyingCode || isCartLoading}
                                />
                                <Button 
                                    variant="secondary" 
                                    onClick={handleApplyCode}
                                    disabled={!discountCode || isApplyingCode || isCartLoading}
                                >
                                    {isApplyingCode ? "..." : "Aplicar"}
                                </Button>
                            </div>
                            {discountStatus && (
                                <p className={`text-xs ${discountStatus.isError ? "text-destructive" : "text-green-600 dark:text-green-400"}`}>
                                    {discountStatus.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="font-medium text-foreground">${subtotal.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Logística</span>
                                <span>
                                    {estimatedShipping === null 
                                        ? "Calculado en checkout" 
                                        : estimatedShipping === 0 
                                            ? <span className="text-green-600 dark:text-green-500 font-medium">Gratis</span> 
                                            : `$${estimatedShipping.toLocaleString("es-AR")}`
                                    }
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total Estimado</span>
                                <span className="text-xl text-primary">
                                    ${(subtotal + (estimatedShipping || 0)).toLocaleString("es-AR")}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Button size="lg" className="w-full font-bold" onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }} disabled={isCartLoading || !checkoutUrl}>
                                {checkoutUrl ? (
                                    <>
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Proceder al Checkout
                                    </>
                                ) : (
                                    <span>Calculando...</span>
                                )}
                            </Button>
                            <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
                                Continuar Comprando
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 -mx-6 px-6 py-4">
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                        <ShoppingCart className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">Tu carrito está vacío</p>
                        <p className="text-sm">Parece que aún no agregaste productos.</p>
                    </div>
                    <div className="mt-auto pt-6 border-t font-medium">
                        <Button className="w-full" size="lg" onClick={onClose}>
                            Seguir Comprando
                        </Button>
                    </div>
                </div>
            )}
        </Drawer>
    );
}

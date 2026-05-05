"use client";

import { Drawer } from "@/components/ui/drawer";
import { Trash2, Plus, Minus, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shippingRates";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const LOCALE = "es-UY";

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const {
        items,
        subtotal,
        estimatedShipping,
        updateQuantity,
        removeFromCart,
        checkoutUrl,
        isCartLoading,
        applyDiscountCode,
        applyGiftCard,
    } = useCart();
    const [discountCode, setDiscountCode] = useState("");
    const [isApplyingCode, setIsApplyingCode] = useState(false);
    const [discountStatus, setDiscountStatus] = useState<{ message: string; isError: boolean } | null>(null);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountLeft = FREE_SHIPPING_THRESHOLD - subtotal;
    const totalEstimated = subtotal + (estimatedShipping || 0);

    const drawerTitle = items.length > 0
        ? `Mi carrito · ${itemCount} ${itemCount === 1 ? "ítem" : "ítems"}`
        : "Mi carrito";

    const handleApplyCode = async () => {
        if (!discountCode.trim()) return;
        setIsApplyingCode(true);
        setDiscountStatus(null);

        // First attempt: discount code. Fall back to gift card if that fails.
        const res = await applyDiscountCode(discountCode);

        if (res.success) {
            setDiscountStatus({ message: "Descuento aplicado con éxito.", isError: false });
            setDiscountCode("");
        } else {
            const giftRes = await applyGiftCard(discountCode);
            if (giftRes.success) {
                setDiscountStatus({ message: "Tarjeta de regalo aplicada con éxito.", isError: false });
                setDiscountCode("");
            } else {
                setDiscountStatus({ message: res.error || giftRes.error || "Código inválido.", isError: true });
            }
        }
        setIsApplyingCode(false);
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={drawerTitle} side="right">
            {items.length > 0 ? (
                <div className="flex flex-col h-full -mx-6">
                    {/* Free Shipping Progress */}
                    <div className="px-6 py-4 bg-muted/50 border-b">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {progress >= 100 ? (
                                    <span className="text-primary flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Envío gratuito alcanzado
                                    </span>
                                ) : (
                                    <>
                                        Faltan{" "}
                                        <span className="font-bold text-foreground">
                                            ${amountLeft.toLocaleString(LOCALE)}
                                        </span>{" "}
                                        para envío gratis
                                    </>
                                )}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
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
                                            sizes="80px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                            <ShoppingCart className="w-6 h-6 opacity-30" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            {item.productType && (
                                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                                    {item.productType}
                                                </span>
                                            )}
                                            <h3 className="text-sm font-semibold text-foreground line-clamp-2 mt-0.5">
                                                {item.productTitle}
                                            </h3>
                                            {item.variantTitle !== "Default Title" && (
                                                <span className="text-xs text-slate-500 mt-0.5 block">
                                                    {item.variantTitle}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={`Eliminar ${item.productTitle}`}
                                            onClick={() => removeFromCart(item.id)}
                                            disabled={isCartLoading}
                                            className="shrink-0 text-slate-400 hover:text-destructive transition-colors p-1 -mr-1 -mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-3 gap-3">
                                        <div className="flex items-center border rounded-md h-9 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-full w-9 rounded-none"
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                disabled={isCartLoading || item.quantity <= 1}
                                                aria-label="Disminuir cantidad"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </Button>
                                            <span className="text-sm font-medium w-8 text-center tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-full w-9 rounded-none"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={isCartLoading}
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <span className="font-semibold text-sm text-foreground tabular-nums">
                                            ${(item.price * item.quantity).toLocaleString(LOCALE)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-background mt-auto">
                        {/* Discount / gift card code */}
                        <div className="mb-5 space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Código de descuento"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 uppercase"
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
                                <p className={`text-xs ${discountStatus.isError ? "text-destructive" : "text-green-600"}`}>
                                    {discountStatus.message}
                                </p>
                            )}
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 mb-5">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="font-medium text-foreground tabular-nums">
                                    ${subtotal.toLocaleString(LOCALE)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Envío</span>
                                <span className="tabular-nums">
                                    {estimatedShipping === null ? (
                                        <span className="text-muted-foreground">Se calcula en el checkout</span>
                                    ) : estimatedShipping === 0 ? (
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    ) : (
                                        `$${estimatedShipping.toLocaleString(LOCALE)}`
                                    )}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-baseline font-bold">
                                <span>Total</span>
                                <span className="text-xl text-primary tabular-nums">
                                    ${totalEstimated.toLocaleString(LOCALE)}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-2.5">
                            <Button
                                size="lg"
                                className="w-full font-semibold rounded-xl h-[48px]"
                                onClick={() => {
                                    if (checkoutUrl) window.location.href = checkoutUrl;
                                }}
                                disabled={isCartLoading || !checkoutUrl}
                            >
                                {checkoutUrl ? (
                                    <>
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Finalizar compra
                                    </>
                                ) : (
                                    <span>Preparando checkout...</span>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-xl h-[44px] border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary"
                                onClick={onClose}
                            >
                                Seguir comprando
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty cart state
                <div className="flex flex-col h-full -mx-6 px-6 py-4">
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                            <ShoppingCart className="w-7 h-7 text-primary/60" strokeWidth={1.5} />
                        </div>
                        <p className="text-lg font-semibold text-foreground mb-1">Tu carrito está vacío</p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Agregá productos desde el catálogo para empezar.
                        </p>
                    </div>
                    <div className="mt-auto pt-6 border-t">
                        <GlassButton
                            variant="light"
                            size="md"
                            className="w-full h-[48px]"
                            onClick={onClose}
                        >
                            Seguir comprando
                        </GlassButton>
                    </div>
                </div>
            )}
        </Drawer>
    );
}

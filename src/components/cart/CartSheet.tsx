"use client";

import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export function CartSheet({ children }: { children: ReactNode }) {
    // Datos de prueba
    const items = [
        {
            id: 1,
            name: "Taladro Percutor Inalámbrico 20V Max Pro",
            price: 185000,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=300",
            category: "Precisión Térmica"
        },
        {
            id: 2,
            name: "Juego de Llaves Combinadas Cromo Vanadio",
            price: 45000,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1541727687969-ce40493cb861?auto=format&fit=crop&q=80&w=300",
            category: "Herramientas Manuales"
        }
    ];

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const freeShippingGoal = 300000;
    const progress = Math.min((subtotal / freeShippingGoal) * 100, 100);
    const amountLeft = freeShippingGoal - subtotal;

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="p-6 text-left border-b">
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Tu Carrito ({items.length})
                    </SheetTitle>
                </SheetHeader>

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
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-col flex-1">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.category}</span>
                                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mt-0.5">
                                    {item.name}
                                </h3>

                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <div className="flex items-center border rounded-md">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none">
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none">
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold text-sm">
                                            ${(item.price * item.quantity).toLocaleString("es-AR")}
                                        </span>
                                        <Button variant="link" className="h-auto p-0 text-[10px] text-muted-foreground hover:text-destructive h-auto">
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
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">${subtotal.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Logística</span>
                            <span>Calculado en checkout</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total Estimado</span>
                            <span className="text-xl text-primary">
                                ${subtotal.toLocaleString("es-AR")}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <SheetClose asChild>
                            <Button asChild size="lg" className="w-full font-bold">
                                <Link href="/checkout">
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Proceder al Checkout
                                </Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button variant="outline" size="lg" className="w-full">
                                Continuar Comprando
                            </Button>
                        </SheetClose>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

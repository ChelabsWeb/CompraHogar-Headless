"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Lock, Search, Home, ChevronLeft, Check, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
    const [contactEmail, setContactEmail] = useState("");

    // Mock items matching CartSheet
    const items = [
        {
            id: 1,
            name: "Taladro Percutor Inalámbrico 20V Max con Kit Accesorios",
            price: 185000,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=300",
            category: "Herramientas Inalámbricas"
        },
        {
            id: 2,
            name: "Juego de Llaves Combinadas 12 Piezas Professional",
            price: 45000,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1541727687969-ce40493cb861?auto=format&fit=crop&q=80&w=300",
            category: "Herramientas Manuales"
        }
    ];

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 2500;
    const taxes = subtotal * 0.21;
    const total = subtotal + shipping + taxes;

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">

            {/* LEFT COLUMN: Form and Details */}
            <div className="flex-1 bg-background pt-8 pb-20 px-6 md:px-12 lg:px-24 flex flex-col xl:border-r border-border">

                {/* Header (Logo) */}
                <header className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-8 h-8 transition-transform group-hover:scale-105">
                            <Home className="w-8 h-8 text-primary fill-primary" />
                            <Search className="absolute bottom-[-2px] right-[-2px] w-4 h-4 text-secondary bg-background rounded-full p-[2px]" strokeWidth={4} />
                        </div>
                        <div className="flex flex-col leading-[0.9] font-black tracking-tight text-lg">
                            <span className="text-secondary">COMPRA</span>
                            <span className="text-primary">HOGAR</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                        <Lock className="w-4 h-4" />
                        <span>Pago Seguro</span>
                    </div>
                </header>

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-8">
                    <Link href="/cart" className="hover:text-primary transition-colors">Carrito</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground">Información</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>Envío</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>Pago</span>
                </nav>

                <main className="max-w-2xl w-full mx-auto md:mx-0 flex-1">

                    {/* Express Checkout */}
                    <div className="mb-10 text-center">
                        <p className="text-xs font-semibold text-muted-foreground mb-4">PAGO EXPRÉS</p>
                        <div className="flex gap-3">
                            <button className="flex-1 h-12 bg-[#009ee3] hover:bg-[#009ee3]/90 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                                <span className="text-white font-bold text-lg tracking-tight">mercado<span className="font-light">pago</span></span>
                            </button>
                            <button className="flex-1 h-12 bg-black hover:bg-black/90 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                                <span className="text-white font-semibold text-lg flex items-center gap-1">
                                    {/* Apple logo simulated */}
                                    <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                                    Pay
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center mb-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/60"></div>
                        </div>
                        <div className="relative bg-background px-4 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                            O continuar con email
                        </div>
                    </div>

                    {/* Contact Info */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold tracking-tight">Contacto</h2>
                            <span className="text-sm text-primary font-medium cursor-pointer hover:underline">¿Ya tenés cuenta? Ingresá</span>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email o número de teléfono"
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none"
                            />
                            <label className="flex items-center gap-2 cursor-pointer mt-3">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary border-border focus:ring-primary rounded-sm" defaultChecked />
                                <span className="text-sm text-muted-foreground font-medium">Enviarme novedades y ofertas exclusivas</span>
                            </label>
                        </div>
                    </section>

                    {/* Shipping Info */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold tracking-tight mb-4">Dirección de envío</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nombre" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                            <input type="text" placeholder="Apellido" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                            <input type="text" placeholder="Dirección y número" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none md:col-span-2" />
                            <input type="text" placeholder="Casa, apartamento, etc. (Opcional)" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none md:col-span-2" />
                            <input type="text" placeholder="Código postal" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                            <input type="text" placeholder="Ciudad" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                            <select className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none md:col-span-2 text-foreground font-medium appearance-none">
                                <option>Provincia / Estado</option>
                                <option>Buenos Aires</option>
                                <option>CABA</option>
                                <option>Córdoba</option>
                                <option>Santa Fe</option>
                                <option>Neuquén</option>
                            </select>
                            <input type="tel" placeholder="Teléfono" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none md:col-span-2" />
                        </div>
                    </section>

                    {/* Payment Simulation Section */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold tracking-tight mb-4">Pago</h2>
                        <p className="text-sm text-muted-foreground mb-4">Todas las transacciones son seguras y están encriptadas.</p>

                        <div className="border border-border rounded-xl overflow-hidden">
                            <div className="p-4 bg-primary/5 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-primary flex flex-col items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    </div>
                                    <span className="font-bold text-foreground">Tarjeta de crédito o débito</span>
                                </div>
                                <div className="flex gap-1">
                                    {/* Mock card icons */}
                                    <div className="w-8 h-5 bg-white rounded border border-border flex items-center justify-center text-[8px] font-black text-[#1a1f71]">VISA</div>
                                    <div className="w-8 h-5 bg-white rounded border border-border flex items-center justify-center text-[8px] font-black text-[#eb001b]">MC</div>
                                </div>
                            </div>
                            <div className="p-4 bg-secondary/5 space-y-4">
                                <div className="relative">
                                    <input type="text" placeholder="Número de tarjeta" className="w-full h-12 pl-4 pr-10 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                                    <Lock className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2" />
                                </div>
                                <input type="text" placeholder="Nombre en la tarjeta" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Vencimiento (MM/AA)" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                                    <div className="relative">
                                        <input type="text" placeholder="Código de seguridad" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 gap-4 pt-4 border-t border-border/50">
                        <Link href="/cart" className="text-sm font-semibold text-primary hover:text-primary/80 flex flex-col gap-2 items-center flex-row">
                            <ChevronLeft className="w-4 h-4" /> Volver al carrito
                        </Link>
                        <button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                            <span>Pagar ${(total).toLocaleString("es-AR")}</span>
                            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                </main>

                {/* Footer (Mobile only, hidden on Desktop) */}
                <footer className="mt-16 pt-6 border-t border-border flex justify-center gap-4 text-xs font-semibold text-muted-foreground lg:hidden">
                    <Link href="#">Política de reembolso</Link>
                    <Link href="#">Política de envíos</Link>
                    <Link href="#">Política de privacidad</Link>
                    <Link href="#">Términos del servicio</Link>
                </footer>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <aside className="hidden lg:block w-[45%] bg-secondary/10 px-12 xl:px-16 pt-16 flex-none font-sans sticky top-0 h-screen overflow-y-auto no-scrollbar">

                <div className="max-w-[420px]">
                    {/* Item List */}
                    <div className="space-y-4 mb-8">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="relative w-16 h-16 rounded-xl overflow-visible bg-background border border-border/60 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold line-clamp-2 leading-tight">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                                </div>
                                <div className="font-semibold text-sm">
                                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Discount */}
                    <div className="flex gap-3 py-6 border-y border-border/60">
                        <input type="text" placeholder="Tarjeta de regalo o código de descuento" className="flex-1 h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm outline-none" />
                        <button className="h-12 px-6 rounded-xl bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground font-semibold text-sm transition-colors border border-transparent shadow-sm">
                            Aplicar
                        </button>
                    </div>

                    {/* Totals */}
                    <div className="py-6 space-y-3 border-b border-border/60">
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="text-foreground font-semibold">${subtotal.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                            <span>Envío</span>
                            <span className="text-foreground font-semibold">${shipping.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                            <span>Impuestos (IVA 21%)</span>
                            <span className="text-foreground font-semibold">${taxes.toLocaleString("es-AR")}</span>
                        </div>
                    </div>

                    <div className="py-6 flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">ARS</span>
                            <span className="text-2xl font-black tracking-tight">${total.toLocaleString("es-AR")}</span>
                        </div>
                    </div>

                    {/* Footer Desktop */}
                    <footer className="mt-8 flex flex-col gap-4 text-xs font-semibold text-muted-foreground">
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary transition-colors">Política de reembolso</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Términos de servicio</Link>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Lock className="w-3 h-3" />
                            <span>100% de pago seguro y encriptado</span>
                        </div>
                    </footer>
                </div>

            </aside>

            {/* Mobile Order Summary (Bottom Sheet / Expanding element - SIMPLIFIED for demo) */}
            <div className="lg:hidden bg-secondary/5 border-t border-border p-6 font-sans">
                <div className="flex justify-between items-center mb-4 cursor-pointer">
                    <span className="font-semibold text-primary flex items-center gap-1 text-sm">
                        Mostrar resumen del pedido <ChevronDown className="w-4 h-4" />
                    </span>
                    <span className="text-lg font-bold">${total.toLocaleString("es-AR")}</span>
                </div>
                {/* The mobile breakdown is currently collapsed in typical designs, we'll keep it simple here */}
            </div>

        </div>
    );
}

// Quick component for ChevronDown since it was missing above
function ChevronDown(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

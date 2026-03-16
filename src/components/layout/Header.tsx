"use client";

import { useState } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, ChevronDown, User, ChevronRight, Home, Tag, Clock, Store, List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/CartProvider";

import { PredictiveSearch } from "@/components/shared/PredictiveSearch";
import { LocationSelector } from "@/components/shop/LocationSelector";
import { MegaMenu } from "./MegaMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";

const CATEGORIES = [
    { name: "Obra Gruesa", handle: "obra-gruesa" },
    { name: "Herramientas", handle: "herramientas-y-maquinaria" },
    { name: "Electricidad", handle: "electricidad-e-iluminacion" },
    { name: "Sanitaria", handle: "sanitaria-y-griferia" },
    { name: "Pinturas", handle: "pinturas-y-acabados" },
    { name: "Decoración", handle: "hogar-y-decoracion" },
    { name: "Servicios", handle: "servicios-y-alquileres" }
];

export function Header({ collections = [], isLoggedIn }: { collections?: any[], isLoggedIn?: boolean }) {
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const { totalQuantity, isCartOpen, setIsCartOpen } = useCart();

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 50);
    });

    const headerBg = "bg-[#21645d]";

    return (
        <div className={`fixed top-0 inset-x-0 z-50 flex flex-col pointer-events-auto transition-transform duration-300 ${isScrolled ? "lg:-translate-y-[72px] -translate-y-[56px]" : "translate-y-0"}`}>

            <header className={`w-full ${headerBg} shadow-sm border-b border-black/5`}>
                <div className="container mx-auto max-w-[1200px] px-4">

                    {/* TOP ROW: Logo, Search, Ad */}
                    <div className="flex flex-col lg:flex-row lg:h-[72px] lg:items-center justify-between gap-3 lg:gap-8 py-2 pb-3 lg:pb-2">
                        {/* Mobile and Desktop Top Row Items */}
                        <div className="flex items-center justify-between w-full lg:w-auto gap-3 sm:gap-4 lg:gap-8">
                            
                            {/* Mobile Hamburger / Desktop Logo */}
                            <div className="flex items-center shrink-0">
                                {/* Hamburger Menu in Mobile ML */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="lg:hidden p-2 -ml-2 text-white active:bg-white/10 rounded-full transition-colors">
                                            <Menu className="w-6 h-6" strokeWidth={1.5} />
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 flex flex-col bg-slate-50 border-r-0">
                                        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                                        
                                        {/* Drawer Header with Logo & Profile */}
                                        <div className="bg-[#21645d] text-white p-5 pt-10 flex flex-col gap-4">
                                            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/20 w-fit">
                                                <div className="relative w-8 h-8 bg-white rounded-full p-1 shadow-sm flex items-center justify-center">
                                                    <Image src="/logo-generated.png" alt="Heladless" fill className="object-contain scale-[1.1]" sizes="32px" />
                                                </div>
                                                <span className="font-black tracking-tight leading-none flex flex-col">
                                                    <span className="text-[11px] uppercase tracking-wide opacity-80">Heladless</span>
                                                    <span className="text-[14px]">compra hogar</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-lg leading-tight">Bienvenido</span>
                                                    <span className="text-sm text-white/90">Ingresa a tu cuenta</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Drawer Links */}
                                        <div className="flex-1 overflow-y-auto py-2">
                                            <div className="flex flex-col px-2">
                                                <SheetClose asChild>
                                                    <Link href="/" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                        <Home className="w-5 h-5 text-slate-400" /> Inicio
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/collections/ofertas" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                        <Tag className="w-5 h-5 text-slate-400" /> Ofertas
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/institucional/historial" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                        <Clock className="w-5 h-5 text-slate-400" /> Historial
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/institucional/vender" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                        <Store className="w-5 h-5 text-slate-400" /> Vender
                                                    </Link>
                                                </SheetClose>

                                                <div className="h-px bg-slate-200 my-2 mx-4" />

                                                <div className="px-4 py-3 pb-1">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categorías</span>
                                                </div>
                                                {CATEGORIES.map(cat => (
                                                    <SheetClose key={cat.handle} asChild>
                                                        <Link href={`/collections/${cat.handle}`} className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                            <List className="w-5 h-5 text-slate-400" /> {cat.name}
                                                        </Link>
                                                    </SheetClose>
                                                ))}
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Desktop Logo */}
                                <Link href="/" className="hidden lg:flex items-center ml-2 lg:ml-0 gap-2">
                                    <div className="relative w-[46px] h-[46px] shrink-0 bg-white rounded-full p-1.5 shadow-sm border border-black/10 overflow-hidden flex items-center justify-center">
                                        <Image src="/logo-generated.png" alt="Logo CompraHogar" fill className="object-contain scale-[1.15]" priority sizes="46px" />
                                    </div>
                                    <div className="flex flex-col text-white font-black tracking-tight leading-[0.85]">
                                        <span className="text-[20px] ml-[1px]">compra</span>
                                        <span className="text-[20px]">hogar</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Huge Central Search (ML Style Pill) - Expands to fill available space */}
                            <div className="flex-1 w-full max-w-[600px] block">
                                <div className="bg-white rounded-full sm:rounded-md shadow-sm border-none overflow-hidden h-[38px] md:h-10 flex items-center">
                                    <PredictiveSearch hideBorder />
                                </div>
                            </div>

                            {/* Mobile Cart Icon in Top Level */}
                            <button 
                                className="lg:hidden relative p-2 -mr-2 text-white active:bg-white/10 rounded-full transition-colors shrink-0"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                                {totalQuantity > 0 && (
                                    <span className="absolute top-1 right-0 w-4 h-4 bg-[#ef7c1c] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                        {totalQuantity}
                                    </span>
                                )}
                            </button>

                            {/* Right Actions (Desktop) */}
                            <div className="hidden lg:flex shrink-0 items-center justify-end gap-4 min-w-[180px] text-sm text-white">
                                <LocationSelector />
                                <LocaleSwitcher className="h-9 px-3 py-2 border border-input bg-background/10 backdrop-blur-sm hover:bg-background/20 rounded-md text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM ROW (Full width teal background) */}
                <div className="w-full bg-[#21645d] border-b border-[#1c554f]">
                    <div className="container mx-auto max-w-[1200px] px-4">
                        <div className="h-[44px] flex items-center justify-between text-white/95 text-[13px]">

                            {/* Category & Quick Links */}
                            <nav className="hidden lg:flex items-center gap-1 flex-1">
                                <MegaMenu collections={collections} />

                                <Link href="/collections/ofertas" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ofertas</Link>
                                <Link href="/institucional/historial" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Historial</Link>
                                <Link href="/institucional/vender" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Corporativo</Link>
                                <Link href="/ayuda" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ayuda</Link>
                            </nav>

                            {/* User & Cart Actions (Desktop) */}
                            <div className="hidden lg:flex items-center gap-2">
                                
                                <Link href="/cuenta" className="hidden sm:flex items-center gap-1.5 font-medium hover:bg-black/10 px-3 h-11 rounded-sm transition-colors">
                                    <User className="w-4 h-4 opacity-80" />
                                    <span className="hidden lg:block">Mi cuenta</span>
                                </Link>
                                <Link href="/cuenta" className="hidden lg:flex items-center font-medium hover:bg-black/10 px-3 h-11 rounded-sm transition-colors">
                                    Mis compras
                                </Link>

                                <button 
                                    className="relative flex items-center justify-center w-11 h-11 mx-1 hover:bg-black/10 rounded-full transition-colors"
                                    onClick={() => setIsCartOpen(true)}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {totalQuantity > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-white text-[#21645d] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border border-[#21645d]">
                                            {totalQuantity}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE ONLY Location Bar (App Style Ribbon) */}
            <div className={`lg:hidden w-full px-3 relative z-[40] transition-all duration-300 origin-top overflow-hidden bg-slate-100 ${isScrolled ? "h-0 py-0 opacity-0" : "h-[36px] py-2 opacity-100"}`}>
                <div className="flex items-center gap-1.5 text-slate-700 text-[13px] font-normal w-full px-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="truncate flex-1">Ingresa tu ubicación</span>
                    <ChevronRight className="w-4 h-4 opacity-50 shrink-0" strokeWidth={1.5} />
                </div>
            </div>

            {/* Render CartDrawer once directly in the main layout tree instead of inside conditional hidden divs */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}

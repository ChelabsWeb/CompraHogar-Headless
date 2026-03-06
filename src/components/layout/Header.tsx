"use client";

import { useState } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, ChevronDown, User, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/CartProvider";

import { PredictiveSearch } from "@/components/shared/PredictiveSearch";
import { LocationSelector } from "@/components/shop/LocationSelector";
import { MegaMenu } from "./MegaMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";

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
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { totalQuantity } = useCart();

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 50);
    });

    const isHome = pathname === "/";
    const headerBg = "bg-white"; // Top row white, bottom row Teal

    return (
        <div className={`fixed top-0 inset-x-0 z-50 flex flex-col pointer-events-auto transition-transform duration-300 ${isScrolled ? "-translate-y-[72px]" : "translate-y-0"}`}>

            <header className={`w-full ${headerBg} shadow-sm border-b border-slate-200`}>
                <div className="container mx-auto max-w-[1200px] px-4">

                    {/* TOP ROW: Logo, Search, Ad */}
                    <div className="h-[72px] flex items-center justify-between gap-4 lg:gap-8 pt-2">
                        {/* Logo and Mobile Menu */}
                        <div className="flex items-center gap-2 lg:gap-0 shrink-0">
                            <div className="lg:hidden flex items-center -ml-2">
                                <MobileMenu />
                            </div>
                            <Link href="/" className="flex items-center">
                                <div className="relative w-[150px] sm:w-[210px] h-[40px] sm:h-[56px]">
                                    <Image
                                        src="/logo.png"
                                        alt="CompraHogar"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                        sizes="(max-width: 640px) 150px, 210px"
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* Huge Central Search */}
                        <div className="flex-1 max-w-[600px]">
                            <PredictiveSearch />
                        </div>

                        {/* Right Promo Box */}
                        <div className="hidden lg:flex shrink-0 items-center justify-end w-[180px]">
                            <LocaleSwitcher className="h-9 px-3 py-2 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground rounded-md text-foreground transition-colors" />
                        </div>
                    </div>

                </div>

                {/* BOTTOM ROW (Full width teal background) */}
                <div className="w-full bg-[#21645d] border-b border-[#1c554f]">
                    <div className="container mx-auto max-w-[1200px] px-4">
                        <div className="h-[44px] flex items-center justify-between text-white/95 text-[13px]">

                            {/* Location Pin */}
                            <LocationSelector />

                            {/* Category & Quick Links */}
                            <nav className="hidden lg:flex items-center gap-1 flex-1 px-8">
                                <MegaMenu collections={collections} />

                                <Link href="/collections/ofertas" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ofertas</Link>
                                <Link href="/institucional/historial" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Historial</Link>
                                <Link href="/institucional/vender" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Corporativo</Link>
                                <Link href="/ayuda" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ayuda</Link>
                            </nav>

                            {/* User & Cart Actions */}
                            <div className="flex items-center gap-2">
                                
                                <Link href="/cuenta" className="hidden sm:flex items-center gap-1.5 font-medium hover:bg-black/10 px-3 py-1.5 rounded-sm transition-colors">
                                    <User className="w-4 h-4 opacity-80" />
                                    <span className="hidden lg:block">Mi cuenta</span>
                                </Link>
                                <Link href="/cuenta" className="hidden lg:block font-medium hover:bg-black/10 px-3 py-1.5 rounded-sm transition-colors">
                                    Mis compras
                                </Link>

                                <button 
                                    className="relative flex items-center justify-center p-2 mx-2 hover:bg-black/10 rounded-full transition-colors"
                                    onClick={() => setIsCartOpen(true)}
                                >
                                    <ShoppingBag className="w-[18px] h-[18px]" />
                                    {totalQuantity > 0 && (
                                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white text-[#21645d] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                            {totalQuantity}
                                        </span>
                                    )}
                                </button>
                                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE ONLY SEARCH BAR (Appears on scroll) */}
            <div className={`lg:hidden w-full bg-[#21645d] py-2 px-4 shadow-sm transition-all duration-300 origin-top overflow-hidden ${isScrolled ? "h-[56px] opacity-100 border-t border-[#1c554f]" : "h-0 opacity-0 p-0"}`}>
                <PredictiveSearch placeholder="Buscar en CompraHogar..." />
            </div>

        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, ChevronDown, MapPin, User, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart/CartSheet";

const CATEGORIES = [
    { name: "Obra Gruesa", handle: "obra-gruesa" },
    { name: "Herramientas", handle: "herramientas-y-maquinaria" },
    { name: "Electricidad", handle: "electricidad-e-iluminacion" },
    { name: "Sanitaria", handle: "sanitaria-y-griferia" },
    { name: "Pinturas", handle: "pinturas-y-acabados" },
    { name: "Decoración", handle: "hogar-y-decoracion" },
    { name: "Servicios", handle: "servicios-y-alquileres" }
];

export function Header({ collections = [] }: { collections?: any[] }) {
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

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
                    <div className="h-[72px] flex items-center justify-between gap-8 pt-2">
                        {/* Logo */}
                        <Link href="/" className="shrink-0 flex items-center">
                            <div className="relative w-[210px] h-[56px]">
                                <Image
                                    src="/logo.png"
                                    alt="CompraHogar"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    sizes="210px"
                                />
                            </div>
                        </Link>

                        {/* Huge Central Search */}
                        <form action="/search" method="GET" className="flex-1 max-w-[600px] relative shadow-sm">
                            <input
                                type="text"
                                name="q"
                                placeholder="Buscar productos, marcas y más..."
                                className="w-full h-10 pl-4 pr-12 rounded-sm border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[15px] shadow-sm"
                                required
                            />
                            <button type="submit" className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center border-l border-slate-200 cursor-pointer bg-white rounded-r-sm hover:bg-slate-50 transition-colors">
                                <Search className="w-5 h-5 text-slate-500" />
                            </button>
                        </form>

                        {/* Right Promo Box */}
                        <div className="hidden lg:flex shrink-0 items-center justify-end w-[180px]">
                            <Link href="/collections/servicios" className="flex items-center gap-2 group">
                                <div className="text-right flex flex-col justify-center">
                                    <p className="text-[13px] text-slate-800 font-bold leading-tight group-hover:text-blue-600 transition-colors">Servicios Premium</p>
                                    <p className="text-[12px] text-[#21645d] font-semibold">Instalación Pyme</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* BOTTOM ROW (Full width teal background) */}
                <div className="w-full bg-[#21645d] border-b border-[#1c554f]">
                    <div className="container mx-auto max-w-[1200px] px-4">
                        <div className="h-[44px] flex items-center justify-between text-white/95 text-[13px]">

                            {/* Location Pin */}
                            <button className="flex items-center gap-1.5 hover:bg-black/10 px-2 py-1 rounded-sm transition-colors group">
                                <MapPin className="w-4 h-4 opacity-80 group-hover:opacity-100" />
                                <div className="flex items-center gap-1 leading-none">
                                    <span className="opacity-80">Enviar a</span>
                                    <span className="font-semibold hidden sm:block">Montevideo 11000</span>
                                </div>
                            </button>

                            {/* Category & Quick Links */}
                            <nav className="hidden lg:flex items-center gap-1 flex-1 px-8">
                                <div className="relative group/menu h-[44px] flex items-center">
                                    <button className="flex items-center gap-1.5 px-3 h-full font-medium hover:bg-black/10 transition-colors cursor-pointer rounded-sm">
                                        Categorías <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                                    </button>

                                    {/* Simple Dropdown Menu */}
                                    <div className="absolute top-full left-0 w-[240px] bg-white rounded-sm shadow-xl py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-50">
                                        {CATEGORIES.map(cat => (
                                            <Link key={cat.handle} href={`/collections/${cat.handle}`} className="flex items-center justify-between px-5 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer">
                                                {cat.name}
                                                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                                            </Link>
                                        ))}
                                        <div className="h-[1px] w-full bg-slate-100 my-1"></div>
                                        <Link href="/collections/all" className="block px-5 py-2.5 text-[14px] text-blue-600 font-semibold hover:bg-slate-50">
                                            Explorar todo el catálogo
                                        </Link>
                                    </div>
                                </div>

                                <Link href="/collections/ofertas" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ofertas</Link>
                                <Link href="/institucional/historial" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Historial</Link>
                                <Link href="/institucional/vender" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Corporativo</Link>
                                <Link href="/ayuda" className="px-3 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ayuda</Link>
                            </nav>

                            {/* User & Cart Actions */}
                            <div className="flex items-center gap-2">
                                <Link href="/account" className="hidden sm:flex items-center gap-1.5 font-medium hover:bg-black/10 px-3 py-1.5 rounded-sm transition-colors">
                                    <User className="w-4 h-4 opacity-80" />
                                    <span className="hidden lg:block">Ingresa</span>
                                </Link>
                                <Link href="/account/orders" className="hidden lg:block font-medium hover:bg-black/10 px-3 py-1.5 rounded-sm transition-colors">
                                    Mis compras
                                </Link>

                                <CartSheet>
                                    <button className="relative flex items-center justify-center p-2 mx-2 hover:bg-black/10 rounded-full transition-colors">
                                        <ShoppingBag className="w-[18px] h-[18px]" />
                                        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white text-[#21645d] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">2</span>
                                    </button>
                                </CartSheet>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE ONLY SEARCH BAR (Appears on scroll) */}
            <div className={`lg:hidden w-full bg-[#21645d] py-2 px-4 shadow-sm transition-all duration-300 origin-top overflow-hidden ${isScrolled ? "h-[56px] opacity-100 border-t border-[#1c554f]" : "h-0 opacity-0 p-0"}`}>
                <div className="relative w-full shadow-sm">
                    <input
                        type="text"
                        placeholder="Buscar en CompraHogar..."
                        className="w-full h-10 pl-10 pr-4 rounded-full border-0 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none text-[14px] shadow-sm"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
            </div>

        </div>
    );
}

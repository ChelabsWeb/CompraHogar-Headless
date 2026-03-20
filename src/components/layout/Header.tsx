"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, ChevronDown, User, ChevronRight, Home, Tag, Clock, Store, List, X, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartSheet";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FavoritesSheet } from "@/components/shop/FavoritesSheet";

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
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const mobileSearchRef = useRef<HTMLInputElement>(null);
    const { totalQuantity, isCartOpen, setIsCartOpen } = useCart();
    const { count: wishlistCount } = useWishlist();
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    useEffect(() => {
        if (mobileSearchOpen && mobileSearchRef.current) {
            mobileSearchRef.current.focus();
        }
    }, [mobileSearchOpen]);

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 50);
    });

    const headerBg = "bg-[#21645d]";

    return (
        <div className={`fixed top-0 inset-x-0 z-50 flex flex-col pointer-events-auto transition-transform duration-300 ${isScrolled ? "lg:-translate-y-[72px] -translate-y-[60px]" : "translate-y-0"}`}>

            <header className="w-full shadow-sm border-b border-black/5">
                {/* TOP ROW: Green on mobile, white on desktop */}
                <div className="bg-white lg:border-b lg:border-slate-200">

                    {/* === MOBILE TOP ROW === */}
                    <div className="lg:hidden container mx-auto max-w-7xl px-4">
                        <div className="flex items-center justify-between w-full h-[56px] relative">
                            <AnimatePresence mode="wait">
                                {mobileSearchOpen ? (
                                    /* ── Search mode: full-width search bar ── */
                                    <motion.div
                                        key="search-bar"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        <div className="flex-1 bg-slate-100 rounded-full overflow-hidden h-[40px] flex items-center">
                                            <PredictiveSearch hideBorder inputRef={mobileSearchRef} />
                                        </div>
                                        <button
                                            onClick={() => setMobileSearchOpen(false)}
                                            className="p-2.5 -mr-2 text-slate-600 active:bg-slate-100 rounded-full transition-colors shrink-0"
                                        >
                                            <X className="w-5 h-5" strokeWidth={2} />
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* ── Default mode: Menu | Logo | Search ── */
                                    <motion.div
                                        key="header-default"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center justify-between w-full"
                                    >
                                        {/* Left: Hamburger menu */}
                                        <div className="flex items-center shrink-0">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <button className="p-2 -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors">
                                                        <Menu className="w-6 h-6" strokeWidth={1.5} />
                                                    </button>
                                                </SheetTrigger>
                                                <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0 flex flex-col bg-white border-r-0">
                                                    <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

                                                    {/* Drawer Header with Logo */}
                                                    <div className="px-5 pt-10 pb-4 flex items-center justify-center">
                                                        <div className="relative w-[260px] h-[65px]">
                                                            <Image src="/logo.png" alt="CompraHogar" fill className="object-contain" sizes="260px" />
                                                        </div>
                                                    </div>
                                                    <div className="h-px bg-[#21645d]/20 mx-5" />

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
                                                                <Link href="/cuenta/mis-compras" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                                    <Clock className="w-5 h-5 text-slate-400" /> Mis Compras
                                                                </Link>
                                                            </SheetClose>
                                                            <SheetClose asChild>
                                                                <Link href="/cuenta/favoritos" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                                    <Heart className="w-5 h-5 text-slate-400" /> Favoritos
                                                                </Link>
                                                            </SheetClose>
                                                            <SheetClose asChild>
                                                                <Link href="/collections" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
                                                                    <Store className="w-5 h-5 text-slate-400" /> Catálogo
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
                                        </div>

                                        {/* Center: Logo */}
                                        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
                                            <div className="relative w-[42px] h-[42px]">
                                                <Image src="/logo2.png" alt="CompraHogar" fill className="object-contain" priority sizes="42px" />
                                            </div>
                                        </Link>

                                        {/* Right: Search + Cart */}
                                        <div className="flex items-center shrink-0 gap-1">
                                            <button
                                                onClick={() => setMobileSearchOpen(true)}
                                                className="p-2.5 text-slate-700 active:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <Search className="w-5 h-5" strokeWidth={1.5} />
                                            </button>
                                            <button
                                                className="relative p-2.5 -mr-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors"
                                                onClick={() => setIsCartOpen(true)}
                                            >
                                                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                                                {totalQuantity > 0 && (
                                                    <span className="absolute top-1 right-0 w-4 h-4 bg-[#ef7c1c] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                                        {totalQuantity}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* === DESKTOP TOP ROW === */}
                    <div className="hidden lg:flex items-center h-[72px] pl-4 pr-6 xl:pl-6 xl:pr-10 gap-2">
                        {/* Logo — left aligned */}
                        <Link href="/" className="flex items-center shrink-0 ml-2">
                            <div className="relative w-[380px] h-[90px] shrink-0">
                                <Image src="/logo.png" alt="Logo CompraHogar" fill className="object-contain object-left" priority sizes="380px" />
                            </div>
                        </Link>

                        {/* Search bar — fills all available space */}
                        <div className="flex-1 min-w-0">
                            <div className="bg-white rounded-xl border border-slate-300 overflow-hidden h-12 flex items-center">
                                <PredictiveSearch hideBorder />
                            </div>
                        </div>

                        {/* Right Actions — selectors unified */}
                        <div className="flex shrink-0 items-center gap-4 text-sm text-slate-700">
                            <LocationSelector />
                            <LocaleSwitcher className="h-12 px-4 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm" />
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW (Full width teal background) — desktop only */}
                <div className="hidden lg:block w-full bg-[#21645d] border-b border-[#1c554f]">
                    <div className="w-full px-4 xl:px-8">
                        <div className="h-[52px] flex items-center justify-between text-white/95 text-[13px] lg:text-sm">

                            {/* Category & Quick Links */}
                            <nav className="hidden lg:flex items-center gap-1 lg:gap-2 flex-1">
                                <MegaMenu collections={collections} />

                                <Link href="/collections/ofertas" className="px-3 lg:px-4 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Ofertas</Link>
                                <Link href="/collections" className="px-3 lg:px-4 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Catálogo</Link>
                                <Link href="/sobre-nosotros" className="px-3 lg:px-4 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Nosotros</Link>
                                <Link href="/envios-y-entregas" className="px-3 lg:px-4 py-2 font-medium hover:bg-black/10 rounded-sm transition-colors">Envíos</Link>
                            </nav>

                            {/* User & Cart Actions (Desktop) */}
                            <div className="hidden lg:flex items-center gap-1">

                                <Link href="/cuenta" className="hidden sm:flex items-center gap-1.5 font-medium hover:bg-black/10 px-3 h-11 rounded-sm transition-colors">
                                    <User className="w-4 h-4 opacity-80" />
                                    <span className="hidden lg:block">Mi cuenta</span>
                                </Link>
                                <Link href="/cuenta/mis-compras" className="hidden lg:flex items-center font-medium hover:bg-black/10 px-3 h-11 rounded-sm transition-colors">
                                    Mis compras
                                </Link>

                                <button
                                    className="relative flex items-center justify-center w-11 h-11 hover:bg-black/10 rounded-full transition-colors"
                                    onClick={() => setIsFavoritesOpen(true)}
                                    aria-label="Favoritos"
                                >
                                    <Heart className="w-5 h-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-white text-[#21645d] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border border-[#21645d]">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </button>

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
            <FavoritesSheet isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
        </div>
    );
}

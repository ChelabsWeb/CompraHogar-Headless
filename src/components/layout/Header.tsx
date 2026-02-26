"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Header({ collections = [] }: { collections?: any[] }) {
    return (
        <header className="w-full flex flex-col z-50 bg-background text-foreground border-b">
            {/* Top Bar */}
            <div className="w-full bg-black text-white text-[11px] font-bold tracking-widest uppercase py-2 px-6 flex justify-between items-center hidden md:flex">
                <span>Envíos gratis en compras mayores a $3000</span>
                <div className="flex gap-8 text-white/80">
                    <span className="hover:text-white cursor-pointer transition-colors">Garantía de Calidad</span>
                    <span className="hover:text-white cursor-pointer transition-colors">Soporte 24/7</span>
                </div>
            </div>

            {/* Main Header Area */}
            <div className="w-full px-4 md:px-8 py-4 md:py-6 flex items-center justify-between">
                
                {/* Mobile Menu & Search */}
                <div className="flex items-center gap-4 md:w-1/3">
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 -ml-2 text-foreground">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-r p-0">
                                <SheetTitle className="sr-only">Menú</SheetTitle>
                                <SheetDescription className="sr-only">Menú principal</SheetDescription>
                                <div className="flex flex-col p-6 gap-6 pt-12">
                                    <Link href="/collections/all" className="text-xl font-bold uppercase tracking-tighter flex items-center justify-between group">
                                        Novedades
                                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                    {collections.map(c => (
                                        <Link key={c.id} href={`/collections/${c.handle}`} className="text-xl font-bold uppercase tracking-tighter flex items-center justify-between group">
                                            {c.title}
                                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex items-center bg-muted rounded px-3 py-2.5 w-full max-w-[260px]">
                        <Search className="w-4 h-4 text-muted-foreground mr-3" />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground font-medium text-foreground"
                        />
                    </div>
                </div>

                {/* Logo Center */}
                <div className="flex justify-center md:w-1/3">
                    <Link href="/" className="text-2xl md:text-4xl font-black tracking-tighter uppercase whitespace-nowrap text-foreground flex items-start">
                        COMPRA HOGAR<sup className="text-[10px] md:text-sm font-bold ml-0.5 mt-1">®</sup>
                    </Link>
                </div>

                {/* Icons Right */}
                <div className="flex items-center justify-end gap-6 md:w-1/3 text-foreground">
                    <button className="hidden md:block hover:opacity-70 transition-opacity">
                        <User className="w-5 h-5" />
                    </button>
                    <button className="hidden md:block hover:opacity-70 transition-opacity">
                        <Search className="w-5 h-5 md:hidden" />
                    </button>
                    <button className="relative hover:opacity-70 transition-opacity">
                        <ShoppingBag className="w-6 h-6 md:w-5 md:h-5" />
                        <span className="absolute -top-1.5 -right-2 bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            0
                        </span>
                    </button>
                </div>
            </div>

            {/* Desktop Navigation Links (Bottom Row) */}
            <nav className="hidden md:flex items-center justify-center gap-10 py-2 pb-5 border-t border-transparent">
                <Link href="/collections/all" className="text-[13px] font-bold uppercase tracking-[0.05em] hover:text-muted-foreground transition-colors">
                    Novedades
                </Link>
                {collections.slice(0, 5).map(c => (
                    <Link key={c.id} href={`/collections/${c.handle}`} className="text-[13px] font-bold uppercase tracking-[0.05em] hover:text-muted-foreground transition-colors">
                        {c.title}
                    </Link>
                ))}
                <Link href="/collections/all" className="text-[13px] font-bold uppercase tracking-[0.05em] hover:text-muted-foreground transition-colors text-red-600">
                    Ofertas
                </Link>
            </nav>
        </header>
    );
}

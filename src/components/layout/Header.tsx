"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Search, Menu, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function Header({ collections = [] }: { collections?: any[] }) {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Add glass effect when scrolled down even a bit
        if (latest > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }

        // Hide on scroll down, show on scroll up
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-colors duration-500 ${isScrolled
                ? "glass-panel border-b border-white/5"
                : "bg-transparent border-transparent"
                }`}
        >
            <div className="flex items-center gap-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="text-white hover:text-white/70 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[400px] sm:w-[500px] bg-background/95 backdrop-blur-2xl border-white/10 p-0">
                        <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                        <SheetDescription className="sr-only">Accede a las categorías del catálogo</SheetDescription>
                        <div className="flex flex-col h-full py-16 px-8 overflow-y-auto">
                            <h2 className="text-sm font-semibold tracking-widest text-white/40 uppercase mb-8">
                                Departamentos
                            </h2>
                            <nav className="flex flex-col gap-6 text-3xl md:text-4xl font-light tracking-tighter">
                                {collections.map((collection) => (
                                    <Link
                                        key={collection.id}
                                        href={`/collections/${collection.handle}`}
                                        className="group flex items-center justify-between hover:pl-4 transition-all duration-300 text-white hover:text-white"
                                    >
                                        <span>{collection.title}</span>
                                        <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
                                    </Link>
                                ))}
                                <Link
                                    href="/collections/all"
                                    className="group flex items-center justify-between hover:pl-4 transition-all duration-300 text-white/50 hover:text-white mt-8"
                                >
                                    <span>Ver Todo</span>
                                    <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
                                </Link>
                            </nav>
                        </div>
                    </SheetContent>
                </Sheet>

                <Link href="/collections/all" className="hidden md:block text-sm uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
                    Catálogo
                </Link>
            </div>

            <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold tracking-tighter">COMPRA HOGAR</span>
            </Link>

            <div className="flex items-center gap-6">
                <button className="text-white hover:text-white/70 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-white/70 transition-colors relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        0
                    </span>
                </button>
            </div>
        </motion.header>
    );
}

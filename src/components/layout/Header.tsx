"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, ChevronRight, ChevronDown, ChevronUp, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const CATEGORIES = [
    {
        name: "Construcción y Materiales",
        handle: "construccion-y-materiales",
        subcategories: [
            { name: "Obra Gruesa", handle: "obra-gruesa" },
            { name: "Hierros y Aceros", handle: "hierros-y-aceros" },
            { name: "Maderas y Placas", handle: "maderas-y-placas" },
            { name: "Aislantes y Membranas", handle: "aislantes-y-membranas" },
            { name: "Construcción en Seco", handle: "construccion-en-seco" },
        ]
    },
    {
        name: "Herramientas y Maquinaria",
        handle: "herramientas-y-maquinaria",
        subcategories: [
            { name: "Herramientas Eléctricas", handle: "herramientas-electricas" },
            { name: "Herramientas Inalámbricas", handle: "herramientas-inalambricas" },
            { name: "Herramientas Manuales", handle: "herramientas-manuales" },
            { name: "Maquinaria Pesada", handle: "maquinaria-pesada" },
            { name: "Accesorios", handle: "accesorios-herramientas" },
        ]
    },
    {
        name: "Electricidad e Iluminación",
        handle: "electricidad-e-iluminacion",
        subcategories: [
            { name: "Cables y Conductores", handle: "cables-y-conductores" },
            { name: "Tubos y Caños Eléctricos", handle: "tubos-y-canos-electricos" },
            { name: "Módulos y Llaves", handle: "modulos-y-llaves" },
            { name: "Tableros y Protecciones", handle: "tableros-y-protecciones" },
            { name: "Iluminación", handle: "iluminacion" },
        ]
    },
    {
        name: "Sanitaria y Grifería",
        handle: "sanitaria-y-griferia",
        subcategories: [
            { name: "Caños y Conexiones", handle: "canos-y-conexiones-sanitaria" },
            { name: "Grifería", handle: "griferia" },
            { name: "Loza Sanitaria", handle: "loza-sanitaria" },
            { name: "Bombas y Tanques", handle: "bombas-y-tanques" },
        ]
    },
    {
        name: "Pinturas y Acabados",
        handle: "pinturas-y-acabados",
        subcategories: [
            { name: "Pinturas", handle: "pinturas" },
            { name: "Impermeabilizantes", handle: "impermeabilizantes" },
            { name: "Preparación de Superficies", handle: "preparacion-de-superficies" },
            { name: "Accesorios para Pintar", handle: "accesorios-para-pintar" },
        ]
    },
    {
        name: "Hogar y Decoración",
        handle: "hogar-y-decoracion",
        subcategories: [
            { name: "Revestimientos", handle: "revestimientos" },
            { name: "Baño y Cocina", handle: "bano-y-cocina" },
        ]
    },
    {
        name: "Jardín y Exteriores",
        handle: "jardin-y-exteriores",
        subcategories: [
            { name: "Herramientas de Jardín", handle: "herramientas-de-jardin" },
            { name: "Mobiliario de Exterior", handle: "mobiliario-de-exterior" },
            { name: "Riego", handle: "riego" },
        ]
    },
    {
        name: "Servicios y Alquileres",
        handle: "servicios-y-alquileres",
        subcategories: []
    }
];

export function Header({ collections = [] }: { collections?: any[] }) {
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const toggleCategory = (handle: string) => {
        setOpenCategory((prev) => (prev === handle ? null : handle));
    };

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 10);
    });

    const isHome = pathname === "/";
    const isTransparent = isHome && !isScrolled;

    // Dynamic text colors based on whether we are floating over the dark video on home, or standard layout
    const textColor = isTransparent ? "text-white" : "text-foreground";
    const textMutedColor = isTransparent ? "text-white/80" : "text-foreground/80";
    const borderMuted = isTransparent ? "border-white/20" : "border-border";

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 flex items-center h-[72px] transition-all duration-300 ${isScrolled ? "glass-nav" : "bg-transparent border-transparent"
                }`}
        >
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">

                {/* Left Drawer Menu */}
                <div className="flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className={`flex items-center gap-2 group p-2 -ml-2 rounded-md hover:bg-muted/20 transition-colors ${textMutedColor} hover:${textColor}`}>
                                <Menu className="w-5 h-5" />
                                <span className="hidden md:inline-block text-sm font-medium">Menú</span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-full sm:w-[400px] bg-background border-r border-border p-0">
                            <SheetTitle className="sr-only">Navegación</SheetTitle>
                            <SheetDescription className="sr-only">Explorar departamentos</SheetDescription>

                            <div className="flex flex-col h-full bg-muted/30">
                                <div className="p-8 pb-4">
                                    <Link href="/" className="flex items-center gap-3">
                                        <div className="relative flex items-center justify-center w-8 h-8">
                                            <Home className="w-8 h-8 text-brand-teal fill-brand-teal" />
                                            <Search className="absolute bottom-[-2px] right-[-2px] w-4 h-4 text-brand-orange bg-background rounded-full p-[2px]" strokeWidth={4} />
                                        </div>
                                        <div className="flex flex-col leading-[0.9] font-black tracking-tight text-[17px]">
                                            <span className="text-brand-orange">COMPRA</span>
                                            <span className="text-brand-teal">HOGAR</span>
                                        </div>
                                    </Link>
                                    <h2 className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase mt-8 mb-4">
                                        Departamentos
                                    </h2>
                                </div>

                                <nav className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
                                    <ul className="flex flex-col gap-1">
                                        {CATEGORIES.map((category) => (
                                            <li key={category.handle} className="flex flex-col">
                                                {category.subcategories.length === 0 ? (
                                                    <Link
                                                        href={`/collections/${category.handle}`}
                                                        className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted/50 border border-transparent transition-all w-full text-left"
                                                    >
                                                        <span className="text-foreground font-semibold text-[15px]">{category.name}</span>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-orange transition-colors" />
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => toggleCategory(category.handle)}
                                                        className="group flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted/50 border border-transparent transition-all w-full text-left"
                                                    >
                                                        <span className="text-foreground font-semibold text-[15px]">{category.name}</span>
                                                        {openCategory === category.handle ? (
                                                            <ChevronUp className="w-4 h-4 text-brand-orange" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-brand-teal transition-colors" />
                                                        )}
                                                    </button>
                                                )}

                                                {openCategory === category.handle && category.subcategories.length > 0 && (
                                                    <ul className="flex flex-col pl-4 pr-2 py-2 space-y-1 mb-2 border-l-[1.5px] border-muted ml-5">
                                                        {category.subcategories.map((sub) => (
                                                            <li key={sub.handle}>
                                                                <Link
                                                                    href={`/collections/${sub.handle}`}
                                                                    className="block px-3 py-2 text-[14px] text-muted-foreground font-medium hover:text-brand-teal hover:bg-brand-teal/5 rounded-md transition-all"
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </nav>

                                <div className="p-8 border-t border-border bg-background">
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[13px] font-medium text-muted-foreground">
                                        <Link href="/about" className="hover:text-brand-teal transition-colors">Nosotros</Link>
                                        <Link href="/contact" className="hover:text-brand-teal transition-colors">Contacto</Link>
                                        <Link href="/shipping" className="hover:text-brand-teal transition-colors">Envíos</Link>
                                        <Link href="/empresas" className="hover:text-brand-teal transition-colors">Para Empresas</Link>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* LOGO */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-6 h-6">
                        <Home className="w-6 h-6 text-brand-teal fill-brand-teal" />
                        <Search className={`absolute bottom-[-2px] right-[-2px] w-3 h-3 text-brand-orange rounded-full p-[1px] ${isTransparent ? 'bg-black/50 backdrop-blur-md' : 'bg-background'}`} strokeWidth={4} />
                    </div>
                    <div className="flex flex-col leading-[0.9] font-black tracking-tight text-[14px] ml-1">
                        <span className="text-brand-orange">COMPRA</span>
                        <span className={`transition-colors ${isTransparent ? 'text-white' : 'text-brand-teal'}`}>HOGAR</span>
                    </div>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <button className={`p-2.5 rounded-full hover:bg-muted/20 transition-colors ${textMutedColor} hover:${textColor}`}>
                        <Search className="w-5 h-5" />
                    </button>
                    <button className={`p-2.5 rounded-full hover:bg-muted/20 transition-colors ${textMutedColor} hover:${textColor} relative`}>
                        <ShoppingBag className="w-5 h-5" />
                        <span className={`absolute top-1.5 right-1.5 bg-brand-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ${isTransparent ? 'ring-transparent' : 'ring-background'}`}>
                            0
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}

"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  Wrench,
  Droplets,
} from "lucide-react";
import { COLLECTION_HIERARCHY, MAIN_COLLECTION_HANDLES } from "@/lib/constants/collectionHierarchy";

// ==========================================
// 1. Tipados (Interfaces)
// ==========================================
export interface SubCategory {
  title: string;
  href: string;
}

export interface PromoData {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
  ctaText: string;
}

export interface Category {
  id: string;
  title: string;
  href: string;
  icon?: React.ReactNode;
  subcategories: SubCategory[];
  promo: PromoData;
}

// ==========================================
// 2. Mock Data (Estructura Simulada)
// ==========================================
const MOCK_CATEGORIES: Category[] = [
  {
    id: "obra-gruesa",
    title: "Obra Gruesa",
    href: "/collections/obra-gruesa",
    icon: <LayoutGrid className="w-4 h-4" />,
    subcategories: [
      { title: "Cementos y Cal", href: "/collections/cementos" },
      { title: "Ladrillos y Bloques", href: "/collections/ladrillos" },
      { title: "Hierros y Mallas", href: "/collections/hierros" },
      { title: "Áridos", href: "/collections/aridos" },
      { title: "Impermeabilizantes", href: "/collections/impermeabilizantes" },
      { title: "Aditivos", href: "/collections/aditivos" },
    ],
    promo: {
      title: "Descuento en Acero",
      subtitle: "Hasta 20% OFF en barras ADN 500 para tu obra",
      imageSrc:
        "https://images.unsplash.com/photo-1518331539958-31623192fde0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      href: "/collections/hierros-promocion",
      ctaText: "Ver Promoción",
    },
  },
  {
    id: "herramientas",
    title: "Herramientas",
    href: "/collections/herramientas",
    icon: <Wrench className="w-4 h-4" />,
    subcategories: [
      {
        title: "Herramientas Eléctricas",
        href: "/collections/herramientas-electricas",
      },
      {
        title: "Herramientas Manuales",
        href: "/collections/herramientas-manuales",
      },
      { title: "Medición y Trazado", href: "/collections/medicion" },
      { title: "Accesorios", href: "/collections/accesorios" },
      { title: "Seguridad Industrial", href: "/collections/seguridad" },
    ],
    promo: {
      title: "Nueva Colección Dewalt",
      subtitle: "Potencia sin cables. Descubrí la línea 20V MAX",
      imageSrc:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      href: "/collections/dewalt",
      ctaText: "Comprar ahora",
    },
  },
  {
    id: "sanitaria",
    title: "Sanitaria",
    href: "/collections/sanitaria",
    icon: <Droplets className="w-4 h-4" />,
    subcategories: [
      { title: "Caños y Conexiones", href: "/collections/canos" },
      { title: "Grifería", href: "/collections/griferia" },
      { title: "Loza Sanitaria", href: "/collections/loza" },
      { title: "Bombas de Agua", href: "/collections/bombas" },
      { title: "Tanques y Cisternas", href: "/collections/tanques" },
    ],
    promo: {
      title: "Renová tu Baño",
      subtitle: "Encontrá las mejores marcas en grifería premium",
      imageSrc:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      href: "/collections/griferia-premium",
      ctaText: "Ver Catálogo",
    },
  },
];

// ==========================================
// 3. Componente Principal
// ==========================================
export function MegaMenu({
  collections = [],
}: {
  collections?: any[]; // Replaces categories?: Category[] 
}) {
  // Map manual collections to the expected Mega Menu shape
  const categories: Category[] = (() => {
    // 1. Define the exact main category handles in order
    const mainHandles = MAIN_COLLECTION_HANDLES;

    // If no collections are passed from Shopify yet, fallback to mock data
    if (!collections || collections.length === 0) return MOCK_CATEGORIES;

    const finalCategories: Category[] = [];

    // 3. Build the structure based on the mainHandles array
    mainHandles.forEach((handle, idx) => {
      // Find the main collection from Shopify data
      const mainCol = collections.find(c => c.handle === handle || c.handle === handle.split('-')[0]);
      
      if (mainCol) {
        // Find subcategories that belong to this main category
        const expectedSubs = COLLECTION_HIERARCHY[handle] || [];
        
        // We will show the expected subcategory even if it isn't in Shopify yet, using our mapping's name
        const foundSubs = expectedSubs.map(sub => {
            const foundCol = collections.find(c => c.handle === sub.handle);
            return {
                title: foundCol ? foundCol.title : sub.name,
                href: `/collections/${sub.handle}`
            };
        });

        // Assign an icon from mock data circularly
        const mock = MOCK_CATEGORIES[idx % MOCK_CATEGORIES.length];

        finalCategories.push({
          id: mainCol.id || mainCol.handle,
          title: mainCol.title,
          href: `/collections/${mainCol.handle}`,
          icon: mock.icon || MOCK_CATEGORIES[0].icon,
          subcategories: foundSubs.length > 0 ? foundSubs : (mock?.subcategories || []),
          promo: {
            // Use actual collection data if available, otherwise fallback to mock
            title: `Especial ${mainCol.title}`,
            subtitle: mainCol.description || "Descubrí las mejores ofertas en esta categoría",
            imageSrc: mainCol.image?.url || mock.promo.imageSrc,
            href: `/collections/${mainCol.handle}`,
            ctaText: "Ver Colección"
          }
        });
      }
    });

    // Fallback if the mapping found nothing (e.g. handles don't match exactly)
    return finalCategories.length > 0 ? finalCategories : MOCK_CATEGORIES;
  })();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lógica de hover con Delay para evitar cierres molestos
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250); // 250ms de tolerancia
  };

  // Accesibilidad: Soporte para teclado (Escape para cerrar, Enter/Space para abrir)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  // Cierra el menú al hacer clic en cualquier enlace interno
  const closeMenu = () => setIsOpen(false);

  // Derivar la categoría actualmente enfocada
  const activeCategory =
    categories.find((cat) => cat.id === activeCategoryId) || categories[0];

  return (
    <div
      className="relative z-50 inline-flex items-center h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* --- Disparador (Trigger) adaptado al Header actual --- */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onKeyDown={handleKeyDown}
        className="flex items-center gap-1.5 px-3 h-[44px] font-medium hover:bg-black/10 transition-colors cursor-pointer rounded-sm"
      >
        Categorías
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </motion.div>
      </button>

      {/* --- Contenedor del Mega Menú --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} // Curva Spring-like 'ease-out'
            className="absolute left-0 top-[44px] mt-1 w-screen max-w-[950px] overflow-hidden bg-white border border-neutral-200/60 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] origin-top-left text-neutral-900"
            role="menu"
            aria-orientation="vertical"
          >
            {/* 4. Layout Interno */}
            <div className="flex bg-white h-[440px]">
              {/* Columna Izquierda: Lista de Categorías Principales */}
              <div className="w-[30%] p-3 bg-neutral-50/60 flex flex-col gap-1 border-r border-neutral-100 pb-4 overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    onMouseEnter={() => setActiveCategoryId(category.id)}
                    onClick={closeMenu}
                    className={`group flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200 focus:outline-none ${
                      activeCategoryId === category.id
                        ? "bg-white text-black shadow-sm ring-1 ring-neutral-200/50 scale-[1.02]"
                        : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`transition-colors ${
                          activeCategoryId === category.id
                            ? "text-black"
                            : "text-neutral-400 group-hover:text-black"
                        }`}
                      >
                        {category.icon}
                      </span>
                      {category.title}
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-all duration-300 ${
                        activeCategoryId === category.id
                          ? "translate-x-0 opacity-100"
                          : "opacity-0 -translate-x-3"
                      }`}
                    />
                  </Link>
                ))}
              </div>

              {/* Columna Central: Navegación de Subcategorías */}
              <div className="w-[35%] py-8 px-10 border-r border-neutral-100">
                <Link
                  href={activeCategory.href}
                  onClick={closeMenu}
                  className="inline-block mb-6 text-xl font-semibold tracking-tight text-neutral-900 transition-colors hover:text-primary"
                >
                  Explorar todo {activeCategory.title}
                </Link>
                <ul className="flex flex-col gap-4">
                  {activeCategory.subcategories.map((sub, index) => (
                    <motion.li
                      key={sub.title}
                      // Efecto escalonado sutil al cambiar de categoría
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                    >
                      <Link
                        href={sub.href}
                        onClick={closeMenu}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none focus-visible:underline"
                      >
                        {sub.title}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Columna Derecha: Tarjeta Promocional Integrada */}
              <div className="w-[35%] p-4 bg-white">
                <Link
                  href={activeCategory.promo.href}
                  onClick={closeMenu}
                  className="relative block w-full h-full overflow-hidden transition-transform duration-300 rounded-2xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  <Image
                    src={activeCategory.promo.imageSrc}
                    alt={activeCategory.promo.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* Gradiente Oscuro para Legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                    <motion.div
                      key={activeCategory.id} // Forza re-animación al cambiar de categoría
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15,
                        ease: "easeOut",
                      }}
                      className="flex flex-col gap-2"
                    >
                      <h4 className="text-xl font-bold leading-tight tracking-tight">
                        {activeCategory.promo.title}
                      </h4>
                      <p className="text-sm text-neutral-300 line-clamp-2">
                        {activeCategory.promo.subtitle}
                      </p>

                      <span className="inline-flex items-center gap-2 mt-3 text-xs font-bold tracking-wider uppercase transition-colors group-hover:text-secondary">
                        {activeCategory.promo.ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </motion.div>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

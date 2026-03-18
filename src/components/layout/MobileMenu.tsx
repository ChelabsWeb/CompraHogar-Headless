'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Drawer } from 'vaul';
import { ChevronRight, ChevronLeft, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { COLLECTION_HIERARCHY, MAIN_COLLECTION_HANDLES } from '@/lib/constants/collectionHierarchy';

// ---------------------------------------------------------------------------
// 1. Tipados y Mock de Datos JSON
// ---------------------------------------------------------------------------
type Category = {
  id: string;
  name: string;
  href?: string;
  children?: Category[];
};

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Obra Gruesa',
    children: [
      {
        id: '1-1',
        name: 'Cemento y Mezclas',
        children: [
          { id: '1-1-1', name: 'Cemento Portland', href: '/cemento-portland' },
          { id: '1-1-2', name: 'Cal', href: '/cal' },
        ],
      },
      { id: '1-2', name: 'Hierros y Mallas', href: '/hierros-y-mallas' },
      { id: '1-3', name: 'Ladrillos y Bloques', href: '/ladrillos' },
    ],
  },
  {
    id: '2',
    name: 'Terminaciones',
    children: [
      { id: '2-1', name: 'Pinturas', href: '/pinturas' },
      { id: '2-2', name: 'Cerámicas y Porcelanatos', href: '/ceramicas' },
    ],
  },
  {
    id: '3',
    name: 'Herramientas',
    href: '/herramientas',
  },
];

// ---------------------------------------------------------------------------
// 2. Componente Principal
// ---------------------------------------------------------------------------
export default function MobileMenu({ collections = [] }: { collections?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mapeamos colecciones dinámicamente como en MegaMenu
  const categories: Category[] = useMemo(() => {
    const mainHandles = MAIN_COLLECTION_HANDLES;
    if (!collections || collections.length === 0) return mockCategories;

    const finalCategories: Category[] = [];

    mainHandles.forEach(handle => {
      const mainCol = collections.find(c => c.handle === handle || c.handle === handle.split('-')[0]);
      if (mainCol) {
        const expectedSubs = COLLECTION_HIERARCHY[handle] || [];
        const foundSubs = expectedSubs.map(sub => {
            const foundCol = collections.find(c => c.handle === sub.handle);
            return {
                id: foundCol ? (foundCol.id || foundCol.handle) : sub.handle,
                name: foundCol ? foundCol.title : sub.name,
                href: `/collections/${sub.handle}`
            };
        });

        finalCategories.push({
          id: mainCol.id || mainCol.handle,
          name: mainCol.title,
          href: `/collections/${mainCol.handle}`,
          children: foundSubs.length > 0 ? foundSubs : undefined
        });
      }
    });

    return finalCategories.length > 0 ? finalCategories : mockCategories;
  }, [collections]);

  // Manejo de la navegación anidada con transiciones CSS
  // En lugar de Framer Motion, guardamos las vistas en un array y nos movemos con un índice.
  const initialView = { id: 'root', name: 'Menú Principal', items: categories };
  const [views, setViews] = useState<{ id: string; name: string; items: Category[]; href?: string }[]>([initialView]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Actualizar el stack si `categories` cambia después del render inicial
  useEffect(() => {
    setViews((prev) => {
        const newViews = [...prev];
        newViews[0] = { id: 'root', name: 'Menú Principal', items: categories };
        return newViews;
    });
  }, [categories]);

  // Al cerrar el Drawer, reiniciamos la navegación anidada al root con un delay para no cortar animación
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setActiveIndex(0);
        setViews([{ id: 'root', name: 'Menú Principal', items: categories }]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, categories]);

  // Lógica de "Avanzar" en el menú
  const handlePush = (category: Category) => {
    if (category.children && category.children.length > 0) {
      const newView = { id: category.id, name: category.name, items: category.children, href: category.href };
      // Cortamos cualquier vista "futura" que se haya acumulado (ej si navegó hacia atrás y luego a otro hijo)
      const nextViews = [...views.slice(0, activeIndex + 1), newView];
      setViews(nextViews);
      setActiveIndex(activeIndex + 1);
    }
  };

  // Lógica de "Retroceder" en el menú
  const handlePop = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        <button
          className="p-2 text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
        
        <Drawer.Content 
          className="fixed bottom-0 left-0 top-0 z-[101] flex h-full w-[85vw] max-w-[360px] flex-col bg-white shadow-2xl outline-none"
        >
          <Drawer.Title className="sr-only">Navegación Móvil</Drawer.Title>
          <Drawer.Description className="sr-only">Menú principal de categorías de compra</Drawer.Description>
          
          {/* Contenedor principal de vistas (Carrusel) */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-white">
            <div 
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${activeIndex * 100}%)`,
                width: `${Math.max(1, views.length) * 100}%` 
              }}
            >
              {views.map((view, index) => (
                <div 
                  key={`${view.id}-${index}`} 
                  className="h-full flex flex-col shrink-0 bg-white"
                  style={{ width: `${100 / Math.max(1, views.length)}%` }}
                  aria-hidden={index !== activeIndex}
                >
                  {/* Header Pega / Sticky de la Vista Actual */}
                  <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 bg-white shrink-0">
                    {index > 0 ? (
                      // Botón de Retroceso
                      <button
                        onClick={handlePop}
                        className="flex items-center text-primary font-medium active:opacity-60 transition-opacity p-2 rounded-lg"
                      >
                        <ChevronLeft size={22} className="mr-0.5" />
                        Volver
                      </button>
                    ) : (
                      // Título de Root
                      <span className="font-bold text-[17px] tracking-tight text-gray-900 truncate pr-2">
                        {view.name}
                      </span>
                    )}
                    
                    {/* Botón de Cerrar */}
                    <Drawer.Close asChild>
                      <button
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full active:scale-95 transition-all outline-none"
                        aria-label="Cerrar menú"
                      >
                        <X size={22} />
                      </button>
                    </Drawer.Close>
                  </div>

                  {/* Mostrar título destacado si estamos en un nivel profundo */}
                  {index > 0 && (
                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 shrink-0 flex items-center justify-between gap-4">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        {view.name}
                      </h2>
                      {view.href && (
                        <Link
                          href={view.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
                        >
                          Ver todo
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Listado dinámico (Navegable deslizando mediante touch en móviles) */}
                  <nav className="flex-1 overflow-y-auto overscroll-contain">
                    <ul className="py-2">
                      {view.items.map((item) => (
                        <li key={item.id}>
                          {item.children && item.children.length > 0 ? (
                              <button
                                onClick={() => handlePush(item)}
                                className="w-full flex items-center justify-between px-5 py-4 min-h-[56px] text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                <span className="text-gray-800 font-medium text-[16px]">
                                  {item.name}
                                </span>
                                <ChevronRight size={20} className="text-gray-400" />
                              </button>
                          ) : (
                              <Link
                                  href={item.href || '#'}
                                  onClick={() => setIsOpen(false)}
                                  className="w-full flex items-center justify-between px-5 py-4 min-h-[56px] text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                  <span className="text-gray-800 font-medium text-[16px]">
                                      {item.name}
                                  </span>
                              </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

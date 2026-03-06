'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Menu } from 'lucide-react';
import Link from 'next/link';

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
    href: '/herramientas', // No tiene hijos, lleva directo a la página
  },
];

// ---------------------------------------------------------------------------
// 2. Variantes de Animación Framer Motion (Transición Horizontal)
// ---------------------------------------------------------------------------
const slideVariants = {
  // `direction` nos indica si vamos "hacia adentro" (+1) o "hacia afuera" (-1)
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 1,
  }),
};

// ---------------------------------------------------------------------------
// 3. Componente Principal
// ---------------------------------------------------------------------------
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  // El stack guarda la "ruta" de menús. El root siempre está en index 0.
  const [stack, setStack] = useState<{ id: string; name: string; items: Category[] }[]>([
    { id: 'root', name: 'Menú Principal', items: mockCategories },
  ]);
  
  // 'direction' controla de qué lado entra/sale la animación. 1 = push, -1 = pop
  const [direction, setDirection] = useState(1);

  // Bloquear scroll externo al abrir el Drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      
      // Opcional: Reiniciar el stack al cerrar (después delay para no cortar animación visual)
      const timer = setTimeout(() => {
        setStack([{ id: 'root', name: 'Menú Principal', items: mockCategories }]);
        setDirection(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Vista activa actual en el frente
  const currentView = stack[stack.length - 1];

  // Lógica de "Avanzar" en el menú
  const handlePush = (category: Category) => {
    if (category.children && category.children.length > 0) {
      setDirection(1); // Animamos hacia la izquierda
      setStack([...stack, { id: category.id, name: category.name, items: category.children }]);
    }
  };

  // Lógica de "Retroceder" en el menú
  const handlePop = () => {
    if (stack.length > 1) {
      setDirection(-1); // Animamos hacia la derecha
      setStack(stack.slice(0, -1));
    }
  };

  return (
    <>
      {/* Botón Trigger de ejemplo */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop y Contenedor del Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex">
            {/* Backdrop oscuro translúcido */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Contenedor principal del Drawer (Mobile Menu deslizando desde la izquierda) */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[300px] max-w-[85%] h-full bg-white shadow-2xl flex flex-col z-50 overflow-hidden"
            >
              {/* Contenedor relativo para el apilamiento de pantallas (Stack view) */}
              <div className="relative flex-1 w-full h-full overflow-hidden bg-gray-50 flex flex-col">
                {/* 
                  Ojo: AnimatePresence con mode="popLayout" o inicial false + absolute
                  permite que las vistas saliente y entrante convivan en el DOM durante el slide 
                */}
                <div className="flex-1 relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentView.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    // Suavizado típico de interfaces nativas en iOS/Android
                    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                    className="absolute inset-0 flex flex-col w-full h-full bg-white"
                  >
                    
                    {/* Header Pega / Sticky de la Vista Actual */}
                    <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 bg-white shrink-0">
                      {stack.length > 1 ? (
                        // Botón de Retroceso
                        <button
                          onClick={handlePop}
                          className="flex items-center text-blue-600 font-medium active:opacity-60 transition-opacity -ml-2 p-2 rounded-lg"
                        >
                          <ChevronLeft size={22} className="mr-0.5" />
                          Volver
                        </button>
                      ) : (
                        // Título de Root
                        <span className="font-bold text-lg tracking-tight text-gray-900">
                          {currentView.name}
                        </span>
                      )}
                      
                      {/* Botón de Cerrar */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                        aria-label="Cerrar menú"
                      >
                        <X size={22} />
                      </button>
                    </div>

                    {/* Mostrar título destacado ("Sub-header") si estamos en un nivel profundo */}
                    {stack.length > 1 && (
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                          {currentView.name}
                        </h2>
                      </div>
                    )}

                    {/* Listado dinámico (Navegable deslizando mediante touch en móviles) */}
                    <nav className="flex-1 overflow-y-auto overscroll-contain">
                      <ul className="py-2">
                        {currentView.items.map((item) => (
                          <li key={item.id}>
                            {item.children && item.children.length > 0 ? (
                                <button
                                  onClick={() => handlePush(item)}
                                  // Estética "Tap target" nativa: Espaciado generoso (min-h: 44px o más)
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

                  </motion.div>
                </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

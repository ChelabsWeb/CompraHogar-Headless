'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface VendorReviewsProps {
  productId: string; // Ej: 'gid://shopify/Product/123456789' convertido o el ID directo
}

export default function VendorReviews({ productId }: VendorReviewsProps) {
  
  // Si la navegación en Next.js muta el producto sin recargar la página (SPA),
  // el componente contenedor hace re-render, pero el script de terceros puede necesitar
  // inicializarse forzosamente si expone alguna API global.
  useEffect(() => {
    // Dependiendo del proveedor, podría requerirse refrescar el widget:
    // if (typeof window !== 'undefined' && (window as any).VendorApi) {
    //   (window as any).VendorApi.refreshWidget(); 
    // }
  }, [productId]);

  return (
    <section className="mt-8 lg:mt-16 w-full max-w-5xl mx-auto border-t border-slate-200 pt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">Opiniones de Clientes</h2>
      
      {/* 1. DOM Objetivo: El script buscará este elemento para inyectarse */}
      <div 
        id="vendor-reviews-widget" 
        className="vendor-reviews-wrapper min-h-[300px]" // min-h evita CLS (Cumulative Layout Shift)
        data-product-id={productId}
      >
         {/* Opcional: Skeleton o mensaje sutil mientras lazyOnload despacha el script */}
         <div className="flex flex-col gap-4 animate-pulse">
             <div className="h-4 bg-slate-200 rounded w-1/4"></div>
             <div className="h-24 bg-slate-200 rounded w-full"></div>
             <div className="h-24 bg-slate-200 rounded w-full"></div>
         </div>
      </div>

      {/* 2. Inyección Perimetral Asíncrona: No bloquea el Hilo Principal */}
      {/* Cuidado: Reemplazar el src con la URL real del provider de reviews */}
      <Script
        id="vendor-reviews-loader"
        src="https://cdn.judge.me/widget_preloader.js" // Ejemplo con Judge.me
        strategy="lazyOnload"
      />
    </section>
  );
}

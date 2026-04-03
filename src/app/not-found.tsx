import Link from 'next/link';
import { Search, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const suggestions = [
    { label: "Herramientas", href: "/collections/herramientas-y-maquinaria" },
    { label: "Sanitaria", href: "/collections/sanitaria-y-griferia" },
    { label: "Electricidad", href: "/collections/electricidad-e-iluminacion" },
    { label: "Pinturas", href: "/collections/pinturas-y-acabados" },
    { label: "Obra Gruesa", href: "/collections/construccion-y-materiales" },
    { label: "Decoración", href: "/collections/hogar-y-decoracion" },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-lg w-full text-center space-y-6">
        <h1 className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Página no encontrada</h2>
          <p className="text-base text-gray-500">
            Lo que buscás puede haber sido movido o ya no está disponible.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/collections">
              <ShoppingBag className="w-4 h-4" />
              Ver catálogo
            </Link>
          </Button>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-400 mb-3">Explorá nuestras categorías</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Link href="/search" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            <Search className="w-4 h-4" />
            Buscar un producto
          </Link>
        </div>
      </div>
    </div>
  );
}

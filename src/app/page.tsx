import { Suspense } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGridSkeleton } from "@/components/shop/ProductCardSkeleton";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CategoryShortcutsList } from "@/components/shop/CategoryShortcuts";

async function FeaturedProducts() {
  try {
    const { body } = await shopifyFetch({
      query: getProductsQuery,
      variables: { first: 8 },
    });

    const products = body?.data?.products?.edges || [];

    if (!products.length) return null;

    return <ProductGrid products={products} />;
  } catch (error) {
    return (
      <div className="w-full flex-col py-12 px-4 border border-red-100 bg-red-50/50 rounded-xl flex items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-3 opacity-80" />
        <h3 className="text-red-700 font-semibold mb-1">Error al conectar con el catálogo</h3>
        <p className="text-red-600/80 text-sm max-w-sm">
          No pudimos cargar los productos destacados en este momento. Por favor, recarga la página.
        </p>
      </div>
    );
  }
}

export default function Home() {

  const categories = [
    { label: "Obra Gruesa", href: "/collections/obra-gruesa", icon: "🧱" },
    { label: "Herramientas", href: "/collections/herramientas-y-maquinaria", icon: "🛠️" },
    { label: "Electricidad", href: "/collections/electricidad-e-iluminacion", icon: "💡" },
    { label: "Sanitaria", href: "/collections/sanitaria-y-griferia", icon: "🚿" },
    { label: "Pinturas", href: "/collections/pinturas-y-acabados", icon: "🎨" },
    { label: "Decoración", href: "/collections/hogar-y-decoracion", icon: "🛋️" },
    { label: "Servicios", href: "/collections/servicios-y-alquileres", icon: "👷" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-800">
      {/* SECTION: Hero Slider & Payment Bar */}
      <section className="relative w-full pb-12 pt-6">
        <Container>
          {/* Main Hero Slider Area */}
          <div className="w-full h-[300px] md:h-[400px] rounded-3xl bg-slate-900 relative overflow-hidden shadow-sm group cursor-pointer border border-slate-100">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80')] opacity-40 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3">
              <Badge variant="secondary" className="w-fit mb-4">
                Temporada de Obra
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 tracking-tight drop-shadow-md">
                Hasta 40% OFF <br />en Refacciones
              </h1>
              <p className="text-white/90 text-sm md:text-xl mb-8 max-w-md hidden md:block font-medium drop-shadow-sm">
                Equipamiento profesional de alto rendimiento con envío gratis a todo el país.
              </p>
              <Button variant="default" className="w-fit font-bold px-8 py-4 h-auto text-base shadow-md transition-transform hover:-translate-y-0.5">
                Comprar Ahora
              </Button>
            </div>
          </div>

          {/* Payment Methods Bar (Trust Bar) */}
          <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payment Method 1 */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 transition-all hover:border-slate-200 hover:shadow-sm cursor-pointer group text-center md:text-left">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 shadow-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                <ShieldCheck className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-slate-800 leading-tight mb-1">Compra Garantizada</span>
                <span className="text-[13px] text-slate-500">Recibe el producto que esperabas</span>
              </div>
            </div>

            {/* Payment Method 2 */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 transition-all hover:border-slate-200 hover:shadow-sm cursor-pointer group text-center md:text-left">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 shadow-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                <CreditCard className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-slate-800 leading-tight mb-1">Mismo precio en cuotas</span>
                <span className="text-[13px] text-slate-500">Con tarjetas seleccionadas</span>
              </div>
            </div>

            {/* Payment Method 3 */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-4 transition-all hover:border-slate-200 hover:shadow-sm cursor-pointer group text-center md:text-left">
               <div className="w-12 h-12 bg-slate-50 border border-slate-100 shadow-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                <Truck className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-slate-800 leading-tight mb-1">Envíos a todo el país</span>
                <span className="text-[13px] text-slate-500">Rápido y seguro a tu puerta</span>
              </div>
            </div>
          </div>

          {/* SECTION: Category Bubbles */}
          <div className="mt-12">
            <div className="bg-slate-50 py-8 px-4 md:px-8 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-800">Categorías</h2>
              </div>
              <CategoryShortcutsList categories={categories} />
            </div>
          </div>

          {/* SECTION: Bento Grid Promociones (NEW) */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-800 mb-6">Promociones Especiales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Promo Banner 1 */}
              <div className="relative rounded-2xl overflow-hidden h-[280px] group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585128719715-46776b56a0fb?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-3">Sanitaria</Badge>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Hasta 40% OFF <br/>en Grifería</h3>
                  <Button variant="secondary" size="sm" className="w-fit">
                    Ver Colección
                  </Button>
                </div>
              </div>

              {/* Promo Banner 2 */}
              <div className="relative rounded-2xl overflow-hidden h-[280px] group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-3">Herramientas</Badge>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Nuevos Taladros <br/>Inalámbricos</h3>
                  <Button variant="secondary" size="sm" className="w-fit">
                    Descubrir
                  </Button>
                </div>
              </div>

              {/* Promo Banner 3 (Wider on md screens, span 1 on lg) */}
              <div className="relative rounded-2xl overflow-hidden h-[280px] group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md md:col-span-2 lg:col-span-1">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-3">Iluminación</Badge>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Renueva tus <br/>Ambientes</h3>
                  <Button variant="secondary" size="sm" className="w-fit">
                    Ver Ofertas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION: Featured Products */}
      <section className="w-full py-20 mt-8 border-t border-slate-100 bg-slate-50/50">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="space-y-3">
              <span className="text-primary text-xs font-bold uppercase tracking-widest block">Productos Populares</span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-800">Equipamiento Destacado</h2>
              <p className="text-muted-foreground text-lg">
                Nuestra selección de alto rendimiento para esta semana.
              </p>
            </div>
            <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl">
              <Link href="/collections/all">Ver catálogo completo</Link>
            </Button>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}


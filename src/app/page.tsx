import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CategoryShortcutsList } from "@/components/shop/CategoryShortcuts";

export default async function Home() {
  const { body } = await shopifyFetch({
    query: getProductsQuery,
    variables: { first: 8 },
  });

  const products = body?.data?.products?.edges || [];

  const categories = [
    { label: "Herramientas", href: "/collections/herramientas", icon: "Drill" },
    { label: "Obra Gruesa", href: "/collections/obra-gruesa", icon: "Home" },
    { label: "Iluminación", href: "/collections/iluminacion", icon: "Zap" },
    { label: "Sanitaria", href: "/collections/sanitaria-y-griferia", icon: "Droplet" },
    { label: "Servicios B2B", href: "/collections/servicios", icon: "Paintbrush" },
    { label: "Ver Todas", href: "/collections/all", icon: "Plus" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      {/* SECTION: Hero Slider & Payment Bar */}
      <section className="relative w-full bg-[#ebebeb] pb-12 pt-6">
        {/* ML Style Yellow/Teal Background Extension */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-[#21645d] -z-10 hidden md:block" />

        <Container>
          {/* Main Hero Slider Area */}
          <div className="w-full h-[300px] md:h-[400px] rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden shadow-xl group cursor-pointer border border-slate-700/50">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80')] opacity-50 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3">
              <Badge variant="secondary" className="w-fit mb-4 text-xs md:text-sm uppercase font-bold tracking-wider px-4 py-1.5 shadow-sm">
                Temporada de Obra
              </Badge>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
                Hasta 40% OFF <br />en Refacciones
              </h1>
              <p className="text-white/90 text-sm md:text-lg mb-8 max-w-md hidden md:block font-medium">
                Equipamiento profesional de alto rendimiento con envío gratis a todo el país.
              </p>
              <Button size="lg" variant="default" className="w-fit font-bold rounded-lg px-8 py-6 h-auto text-base shadow-lg transition-transform hover:-translate-y-0.5">
                Comprar Ahora
              </Button>
            </div>
          </div>

          {/* Payment Methods Bar (Trust Bar) */}
          <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment Method 1 */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center gap-5 transition-shadow hover:shadow-md cursor-pointer group">
              <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#21645d]/10 transition-colors">
                <ShieldCheck className="w-6 h-6 text-[#21645d]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-slate-800 leading-tight mb-1">Compra Garantizada</span>
                <span className="text-[13px] text-slate-500">Recibe el producto que esperabas</span>
              </div>
            </div>

            {/* Payment Method 2 */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center gap-5 transition-shadow hover:shadow-md cursor-pointer group">
              <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#21645d]/10 transition-colors">
                <CreditCard className="w-6 h-6 text-[#21645d]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-slate-800 leading-tight mb-1">Mismo precio en cuotas</span>
                <span className="text-[13px] text-slate-500">Con tarjetas seleccionadas</span>
              </div>
            </div>

            {/* Payment Method 3 */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center gap-5 transition-shadow hover:shadow-md cursor-pointer group">
              <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#21645d]/10 transition-colors">
                <Truck className="w-6 h-6 text-[#21645d]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-slate-800 leading-tight mb-1">Envíos a todo el país</span>
                <span className="text-[13px] text-slate-500">Rápido y seguro a tu puerta</span>
              </div>
            </div>
          </div>

          {/* SECTION: Category Bubbles */}
          <div className="mt-10">
            <CategoryShortcutsList categories={categories} />
          </div>

          {/* SECTION: Bento Grid Promociones (NEW) */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Promo Banner 1 */}
            <div className="relative rounded-2xl overflow-hidden h-[240px] group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
              <div className="absolute inset-0 bg-[#21645d]" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585128719715-46776b56a0fb?auto=format&fit=crop&q=80')] opacity-30 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <Badge variant="secondary" className="w-fit mb-3 text-[10px] uppercase font-bold px-2.5 py-0.5">Sanitaria</Badge>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Hasta 40% OFF <br/>en Grifería</h3>
                <Button variant="outline" size="sm" className="w-fit bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm">
                  Ver Colección
                </Button>
              </div>
            </div>

            {/* Promo Banner 2 */}
            <div className="relative rounded-2xl overflow-hidden h-[240px] group cursor-pointer shadow-sm hover:shadow-lg transition-shadow">
               <div className="absolute inset-0 bg-slate-900" />
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80')] opacity-40 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <Badge variant="default" className="w-fit mb-3 text-[10px] uppercase font-bold px-2.5 py-0.5">Herramientas</Badge>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Nuevos Taladros <br/>Inalámbricos</h3>
                <Button variant="outline" size="sm" className="w-fit bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm">
                  Descubrir
                </Button>
              </div>
            </div>

            {/* Promo Banner 3 (Wider on md screens, span 1 on lg) */}
            <div className="relative rounded-2xl overflow-hidden h-[240px] group cursor-pointer shadow-sm hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
               <div className="absolute inset-0 bg-orange-600" />
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80')] opacity-40 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                <Badge variant="secondary" className="w-fit mb-3 text-[10px] uppercase font-bold px-2.5 py-0.5 border-white text-white">Iluminación</Badge>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Renueva tus <br/>Ambientes</h3>
                <Button variant="outline" size="sm" className="w-fit bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-sm">
                  Ver Ofertas
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SECTION: Featured Products */}
      {products.length > 0 && (
        <section className="w-full py-24 border-t border-border bg-slate-50">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-3">
                <span className="text-[#21645d] text-xs font-bold uppercase tracking-widest block">Productos Populares</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Equipamiento Destacado</h2>
                <p className="text-slate-500 text-lg">
                  Nuestra selección de alto rendimiento para esta semana.
                </p>
              </div>
              <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100">
                <Link href="/collections/all">Ver catálogo completo</Link>
              </Button>
            </div>

            <ProductGrid products={products} />
          </Container>
        </section>
      )}
    </div>
  );
}

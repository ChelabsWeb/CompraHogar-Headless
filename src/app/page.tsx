import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";
import { ArrowRight, Drill, Zap, Droplet, Paintbrush, Home as HomeIcon, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const { body } = await shopifyFetch({
    query: getProductsQuery,
    variables: { first: 8 },
  });

  const products = body?.data?.products?.edges || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      {/* SECTION: Hero Slider & Payment Bar */}
      <section className="relative w-full bg-[#ebebeb] pb-8 pt-6">
        {/* ML Style Yellow/Teal Background Extension */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-[#21645d] -z-10 hidden md:block" />

        <div className="container mx-auto max-w-[1200px] px-4 md:px-0">

          {/* Main Hero Slider Area */}
          <div className="w-full h-[200px] md:h-[340px] rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 relative overflow-hidden shadow-md group cursor-pointer border border-slate-200">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80')] opacity-50 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 w-full md:w-2/3">
              <Badge className="w-fit bg-[#f3843e] hover:bg-[#d97435] text-white border-none mb-3 md:mb-5 text-[10px] uppercase font-bold tracking-wider px-3 py-1">Temporada de Obra</Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 md:mb-3">
                Hasta 40% OFF <br />en Refacciones
              </h1>
              <p className="text-white/80 text-sm md:text-lg mb-6 max-w-md hidden md:block">
                Equipamiento profesional de alto rendimiento con envío gratis a todo el país.
              </p>
              <Button className="w-fit bg-white text-[#21645d] hover:bg-slate-100 font-bold rounded-md px-8 py-6 h-auto">
                Ver Ofertas
              </Button>
            </div>
          </div>

          {/* Payment Methods Bar (Classic ML trust bar) */}
          <div className="w-full bg-white rounded-md shadow-sm mt-4 p-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 mb-8 border border-slate-100">

            {/* Payment Method 1 */}
            <div className="flex-1 flex items-center gap-4 p-2 md:px-6 cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-slate-800 leading-tight">Compra Garantizada</span>
                <Link href="#" className="text-[13px] text-blue-500 hover:text-blue-600">Ver detalles</Link>
              </div>
            </div>

            {/* Payment Method 2 */}
            <div className="flex-1 flex items-center gap-4 p-2 md:px-6 pt-4 md:pt-2 cursor-pointer group">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                <ArrowRight className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-slate-800 leading-tight">Mismo precio en cuotas</span>
                <Link href="#" className="text-[13px] text-blue-500 hover:text-blue-600">Ver tarjetas</Link>
              </div>
            </div>

            {/* Payment Method 3 */}
            <div className="flex-1 flex items-center gap-4 p-2 md:px-6 pt-4 md:pt-2 cursor-pointer group">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                <Zap className="w-6 h-6 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-slate-800 leading-tight">Más medios de pago</span>
                <Link href="#" className="text-[13px] text-blue-500 hover:text-blue-600">Ver todos</Link>
              </div>
            </div>

          </div>

          {/* SECTION: Category Bubbles (ML Style) */}
          <div className="hidden md:block mb-8">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 no-scrollbar">

              <Link href="/collections/herramientas" className="flex flex-col items-center gap-3 group min-w-[120px]">
                <div className="w-[84px] h-[84px] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-slate-100">
                  <Drill className="w-8 h-8 text-[#21645d] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[13px] text-slate-600 text-center font-medium group-hover:text-[#21645d]">Herramientas</span>
              </Link>

              <Link href="/collections/obra-gruesa" className="flex flex-col items-center gap-3 group min-w-[120px]">
                <div className="w-[84px] h-[84px] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-slate-100">
                  <HomeIcon className="w-8 h-8 text-[#21645d] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[13px] text-slate-600 text-center font-medium group-hover:text-[#21645d]">Obra Gruesa</span>
              </Link>

              <Link href="/collections/iluminacion" className="flex flex-col items-center gap-3 group min-w-[120px]">
                <div className="w-[84px] h-[84px] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-slate-100">
                  <Zap className="w-8 h-8 text-[#21645d] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[13px] text-slate-600 text-center font-medium group-hover:text-[#21645d]">Iluminación</span>
              </Link>

              <Link href="/collections/sanitaria-y-griferia" className="flex flex-col items-center gap-3 group min-w-[120px]">
                <div className="w-[84px] h-[84px] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-slate-100">
                  <Droplet className="w-8 h-8 text-[#21645d] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[13px] text-slate-600 text-center font-medium group-hover:text-[#21645d]">Sanitaria</span>
              </Link>

              <Link href="/collections/servicios" className="flex flex-col items-center gap-3 group min-w-[120px]">
                <div className="w-[84px] h-[84px] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-slate-100">
                  <Paintbrush className="w-8 h-8 text-[#21645d] group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[13px] text-slate-600 text-center font-medium group-hover:text-[#21645d]">Servicios B2B</span>
              </Link>

              {/* 'Ver Todas' Bubble */}
              <Link href="/collections/all" className="flex flex-col items-center gap-3 group min-w-[120px]">
                <div className="w-[84px] h-[84px] bg-white rounded-full shadow-sm flex items-center justify-center group-hover:shadow-md transition-all border border-slate-100">
                  <div className="text-xl text-[#21645d] font-bold group-hover:scale-110 transition-transform">+</div>
                </div>
                <span className="text-[13px] text-slate-600 text-center font-medium group-hover:text-[#21645d]">Ver Todas</span>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Featured Products */}
      {products.length > 0 && (
        <section className="w-full py-24 border-t border-border bg-slate-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="space-y-3">
                <span className="text-[#21645d] text-xs font-bold uppercase tracking-widest block">Productos Populares</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Equipamiento Destacado</h2>
                <p className="text-slate-500 text-lg">
                  Nuestra selección de alto rendimiento para esta semana.
                </p>
              </div>
              <Button asChild variant="outline" className="border-slate-200 text-slate-700">
                <Link href="/collections/all">Ver catálogo completo</Link>
              </Button>
            </div>

            <ProductGrid products={products} />
          </div>
        </section>
      )}

    </div>
  );
}

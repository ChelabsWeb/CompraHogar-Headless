import { Suspense } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGridSkeleton } from "@/components/shop/ProductCardSkeleton";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, AlertCircle, Tag, Zap } from "lucide-react";
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
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-800 overflow-x-hidden">
      {/* SECTION: Hero Slider & Payment Bar */}
      <section className="relative w-full pb-8">
        <div className="w-full">
          {/* Main Hero Slider Area (2:1 full width on mobile) */}
          <div className="w-full aspect-[2/1] bg-slate-900 relative overflow-hidden group cursor-pointer snap-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80')] opacity-50 mix-blend-overlay bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />

            <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 w-full md:w-2/3">
              <Badge variant="secondary" className="w-fit mb-2 sm:mb-4 bg-white/20 text-white border-0 backdrop-blur-md">
                Temporada de Obra
              </Badge>
              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight sm:mb-2 md:mb-4 tracking-tight drop-shadow-md">
                Hasta 40% OFF <br className="hidden sm:block" />en Refacciones
              </h1>
              <p className="text-white/90 text-sm md:text-xl mb-6 max-w-md hidden md:block font-medium drop-shadow-sm">
                Equipamiento profesional de alto rendimiento.
              </p>
              <Button variant="default" className="w-fit hidden sm:flex font-bold px-6 md:px-8 py-3 md:py-4 h-auto text-sm md:text-base border-0 focus:ring-0">
                Comprar Ahora
              </Button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
              <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
            </div>
          </div>
        </div>

        <Container>
          {/* Payment Methods Bar (Trust Bar) - Horizontal scroll on mobile with ML circular icons style */}
          <div className="w-full mt-4 sm:mt-6 flex overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar pb-2 md:grid md:grid-cols-4 gap-3 md:gap-4 -mx-4 px-4 md:mx-0 md:px-0">
            {/* Payment Method 1 */}
            <Link href="/" className="bg-white rounded-[8px] p-3 flex flex-row items-center gap-3 transition-all hover:shadow-md cursor-pointer group flex-shrink-0 w-auto pr-6 snap-start shadow-sm border border-slate-100/50">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#ef7c1c]/10 transition-colors">
                <CreditCard className="w-5 h-5 text-[#3483FA] group-hover:text-[#ef7c1c] transition-colors" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-medium text-slate-800 leading-tight">Medios de pago</span>
                <span className="text-[13px] text-[#3483FA] font-medium">Ver todos</span>
              </div>
            </Link>

            {/* Payment Method 2 */}
            <Link href="/" className="bg-white rounded-[8px] p-3 flex flex-row items-center gap-3 transition-all hover:shadow-md cursor-pointer group flex-shrink-0 w-auto pr-6 snap-start shadow-sm border border-slate-100/50">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#ef7c1c]/10 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#3483FA] group-hover:text-[#ef7c1c] transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-medium text-slate-800 leading-tight">Agrega tu código postal</span>
                <span className="text-[13px] text-[#3483FA] font-medium">Ingresar ubicación</span>
              </div>
            </Link>

            {/* Payment Method 3 */}
            <Link href="/" className="bg-white rounded-[8px] p-3 flex flex-row items-center gap-3 transition-all hover:shadow-md cursor-pointer group flex-shrink-0 w-auto pr-6 snap-start shadow-sm border border-slate-100/50">
               <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#ef7c1c]/10 transition-colors">
                <Truck className="w-5 h-5 text-[#3483FA] group-hover:text-[#ef7c1c] transition-colors" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-medium text-slate-800 leading-tight">Centros de envío</span>
                <span className="text-[13px] text-[#3483FA] font-medium">Ver sedes</span>
              </div>
            </Link>

            {/* Payment Method 4 */}
            <Link href="/" className="bg-white rounded-[8px] p-3 flex flex-row items-center gap-3 transition-all hover:shadow-md cursor-pointer group flex-shrink-0 w-auto pr-6 snap-start shadow-sm border border-slate-100/50">
               <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#ef7c1c]/10 transition-colors">
                <Tag className="w-5 h-5 text-[#3483FA] group-hover:text-[#ef7c1c] transition-colors" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-medium text-slate-800 leading-tight">Ofertas menores a</span>
                <span className="text-[13px] text-[#3483FA] font-medium">$500</span>
              </div>
            </Link>
          </div>

          {/* SECTION: Auth Card (Heladless / ML Style) */}
          <div className="mt-4 mb-2">
            <div className="bg-white rounded-[8px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.15)] md:py-6">
                <div className="flex flex-col text-center md:text-left">
                    <h3 className="text-lg font-semibold text-slate-800 leading-tight mb-1">Crea tu cuenta para disfrutar de la mejor experiencia</h3>
                    <p className="text-[14px] text-slate-500">Haz compras más rápido y recibe recomendaciones personalizadas.</p>
                </div>
                <div className="flex flex-row items-center gap-3 w-full md:w-auto">
                    <Button variant="default" className="w-full md:w-auto bg-[#ef7c1c] hover:bg-[#d96a12] text-white font-semibold rounded-[8px] h-12 px-6">
                        Crear cuenta
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto text-[#ef7c1c] border-[#ef7c1c]/20 bg-[#ef7c1c]/5 hover:bg-[#ef7c1c]/10 font-semibold rounded-[8px] h-12 px-6">
                        Ingresar
                    </Button>
                </div>
            </div>
          </div>

          {/* SECTION: Category Bubbles */}
          <div className="mt-8 md:mt-12">
            <div className="bg-slate-50 py-6 px-0 md:py-8 md:px-8 rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">Categorías</h2>
              </div>
              <CategoryShortcutsList categories={categories} />
            </div>
          </div>
            {/* SECTION: Oferta del Día */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-800">Oferta del día</h2>
                  <Link href="/collections/ofertas" className="text-[13px] font-medium text-[#3483FA] hover:text-[#21645d] transition-colors">Ver todas</Link>
              </div>
            </div>
            
            <Link href="/" className="block bg-white rounded-[8px] shadow-[0_1px_2px_0_rgba(0,0,0,0.15)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-row items-stretch min-h-[160px]">
                    <div className="w-1/2 relative bg-white border-r border-slate-100 flex items-center justify-center p-4">
                        <div className="relative w-full aspect-square">
                            <Image src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80" alt="Oferta del día" fill className="object-contain" sizes="50vw" />
                        </div>
                    </div>
                    <div className="w-1/2 p-4 flex flex-col justify-center">
                        <span className="text-[12px] text-slate-500 line-through mb-1">$ 4.590</span>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[26px] font-normal text-slate-800 leading-none">$ 2.290</span>
                            <span className="text-[14px] text-[#00a650] font-medium leading-none">50% OFF</span>
                        </div>
                        <span className="text-[13px] text-[#00a650] font-semibold flex items-center mb-1">
                            Envío gratis <Zap className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </span>
                        <h3 className="text-[14px] text-slate-800 font-normal leading-snug line-clamp-2 mt-2">Taladro Percutor Inalámbrico 18V con Batería Extra</h3>
                    </div>
                </div>
            </Link>
          </div>

          <div className="mt-8 px-2 md:px-0 hidden md:block">
            <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">Promociones Especiales</h2>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Promo Banner 1 */}
              <div className="relative rounded-[8px] overflow-hidden h-[240px] md:h-[280px] w-[85vw] max-w-[320px] md:w-auto shrink-0 snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
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
              <div className="relative rounded-2xl overflow-hidden h-[240px] md:h-[280px] w-[85vw] max-w-[320px] md:w-auto shrink-0 snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
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
              <div className="relative rounded-2xl overflow-hidden h-[240px] md:h-[280px] w-[85vw] max-w-[320px] md:w-auto shrink-0 snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md md:col-span-2 lg:col-span-1">
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
      <section className="w-full py-12 md:py-20 bg-slate-100/60 pb-20">
        <Container>
          <div className="flex items-center gap-3 mb-4 md:mb-10 px-1">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">Equipamiento Destacado</h2>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}


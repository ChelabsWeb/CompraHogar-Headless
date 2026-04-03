import { Suspense } from "react";
import { shopifyFetch, getDealOfTheDay, getCollectionProducts } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGridSkeleton } from "@/components/shop/ProductCardSkeleton";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, AlertCircle, Tag } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
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

export default async function Home() {
  const [deal, herramientas, sanitaria, electricidad] = await Promise.all([
    getDealOfTheDay(),
    getCollectionProducts("herramientas-y-maquinaria", 8),
    getCollectionProducts("sanitaria-y-griferia", 8),
    getCollectionProducts("electricidad-e-iluminacion", 8),
  ]);
  const dealPrice = deal ? parseFloat(deal.priceRange.minVariantPrice.amount) : 0;
  const dealOriginalPrice = deal?.compareAtPriceRange?.maxVariantPrice
    ? parseFloat(deal.compareAtPriceRange.maxVariantPrice.amount)
    : null;
  const dealDiscount = dealOriginalPrice ? Math.round((1 - dealPrice / dealOriginalPrice) * 100) : null;

  const categories = [
    { label: "Obra Gruesa", href: "/collections/obra-gruesa", icon: "🏗️" },
    { label: "Herramientas", href: "/collections/herramientas-y-maquinaria", icon: "🛠️" },
    { label: "Electricidad", href: "/collections/electricidad-e-iluminacion", icon: "⚡" },
    { label: "Sanitaria", href: "/collections/sanitaria-y-griferia", icon: "🚿" },
    { label: "Pinturas", href: "/collections/pinturas-y-acabados", icon: "🎨" },
    { label: "Decoración", href: "/collections/hogar-y-decoracion", icon: "🛋️" },
    { label: "Alquileres", href: "/collections/servicios-y-alquileres", icon: "🔧" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-800 overflow-x-hidden">
      {/* SECTION: Hero & Payment Bar */}
      <section className="relative w-full pb-6">
        {/* Hero Carousel */}
        <HeroCarousel />

        <Container>
          {/* Trust Bar — compact horizontal strip on mobile, grid on desktop */}
          <div className="w-full mt-4 grid grid-cols-4 gap-2 md:gap-4 lg:gap-6 md:mt-6">
            {[
              { icon: CreditCard, label: "Medios de pago", description: "Tarjetas, transferencias y más", color: "text-primary" },
              { icon: Truck, label: "Envío rápido", description: "Recibí en 24-48hs", color: "text-secondary" },
              { icon: ShieldCheck, label: "Compra segura", description: "Protección en cada compra", color: "text-primary" },
              { icon: Tag, label: "Ofertas", description: "Descuentos exclusivos diarios", color: "text-secondary" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 py-3 md:py-4 lg:py-5 xl:py-6 rounded-xl lg:rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
                <item.icon className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ${item.color}`} strokeWidth={1.5} />
                <span className="text-[11px] md:text-[13px] lg:text-sm font-medium text-slate-600 text-center leading-tight">{item.label}</span>
                <span className="hidden lg:block text-xs text-slate-400 text-center leading-tight">{item.description}</span>
              </div>
            ))}
          </div>

          {/* SECTION: Auth Card — compact on mobile */}
          <div className="mt-6 mb-2">
            <div className="bg-gradient-to-r from-primary/8 to-primary/3 rounded-xl p-4 md:p-8 lg:p-10 flex flex-row items-center justify-between gap-3 md:gap-6 border border-primary/10">
                <div className="flex flex-row items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-[14px] md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight">Ingresá a tu cuenta</h3>
                      <p className="text-[11px] md:text-[15px] lg:text-base font-medium text-slate-500 truncate">Comprá más rápido y seguí tus pedidos.</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2 shrink-0">
                    <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg h-9 md:h-11 lg:h-12 px-4 md:px-8 lg:px-10 text-[12px] md:text-sm lg:text-base">
                      <Link href="/login">Ingresar</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex text-primary border-primary/20 hover:bg-primary/5 font-semibold rounded-lg h-9 md:h-11 lg:h-12 px-4 md:px-8 lg:px-10 text-[12px] md:text-sm lg:text-base">
                      <Link href="/registro">Crear cuenta</Link>
                    </Button>
                </div>
            </div>
          </div>

          {/* SECTION: Category Bubbles */}
          <div className="mt-6 md:mt-10">
            <div className="flex justify-between items-center mb-3 md:mb-5">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Categorías</h2>
              <Link href="/collections" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
            </div>
            <CategoryShortcutsList categories={categories} />
          </div>
            {/* SECTION: Oferta del Día */}
          {deal && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Oferta del día</h2>
              <Link href="/collections/ofertas" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
            </div>

            <Link href={`/product/${deal.handle}`} className="block bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 transition-all cursor-pointer group">
                <div className="flex flex-row items-stretch min-h-[140px] lg:min-h-[220px]">
                    {/* Image — left side, compact */}
                    <div className="w-[140px] sm:w-[180px] md:w-1/2 relative bg-slate-50 flex items-center justify-center shrink-0">
                        {dealDiscount && (
                        <Badge className="absolute top-2 left-2 z-10 bg-secondary text-white border-none font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                            -{dealDiscount}%
                        </Badge>
                        )}
                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                            <Image src={deal.featuredImage?.url || "/placeholder.png"} alt={deal.featuredImage?.altText || deal.title} fill className="object-contain p-3" sizes="(max-width: 768px) 140px, 50vw" />
                        </div>
                    </div>
                    {/* Info — right side */}
                    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col justify-center">
                        <h3 className="text-[13px] md:text-[15px] lg:text-lg text-slate-700 font-medium leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">{deal.title}</h3>
                        {dealOriginalPrice && (
                        <span className="text-[11px] text-slate-400 line-through font-medium">$ {dealOriginalPrice.toLocaleString("es-UY")}</span>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[22px] sm:text-[26px] lg:text-[32px] font-normal text-slate-900 leading-none tracking-tight">$ {dealPrice.toLocaleString("es-UY")}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center text-[11px] text-[#00a650] font-bold">
                                <Truck className="w-3 h-3 mr-1" /> Envío gratis
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
          </div>
          )}

          <div className="mt-8 px-2 md:px-0">
            <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-800">Promociones Especiales</h2>
            </div>
            <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
              {/* Promo Banner 1 */}
              <div className="relative rounded-xl overflow-hidden h-[200px] md:h-[280px] lg:h-[340px] w-[75vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 md:shrink snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-[url('/hero-2.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-2 md:mb-3 text-[11px] md:text-sm">Sanitaria</Badge>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight">Hasta 40% OFF <br/>en Grifería</h3>
                  <Button variant="secondary" size="sm" className="w-fit text-xs md:text-sm">
                    Ver Colección
                  </Button>
                </div>
              </div>

              {/* Promo Banner 2 */}
              <div className="relative rounded-xl overflow-hidden h-[200px] md:h-[280px] lg:h-[340px] w-[75vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 md:shrink snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
                 <div className="absolute inset-0 bg-[url('/hero-1.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-2 md:mb-3 text-[11px] md:text-sm">Herramientas</Badge>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight">Nuevos Taladros <br/>Inalámbricos</h3>
                  <Button variant="secondary" size="sm" className="w-fit text-xs md:text-sm">
                    Descubrir
                  </Button>
                </div>
              </div>

              {/* Promo Banner 3 */}
              <div className="relative rounded-xl overflow-hidden h-[200px] md:h-[280px] lg:h-[340px] w-[75vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 md:shrink snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md md:col-span-2 lg:col-span-1">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-2 md:mb-3 text-[11px] md:text-sm">Iluminación</Badge>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight">Renueva tus <br/>Ambientes</h3>
                  <Button variant="secondary" size="sm" className="w-fit text-xs md:text-sm">
                    Ver Ofertas
                  </Button>
                </div>
              </div>
            </div>
            {/* Fade indicator for horizontal scroll on mobile */}
            <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
            </div>
          </div>
          {/* SECTION: Collection Showcases */}
          <div className="mt-10 flex flex-col gap-8 md:gap-10">
            {herramientas && herramientas.products?.edges?.length > 0 && (
              <CollectionShowcase
                title={herramientas.title}
                handle={herramientas.handle}
                description={herramientas.description}
                bannerImage="/hero-1.png"
                bannerColor="from-amber-700 to-amber-900"
                products={herramientas.products.edges}
              />
            )}
            {sanitaria && sanitaria.products?.edges?.length > 0 && (
              <CollectionShowcase
                title={sanitaria.title}
                handle={sanitaria.handle}
                description={sanitaria.description}
                bannerImage="/hero-2.png"
                bannerColor="from-sky-700 to-sky-900"
                products={sanitaria.products.edges}
              />
            )}
            {electricidad && electricidad.products?.edges?.length > 0 && (
              <CollectionShowcase
                title={electricidad.title}
                handle={electricidad.handle}
                description={electricidad.description}
                bannerColor="from-yellow-600 to-yellow-800"
                products={electricidad.products.edges}
              />
            )}
          </div>

        </Container>
      </section>

      {/* SECTION: Featured Products */}
      <section className="w-full py-8 md:py-20 xl:py-24 bg-slate-100/60">
        <Container>
          <div className="flex items-center gap-3 mb-4 md:mb-10 lg:mb-12 px-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-800">Equipamiento Destacado</h2>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}


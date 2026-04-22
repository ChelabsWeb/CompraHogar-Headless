import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { shopifyFetch, getDealOfTheDay, getCollectionProducts } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};
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
import { MAIN_CATEGORIES, categoryHref } from "@/lib/constants/categories";

async function FeaturedProducts() {
  try {
    const { body } = await shopifyFetch({
      query: getProductsQuery,
      tags: ['products'],
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
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("customerAccessToken")?.value;

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

  const categories = MAIN_CATEGORIES.map((cat) => ({
    label: cat.shortName,
    href: categoryHref(cat.handle),
    icon: cat.icon,
  }));

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-800 overflow-x-hidden">
      <h1 className="sr-only">
        CompraHogar Uruguay — Ferretería online: materiales de construcción, herramientas, sanitaria, electricidad y pinturas con envíos en 24-48hs a todo el país
      </h1>
      {/* SECTION: Hero & Payment Bar */}
      <section className="relative w-full pb-6">
        {/* Hero Carousel */}
        <HeroCarousel />

        <Container>
          {/* Trust Bar — icons-forward, no card backgrounds. Each item is a strong value
              prop (not generic "compra segura" copy). Two columns on mobile so text breathes. */}
          <div className="w-full mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 md:gap-x-6">
            {[
              { icon: CreditCard, label: "12 cuotas sin interés" },
              { icon: Truck, label: "Envío en 24–48 hs" },
              { icon: ShieldCheck, label: "Compra protegida" },
              { icon: Tag, label: "Ofertas todos los días" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 md:w-[22px] md:h-[22px] text-primary" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] md:text-[14px] font-semibold text-slate-900 leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* SECTION: Auth Card — only shown to anonymous visitors.
              Logged-in users already have the account entry point in the header, so this
              block wastes first-viewport real estate for them. */}
          {!isLoggedIn && (
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
          )}

          {/* SECTION: Category Bubbles */}
          <div className="mt-6 md:mt-10">
            <div className="flex justify-between items-center mb-3 md:mb-5">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Categorías</h2>
              <Link href="/collections" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
            </div>
            <CategoryShortcutsList categories={categories} />
          </div>
            {/* SECTION: Oferta del día — hero-style to stand out from other rows.
                Subtle gradient backdrop + secondary (orange) accents to convey urgency
                without screaming, and a real "Aprovechar oferta" CTA so the card has a
                clear action target beside being a whole-surface link. */}
          {deal && (
          <div className="mt-8 md:mt-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Oferta del día</h2>
              <Link href="/collections/ofertas" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
            </div>

            <Link
              href={`/products/${deal.handle}`}
              className="block rounded-2xl overflow-hidden border border-secondary/20 bg-gradient-to-br from-secondary/5 via-white to-primary/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] transition-shadow duration-300 group"
            >
                <div className="flex flex-row items-stretch min-h-[180px] md:min-h-[240px] lg:min-h-[280px]">
                    {/* Image */}
                    <div className="w-[150px] sm:w-[200px] md:w-[42%] lg:w-[45%] relative bg-white flex items-center justify-center shrink-0 overflow-hidden">
                        {dealDiscount !== null && (
                            <Badge className="absolute top-3 left-3 z-10 bg-secondary text-white border-none font-bold px-2.5 py-1 text-[11px] uppercase tracking-wider shadow-sm">
                                -{dealDiscount}%
                            </Badge>
                        )}
                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-[1.04]">
                            <Image
                                src={deal.featuredImage?.url || "/placeholder.png"}
                                alt={deal.featuredImage?.altText || deal.title}
                                fill
                                className="object-contain p-4 md:p-6"
                                sizes="(max-width: 768px) 200px, 45vw"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col justify-center gap-2 min-w-0">
                        <span className="inline-flex items-center gap-1.5 w-fit text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            Oferta del día
                        </span>

                        <h3 className="text-[14px] md:text-[17px] lg:text-xl text-slate-900 font-semibold leading-snug line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                            {deal.title}
                        </h3>

                        {dealOriginalPrice && (
                            <span className="text-[11px] md:text-[13px] text-slate-400 line-through font-medium mt-1">
                                ${dealOriginalPrice.toLocaleString("es-UY")}
                            </span>
                        )}

                        <div className="flex items-baseline gap-2">
                            <span className="text-[24px] sm:text-[28px] lg:text-[34px] font-semibold text-slate-900 leading-none tracking-tight">
                                ${dealPrice.toLocaleString("es-UY")}
                            </span>
                        </div>

                        {dealPrice >= 1000 && (
                            <span className="text-[12px] md:text-[13px] text-emerald-700 font-medium mt-0.5">
                                12x ${(dealPrice / 12).toLocaleString("es-UY", { maximumFractionDigits: 0 })} sin interés
                            </span>
                        )}

                        <div className="hidden md:flex items-center gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 text-[12px] lg:text-[13px] font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-md">
                                Aprovechar oferta
                                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
          </div>
          )}

          {/* SECTION: Promos — each banner is now a real Link to a collection.
              Previously the whole card had cursor-pointer and a "Ver Colección" button but no
              href, so clicks went nowhere. */}
          <div className="mt-8 px-2 md:px-0">
            <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-800">Promociones especiales</h2>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
              <Link
                href="/collections/sanitaria-y-griferia"
                className="relative rounded-xl overflow-hidden h-[200px] md:h-[280px] lg:h-[340px] w-[75vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 md:shrink snap-center group shadow-sm border border-slate-100 transition-all hover:shadow-md block"
              >
                <div className="absolute inset-0 bg-[url('/hero-2.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-2 md:mb-3 text-[11px] md:text-sm">Sanitaria</Badge>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight">Hasta 40% OFF<br />en grifería</h3>
                  <span className="w-fit inline-flex items-center gap-1 text-white text-xs md:text-sm font-semibold">
                    Ver colección
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>

              <Link
                href="/collections/herramientas-y-maquinaria"
                className="relative rounded-xl overflow-hidden h-[200px] md:h-[280px] lg:h-[340px] w-[75vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 md:shrink snap-center group shadow-sm border border-slate-100 transition-all hover:shadow-md block"
              >
                <div className="absolute inset-0 bg-[url('/hero-1.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-2 md:mb-3 text-[11px] md:text-sm">Herramientas</Badge>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight">Nuevos taladros<br />inalámbricos</h3>
                  <span className="w-fit inline-flex items-center gap-1 text-white text-xs md:text-sm font-semibold">
                    Descubrir
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>

              <Link
                href="/collections/electricidad-e-iluminacion"
                className="relative rounded-xl overflow-hidden h-[200px] md:h-[280px] lg:h-[340px] w-[75vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 md:shrink snap-center group shadow-sm border border-slate-100 transition-all hover:shadow-md md:col-span-2 lg:col-span-1 block"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 h-full p-5 md:p-8 flex flex-col justify-end">
                  <Badge variant="secondary" className="w-fit mb-2 md:mb-3 text-[11px] md:text-sm">Iluminación</Badge>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight">Renová tus<br />ambientes</h3>
                  <span className="w-fit inline-flex items-center gap-1 text-white text-xs md:text-sm font-semibold">
                    Ver ofertas
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
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
      <section className="w-full py-8 md:py-16 xl:py-20">
        <Container>
          <div className="flex items-center justify-between gap-3 mb-4 md:mb-8 px-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">Equipamiento destacado</h2>
              <Link href="/products" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors shrink-0">
                  Ver todos
              </Link>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}


import { Suspense } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGridSkeleton } from "@/components/shop/ProductCardSkeleton";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, AlertCircle, Tag, ArrowRight } from "lucide-react";
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
    { label: "Obra Gruesa", href: "/collections/obra-gruesa", icon: "Home" },
    { label: "Herramientas", href: "/collections/herramientas-y-maquinaria", icon: "Drill" },
    { label: "Electricidad", href: "/collections/electricidad-e-iluminacion", icon: "Zap" },
    { label: "Sanitaria", href: "/collections/sanitaria-y-griferia", icon: "Droplet" },
    { label: "Pinturas", href: "/collections/pinturas-y-acabados", icon: "Paintbrush" },
    { label: "Decoración", href: "/collections/hogar-y-decoracion", icon: "Home" }, // Reusing home
    { label: "Servicios", href: "/collections/servicios-y-alquileres", icon: "ShieldCheck" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-800 overflow-x-hidden">
      {/* SECTION: Hero & Payment Bar */}
      <section className="relative w-full pb-6">
        {/* Hero Banner — background-image approach for maximum reliability */}
        <Link
          href="/collections/ofertas"
          className="block w-full relative overflow-hidden group"
          style={{
            backgroundImage: "url('/hero-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "right center",
            minHeight: "65svh",
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.08) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-5 pb-7 sm:p-8 md:p-16" style={{ minHeight: "65svh" }}>
            {/* Trust badge */}
            <span className="inline-flex items-center gap-1.5 w-fit mb-3 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[11px] sm:text-xs font-semibold">
              <Truck className="w-3.5 h-3.5" strokeWidth={2} />
              Envío gratis en compras +$300k
            </span>

            <h1 className="text-[30px] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-2 sm:mb-3 max-w-[300px] sm:max-w-md" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              Hasta <span className="text-[#f3843e]" style={{ textShadow: "0 2px 16px rgba(243,132,62,0.5)" }}>40% OFF</span> en Refacciones
            </h1>

            <p className="text-white/90 text-[13px] sm:text-base md:text-lg mb-5 sm:mb-6 font-medium leading-snug max-w-[260px] sm:max-w-sm" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Equipamiento profesional de alto rendimiento.
            </p>

            {/* CTA — orange pill with shimmer */}
            <span className="relative inline-flex items-center gap-2 w-fit bg-[#f3843e] text-white font-bold text-[13px] sm:text-base px-6 py-3 sm:py-3.5 rounded-full overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(243,132,62,0.4)" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              Comprar Ahora
              <ArrowRight className="w-4 h-4" />
            </span>

            {/* Dots */}
            <div className="flex gap-1.5 mt-5">
              <div className="w-6 h-1.5 rounded-full bg-[#f3843e]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </Link>

        <Container>
          {/* Trust Bar — compact horizontal strip on mobile, grid on desktop */}
          <div className="w-full mt-4 grid grid-cols-4 gap-2 md:gap-4 md:mt-6">
            {[
              { icon: CreditCard, label: "Medios de pago", color: "text-primary" },
              { icon: Truck, label: "Envío rápido", color: "text-secondary" },
              { icon: ShieldCheck, label: "Compra segura", color: "text-primary" },
              { icon: Tag, label: "Ofertas", color: "text-secondary" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 py-3 md:py-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
                <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} strokeWidth={1.5} />
                <span className="text-[10px] md:text-[13px] font-medium text-slate-600 text-center leading-tight">{item.label}</span>
              </div>
            ))}
          </div>

          {/* SECTION: Auth Card — compact on mobile */}
          <div className="mt-6 mb-2">
            <div className="bg-primary/5 rounded-xl p-4 md:p-8 flex flex-row items-center justify-between gap-3 md:gap-6 border border-primary/10">
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-[14px] md:text-2xl font-bold tracking-tight text-slate-900 leading-tight">Ingresá a tu cuenta</h3>
                    <p className="text-[12px] md:text-[15px] font-medium text-slate-500 truncate hidden sm:block">Comprá más rápido y seguí tus pedidos.</p>
                </div>
                <div className="flex flex-row items-center gap-2 shrink-0">
                    <Link href="/login">
                      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg h-9 md:h-11 px-4 md:px-8 text-[12px] md:text-sm">
                          Ingresar
                      </Button>
                    </Link>
                    <Link href="/registro" className="hidden sm:block">
                      <Button variant="outline" size="sm" className="text-primary border-primary/20 hover:bg-primary/5 font-semibold rounded-lg h-9 md:h-11 px-4 md:px-8 text-[12px] md:text-sm">
                          Crear cuenta
                      </Button>
                    </Link>
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
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg md:text-2xl font-bold tracking-tight text-slate-900">Oferta del día</h2>
              <Link href="/collections/ofertas" className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors">Ver todas</Link>
            </div>

            <Link href="/" className="block bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 transition-all cursor-pointer group">
                <div className="flex flex-row items-stretch min-h-[140px]">
                    {/* Image — left side, compact */}
                    <div className="w-[120px] sm:w-[180px] md:w-1/2 relative bg-slate-50 flex items-center justify-center shrink-0">
                        <Badge className="absolute top-2 left-2 z-10 bg-secondary text-white border-none font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                            -50%
                        </Badge>
                        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                            <Image src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80" alt="Oferta del día" fill className="object-contain p-3" sizes="(max-width: 768px) 120px, 50vw" />
                        </div>
                    </div>
                    {/* Info — right side */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
                        <h3 className="text-[13px] md:text-[15px] text-slate-700 font-medium leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">Taladro Percutor Inalámbrico 18V con Batería Extra</h3>
                        <span className="text-[11px] text-slate-400 line-through font-medium">$ 4.590</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[22px] sm:text-[26px] font-normal text-slate-900 leading-none tracking-tight">$ 2.290</span>
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

          <div className="mt-8 px-2 md:px-0">
            <div className="flex justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-800">Promociones Especiales</h2>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {/* Promo Banner 1 */}
              <div className="relative rounded-xl overflow-hidden h-[180px] md:h-[280px] w-[75vw] max-w-[320px] md:w-auto shrink-0 snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
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
              <div className="relative rounded-xl overflow-hidden h-[180px] md:h-[280px] w-[75vw] max-w-[320px] md:w-auto shrink-0 snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md">
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
              <div className="relative rounded-xl overflow-hidden h-[180px] md:h-[280px] w-[75vw] max-w-[320px] md:w-auto shrink-0 snap-center group cursor-pointer shadow-sm border border-slate-100 transition-all hover:shadow-md md:col-span-2 lg:col-span-1">
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
          </div>
        </Container>
      </section>

      {/* SECTION: Featured Products */}
      <section className="w-full py-10 md:py-20 bg-slate-100/60 pb-24 lg:pb-20">
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


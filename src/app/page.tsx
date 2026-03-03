import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import Link from "next/link";
import { ArrowRight, Drill, Zap, Droplet, Paintbrush, Home as HomeIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const { body } = await shopifyFetch({
    query: getProductsQuery,
    variables: { first: 8 },
  });

  const products = body?.data?.products?.edges || [];

  return (
    <div className="flex flex-col w-full bg-background -mt-[72px]">

      {/* 
        HERO SECTION - CINEMATIC IMMERSION
        Apple/Tesla inspired full-bleed video.
      */}
      <section className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black -mt-[72px]">

        {/* Full Bleed Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-[1.02] transform-gpu"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Pure flat dark overlay for perfect contrast */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        {/* Centered Cinematic Text */}
        <div className="relative z-10 max-w-[1000px] mx-auto w-full px-6 flex flex-col items-center text-center mt-12">

          <div className="inline-flex items-center justify-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_rgba(243,132,62,0.8)]" />
            <span className="text-white text-xs font-bold tracking-[0.2em] uppercase opacity-90">Colección Premium 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-semibold tracking-tight text-white leading-[0.95] mb-6 drop-shadow-lg">
            Construye con <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-teal/80 to-brand-teal drop-shadow-sm">precisión absoluta.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mb-12 leading-relaxed drop-shadow-sm">
            Herramientas e insumos de vanguardia para proyectos que no aceptan concesiones. Conecta directamente con las mejores marcas del mundo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-4">
            <Button asChild size="lg" className="h-14 px-10 rounded-full font-semibold [&_svg]:size-4">
              <Link href="/collections/all">
                Explorar Catálogo
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-full font-semibold border-white/20 bg-black/10 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:border-white transition-all [&_svg]:size-4 gap-3">
              <Link href="/collections/herramientas">
                Herramientas Pro
                <ArrowRight className="text-secondary" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Minimal Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] mb-4 font-bold">Descubrir</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-white animate-[slideDown_2s_infinite]" />
          </div>
        </div>
      </section>

      {/* 
        SHADCN BENTO GRID - MAIN COLLECTIONS
      */}
      <section className="relative w-full px-6 md:px-12 py-24 bg-muted/30 z-20">
        <div className="max-w-[1400px] mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-secondary uppercase mb-4">Descubre</h2>
            <h3 className="font-['Syne'] text-4xl md:text-5xl font-black text-primary tracking-tighter">
              Categorías Principales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[280px]">

            {/* LARGE FEATURED ITEM */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-end relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center z-0">
                <Drill className="w-48 h-48 text-primary/10 rotate-[-15deg] group-hover:scale-110 group-hover:text-primary/20 transition-all duration-700" />
              </div>
              <CardHeader className="relative z-10 pb-0 shrink-0 mt-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold tracking-widest uppercase mb-2 w-fit">Destacado</span>
                <CardTitle className="text-3xl font-bold">Herramientas Eléctricas</CardTitle>
                <CardDescription className="text-base max-w-sm mt-2">
                  Potencia y rendimiento para proyectos que exigen lo mejor de la industria.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pt-6">
                <Button asChild>
                  <Link href="/collections/herramientas-electricas">
                    Explorar Colección <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* MEDIUM ITEM */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-2 relative overflow-hidden group hover:border-primary/50 transition-colors bg-primary/5">
              <CardHeader>
                <HomeIcon className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-2xl font-bold">Obra Gruesa</CardTitle>
                <CardDescription>Cimientos, cemento y materiales pesados para tu proyecto.</CardDescription>
              </CardHeader>
              <CardContent className="absolute bottom-0 left-0">
                <Button asChild variant="outline" className="bg-background/80 backdrop-blur-sm">
                  <Link href="/collections/obra-gruesa">Ver Más</Link>
                </Button>
              </CardContent>
            </Card>

            {/* SMALL ITEM 1 */}
            <Card className="col-span-1 relative overflow-hidden group hover:border-secondary/50 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-secondary mb-2" />
                <CardTitle className="text-lg">Iluminación</CardTitle>
                <CardDescription className="text-sm">Paneles LED, focos y exteriores.</CardDescription>
              </CardHeader>
              <CardContent className="absolute bottom-6 left-6 p-0">
                <Button asChild variant="ghost" size="icon" className="rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-colors">
                  <Link href="/collections/iluminacion"><ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>

            {/* SMALL ITEM 2 */}
            <Card className="col-span-1 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <CardHeader>
                <Droplet className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Sanitaria</CardTitle>
                <CardDescription className="text-sm">Caños, grifería y loza.</CardDescription>
              </CardHeader>
              <CardContent className="absolute bottom-6 left-6 p-0">
                <Button asChild variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                  <Link href="/collections/sanitaria-y-griferia"><ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>

            {/* MEDIUM HORIZONTAL BOTTOM */}
            <Card className="col-span-1 md:col-span-3 lg:col-span-4 h-full relative overflow-hidden bg-secondary/10 border-secondary/20 group hover:border-secondary/50 transition-colors">
              <div className="absolute inset-y-0 right-12 flex items-center justify-center z-0 opacity-10">
                <Paintbrush className="w-48 h-48 text-secondary" />
              </div>
              <div className="relative z-10 w-full h-full flex flex-col justify-center">
                <CardHeader>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-foreground">Pinturas y Acabados</CardTitle>
                  <CardDescription className="text-lg max-w-lg mt-2 text-foreground/70">
                    Acabados perfectos para interior y exterior. Todo lo que necesitas para el último toque.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Link href="/collections/pinturas">Ver Colección Completa</Link>
                  </Button>
                </CardContent>
              </div>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}

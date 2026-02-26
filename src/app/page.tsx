import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ArrowDown } from "lucide-react";

export default async function Home() {
  const { body } = await shopifyFetch({
    query: getProductsQuery,
    variables: { first: 6 },
  });

  const products = body?.data?.products?.edges || [];

  return (
    <div className="flex flex-col w-full bg-background">
      {/* Hero Section - Kickgame clone */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-[#EAE8E3]">
        <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-black uppercase mb-6 leading-none">
            Materiales <br/>
            <span className="text-black/80">De Primera</span>
          </h1>
          <p className="text-base md:text-lg text-black/70 font-medium mb-8 max-w-xl">
            Acero, impermeabilizantes y herramientas para proyectos que exigen excelencia absoluta.
          </p>
          <div className="flex gap-4">
              <a href="/collections/all" className="bg-black text-white px-8 py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-black/90 transition-colors rounded-sm">
                Comprar Acero
              </a>
              <a href="/collections/all" className="bg-white text-black px-8 py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors rounded-sm">
                Ver Todo
              </a>
          </div>
        </div>
      </section>

      {/* Categories / Banner Strip */}
      <section className="w-full bg-[#F2EFE7] py-6 border-y border-border">
          <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#444444]">Mallas Electrosoldadas</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#444444]">Hierro Redondo</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#444444]">Impermeabilizantes</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#444444]">Herramientas</span>
          </div>
      </section>

      {/* Product Grid Section - Clean Uniform Design */}
      <section className="relative z-20 px-4 md:px-8 py-16 md:py-24 bg-background">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl md:text-[28px] font-black uppercase tracking-tight text-foreground">Recién Llegados</h2>
            <a href="/collections/all" className="text-sm font-bold underline underline-offset-4 text-foreground/80 hover:text-foreground">Ver todos los productos</a>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}

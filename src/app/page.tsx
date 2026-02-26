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
    <div className="flex flex-col w-full bg-background -mt-24">
      {/* Hero Section - Radical Minimalism */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-12">
        <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col justify-end h-full pb-16 md:pb-24">
          <p className="text-white/60 text-sm md:text-md uppercase tracking-[0.3em] font-medium mb-4 pl-1">
            Re-definiendo la Utilidad Radícal
          </p>
          <h1 className="text-[12vw] leading-[0.85] font-black tracking-tighter text-white">
            MASTERY IN
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/30 to-white/70">MOTION</span>
          </h1>

          <div className="absolute right-0 bottom-24 flex items-center gap-4 hidden md:flex">
            <div className="w-[1px] h-24 bg-white/20 self-end"></div>
            <p className="[writing-mode:vertical-rl] text-white/40 tracking-[0.2em] text-xs uppercase">Scroll para descubrir</p>
          </div>
        </div>

        {/* Floating gradient orb for subtle depth */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[100px] opacity-30 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      </section>

      {/* Product Grid Section - Visual First */}
      <section className="relative z-20 px-4 md:px-12 py-24 bg-background border-t border-white-[0.03]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-16 px-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Novedades</h2>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}

import { ProductCardSkeleton } from "@/components/shop/ProductCardSkeleton";

export function CollectionShowcaseSkeleton() {
  return (
    <section className="w-full animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-7 w-48 bg-slate-100 rounded" />
        <div className="h-5 w-20 bg-slate-100 rounded" />
      </div>
      <div className="flex gap-3 md:gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-hidden">
        <div className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] shrink-0 rounded-2xl bg-slate-100 min-h-[360px]" />
        <div className="hidden sm:block min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] shrink-0">
          <ProductCardSkeleton />
        </div>
        <div className="hidden md:block min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] shrink-0">
          <ProductCardSkeleton />
        </div>
        <div className="hidden lg:block min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] shrink-0">
          <ProductCardSkeleton />
        </div>
        <div className="hidden xl:block min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] shrink-0">
          <ProductCardSkeleton />
        </div>
      </div>
    </section>
  );
}

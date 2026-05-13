import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="bg-white rounded-2xl border-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col p-0 animate-pulse">
      <div className="relative w-full aspect-square bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 m-3 sm:m-4 lg:m-5 bg-slate-100 rounded-xl" />
      </div>
      <div className="px-3 pt-3 pb-3.5 flex flex-col gap-2">
        <div className="h-4 w-[85%] bg-slate-100 rounded" />
        <div className="h-4 w-[55%] bg-slate-100 rounded" />
        <div className="mt-1 h-5 w-[40%] bg-slate-200 rounded" />
      </div>
    </Card>
  );
}

// Envoltorio esqueleto para el grid completo — debe replicar la estructura de <ProductGrid />
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 xl:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

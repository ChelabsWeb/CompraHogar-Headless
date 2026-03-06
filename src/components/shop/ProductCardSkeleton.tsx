import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
    return (
        <Card className="group bg-white rounded-md border border-slate-100 overflow-hidden flex flex-col h-full pointer-events-none">
            <div className="flex-1 flex flex-col">
                {/* Cuadrado de Imagen - Respeta el aspect ratio 4/3 exacto */}
                <div className="relative w-full aspect-[4/3] bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-200/60 animate-pulse rounded-md" />
                    {/* Skeleton del Botón de Favoritos en la misma posición */}
                    <div className="absolute top-1 right-1 rounded-full h-8 w-8 bg-slate-200 animate-pulse z-10 border border-slate-100/50" />
                </div>

                {/* Contenedor de Información con distribución idéntica */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                    {/* Precio Principal */}
                    <div className="flex items-start gap-1 mb-1 mt-1">
                        <div className="h-7 w-28 bg-slate-200 animate-pulse rounded-md" />
                    </div>

                    {/* Texto de Cuotas */}
                    <div className="h-3.5 w-48 bg-slate-200 animate-pulse rounded-md mb-2" />

                    {/* Badge de Envío Gratis simulado */}
                    <div className="h-5 w-36 bg-slate-200 animate-pulse rounded-md mb-2 mt-1" />

                    {/* Título (Siempre en la base ocupando 2 líneas como el line-clamp-2 real) */}
                    <div className="mt-auto flex flex-col gap-1.5 pt-2">
                        <div className="h-3.5 w-full bg-slate-200 animate-pulse rounded-md" />
                        <div className="h-3.5 w-4/5 bg-slate-200 animate-pulse rounded-md" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Envoltorio esqueleto para el grid completo
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

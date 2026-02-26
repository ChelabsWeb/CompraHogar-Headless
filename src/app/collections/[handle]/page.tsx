import { shopifyFetch } from "@/lib/shopify";
import { getCollectionWithProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
    const resolvedParams = await params;

    if (!resolvedParams?.handle) {
        return notFound();
    }

    const { body } = await shopifyFetch({
        query: getCollectionWithProductsQuery,
        variables: { handle: resolvedParams.handle, first: 24 },
    });

    const collection = body?.data?.collection;

    if (!collection) return notFound();

    const products = collection.products.edges || [];

    return (
        <div className="flex flex-col w-full bg-background -mt-24">
            {/* Dynamic Collection Header */}
            <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-12 bg-black">
                {collection.image && (
                    <Image
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        fill
                        priority
                        className="object-cover opacity-50 block"
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 z-10" />
                <div className="absolute inset-0 bg-black/40 z-10" />

                <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center mt-24">
                    <p className="text-white/60 text-sm md:text-md uppercase tracking-[0.3em] font-medium mb-4">
                        Colección
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-[8vw] leading-[0.85] font-black tracking-tighter text-white">
                        {collection.title}
                    </h1>
                    {collection.description && (
                        <p className="mt-8 text-xl text-white/70 max-w-2xl font-light">
                            {collection.description}
                        </p>
                    )}
                </div>
            </section>

            {/* Main Content: Sidebar Filters + Product Grid */}
            <section className="relative z-20 px-4 md:px-12 py-16 bg-background">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">

                    {/* Subtle minimal Sidebar for future filters */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-32">
                            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-6 font-semibold">Filtros</h3>

                            <div className="mb-8">
                                <h4 className="text-sm text-white mb-4">Disponibilidad</h4>
                                <label className="flex items-center gap-3 text-sm text-white/70 mb-3 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-white/20 bg-transparent text-white" />
                                    En stock
                                </label>
                                <label className="flex items-center gap-3 text-sm text-white/70 cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="rounded border-white/20 bg-transparent text-white" />
                                    Bajo pedido
                                </label>
                            </div>

                            <div className="w-full h-[1px] bg-white/5 mb-8" />

                            <div className="mb-8">
                                <h4 className="text-sm text-white mb-4">Precio</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-white/40">Min</span>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-1/3"></div>
                                    </div>
                                    <span className="text-xs text-white/40">Max</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-8 px-4 text-sm text-white/50">
                            <span>{products.length} productos</span>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                <span>Ordenar por relevania</span>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <ProductGrid products={products} />
                        ) : (
                            <div className="py-24 text-center">
                                <p className="text-2xl font-light text-white/40">No se encontraron productos.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
}

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
        <div className="flex flex-col w-full bg-background">
            {/* Dynamic Collection Header */}
            <section className="relative h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-12 bg-[#EAE8E3]">
                <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center mt-12">
                    <p className="text-foreground/60 text-[11px] uppercase tracking-widest font-bold mb-4">
                        Colección
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase">
                        {collection.title}
                    </h1>
                    {collection.description && (
                        <p className="mt-6 text-base text-foreground/80 max-w-2xl font-medium">
                            {collection.description}
                        </p>
                    )}
                </div>
            </section>

            {/* Main Content: Sidebar Filters + Product Grid */}
            <section className="relative z-20 px-4 md:px-8 py-16 bg-background">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-12">

                    {/* Subtle minimal Sidebar for future filters */}
                    <div className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-32">
                            <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-6">Filtros</h3>

                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-foreground mb-4">Disponibilidad</h4>
                                <label className="flex items-center gap-3 text-sm text-foreground/80 mb-3 cursor-pointer hover:text-foreground transition-colors">
                                    <input type="checkbox" className="rounded border-border bg-transparent text-foreground accent-black" />
                                    En stock
                                </label>
                                <label className="flex items-center gap-3 text-sm text-foreground/80 cursor-pointer hover:text-foreground transition-colors">
                                    <input type="checkbox" className="rounded border-border bg-transparent text-foreground accent-black" />
                                    Bajo pedido
                                </label>
                            </div>

                            <div className="w-full h-[1px] bg-border mb-8" />

                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-foreground mb-4">Precio</h4>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-muted-foreground font-medium">Min</span>
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-black w-1/3"></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">Max</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-10 px-0 text-sm font-medium text-foreground/60">
                            <span>{products.length} productos</span>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                <span className="uppercase text-[11px] font-bold tracking-widest text-foreground">Ordenar por</span>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <ProductGrid products={products} />
                        ) : (
                            <div className="py-24 text-center">
                                <p className="text-lg font-medium text-muted-foreground">No se encontraron productos.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
}

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

    let collection = body?.data?.collection;

    // Fallback gracefully so any collection handle pressed from the UI works for presentation
    if (!collection) {
        collection = {
            title: resolvedParams.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: "Explora nuestra gama de productos. Nuestro catálogo de Shopify se actualizará pronto para esta categoría.",
            products: { edges: [] },
            image: null
        };
    }

    const products = collection.products?.edges || [];

    return (
        <div className="flex flex-col w-full bg-background min-h-screen">
            {/* Dynamic Collection Header - Light Mode */}
            <section className="relative h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-12 bg-white border-b border-border/50">
                {collection.image && (
                    <Image
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        fill
                        priority
                        className="object-cover opacity-10 block mix-blend-multiply"
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10" />

                <div className="relative z-20 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center mt-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground capitalize mb-4">
                        {collection.title}
                    </h1>
                    {collection.description && (
                        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                            {collection.description}
                        </p>
                    )}
                </div>
            </section>

            {/* Main Content: Sidebar Filters + Product Grid */}
            <section className="relative z-20 px-4 md:px-12 py-16 bg-background">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 md:gap-12">

                    {/* Subtle minimal Sidebar for future filters */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-40 bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
                            <h3 className="text-sm font-semibold mb-6 flex items-center justify-between">
                                Filtros
                                <span className="text-xs text-muted-foreground font-normal bg-secondary/10 px-2 py-1 rounded-md">2 Activos</span>
                            </h3>

                            <div className="mb-6 pb-6 border-b border-border">
                                <h4 className="font-semibold text-sm mb-4">Disponibilidad</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 text-sm text-foreground/80 cursor-pointer hover:text-foreground transition-colors group">
                                        <div className="w-4 h-4 rounded-sm border border-primary shrink-0 flex items-center justify-center bg-primary text-primary-foreground">
                                            <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">En stock</span>
                                    </label>
                                    <label className="flex items-center gap-3 text-sm text-foreground/80 cursor-pointer hover:text-foreground transition-colors group">
                                        <div className="w-4 h-4 rounded-sm border border-primary shrink-0 transition-colors group-hover:border-primary/50"></div>
                                        <span className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bajo pedido</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-2">
                                <h4 className="font-semibold text-sm mb-4">Precio</h4>
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-1/3 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-muted-foreground">$0</span>
                                    <span className="text-xs text-muted-foreground">$5,000+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6 text-sm">
                            <span className="text-muted-foreground">{products.length} productos</span>
                            <div className="flex items-center gap-2 text-foreground font-medium cursor-pointer hover:text-primary transition-colors border px-3 py-1.5 rounded-md shadow-sm">
                                <span>Ordenar: Recomendado</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" opacity="0.5"><path d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <ProductGrid products={products} />
                        ) : (
                            <div className="py-24 text-center bg-card border rounded-xl shadow-sm text-card-foreground">
                                <p className="text-xl font-semibold mb-2">Sin Resultados</p>
                                <p className="text-muted-foreground text-sm">No se encontraron productos en esta colección.</p>
                            </div>
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
}

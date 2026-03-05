import { shopifyFetch } from "@/lib/shopify";
import { getCollectionWithProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FilterSection, FilterItem, PriceRangeFilter } from "@/components/shop/SidebarFilter";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default async function CollectionPage(props: {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await props.params;
    const resolvedSearchParams = await props.searchParams;

    if (!resolvedParams?.handle) {
        return notFound();
    }

    // 1. Construimos los filtros para Shopify
    const filters: any[] = [];
    
    const minPriceStr = Array.isArray(resolvedSearchParams.minPrice) ? resolvedSearchParams.minPrice[0] : resolvedSearchParams.minPrice;
    const maxPriceStr = Array.isArray(resolvedSearchParams.maxPrice) ? resolvedSearchParams.maxPrice[0] : resolvedSearchParams.maxPrice;
    
    const minPrice = Number(minPriceStr);
    const maxPrice = Number(maxPriceStr);

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
        const priceFilter: { min?: number; max?: number } = {};
        if (!isNaN(minPrice)) priceFilter.min = minPrice;
        if (!isNaN(maxPrice)) priceFilter.max = maxPrice;
        filters.push({ price: priceFilter });
    }

    // 2. Construimos las variables de ordenamiento
    let sortKey = "RELEVANCE";
    let reverse = false;

    const sortVal = Array.isArray(resolvedSearchParams.sort) ? resolvedSearchParams.sort[0] : resolvedSearchParams.sort;

    if (sortVal === "price-asc") {
        sortKey = "PRICE";
        reverse = false;
    } else if (sortVal === "price-desc") {
        sortKey = "PRICE";
        reverse = true;
    } else if (sortVal === "newest") {
        sortKey = "CREATED";
        reverse = true;
    }

    // 3. Paginación (opcional si sumas botones "siguiente página")
    const cursor = Array.isArray(resolvedSearchParams.cursor) ? resolvedSearchParams.cursor[0] : resolvedSearchParams.cursor;
    const direction = Array.isArray(resolvedSearchParams.direction) ? resolvedSearchParams.direction[0] : resolvedSearchParams.direction;

    // Llamada con variables dinámicas
    const { body } = await shopifyFetch({
        query: getCollectionWithProductsQuery,
        variables: { 
            handle: resolvedParams.handle, 
            first: 24,
            filters: filters.length > 0 ? filters : undefined,
            sortKey,
            reverse,
            cursor: direction === 'next' ? cursor : undefined
            // Note: Para ir hacia atrás (direction === 'prev'), requieres actualizar el Query 
            // de GraphQL para soportar `last: 24` y `before: cursor`.
        },
    });

    let collection = body?.data?.collection;

    // Fallback gracefully so any collection handle pressed from the UI works for presentation
    if (!collection) {
        collection = {
            title: resolvedParams.handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: "Explora nuestra gama de productos. Nuestro catálogo de Shopify se actualizará pronto para esta categoría.",
            products: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
            image: null
        };
    }

    const products = collection.products?.edges || [];
    const pageInfo = collection.products?.pageInfo;


    return (
        <div className="flex flex-col w-full bg-[#ebebeb] min-h-screen pt-4 pb-16">
            <div className="container mx-auto max-w-[1200px] px-4 md:px-0">

                {/* Breadcrumbs */}
                <div className="mb-4">
                    <Breadcrumbs 
                        items={[
                            { label: "Volver al listado", href: "/collections" },
                            { label: "Hogar y Construcción", href: "/collections/hogar" },
                            { label: collection.title, isLast: true }
                        ]} 
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* LADO IZQUIERDO: Sidebar ML Style */}
                    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col pr-4">
                        <h1 className="text-[26px] font-semibold text-slate-900 capitalize leading-tight mb-2">
                            {collection.title}
                        </h1>
                        <p className="text-[14px] text-slate-500 mb-8 font-light">
                            {products.length} resultados
                        </p>

                        {/* Filtro: Ubicación */}
                        <FilterSection title="Ubicación">
                            <FilterItem label="Montevideo" count={24} />
                            <FilterItem label="Canelones" count={8} />
                            <FilterItem label="Maldonado" count={3} />
                        </FilterSection>

                        {/* Filtro: Precio */}
                        <FilterSection title="Precio">
                            <FilterItem label="Hasta $ 2.500" />
                            <FilterItem label="$ 2.500 a $ 10.000" />
                            <FilterItem label="Más de $ 10.000" />
                            <PriceRangeFilter />
                        </FilterSection>

                        {/* Filtro: Condición */}
                        <FilterSection title="Condición">
                            <FilterItem label="Nuevo" count={products.length} isActive />
                            <FilterItem label="Reacondicionado" count={2} />
                        </FilterSection>
                    </aside>

                    {/* LADO DERECHO: Product Grid Area */}
                    <main className="flex-1 min-w-0">

                        {/* Right-Side Utility Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-4 pt-2">
                            {/* Mobile only title */}
                            <div className="lg:hidden mb-4">
                                <h1 className="text-[22px] font-semibold text-slate-900 capitalize leading-tight">
                                    {collection.title}
                                </h1>
                                <p className="text-[13px] text-slate-500">{products.length} resultados</p>
                            </div>

                            <div className="hidden lg:block" /> {/* Spacer */}

                            <div className="flex items-center gap-2 ml-auto lg:ml-0">
                                <span className="text-[14px] font-semibold text-slate-900 hidden sm:inline">Ordenar por:</span>
                                {/* Aquí el defaultValue debería hidratarse con el sortParams actual si corresponde */}
                                <Select defaultValue={sortVal || "relevance"}>
                                    <SelectTrigger className="w-[180px] bg-white h-9 border-slate-200">
                                        <SelectValue placeholder="Ordenar por" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="relevance">Más relevantes</SelectItem>
                                        <SelectItem value="price-asc">Menor precio</SelectItem>
                                        <SelectItem value="price-desc">Mayor precio</SelectItem>
                                        <SelectItem value="newest">Más recientes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <ProductGrid 
                                products={products}
                                pageInfo={pageInfo}
                                collectionHandle={resolvedParams.handle}
                                filters={filters.length > 0 ? filters : undefined}
                                sortKey={sortKey}
                                reverse={reverse}
                            />
                        ) : (
                            <div className="py-24 text-center bg-white border rounded-md shadow-sm text-slate-600">
                                <p className="text-xl font-medium text-slate-800 mb-2">No hay publicaciones que coincidan con tu búsqueda.</p>
                                <ul className="text-slate-500 text-sm list-disc list-inside mt-4 inline-block text-left">
                                    <li>Revisá la ortografía de la palabra.</li>
                                    <li>Utilizá palabras más genéricas o menos palabras.</li>
                                    <li>Navegá por las categorías para encontrar un producto similar.</li>
                                </ul>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}

import { shopifyFetch } from "@/lib/shopify";
import { getCollectionWithProductsQuery, getCollectionWithProductsPrevQuery, getCollectionMetaQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { notFound } from "next/navigation";
import { StoreFilters } from "@/components/shop/StoreFilters";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import type { Metadata } from "next";
import { getSubcollections } from "@/lib/constants/collectionHierarchy";
import { SubcategoryCarousel } from "@/components/shop/SubcategoryCarousel";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { CollectionSeoBlock } from "@/components/shop/CollectionSeoBlock";
import { RouterRefreshPull } from "@/components/shared/RouterRefreshPull";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata(props: {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const { handle } = await props.params;
    const searchParams = await props.searchParams;
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const pathname = `/collections/${handle}`;
    
    // 1. Iniciamos un objeto URLSearchParams en blanco para asegurar una limpieza total
    const cleanParams = new URLSearchParams();
    
    // 2. DECISIÓN SEO: Preservamos la paginación para garantizar el Deep Crawling de productos,
    // pero omitimos ciegamente 'sort', 'color', 'marca', etc.
    if (searchParams?.page) {
      cleanParams.set('page', String(searchParams.page));
    }

    // 3. Generamos la URL canónica final blindada
    const queryString = cleanParams.toString();
    const canonicalUrl = `${baseUrl}${pathname}${queryString ? `?${queryString}` : ''}`;

    const titleFormatted = handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, ' ');

    // Fetch real collection data from Shopify for rich metadata (dedup'd with the page query).
    let shopifyTitle: string | undefined;
    let shopifyDescription: string | undefined;
    let shopifyImage: string | undefined;
    try {
        const { body } = await shopifyFetch({
            query: getCollectionMetaQuery,
            tags: ['collections', `collection:${handle}`],
            variables: { handle },
        });
        shopifyTitle = body?.data?.collection?.title;
        shopifyDescription = body?.data?.collection?.description;
        shopifyImage = body?.data?.collection?.image?.url;
    } catch {
        // Fall back to handle-derived metadata
    }

    const metaTitle = `${shopifyTitle || titleFormatted} en Uruguay — Envíos 24-48hs | CompraHogar`;
    const metaDescription = (shopifyDescription && shopifyDescription.trim().length > 40)
        ? shopifyDescription.trim().slice(0, 155)
        : `Comprá ${(shopifyTitle || titleFormatted).toLowerCase()} online en Uruguay. Envíos a todo el país en 24-48hs. Hasta 12 cuotas sin interés. Precios mayoristas.`;

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            type: "website",
            url: canonicalUrl,
            ...(shopifyImage && { images: [{ url: shopifyImage }] }),
        },
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            ...(shopifyImage && { images: [shopifyImage] }),
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
        }
    };
}

export default async function CollectionPage(props: {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await props.params;
    const resolvedSearchParams = await props.searchParams;

    if (!resolvedParams?.handle) {
        return notFound();
    }

    // 1. Extraemos e hidratamos los filtros directamente desde la URL
    const activeFiltersUrl = resolvedSearchParams.filter;
    const filters: any[] = [];

    if (activeFiltersUrl) {
        const filtersArray = Array.isArray(activeFiltersUrl) ? activeFiltersUrl : [activeFiltersUrl];
        filtersArray.forEach(f => {
            try {
                filters.push(JSON.parse(f));
            } catch {
                // Silently skip malformed filter params
            }
        });
    }
    
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

    // Llamada con variables dinámicas — usa query distinta según dirección de paginación
    const isPrev = direction === 'prev';
    const { body } = await shopifyFetch({
        query: isPrev ? getCollectionWithProductsPrevQuery : getCollectionWithProductsQuery,
        tags: ['collections', 'products', `collection:${resolvedParams.handle}`],
        variables: isPrev
            ? {
                handle: resolvedParams.handle,
                last: 24,
                filters: filters.length > 0 ? filters : undefined,
                sortKey,
                reverse,
                cursor: cursor || undefined,
            }
            : {
                handle: resolvedParams.handle,
                first: 24,
                filters: filters.length > 0 ? filters : undefined,
                sortKey,
                reverse,
                cursor: direction === 'next' ? cursor : undefined,
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
    const shopifyFilters = collection.products?.filters || [];

    const subcollections = getSubcollections(resolvedParams.handle);
    const isMainCategory = (subcollections && subcollections.length > 0);

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/products` },
            { "@type": "ListItem", position: 3, name: collection.title },
        ],
    };

    return (
        <RouterRefreshPull>
        <div className="flex flex-col w-full bg-[#f7f7f8] min-h-screen pb-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <CollectionHero
                title={collection.title}
                description={collection.description}
                image={collection.image}
                productCount={products.length}
            />

            <div className="container mx-auto max-w-[1200px] px-4 md:px-6 pt-6 md:pt-10">

                {isMainCategory && subcollections && (
                    <div className="-mx-4 md:mx-0 mb-4 md:mb-6">
                        <SubcategoryCarousel
                            parentHandle={resolvedParams.handle}
                            subcollections={subcollections}
                        />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* LADO IZQUIERDO: Sidebar sticky */}
                    <aside className="hidden lg:block w-[260px] shrink-0">
                        <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto pr-2 -mr-2">
                            <h2 className="text-[15px] font-bold text-slate-900 uppercase tracking-wide mb-5">
                                Filtros
                            </h2>
                            {shopifyFilters.length > 0 ? (
                                <StoreFilters filters={shopifyFilters} />
                            ) : (
                                <p className="text-sm text-slate-500">No hay filtros disponibles.</p>
                            )}
                        </div>
                    </aside>

                    {/* LADO DERECHO: Product Grid Area */}
                    <main className="flex-1 min-w-0">

                        {/* Utility bar: sort + count — sticky on mobile */}
                        <div className="sticky top-[80px] z-20 -mx-4 md:mx-0 px-4 md:px-0 bg-[#f7f7f8]/95 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none">
                            <div className="flex items-center justify-between gap-3 py-3 md:py-2 border-b border-slate-200 md:border-0">
                                <p className="text-[13px] md:text-sm text-slate-600">
                                    <span className="font-semibold text-slate-900">{products.length}</span>
                                    <span className="ml-1">{products.length === 1 ? "resultado" : "resultados"}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-medium text-slate-600 hidden sm:inline">Ordenar:</span>
                                    <SortDropdown currentSort={sortVal || "relevance"} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 md:pt-6">
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
                                <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600">
                                    <p className="text-xl font-medium text-slate-800 mb-2">No hay publicaciones que coincidan con tu búsqueda.</p>
                                    <ul className="text-slate-500 text-sm list-disc list-inside mt-4 inline-block text-left">
                                        <li>Revisá la ortografía de la palabra.</li>
                                        <li>Utilizá palabras más genéricas o menos palabras.</li>
                                        <li>Navegá por las categorías para encontrar un producto similar.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </main>

                </div>

                {/* Drawer Móvil (Sólo visible on < lg viewports). */}
                <div className="lg:hidden">
                    <MobileFilterDrawer>
                        {shopifyFilters.length > 0 ? (
                            <StoreFilters filters={shopifyFilters} />
                        ) : (
                            <p className="text-sm text-slate-500">No hay filtros disponibles.</p>
                        )}
                    </MobileFilterDrawer>
                </div>

                <CollectionSeoBlock handle={resolvedParams.handle} />

            </div>
        </div>
        </RouterRefreshPull>
    );
}

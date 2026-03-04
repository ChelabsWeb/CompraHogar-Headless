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
        <div className="flex flex-col w-full bg-[#ebebeb] min-h-screen pt-4 pb-16">
            <div className="container mx-auto max-w-[1200px] px-4 md:px-0">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-4">
                    <span className="cursor-pointer hover:text-blue-500 transition-colors">Volver al listado</span>
                    <span className="mx-1">|</span>
                    <span className="cursor-pointer hover:text-blue-500 transition-colors">Hogar y Construcción</span>
                    <span className="mx-1">{'>'}</span>
                    <span className="font-medium text-slate-700 capitalize">{collection.title}</span>
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
                        <div className="mb-6">
                            <h3 className="text-[16px] font-semibold text-slate-900 mb-3">Ubicación</h3>
                            <ul className="space-y-2 flex flex-col items-start">
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors w-full text-left flex justify-between items-center group">
                                    <span>Montevideo</span> <span className="text-slate-400 text-[12px] group-hover:text-blue-400">(24)</span>
                                </button>
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors w-full text-left flex justify-between items-center group">
                                    <span>Canelones</span> <span className="text-slate-400 text-[12px] group-hover:text-blue-400">(8)</span>
                                </button>
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors w-full text-left flex justify-between items-center group">
                                    <span>Maldonado</span> <span className="text-slate-400 text-[12px] group-hover:text-blue-400">(3)</span>
                                </button>
                            </ul>
                        </div>

                        {/* Filtro: Precio */}
                        <div className="mb-6">
                            <h3 className="text-[16px] font-semibold text-slate-900 mb-3">Precio</h3>
                            <ul className="space-y-2 flex flex-col items-start mb-4">
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors">Hasta $ 2.500</button>
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors">$ 2.500 a $ 10.000</button>
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors">Más de $ 10.000</button>
                            </ul>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Mínimo" className="w-[70px] h-8 px-2 border border-slate-300 rounded-sm text-[13px] text-slate-700 bg-white shadow-sm focus:outline-none focus:border-blue-500" />
                                <span className="text-slate-400">-</span>
                                <input type="number" placeholder="Máximo" className="w-[70px] h-8 px-2 border border-slate-300 rounded-sm text-[13px] text-slate-700 bg-white shadow-sm focus:outline-none focus:border-blue-500" />
                                <button className="h-8 w-8 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-500 shadow-sm hover:bg-slate-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Filtro: Condición */}
                        <div className="mb-6">
                            <h3 className="text-[16px] font-semibold text-slate-900 mb-3">Condición</h3>
                            <ul className="space-y-2 flex flex-col items-start">
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors w-full text-left flex justify-between items-center group">
                                    <span>Nuevo</span> <span className="text-slate-400 text-[12px] group-hover:text-blue-400">({products.length})</span>
                                </button>
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors w-full text-left flex justify-between items-center group">
                                    <span>Reacondicionado</span> <span className="text-slate-400 text-[12px] group-hover:text-blue-400">(2)</span>
                                </button>
                            </ul>
                        </div>
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

                            <div className="flex items-center gap-2 border bg-white rounded-md shadow-sm px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors ml-auto lg:ml-0">
                                <span className="text-[14px] font-semibold text-slate-900">Ordenar por:</span>
                                <span className="text-[14px] text-blue-500">Más relevantes</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <ProductGrid products={products} />
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

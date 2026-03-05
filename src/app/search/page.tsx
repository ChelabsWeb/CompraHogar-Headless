import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const rawQuery = resolvedParams.q;
    const searchQuery = typeof rawQuery === 'string' ? rawQuery : '';

    if (!searchQuery) {
        // If no search query, return an empty state or redirect
        return (
            <div className="flex flex-col w-full bg-[#ebebeb] min-h-[70vh] items-center justify-center p-4">
                <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Qué estás buscando?</h2>
                    <p className="text-slate-500 mb-6">Ingresá el nombre del producto, marca o modelo en la barra superior.</p>
                    <Link href="/" className="text-blue-500 hover:text-blue-700 font-medium flex items-center justify-center gap-1 group">
                        Ir a la página principal <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

    // Fetching all products as a fallback search simulation against Shopify
    const { body } = await shopifyFetch({
        query: getProductsQuery,
        variables: { first: 50 },
    });

    const products = body?.data?.products?.edges || [];

    // Basic client-side filtering logic for the mock search
    const filteredProducts = products.filter(({ node }: any) => {
        const searchTerms = searchQuery.toLowerCase().split(' ');
        const productTitle = node.title.toLowerCase();
        // Match if EVERY word in the search query is found in the product title
        return searchTerms.every((term: string) => productTitle.includes(term));
    });

    return (
        <div className="flex flex-col w-full bg-[#ebebeb] min-h-screen pt-4 pb-16">
            <div className="container mx-auto max-w-[1200px] px-4 md:px-0">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-4">
                    <Link href="/" className="cursor-pointer hover:text-blue-500 transition-colors">Inicio</Link>
                    <span className="mx-1">|</span>
                    <span className="font-medium text-slate-700">Récord de búsqueda</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* LADO IZQUIERDO: Sidebar ML Style */}
                    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col pr-4">
                        <h1 className="text-[26px] font-semibold text-slate-900 leading-tight mb-2 break-words">
                            {searchQuery}
                        </h1>
                        <p className="text-[14px] text-slate-500 mb-8 font-light">
                            {filteredProducts.length} resultados
                        </p>

                        {/* Filtro: Categorías sugeridas */}
                        {filteredProducts.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[16px] font-semibold text-slate-900 mb-3">Categorías</h3>
                                <ul className="space-y-2 flex flex-col items-start">
                                    <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors w-full text-left flex justify-between items-center group">
                                        <span>Resultados relacionados</span> <span className="text-slate-400 text-[12px] group-hover:text-blue-400">({filteredProducts.length})</span>
                                    </button>
                                </ul>
                            </div>
                        )}

                        {/* Filtro: Precio */}
                        <div className="mb-6">
                            <h3 className="text-[16px] font-semibold text-slate-900 mb-3">Precio</h3>
                            <ul className="space-y-2 flex flex-col items-start mb-4">
                                <button className="text-[14px] text-slate-600 hover:text-blue-500 transition-colors">Menos de $ 2.500</button>
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
                    </aside>

                    {/* LADO DERECHO: Product Grid Area */}
                    <main className="flex-1 min-w-0">

                        {/* Utility Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 lg:mb-4 pt-2">
                            {/* Mobile only title */}
                            <div className="lg:hidden mb-4">
                                <h1 className="text-[22px] font-semibold text-slate-900 capitalize leading-tight">
                                    {searchQuery}
                                </h1>
                                <p className="text-[13px] text-slate-500">{filteredProducts.length} resultados</p>
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

                        {filteredProducts.length > 0 ? (
                            <ProductGrid products={filteredProducts} />
                        ) : (
                            <div className="py-24 text-center bg-white border border-slate-100 rounded-md shadow-sm text-slate-600 flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <p className="text-xl font-medium text-slate-800 mb-2">
                                    No hay publicaciones que coincidan con tu búsqueda.
                                </p>
                                <ul className="text-slate-500 text-sm list-disc list-inside mt-4 inline-block text-left">
                                    <li>Revisá la ortografía de la palabra.</li>
                                    <li>Utilizá palabras más genéricas o menos palabras.</li>
                                    <li>Navegá por las categorías gratuitas para encontrar algo similar.</li>
                                </ul>
                                <Link href="/" className="mt-8 text-blue-500 font-medium hover:text-blue-700 transition-colors">
                                    Volver al inicio
                                </Link>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}

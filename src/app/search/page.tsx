import { shopifyFetch } from '@/lib/shopify';
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import { ProductGrid } from '@/components/shop/ProductGrid';

export const metadata = {
  title: 'Buscar | CompraHogar',
  description: 'Busca productos en nuestra tienda.',
};

const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($q: String!) {
    products(first: 24, query: $q) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
        }
      }
    }
  }
`;

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = searchParams;
  const searchTerm = typeof q === 'string' ? q : '';

  let products = [];
  
  if (searchTerm) {
    try {
      const { body } = await shopifyFetch({
        query: SEARCH_PRODUCTS_QUERY,
        variables: { q: searchTerm },
        cache: 'no-store',
      });

      products = body?.data?.products?.edges || [];
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  const hasResults = products.length > 0;

  return (
    <section className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Resultados de búsqueda
          </h1>
          {searchTerm && (
            <p className="mt-2 text-slate-600">
              Mostrando resultados para: <span className="font-medium text-slate-900">"{searchTerm}"</span>
            </p>
          )}
        </div>

        {hasResults ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-100 mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <PackageSearch className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
              No encontramos lo que buscas
            </h2>
            <p className="text-slate-500 mb-8 max-w-md text-center text-balance">
              No hemos podido encontrar resultados exactos para <span className="font-medium">"{searchTerm}"</span>. 
              Intenta usar términos más generales o explora nuestro catálogo completo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
              <Link 
                href="/colecciones/todas" 
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm w-full sm:w-auto"
              >
                Ver todo el catálogo
              </Link>
              <Link 
                href="/" 
                className="inline-flex justify-center items-center px-6 py-3 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

import { shopifyFetch } from "@/lib/shopify";
import Link from "next/link";
import { PackageSearch, ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar productos | CompraHogar",
  description: "Buscá herramientas, materiales y todo lo que necesitás para tu hogar en CompraHogar Uruguay.",
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
          compareAtPriceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
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

// Popular category suggestions shown in the empty state.
// Keep in sync with the home page categories array.
const POPULAR_CATEGORIES = [
  { label: "Herramientas", href: "/collections/herramientas-y-maquinaria" },
  { label: "Sanitaria", href: "/collections/sanitaria-y-griferia" },
  { label: "Electricidad", href: "/collections/electricidad-e-iluminacion" },
  { label: "Pinturas", href: "/collections/pinturas-y-acabados" },
  { label: "Obra gruesa", href: "/collections/obra-gruesa" },
];

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchTerm = typeof q === "string" ? q.trim() : "";

  let products: unknown[] = [];

  if (searchTerm) {
    try {
      const { body } = await shopifyFetch({
        query: SEARCH_PRODUCTS_QUERY,
        variables: { q: searchTerm },
        tags: ["products"],
      });
      products = body?.data?.products?.edges || [];
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  const count = products.length;
  const hasResults = count > 0;

  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs
            items={[
              { label: "Buscar", href: "/search" },
              { label: searchTerm ? `"${searchTerm}"` : "Resultados", isLast: true },
            ]}
          />
        </div>

        {/* Header */}
        <div className="pt-4 md:pt-6 pb-6 md:pb-8">
          {searchTerm ? (
            <>
              <p className="text-sm text-slate-500 mb-1">Resultados para</p>
              <h1 className="text-2xl md:text-[32px] font-bold tracking-tight text-slate-900 leading-tight">
                &ldquo;{searchTerm}&rdquo;
              </h1>
              {hasResults && (
                <p className="text-sm text-slate-500 mt-2">
                  <span className="font-semibold text-slate-900">{count}</span>{" "}
                  {count === 1 ? "producto encontrado" : "productos encontrados"}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-2xl md:text-[32px] font-bold tracking-tight text-slate-900">
              Buscar productos
            </h1>
          )}
        </div>

        {/* Results */}
        {hasResults ? (
          // ProductGrid expects a specific shape; we have edges so pass through.
          // Type is unknown[] because Shopify types are complex — ProductGrid accepts any edges.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <ProductGrid products={products as any} />
        ) : searchTerm ? (
          // Empty state with suggestions
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                <PackageSearch className="w-8 h-8 text-primary/70" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                No encontramos resultados
              </h2>
              <p className="text-slate-500 max-w-md leading-relaxed mb-8">
                Probá con términos más generales o revisá la ortografía. También podés explorar las
                categorías más buscadas.
              </p>

              {/* Popular categories */}
              <div className="w-full mb-8">
                <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">
                  Categorías populares
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Ver todo el catálogo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          // No search term at all — prompt the user to search
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                <PackageSearch className="w-8 h-8 text-primary/70" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                ¿Qué estás buscando?
              </h2>
              <p className="text-slate-500 max-w-md leading-relaxed mb-8">
                Usá el buscador del encabezado para encontrar productos específicos, o explorá las
                categorías más buscadas.
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {POPULAR_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

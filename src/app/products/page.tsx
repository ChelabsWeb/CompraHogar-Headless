import { shopifyFetch } from "@/lib/shopify";
import { ProductGrid } from "@/components/shop/ProductGrid";

// Tipos principales para la respuesta de Shopify
interface ShopifyImage {
  url: string;
  altText: string;
}

interface Price {
  amount: string;
  currencyCode: string;
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: Price;
  };
  featuredImage: ShopifyImage | null;
}

interface ProductsResponse {
  data: {
    products: {
      edges: {
        node: ProductNode;
      }[];
    };
  };
}

// Query GraphQL para obtener los últimos ingresos
const getLatestProductsQuery = `
  query getLatestProducts {
    products(first: 24, sortKey: CREATED_AT, reverse: true) {
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

// Server Component
export default async function ProductsPage() {
  // Fetch asíncrono utilizando la utilidad existente en el proyecto
  const { body } = await shopifyFetch<ProductsResponse>({
    query: getLatestProductsQuery,
  });

  const products = body?.data?.products?.edges || [];

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 font-poppins">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Últimos ingresos
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Explora las novedades y todo nuestro catálogo disponible.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hay productos disponibles por el momento.
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}

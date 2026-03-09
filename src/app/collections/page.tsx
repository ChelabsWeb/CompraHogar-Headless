import Link from "next/link";
import Image from "next/image";

// 1. Interfaces para el tipado de la respuesta de Shopify
interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface CollectionNode {
  id: string;
  title: string;
  handle: string;
  image: ShopifyImage | null;
}

interface CollectionsData {
  collections: {
    edges: {
      node: CollectionNode;
    }[];
  };
}

interface ShopifyResponse {
  data?: CollectionsData;
  errors?: any[];
}

// 2. Query de GraphQL para obtener las primeras 20 colecciones
const COLLECTIONS_QUERY = `
  query getCollections {
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// 3. Función de fetching asíncrona hacia la Storefront API
async function getCollections(): Promise<CollectionNode[]> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !storefrontAccessToken) {
    throw new Error("Faltan las variables de entorno de Shopify: SHOPIFY_STORE_DOMAIN o SHOPIFY_STOREFRONT_ACCESS_TOKEN.");
  }

  const endpoint = `https://${domain}/api/2024-04/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query: COLLECTIONS_QUERY }),
    // Aplicación de caché con revalidación cada 3600 segundos (1 hora)
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Error en la petición a la red de Shopify: ${response.status}`);
  }

  const json: ShopifyResponse = await response.json();

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error("Error en la respuesta de la query GraphQL de Shopify.");
  }

  // Mapeamos los bordes (edges) para retornar directamente el array de nodos
  return json.data?.collections.edges.map((edge) => edge.node) || [];
}

// 4. Server Component (RSC) para la página índice de colecciones
export default async function CollectionsIndexPage() {
  const collections = await getCollections();

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header de la página */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Todas las Categorías
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Explora nuestra selección completa de productos para crear un hogar con diseño y calidad premium.
          </p>
        </header>

        {/* Manejo del estado vacío (cero colecciones recibidas) */}
        {collections.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700">No se encontraron categorías</h2>
            <p className="mt-2 text-gray-500">Actualmente no hay colecciones disponibles para mostrar en la tienda.</p>
          </div>
        ) : (
          /* Grid CSS responsivo para las tarjetas de colección */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {collections.map((collection) => (
              <Link 
                href={`/collections/${collection.handle}`} 
                key={collection.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Contenedor de la imagen con aspect ratio fijo */}
                <div className="relative aspect-[4/5] w-full bg-gray-100 overflow-hidden">
                  {collection.image?.url ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || `Imagen representativa de la categoría ${collection.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Sin Imagen</span>
                    </div>
                  )}
                </div>
                
                {/* Contenedor del título de la colección */}
                <div className="p-5 flex-grow flex items-center justify-between bg-white z-10 relative">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                    {collection.title}
                  </h3>
                  {/* Indicador de acción (flecha) */}
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

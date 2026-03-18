import type { MetadataRoute } from "next";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery, getProductsQuery } from "@/lib/queries";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticPages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/collections", priority: 0.9, changeFrequency: "daily" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/search", priority: 0.7, changeFrequency: "weekly" },
  { path: "/sobre-nosotros", priority: 0.6, changeFrequency: "monthly" },
  { path: "/envios-y-entregas", priority: 0.5, changeFrequency: "monthly" },
  { path: "/devoluciones-y-garantias", priority: 0.5, changeFrequency: "monthly" },
  { path: "/politica-privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terminos-y-condiciones", priority: 0.3, changeFrequency: "yearly" },
  { path: "/login", priority: 0.4, changeFrequency: "yearly" },
  { path: "/registro", priority: 0.4, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  let collectionEntries: MetadataRoute.Sitemap = [];
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const [collectionsResponse, productsResponse] = await Promise.all([
      shopifyFetch<{
        data: {
          collections: {
            edges: { node: { handle: string } }[];
          };
        };
      }>({
        query: getCollectionsQuery,
        variables: { first: 250 },
        cache: "no-store",
      }),
      shopifyFetch<{
        data: {
          products: {
            edges: { node: { handle: string } }[];
          };
        };
      }>({
        query: getProductsQuery,
        variables: { first: 250 },
        cache: "no-store",
      }),
    ]);

    if (collectionsResponse?.body?.data?.collections?.edges) {
      collectionEntries = collectionsResponse.body.data.collections.edges.map(
        ({ node }: { node: { handle: string } }) => ({
          url: `${BASE_URL}/collections/${node.handle}`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.8,
        })
      );
    }

    if (productsResponse?.body?.data?.products?.edges) {
      productEntries = productsResponse.body.data.products.edges.map(
        ({ node }: { node: { handle: string } }) => ({
          url: `${BASE_URL}/products/${node.handle}`,
          lastModified: now,
          changeFrequency: "daily" as const,
          priority: 0.7,
        })
      );
    }
  } catch (error) {
    console.error("[sitemap] Failed to fetch Shopify data:", error);
    // Gracefully degrade — static pages will still be returned
  }

  return [...staticEntries, ...collectionEntries, ...productEntries];
}

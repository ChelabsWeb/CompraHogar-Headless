import type { MetadataRoute } from "next";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery, getProductsQuery } from "@/lib/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticPages: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
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

/** Fetch all handles from a paginated Shopify connection (products or collections). */
async function fetchAllHandles(
  query: string,
  rootKey: "products" | "collections"
): Promise<string[]> {
  const handles: string[] = [];
  let cursor: string | undefined;
  const MAX_PAGES = 10; // safety cap: 250 × 10 = 2500 items max

  for (let page = 0; page < MAX_PAGES; page++) {
    const { body } = await shopifyFetch({
      query,
      variables: { first: 250, ...(cursor ? { after: cursor } : {}) },
      cache: "no-store",
    });

    const edges = body?.data?.[rootKey]?.edges;
    if (!edges || edges.length === 0) break;

    for (const { node } of edges) {
      if (node.handle) handles.push(node.handle);
    }

    const pageInfo = body?.data?.[rootKey]?.pageInfo;
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) break;
    cursor = pageInfo.endCursor;
  }

  return handles;
}

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
    const [collectionHandles, productHandles] = await Promise.all([
      fetchAllHandles(getCollectionsQuery, "collections"),
      fetchAllHandles(getProductsQuery, "products"),
    ]);

    collectionEntries = collectionHandles.map((handle) => ({
      url: `${BASE_URL}/collections/${handle}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    productEntries = productHandles.map((handle) => ({
      url: `${BASE_URL}/products/${handle}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // Gracefully degrade — static pages will still be returned
  }

  return [...staticEntries, ...collectionEntries, ...productEntries];
}

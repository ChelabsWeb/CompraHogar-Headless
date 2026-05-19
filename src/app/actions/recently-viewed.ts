"use server";

import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";
import type { ShopifyProduct } from "@/lib/types";

export async function getRecentlyViewedProducts(
  ids: string[]
): Promise<ShopifyProduct[]> {
  if (!ids || ids.length === 0) return [];

  try {
    const { body } = await shopifyFetch({
      query: getProductsByIdsQuery,
      tags: ["products"],
      variables: { ids },
    });
    const products = (body?.data?.nodes ?? []).filter(
      (n: unknown): n is ShopifyProduct => n !== null && typeof n === "object"
    );
    // Preservar el orden recibido (más recientes primero)
    const indexMap = new Map(ids.map((id, i) => [id, i]));
    return products.sort(
      (a: ShopifyProduct, b: ShopifyProduct) =>
        (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0)
    );
  } catch (error) {
    console.error("Error fetching recently viewed products:", error);
    return [];
  }
}

"use server"

import { shopifyFetch } from "@/lib/shopify";
import { getCollectionWithProductsQuery, getProductsQuery } from "@/lib/queries";

export async function getPopularProducts(first: number = 8) {
  try {
    const { body } = await shopifyFetch({
      query: getProductsQuery,
      tags: ['products', 'popular'],
      variables: { first },
    });
    return body?.data?.products?.edges ?? [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
}

export async function loadMoreCollectionProducts(
  handle: string,
  cursor: string,
  first: number = 24,
  filters?: any[],
  sortKey: string = "RELEVANCE",
  reverse: boolean = false
) {
  try {
     const { body } = await shopifyFetch({
        query: getCollectionWithProductsQuery,
        tags: ['collections', 'products', `collection:${handle}`],
        variables: {
            handle,
            first,
            filters: filters && filters.length > 0 ? filters : undefined,
            sortKey,
            reverse,
            cursor
        },
    });

    return body?.data?.collection?.products || { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
  } catch (error) {
    console.error("Error fetching more products:", error);
    return { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } };
  }
}

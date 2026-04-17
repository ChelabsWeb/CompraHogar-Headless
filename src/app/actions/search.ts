"use server";

import { shopifyFetch } from "@/lib/shopify";
import { predictiveSearchQuery } from "@/lib/queries";

export interface PredictiveSearchResult {
  id: string;
  title: string;
  handle: string;
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export async function predictiveSearchAction(query: string, limit: number = 5): Promise<PredictiveSearchResult[]> {
  if (!query || typeof query !== "string") return [];

  const sanitized = query.trim().slice(0, 200);
  if (sanitized.length === 0) return [];

  const clampedLimit = Math.min(Math.max(1, limit), 10);

  try {
    const response = await shopifyFetch({
      query: predictiveSearchQuery,
      tags: ['products'],
      variables: {
        query: sanitized,
        limit: clampedLimit,
      },
    });

    const products = response.body?.data?.predictiveSearch?.products;

    if (!products) {
      return [];
    }

    return products;
  } catch (error) {
    console.error("Error in predictiveSearchAction:", error);
    return [];
  }
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface ProductReviewsData {
  ratingCount: number;
  averageRating: number;
  reviews: Review[];
}

/**
 * Fetch product reviews bypassing third-party client-side scripts.
 * Prioritizes SSR/RSC for SEO and preventing Cumulative Layout Shift (CLS).
 *
 * TODO: Connect to a real reviews provider. Options:
 *   - Judge.me API: fetch from https://judge.me/api/v1/reviews?shop_domain=...&api_token=...
 *   - Shopify metafields: query `reviews.rating_count` and `reviews.rating` via Storefront API
 *   - Stamped.io, Yotpo, or any other reviews service with a server-side API
 *
 * @param productHandle - The Shopify product handle to look up.
 * @returns Promise<ProductReviewsData | null> — null when no reviews provider is configured.
 */
export async function getProductReviews(productHandle: string): Promise<ProductReviewsData | null> {
  // No reviews provider configured yet — return null so the UI gracefully hides the section.
  return null;
}

import { shopifyFetch } from "./shopify"; // optional integration later

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
 * @param productHandle - The Shopify product handle to look up.
 * @returns Promise<ProductReviewsData | null>
 */
export async function getProductReviews(productHandle: string): Promise<ProductReviewsData | null> {
  try {
    // 1. In a production scenario with Shopify, you would likely fetch the 
    // `reviews.rating_count` and `reviews.rating` metafields via the Storefront API
    // for aggregate data, and then fetch a JSON endpoint (ex: Judge.me API) for the review texts.
    
    // 2. Here we fetch a mock/generic endpoint prioritizing SSR using Next.js `fetch`
    // with ISR (Incremental Static Regeneration) via `next: { revalidate: 3600 }`.
    const res = await fetch(`https://api.judgeme.example.com/api/v1/reviews?handle=${productHandle}`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
        // 'Authorization': `Bearer ${process.env.JUDGEME_API_TOKEN}` // if required
      }
    });

    if (!res.ok) {
      // Simulate fallback for the exercise: No reviews found or API offline
      return { ratingCount: 0, averageRating: 0, reviews: [] };
    }

    const data = await res.json();
    return data as ProductReviewsData;

  } catch (error) {
    console.error(`Error fetching reviews for ${productHandle}:`, error);
    // Silent fail gracefully in UI
    return { ratingCount: 0, averageRating: 0, reviews: [] };
  }
}

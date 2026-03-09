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
    
    // Simulate network delay for realistic SSR rendering behavior
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return mock data for demonstration
    return {
      ratingCount: 3,
      averageRating: 4.7,
      reviews: [
        {
          id: "1",
          author: "Sofía M.",
          rating: 5,
          title: "¡Me encantó!",
          body: "La calidad superó mis expectativas. Queda perfecto y tiene terminaciones premium. El envío llegó en el tiempo estimado.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        },
        {
          id: "2",
          author: "Esteban",
          rating: 4,
          title: "Muy buen producto",
          body: "Me gusta mucho el diseño. Por el precio está muy bien, aunque me gustaría que tuvieran más opciones de colores.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
        },
        {
          id: "3",
          author: "Laura G.",
          rating: 5,
          title: "Excelente atención al cliente",
          body: "Tuve una duda antes de comprar y me respondieron enseguida. El producto llegó impecable. ¡Recomendado 100%!",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month ago
        }
      ]
    };
  } catch (error) {
    // Silent fail gracefully in UI
    return { ratingCount: 0, averageRating: 0, reviews: [] };
  }
}

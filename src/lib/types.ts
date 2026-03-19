// Shared Shopify types — derived from actual Storefront API usage across the codebase.

/** Shopify money amount (e.g. price fields). */
export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

/** Price range returned on a product node. */
export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoneyV2;
  maxVariantPrice?: ShopifyMoneyV2;
}

/** Image node used by products and media. */
export interface ShopifyImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

/** A single selected option on a variant (e.g. { name: "Color", value: "Rojo" }). */
export interface ShopifySelectedOption {
  name: string;
  value: string;
}

/** Product option (e.g. Color with values ["Rojo", "Azul"]). */
export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

/** Variant node inside product.variants.edges[].node */
export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoneyV2;
  selectedOptions: ShopifySelectedOption[];
}

/** Media source (video or 3D model). */
export interface ShopifyMediaSource {
  url: string;
  format: string;
  mimeType?: string;
}

/** Media node inside product.media.edges[].node */
export interface ShopifyMediaNode {
  mediaContentType: 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'EXTERNAL_VIDEO';
  alt?: string | null;
  image?: ShopifyImage;
  previewImage?: ShopifyImage;
  sources?: ShopifyMediaSource[];
}

/** Shopify metafield value (used for material, instruccionesLavado, rendimiento, etc.) */
export interface ShopifyMetafieldValue {
  value: string;
}

/** Product node — the shape returned by Storefront API product queries. */
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  tags?: string[];
  featuredImage?: ShopifyImage | null;
  images?: {
    edges: Array<{ node: ShopifyImage }>;
  };
  priceRange?: ShopifyPriceRange;
  options?: ShopifyProductOption[];
  variants?: {
    edges: Array<{ node: ShopifyVariant }>;
  };
  media?: {
    edges: Array<{ node: ShopifyMediaNode }>;
  };
  // Metafields (custom fields from Shopify)
  material?: ShopifyMetafieldValue;
  instruccionesLavado?: ShopifyMetafieldValue;
  rendimiento?: ShopifyMetafieldValue;
}

/** Edge wrapper for product lists (used in collection queries). */
export interface ShopifyProductEdge {
  node: ShopifyProduct;
}

/** Pagination info from Shopify connections. */
export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  endCursor: string | null;
  startCursor?: string | null;
}

/** Collection node — minimal shape used in navigation. */
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

/** Edge wrapper for collection lists. */
export interface ShopifyCollectionEdge {
  node: ShopifyCollection;
}

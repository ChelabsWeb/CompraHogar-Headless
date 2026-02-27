export interface ShopifyFetchParams<V = Record<string, unknown>> {
  query: string;
  variables?: V;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number;
}

export interface ShopifyFetchResult<T> {
  status: number;
  body: T | null;
  error?: string;
}

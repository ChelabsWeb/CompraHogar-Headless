import 'server-only';
import { cache } from 'react';
import type { ShopifyFetchParams, ShopifyFetchResult } from '@/types/shopify';

const SHOPIFY_GRAPHQL_API_VERSION = '2024-01';

function validateEnvironment() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error('Missing Shopify environment variables: SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  }
  return { domain, token };
}

const fetchShopifyAPI = cache(async <T>(params: ShopifyFetchParams): Promise<ShopifyFetchResult<T>> => {
  const { query, variables, cache: cacheOption = 'force-cache', tags, revalidate } = params;
  
  try {
    const { domain, token } = validateEnvironment();
    // Using the current API version for Shopify Storefront API
    const endpoint = `https://${domain}/api/${SHOPIFY_GRAPHQL_API_VERSION}/graphql.json`;

    const nextOptions = {
      ...(tags && { tags }),
      ...(revalidate !== undefined && { revalidate })
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache: cacheOption,
      ...(Object.keys(nextOptions).length > 0 && { next: nextOptions }),
    });

    const body = await response.json();

    if (body.errors) {
      return {
        status: response.status,
        body: null,
        error: body.errors[0]?.message || 'GraphQL Error',
      };
    }

    return {
      status: response.status,
      body: body as T,
    };
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    return {
      status: 500,
      body: null,
      error: error instanceof Error ? error.message : 'Unknown error during Shopify fetch',
    };
  }
});

export const shopifyFetch = fetchShopifyAPI;

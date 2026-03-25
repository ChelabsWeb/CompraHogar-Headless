const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T = any>({
    cache = "force-cache",
    headers,
    query,
    tags,
    variables,
}: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: object;
}) {
    const endpoint = `https://${domain}/api/2024-04/graphql.json`;

    try {
        const isClient = typeof window !== "undefined";
        
        const fetchOptions: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
                ...headers,
            },
            body: JSON.stringify({
                ...(query && { query }),
                ...(variables && { variables }),
            }),
        };

        if (!isClient) {
            fetchOptions.cache = cache;
            if (tags) {
                (fetchOptions as any).next = { tags };
            }
        }

        const result = await fetch(endpoint, fetchOptions);

        const body = await result.json();

        if (body.errors) {
            console.error("GraphQL Errors:", JSON.stringify(body.errors, null, 2));
            throw new Error(body.errors[0]?.message || "Error in Shopify GraphQL query");
        }

        return {
            status: result.status,
            body,
        };
    } catch (error) {
        console.error("Error connecting to Shopify:", error);
        throw error;
    }
}

export async function getDealOfTheDay() {
  const query = `
    query getDealOfTheDay {
      collectionByHandle(handle: "oferta-del-dia") {
        products(first: 1) {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
                altText
              }
              compareAtPriceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({ query, tags: ['products'] });
    const product = response.body?.data?.collectionByHandle?.products?.edges?.[0]?.node;
    return product || null;
  } catch {
    return null;
  }
}

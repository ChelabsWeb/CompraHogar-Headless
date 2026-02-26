const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({
  query,
  variables,
}: {
  query: string;
  variables?: object;
}) {
  const endpoint = `https://${domain}/api/2024-04/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      // Next.js caching strategy. Adjust based on needs.
      next: { revalidate: 60 },
    });

    const body = await result.json();

    if (body.errors) {
      const errorMsg = body.errors[0]?.message || JSON.stringify(body.errors);
      console.error("Shopify GraphQL Error:", errorMsg);
      throw new Error(errorMsg);
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

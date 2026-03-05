const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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
            next: { revalidate: 60 }
        });

        const body = await result.json();

        if (body.errors) {
            console.error(body.errors[0] || body.errors);
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

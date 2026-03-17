const STORE_DOMAIN = "comprahogar.com.uy";
const ACCESS_TOKEN = "ac96d0914980a4419c72aa3621ac40c9";

async function    getShopifyCollections() {
  const query = `
    query {
      collections(first: 250) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  `;

  const url = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  return json.data.collections.edges.map(edge => edge.node);
}

async function listAll() {
  const collections = await getShopifyCollections();
  console.log("=== ALL COLLECTIONS IN SHOPIFY ===");
  collections.forEach(c => {
    console.log(`- ${c.title} (handle: ${c.handle})`);
  });
}

listAll();

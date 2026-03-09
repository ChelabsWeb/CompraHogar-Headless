async function getCollections() {
  const domain = 'comprahogar.com.uy';
  const token = 'ac96d0914980a4419c72aa3621ac40c9'; // Storefront token

  const query = `
    {
      collections(first: 100) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    const collections = data.data.collections.edges.map(e => e.node);
    console.log(JSON.stringify(collections, null, 2));
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
}

getCollections();

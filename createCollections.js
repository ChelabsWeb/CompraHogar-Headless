const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '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';
const DOMAIN = process.env.SHOPIFY_MYSHOP_DOMAIN || 'comprahogaruy.myshopify.com';

const categories = [
  { main: "Construcción y Materiales", subs: ["Obra Gruesa", "Hierros y Aceros", "Maderas y Placas", "Aislantes y Membranas", "Construcción en Seco (Drywall)"] },
  { main: "Herramientas y Maquinaria", subs: ["Herramientas Eléctricas", "Herramientas Inalámbricas (Batería)", "Herramientas Manuales", "Maquinaria Pesada/Construcción", "Accesorios"] },
  { main: "Electricidad e Iluminación", subs: ["Cables y Conductores", "Tubos y Caños Eléctricos", "Módulos y Llaves", "Tableros y Protecciones", "Iluminación"] },
  { main: "Sanitaria y Grifería", subs: ["Caños y Conexiones", "Grifería", "Loza Sanitaria", "Bombas y Tanques"] },
  { main: "Pinturas y Acabados", subs: ["Pinturas de Interior/Exterior", "Impermeabilizantes", "Preparación de Superficies", "Accesorios para Pintar"] },
  { main: "Hogar y Decoración", subs: ["Revestimientos", "Baño y Cocina (Mobiliario)"] },
  { main: "Jardín y Exteriores", subs: ["Herramientas de Jardín", "Mobiliario de Exterior", "Riego"] }
];

async function createCollection(title) {
  const query = `
    mutation collectionCreate($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id title handle }
        userErrors { field message }
      }
    }
  `;

  const input = { title };
  
  const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    },
    body: JSON.stringify({ query, variables: { input } })
  });

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  if (json.data.collectionCreate.userErrors.length > 0) {
    throw new Error(JSON.stringify(json.data.collectionCreate.userErrors));
  }
  return json.data.collectionCreate.collection;
}

async function run() {
  if (DOMAIN === 'example.myshopify.com') {
    console.error("Please set SHOPIFY_MYSHOP_DOMAIN environment variable to your *.myshopify.com domain.");
    process.exit(1);
  }

  for (const cat of categories) {
    console.log(`Creating parent collection: ${cat.main}`);
    try {
      await createCollection(cat.main);
    } catch (e) {
      console.error(`Error creating ${cat.main}: ${e.message}`);
    }

    for (const sub of cat.subs) {
      console.log(`  Creating sub-collection: ${sub}`);
      const title = `${cat.main} - ${sub}`; // or just use sub
      try {
        await createCollection(sub);
      } catch (e) {
        console.error(`  Error creating ${sub}: ${e.message}`);
      }
    }
  }
}

run();

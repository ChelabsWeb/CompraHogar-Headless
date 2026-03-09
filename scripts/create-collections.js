import { readFileSync } from 'fs';
import { resolve } from 'path';

// Parse .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const DOMAIN = 'comprahogaruy.myshopify.com';

const STOREFRONT_TOKEN = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const ADMIN_TOKEN = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!ADMIN_TOKEN) {
  console.error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const API_VERSION = '2024-04'; // Matching storefront
const ENDPOINT = "https://" + DOMAIN + "/admin/api/" + API_VERSION + "/graphql.json";

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    console.error("HTTP Error:", response.status);
    const text = await response.text();
    console.error(text);
    return null;
  }

  const json = await response.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
  }
  return json.data;
}

const COLLECTION_CREATE_MUTATION = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        handle
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const categoriesToCreate = [
  // De page.tsx principales:
  { title: "Obra Gruesa", handle: "obra-gruesa" },
  { title: "Herramientas", handle: "herramientas" },
  { title: "Electricidad", handle: "electricidad-e-iluminacion" },
  { title: "Sanitaria", handle: "sanitaria" },
  { title: "Pinturas", handle: "pinturas-y-acabados" },
  { title: "Decoración", handle: "hogar-y-decoracion" },
  { title: "Servicios", handle: "servicios-y-alquileres" },

  // Subcategorias (del MegaMenu):
  { title: "Cementos y Cal", handle: "cementos" },
  { title: "Ladrillos y Bloques", handle: "ladrillos" },
  { title: "Hierros y Mallas", handle: "hierros" },
  { title: "Áridos", handle: "aridos" },
  { title: "Impermeabilizantes", handle: "impermeabilizantes" },
  { title: "Aditivos", handle: "aditivos" },
  
  { title: "Herramientas Eléctricas", handle: "herramientas-electricas" },
  { title: "Herramientas Manuales", handle: "herramientas-manuales" },
  { title: "Medición y Trazado", handle: "medicion" },
  { title: "Accesorios", handle: "accesorios" },
  { title: "Seguridad Industrial", handle: "seguridad" },
  
  { title: "Caños y Conexiones", handle: "canos" },
  { title: "Grifería", handle: "griferia" },
  { title: "Loza Sanitaria", handle: "loza" },
  { title: "Bombas de Agua", handle: "bombas" },
  { title: "Tanques y Cisternas", handle: "tanques" }
];

async function syncCollections() {
  console.log("Sincronizando " + categoriesToCreate.length + " colecciones con la tienda " + DOMAIN + "...");
  let createdCount = 0;
  
  for (const cat of categoriesToCreate) {
    console.log("Creando: " + cat.title + " (" + cat.handle + ")...");
    const data = await fetchGraphQL(COLLECTION_CREATE_MUTATION, {
      input: {
        handle: cat.handle,
        title: cat.title
      }
    });

    if (data && data.collectionCreate && data.collectionCreate.userErrors && data.collectionCreate.userErrors.length > 0) {
      const errors = data.collectionCreate.userErrors.map(e => e.message).join(', ');
      console.warn("⚠️ Error en " + cat.title + ": " + errors);
    } else if (data && data.collectionCreate && data.collectionCreate.collection) {
      console.log("✅ Creada: " + data.collectionCreate.collection.title);
      createdCount++;
    } else {
      console.error("❌ Falló la creación de " + cat.title);
    }
  }

  console.log("\\n¡Proceso finalizado! Se crearon " + createdCount + " de " + categoriesToCreate.length + " colecciones.");
}

syncCollections();

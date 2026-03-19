import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ENTRIES = 500;

const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

async function shopifyAdmin(query: string, variables?: object) {
  const res = await fetch(`https://${domain}/admin/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken!,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Admin API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Shopify Admin API error");
  }

  return json;
}

const getProductIdFromVariantQuery = `
  query getProductFromVariant($variantId: ID!) {
    productVariant(id: $variantId) {
      id
      product { id }
    }
  }
`;

const getExistingMetafieldQuery = `
  query getBackInStockMetafield($productId: ID!) {
    product(id: $productId) {
      metafield(namespace: "custom", key: "back_in_stock_emails") {
        id
        value
      }
    }
  }
`;

const setMetafieldMutation = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id key value }
      userErrors { field message }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    if (!adminToken) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const body = await request.json();
    const { email, variantId } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!variantId || typeof variantId !== "string") {
      return NextResponse.json({ error: "Variant ID is required." }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // 1. Get the product ID from the variant
    const variantResult = await shopifyAdmin(getProductIdFromVariantQuery, { variantId });
    const productId = variantResult?.data?.productVariant?.product?.id;
    if (!productId) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // 2. Read existing metafield
    const metafieldResult = await shopifyAdmin(getExistingMetafieldQuery, { productId });
    const existing = metafieldResult?.data?.product?.metafield;
    let entries: Array<{ email: string; variantId: string; createdAt: string }> = [];

    if (existing?.value) {
      try { entries = JSON.parse(existing.value); } catch { entries = []; }
    }

    // 3. Deduplicate
    if (entries.some((e) => e.email === trimmedEmail && e.variantId === variantId)) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 4. Cap entries to prevent unbounded metafield growth
    if (entries.length >= MAX_ENTRIES) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 5. Append and save
    entries.push({ email: trimmedEmail, variantId, createdAt: new Date().toISOString() });

    const writeResult = await shopifyAdmin(setMetafieldMutation, {
      metafields: [{
        ownerId: productId,
        namespace: "custom",
        key: "back_in_stock_emails",
        type: "json",
        value: JSON.stringify(entries),
      }],
    });

    const userErrors = writeResult?.data?.metafieldsSet?.userErrors;
    if (userErrors?.length > 0) {
      return NextResponse.json({ error: "Failed to save notification." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error processing request." }, { status: 500 });
  }
}

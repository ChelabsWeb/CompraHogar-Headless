import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

/**
 * Shopify Admin API helper (server-only, never exposed to client)
 */
async function shopifyAdmin(query: string, variables?: object) {
  const res = await fetch(`https://${domain}/admin/api/2024-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken!,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

/**
 * Extracts the numeric product ID from a Shopify variant GID.
 * Variant GID format: "gid://shopify/ProductVariant/12345"
 * We need the product ID, so we first look up the variant.
 */
const getProductIdFromVariantQuery = `
  query getProductFromVariant($variantId: ID!) {
    productVariant(id: $variantId) {
      id
      product {
        id
      }
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
      metafields {
        id
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * POST /api/back-in-stock
 *
 * Saves the email + variantId to a JSON metafield on the product via
 * Shopify Admin API. Shopify Flow can then watch for inventory changes
 * and email these leads automatically.
 *
 * Metafield: namespace "custom", key "back_in_stock_emails"
 * Value: JSON array of { email, variantId, createdAt }
 */
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
    const variantResult = await shopifyAdmin(getProductIdFromVariantQuery, {
      variantId,
    });

    const productId = variantResult?.data?.productVariant?.product?.id;
    if (!productId) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // 2. Read existing metafield (if any)
    const metafieldResult = await shopifyAdmin(getExistingMetafieldQuery, {
      productId,
    });

    const existing = metafieldResult?.data?.product?.metafield;
    let entries: Array<{ email: string; variantId: string; createdAt: string }> = [];

    if (existing?.value) {
      try {
        entries = JSON.parse(existing.value);
      } catch {
        entries = [];
      }
    }

    // 3. Check for duplicate (same email + same variant)
    const alreadyRegistered = entries.some(
      (e) => e.email === trimmedEmail && e.variantId === variantId
    );

    if (alreadyRegistered) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 4. Append and save
    entries.push({
      email: trimmedEmail,
      variantId,
      createdAt: new Date().toISOString(),
    });

    await shopifyAdmin(setMetafieldMutation, {
      metafields: [
        {
          ownerId: productId,
          namespace: "custom",
          key: "back_in_stock_emails",
          type: "json",
          value: JSON.stringify(entries),
        },
      ],
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error processing request." }, { status: 500 });
  }
}

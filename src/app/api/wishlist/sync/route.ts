import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";

// ---------------------------------------------------------------------------
// Admin API configuration
// ---------------------------------------------------------------------------
const ADMIN_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

function adminEndpoint() {
  return `https://${ADMIN_DOMAIN}/admin/api/2024-04/graphql.json`;
}

const metafieldsSetMutation = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id }
      userErrors { field message }
    }
  }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getCustomerFromToken(token: string) {
  const { body } = await shopifyFetch({
    query: getCustomerQuery,
    variables: { customerAccessToken: token },
    cache: "no-store",
  });
  return body?.data?.customer ?? null;
}

async function adminFetch(query: string, variables: object) {
  const res = await fetch(adminEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// ---------------------------------------------------------------------------
// GET  /api/wishlist/sync — read wishlist from customer metafield
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customerAccessToken")?.value;

    if (!token) {
      return NextResponse.json({ items: [] });
    }

    const customer = await getCustomerFromToken(token);
    if (!customer) {
      return NextResponse.json({ items: [] });
    }

    const raw = customer.metafield?.value;
    if (!raw) {
      return NextResponse.json({ items: [] });
    }

    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : [];

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

// ---------------------------------------------------------------------------
// POST /api/wishlist/sync — write wishlist to customer metafield (Admin API)
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("customerAccessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await getCustomerFromToken(token);
    if (!customer?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "productIds must be an array" },
        { status: 400 }
      );
    }

    const result = await adminFetch(metafieldsSetMutation, {
      metafields: [
        {
          ownerId: customer.id,
          namespace: "custom",
          key: "wishlist",
          type: "json",
          value: JSON.stringify(productIds),
        },
      ],
    });

    const userErrors = result?.data?.metafieldsSet?.userErrors;
    if (userErrors && userErrors.length > 0) {
      return NextResponse.json(
        { error: userErrors[0].message },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to sync wishlist" },
      { status: 500 }
    );
  }
}

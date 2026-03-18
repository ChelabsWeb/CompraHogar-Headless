import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/back-in-stock
 * Registers an email to be notified when a variant is back in stock.
 *
 * TODO: Connect to a real back-in-stock notification provider:
 *   - Klaviyo: POST https://a.klaviyo.com/api/v2/list/{BACK_IN_STOCK_LIST}/subscribe
 *     with custom properties for the variant ID.
 *   - Shopify Flow: trigger a custom event via the Admin API.
 *   Replace the placeholder logic below with the actual API call.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, variantId } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    if (!variantId || typeof variantId !== "string") {
      return NextResponse.json(
        { error: "Variant ID is required." },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 },
      );
    }

    const trimmedVariantId = variantId.trim();

    if (trimmedVariantId.length === 0) {
      return NextResponse.json(
        { error: "Variant ID cannot be empty." },
        { status: 400 },
      );
    }

    // TODO: Replace with real provider API call (Klaviyo, Shopify Flow, etc.)
    console.log(
      `[back-in-stock] Notification request: ${trimmedEmail} for variant ${trimmedVariantId}`,
    );

    return NextResponse.json(
      { success: true, message: "You will be notified when this item is back in stock." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter
 * Subscribes an email address to the newsletter.
 *
 * TODO: Connect to a real email marketing provider:
 *   - Klaviyo: POST https://a.klaviyo.com/api/v2/list/{LIST_ID}/subscribe
 *   - Mailchimp: POST https://usX.api.mailchimp.com/3.0/lists/{LIST_ID}/members
 *   Replace the placeholder logic below with the actual API call.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 },
      );
    }

    // TODO: Replace with real provider API call (Klaviyo, Mailchimp, etc.)
    console.log(`[newsletter] New subscription request: ${trimmed}`);

    return NextResponse.json(
      { success: true, message: "Subscribed successfully." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

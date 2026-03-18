import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Create a Shopify customer with marketing consent enabled.
    // If the customer already exists, Shopify returns an error — we treat that as success
    // since the email is already in the system.
    const { body: result } = await shopifyFetch({
      query: customerCreateMutation,
      cache: "no-store",
      variables: {
        input: {
          email: trimmed,
          acceptsMarketing: true,
        },
      },
    });

    const errors = result?.data?.customerCreate?.customerUserErrors;
    const alreadyExists = errors?.some(
      (e: { code: string }) => e.code === "TAKEN" || e.code === "CUSTOMER_DISABLED"
    );

    if (errors?.length > 0 && !alreadyExists) {
      return NextResponse.json(
        { error: errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error processing request." }, { status: 500 });
  }
}

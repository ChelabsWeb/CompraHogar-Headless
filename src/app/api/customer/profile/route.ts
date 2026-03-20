import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  try {
    const { body } = await shopifyFetch({
      query: getCustomerQuery,
      variables: { customerAccessToken: token },
      cache: "no-store",
    });

    return NextResponse.json({ customer: body.data?.customer || null });
  } catch {
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";
import { AccountSidebar } from "./account-sidebar";

export const metadata = {
  title: "Mi cuenta | CompraHogar",
};

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  type CustomerLayoutData = {
    firstName: string;
    lastName: string;
    email: string;
    orders?: { edges: unknown[] };
    addresses?: { edges: unknown[] };
  };

  let customer: CustomerLayoutData | null = null;

  try {
    const { body } = await shopifyFetch({
      query: getCustomerQuery,
      variables: { customerAccessToken: token },
      cache: "no-store",
    });
    customer = body.data?.customer ?? null;
  } catch {
    // Shopify unreachable — render with fallback data
    customer = { firstName: "Mi", lastName: "Cuenta", email: "" };
  }

  if (!customer) {
    // Token expired or invalid — clean up and redirect
    const cookieStore2 = await cookies();
    cookieStore2.delete("customerAccessToken");
    redirect("/login");
  }

  const ordersCount = customer.orders?.edges?.length ?? 0;
  const addressesCount = customer.addresses?.edges?.length ?? 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <AccountSidebar
        customer={{
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
        }}
        counts={{ orders: ordersCount, addresses: addressesCount }}
      />
      <div className="lg:pl-72">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";
import { AccountSidebar } from "./account-sidebar";

export const metadata = {
  title: "Mi Cuenta | CompraHogar",
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

  let customer: { firstName: string; lastName: string; email: string } | null = null;

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

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar
            customer={{
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
            }}
          />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

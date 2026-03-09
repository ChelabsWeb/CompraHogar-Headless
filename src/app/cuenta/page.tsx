import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";
import { LogOut, Package, MapPin, User as UserIcon } from "lucide-react";
import { logout } from "./actions";
import { OrderHistory } from "@/components/shop/OrderHistory";

export const metadata = {
  title: "Mi Cuenta | CompraHogar",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  // Fetch customer details
  const { body } = await shopifyFetch({
    query: getCustomerQuery,
    variables: { customerAccessToken: token },
  });

  const customer = body.data?.customer;

  if (!customer) {
    // Token might be expired or invalid
    redirect("/login");
  }

  const orders = customer.orders?.edges || [];

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
             <div className="bg-white p-6 rounded-3xl border border-slate-200">
               <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                 {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
               </div>
               <h2 className="text-lg font-bold text-slate-900">{customer.firstName} {customer.lastName}</h2>
               <p className="text-sm text-slate-500 mb-6">{customer.email}</p>
               
               <form action={logout}>
                 <button type="submit" className="flex items-center gap-2 text-sm text-destructive font-medium hover:underline w-full text-left">
                   <LogOut className="w-4 h-4" />
                   Cerrar sesión
                 </button>
               </form>
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full space-y-8">
            {/* Orders Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Mis Pedidos</h3>
              </div>
              
              <OrderHistory orders={orders} />
            </div>

            {/* Address Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-slate-900">Dirección Principal</h3>
              </div>
              
              {customer.defaultAddress ? (
                <div className="p-4 border rounded-xl bg-slate-50">
                  <p className="font-medium text-slate-900">{customer.defaultAddress.address1}</p>
                  {customer.defaultAddress.address2 && <p className="text-slate-700">{customer.defaultAddress.address2}</p>}
                  <p className="text-slate-700">{customer.defaultAddress.city}, {customer.defaultAddress.province}</p>
                  <p className="text-slate-700">{customer.defaultAddress.country} {customer.defaultAddress.zip}</p>
                </div>
              ) : (
                <p className="text-slate-500">No tienes direcciones guardadas.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

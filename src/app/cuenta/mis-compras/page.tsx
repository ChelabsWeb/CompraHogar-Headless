"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { Order } from "@/lib/customer";

type StatusConfig = {
  label: string;
  className: string;
};

function getStatusBadge(order: Order): StatusConfig {
  if (order.financialStatus === "REFUNDED") {
    return { label: "Reembolsado", className: "bg-slate-100 text-slate-600" };
  }
  if (order.financialStatus === "PAID" && order.fulfillmentStatus === "FULFILLED") {
    return { label: "Completado", className: "bg-emerald-100 text-emerald-800" };
  }
  if (order.financialStatus === "PAID" && order.fulfillmentStatus !== "FULFILLED") {
    return { label: "En proceso", className: "bg-blue-100 text-blue-800" };
  }
  if (order.financialStatus === "PENDING") {
    return { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" };
  }
  return { label: "Pendiente", className: "bg-slate-100 text-slate-600" };
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-28 bg-slate-200 rounded" />
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
          </div>
          <div className="h-4 w-40 bg-slate-100 rounded" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="w-10 h-10 rounded-full bg-slate-200" />
          </div>
          <div className="w-5 h-5 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function MisComprasPage() {
  const [orders, setOrders] = useState<{ node: Order }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/profile");
        if (!res.ok) {
          throw new Error("No se pudieron cargar los pedidos");
        }
        const data = await res.json();
        const edges = data?.customer?.orders?.edges ?? [];
        setOrders(edges);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mis Compras</h1>

      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="w-8 h-8 text-slate-400 mb-4" />
          <p className="text-slate-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Aún no tenés pedidos
          </h3>
          <p className="text-slate-500 max-w-sm mb-8">
            Cuando realices tu primera compra, aquí podrás ver el historial
            completo y el estado de cada envío.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-slate-900 text-white font-medium px-8 py-3.5 rounded-2xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20"
          >
            Explorar Productos
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(({ node: order }) => {
            const status = getStatusBadge(order);
            const formattedDate = new Date(
              order.processedAt
            ).toLocaleDateString("es-UY", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const lineItems = order.lineItems?.edges ?? [];
            const thumbnails = lineItems.slice(0, 3);

            return (
              <Link
                key={order.id}
                href={`/cuenta/mis-compras/${order.orderNumber}`}
                className="block bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Order number + status */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        #{order.orderNumber}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-sm text-slate-500">{formattedDate}</p>

                    {/* Price + item count */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-semibold text-slate-900">
                        ${order.totalPrice.amount}{" "}
                        {order.totalPrice.currencyCode}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">
                        {lineItems.length} producto(s)
                      </span>
                    </div>
                  </div>

                  {/* Thumbnails + chevron */}
                  <div className="flex items-center gap-3 shrink-0">
                    {thumbnails.length > 0 && (
                      <div className="hidden sm:flex -space-x-2">
                        {thumbnails.map(({ node: item }, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden relative"
                          >
                            {item.variant?.image?.url ? (
                              <Image
                                src={item.variant.image.url}
                                alt={
                                  item.variant.image.altText || item.title
                                }
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

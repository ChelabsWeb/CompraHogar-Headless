"use client";

import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, ChevronRight } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { useCustomer } from "@/hooks/useCustomer";
import { AccountSectionHeader } from "@/components/cuenta/AccountSectionHeader";
import { AccountCard } from "@/components/cuenta/AccountCard";
import {
  AccountSkeletonHeader,
  AccountSkeletonOrderRow,
} from "@/components/cuenta/AccountSkeleton";
import type { Order } from "@/lib/customer";

interface StatusInfo {
  label: string;
  className: string;
}

function getStatusInfo(order: Order): StatusInfo {
  if (order.financialStatus === "REFUNDED") {
    return { label: "Reembolsado", className: "bg-slate-100 text-slate-600" };
  }
  if (
    order.financialStatus === "PAID" &&
    order.fulfillmentStatus === "FULFILLED"
  ) {
    return {
      label: "Completado",
      className: "bg-emerald-100 text-emerald-800",
    };
  }
  if (
    order.financialStatus === "PAID" &&
    order.fulfillmentStatus !== "FULFILLED"
  ) {
    return { label: "En proceso", className: "bg-blue-100 text-blue-800" };
  }
  if (order.financialStatus === "PENDING") {
    return { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" };
  }
  return { label: "Pendiente", className: "bg-slate-100 text-slate-600" };
}

export default function MisComprasPage() {
  const { customer, isLoading, error } = useCustomer();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AccountSkeletonHeader />
        <div className="space-y-3">
          <AccountSkeletonOrderRow />
          <AccountSkeletonOrderRow />
          <AccountSkeletonOrderRow />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <AccountSectionHeader
          title="Mis compras"
          description="Historial completo de tus pedidos"
        />
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          No pudimos cargar tus pedidos. Recargá la página o intentá de nuevo
          en unos minutos.
        </div>
      </div>
    );
  }

  const orders = customer.orders?.edges ?? [];

  return (
    <div className="space-y-6">
      <AccountSectionHeader
        title="Mis compras"
        description={
          orders.length > 0
            ? `${orders.length} pedido${orders.length === 1 ? "" : "s"} en tu historial`
            : "Historial completo de tus pedidos"
        }
      />

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3" aria-label="Listado de pedidos">
          {orders.map(({ node: order }) => (
            <li key={order.id}>
              <OrderRow order={order} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <AccountCard
      padding="lg"
      className="flex flex-col items-center justify-center py-14 text-center"
    >
      <span
        className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5"
        aria-hidden
      >
        <ShoppingBag className="w-7 h-7" />
      </span>
      <h2 className="font-display text-[20px] sm:text-[22px] font-normal tracking-tight text-foreground leading-snug mb-2">
        Aún no tenés pedidos
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-7">
        Cuando realices tu primera compra, aquí vas a ver el historial completo
        y el estado de cada envío.
      </p>
      <GlassButton variant="light" size="md" asChild>
        <Link href="/products">Explorar productos</Link>
      </GlassButton>
    </AccountCard>
  );
}

function OrderRow({ order }: { order: Order }) {
  const status = getStatusInfo(order);
  const formattedDate = new Date(order.processedAt).toLocaleDateString(
    "es-UY",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const lineItems = order.lineItems?.edges ?? [];
  const thumbnails = lineItems.slice(0, 3);
  const totalItems = lineItems.reduce(
    (sum, { node }) => sum + (node.quantity ?? 1),
    0
  );

  return (
    <Link
      href={`/cuenta/mis-compras/${order.orderNumber}`}
      className="block bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-4 sm:p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      aria-label={`Pedido #${order.orderNumber}, ${status.label}, ${formattedDate}, $${order.totalPrice.amount}`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Thumbnails (visible también en mobile, más pequeños) */}
        {thumbnails.length > 0 && (
          <div
            className="flex -space-x-2 shrink-0"
            aria-hidden
          >
            {thumbnails.map(({ node: item }, i) => (
              <div
                key={i}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white bg-neutral-100 overflow-hidden relative shadow-sm"
              >
                {item.variant?.image?.url ? (
                  <Image
                    src={item.variant.image.url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
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

        {/* Info principal */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-[15px]">
              #{order.orderNumber}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>

        {/* Total + chevron */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm sm:text-[15px] font-semibold text-foreground leading-tight">
              ${order.totalPrice.amount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
            </p>
          </div>
          <ChevronRight
            className="w-4 h-4 text-slate-400 shrink-0"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

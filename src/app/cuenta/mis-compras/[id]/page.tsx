"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ExternalLink,
} from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountCard } from "@/components/cuenta/AccountCard";
import { useCustomer } from "@/hooks/useCustomer";
import { OrderTimeline } from "@/components/shop/OrderTimeline";
import type { Order } from "@/lib/customer";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { customer, isLoading, error } = useCustomer();

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  const orders: { node: Order }[] = customer?.orders?.edges ?? [];
  const found = orders.find(
    ({ node }) => node.orderNumber === Number(params.id)
  );

  if (error || !customer || !found) {
    return <OrderNotFound />;
  }

  const order = found.node;
  const formattedDate = new Date(order.processedAt).toLocaleDateString(
    "es-UY",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const trackingUrl =
    order.successfulFulfillments?.[0]?.trackingInfo?.[0]?.url;

  const statusBadge = (() => {
    if (order.fulfillmentStatus === "FULFILLED")
      return {
        text: "Completado",
        className: "bg-emerald-100 text-emerald-800",
      };
    if (
      order.fulfillmentStatus === "IN_PROGRESS" ||
      order.fulfillmentStatus === "PARTIALLY_FULFILLED"
    )
      return { text: "En proceso", className: "bg-blue-100 text-blue-800" };
    if (order.financialStatus === "PENDING")
      return { text: "Pendiente", className: "bg-yellow-100 text-yellow-800" };
    return { text: "Pendiente", className: "bg-slate-100 text-slate-700" };
  })();

  const subtotal = order.subtotalPrice
    ? `$${order.subtotalPrice.amount}`
    : `$${order.totalPrice.amount}`;

  const shippingAmount = order.totalShippingPrice
    ? Number(order.totalShippingPrice.amount)
    : null;

  const shippingLabel =
    shippingAmount !== null
      ? shippingAmount === 0
        ? "Gratis"
        : `$${order.totalShippingPrice!.amount}`
      : "Calculado en checkout";

  const totalItems = order.lineItems.edges.reduce(
    (sum, { node }) => sum + (node.quantity ?? 1),
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Back link */}
      <Link
        href="/cuenta/mis-compras"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis compras
      </Link>

      {/* Order header card destacado */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/8 via-white to-secondary/8 pointer-events-none"
          aria-hidden
        />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-[24px] sm:text-[28px] font-normal tracking-tight text-foreground leading-tight">
                Pedido #{order.orderNumber}
              </h1>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusBadge.className}`}
              >
                {statusBadge.text}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span>{formattedDate}</span>
              <span aria-hidden>·</span>
              <span className="font-medium text-foreground">
                ${order.totalPrice.amount}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {order.totalPrice.currencyCode}
                </span>
              </span>
              <span aria-hidden>·</span>
              <span>
                {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
              </span>
            </div>
          </div>

          {trackingUrl && (
            <GlassButton variant="light" size="md" asChild>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rastrear envío en una nueva pestaña"
              >
                <Truck className="w-4 h-4" aria-hidden />
                Rastrear envío
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            </GlassButton>
          )}
        </div>
      </section>

      {/* Timeline */}
      <AccountCard padding="lg" as="section" aria-label="Estado del pedido">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">
          Estado del pedido
        </h2>
        <OrderTimeline
          financialStatus={order.financialStatus}
          fulfillmentStatus={order.fulfillmentStatus}
          processedAt={order.processedAt}
          trackingUrl={trackingUrl}
        />
      </AccountCard>

      {/* Products */}
      <AccountCard padding="lg" as="section" aria-label="Productos del pedido">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4 flex items-center gap-2">
          <Package className="w-3.5 h-3.5" aria-hidden />
          Productos
        </h2>
        <ul className="space-y-3">
          {order.lineItems.edges.map(({ node }, index) => {
            const lineTotal = node.variant?.price
              ? (Number(node.variant.price.amount) * node.quantity).toFixed(2)
              : null;

            return (
              <li
                key={index}
                className="flex gap-3 sm:gap-4 items-center p-3 sm:p-4 rounded-xl bg-neutral-50/70 border border-neutral-100"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white overflow-hidden relative shrink-0 border border-neutral-100">
                  {node.variant?.image?.url ? (
                    <Image
                      src={node.variant.image.url}
                      alt={node.variant.image.altText || node.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm leading-snug line-clamp-2">
                    {node.title}
                  </p>
                  {node.variant?.title &&
                    node.variant.title !== "Default Title" && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {node.variant.title}
                      </p>
                    )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Cant. {node.quantity}
                    {node.variant?.price && (
                      <> · ${node.variant.price.amount} c/u</>
                    )}
                  </p>
                </div>
                {lineTotal && (
                  <p className="text-sm font-semibold text-foreground shrink-0 tabular-nums">
                    ${lineTotal}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </AccountCard>

      {/* Shipping address */}
      {order.shippingAddress && (
        <AccountCard padding="lg" as="section" aria-label="Dirección de envío">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" aria-hidden />
            Dirección de envío
          </h2>
          <address className="not-italic text-sm text-foreground space-y-1 leading-relaxed">
            <p className="font-medium">{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && (
              <p className="text-muted-foreground">
                {order.shippingAddress.address2}
              </p>
            )}
            <p className="text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.province}
              {order.shippingAddress.zip && ` — ${order.shippingAddress.zip}`}
            </p>
            <p className="text-muted-foreground">
              {order.shippingAddress.country}
            </p>
          </address>
        </AccountCard>
      )}

      {/* Payment summary */}
      <AccountCard padding="lg" as="section" aria-label="Resumen de pago">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5" aria-hidden />
          Resumen de pago
        </h2>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground tabular-nums">{subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-foreground tabular-nums">
              {shippingLabel}
            </span>
          </div>
          <div className="border-t border-neutral-100 pt-3 mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Total
            </span>
            <span className="text-[18px] font-display font-normal tracking-tight text-primary tabular-nums">
              ${order.totalPrice.amount}{" "}
              <span className="text-xs font-medium text-muted-foreground">
                {order.totalPrice.currencyCode}
              </span>
            </span>
          </div>
        </div>
      </AccountCard>

      {/* Shopify receipt link */}
      {order.statusUrl && (
        <div className="flex justify-center pt-2">
          <a
            href={order.statusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md"
          >
            Ver recibo oficial
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        </div>
      )}
    </div>
  );
}

function OrderNotFound() {
  return (
    <div className="space-y-6">
      <Link
        href="/cuenta/mis-compras"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis compras
      </Link>
      <AccountCard
        padding="lg"
        className="flex flex-col items-center justify-center py-14 text-center"
      >
        <span
          className="w-16 h-16 rounded-full bg-neutral-100 text-slate-400 flex items-center justify-center mb-5"
          aria-hidden
        >
          <Package className="w-7 h-7" />
        </span>
        <h2 className="font-display text-[20px] sm:text-[22px] font-normal tracking-tight text-foreground mb-2">
          Pedido no encontrado
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          No pudimos encontrar este pedido. Verificá el número o volvé al
          listado de compras.
        </p>
      </AccountCard>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-44 rounded-md" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-44 w-full rounded-2xl" />
    </div>
  );
}

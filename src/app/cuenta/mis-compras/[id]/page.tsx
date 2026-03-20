"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Order } from "@/lib/customer";
import { OrderTimeline } from "@/components/shop/OrderTimeline";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/profile");
      if (!res.ok) throw new Error("Error al cargar datos");
      const data = await res.json();
      const orders: { node: Order }[] = data.customer?.orders?.edges ?? [];
      const found = orders.find(
        ({ node }) => node.orderNumber === Number(params.id)
      );
      if (found) {
        setOrder(found.node);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#21645d]" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/cuenta/mis-compras"
          className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Compras
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center py-16">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Pedido no encontrado
          </h2>
          <p className="text-slate-500 text-sm">
            No pudimos encontrar el pedido que buscas. Verificá el número e
            intentá de nuevo.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.processedAt).toLocaleDateString(
    "es-UY",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const trackingUrl =
    order.successfulFulfillments?.[0]?.trackingInfo?.[0]?.url;

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
      : "Calculado";

  const statusBadge = (() => {
    if (order.fulfillmentStatus === "FULFILLED")
      return { text: "Completado", className: "bg-emerald-100 text-emerald-800" };
    if (order.fulfillmentStatus === "IN_PROGRESS" || order.fulfillmentStatus === "PARTIALLY_FULFILLED")
      return { text: "En proceso", className: "bg-amber-100 text-amber-800" };
    return {
      text: order.fulfillmentStatus || "Pendiente",
      className: "bg-slate-100 text-slate-700",
    };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back link */}
      <Link
        href="/cuenta/mis-compras"
        className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Mis Compras
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">
            Pedido #{order.orderNumber}
          </h1>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusBadge.className}`}
          >
            {statusBadge.text}
          </span>
        </div>
        <p className="text-sm text-slate-500">{formattedDate}</p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">
          Estado del pedido
        </h2>
        <OrderTimeline
          financialStatus={order.financialStatus}
          fulfillmentStatus={order.fulfillmentStatus}
          processedAt={order.processedAt}
          trackingUrl={trackingUrl}
        />
        {trackingUrl && (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-[#21645d] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#1a504a] transition-colors"
          >
            <Truck className="w-4 h-4" />
            Rastrear envío
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Productos
        </h2>
        <div className="space-y-4">
          {order.lineItems.edges.map(({ node }, index) => {
            const lineTotal = node.variant?.price
              ? (Number(node.variant.price.amount) * node.quantity).toFixed(2)
              : null;

            return (
              <div
                key={index}
                className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100"
              >
                <div className="w-16 h-16 rounded-lg bg-white overflow-hidden relative shrink-0 border border-slate-100">
                  {node.variant?.image?.url ? (
                    <Image
                      src={node.variant.image.url}
                      alt={node.variant.image.altText || node.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">
                    {node.title}
                  </p>
                  {node.variant?.title &&
                    node.variant.title !== "Default Title" && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {node.variant.title}
                      </p>
                    )}
                  <p className="text-xs text-slate-400 mt-1">
                    Cant. {node.quantity}
                    {node.variant?.price && (
                      <> &middot; ${node.variant.price.amount} c/u</>
                    )}
                  </p>
                </div>
                {lineTotal && (
                  <p className="text-sm font-bold text-slate-900 shrink-0">
                    ${lineTotal}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Dirección de envío
          </h2>
          <div className="text-sm text-slate-700 space-y-1">
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && (
              <p>{order.shippingAddress.address2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.province}
            </p>
            <p>
              {order.shippingAddress.country}{" "}
              {order.shippingAddress.zip && `— ${order.shippingAddress.zip}`}
            </p>
          </div>
        </div>
      )}

      {/* Payment summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Resumen de pago
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-900">{subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Envío</span>
            <span className="text-slate-900">{shippingLabel}</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">Total</span>
            <span className="text-lg font-bold text-[#21645d]">
              ${order.totalPrice.amount}{" "}
              <span className="text-xs font-medium text-slate-500">
                {order.totalPrice.currencyCode}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Shopify receipt link */}
      {order.statusUrl && (
        <div className="flex justify-center">
          <a
            href={order.statusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Ver recibo en Shopify
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

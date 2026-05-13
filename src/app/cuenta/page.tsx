"use client";

import Link from "next/link";
import { Package, MapPin, Heart, Mail, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { useCustomer } from "@/hooks/useCustomer";
import { useWishlist } from "@/components/shop/WishlistProvider";
import {
  DashboardSummaryCard,
  DashboardSummaryEmpty,
} from "@/components/cuenta/DashboardSummaryCard";
import {
  AccountSkeletonHeader,
  AccountSkeletonGrid,
} from "@/components/cuenta/AccountSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@/lib/customer";

interface OrderStatusInfo {
  label: string;
  className: string;
}

function getOrderStatus(order: Order): OrderStatusInfo {
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

export default function CuentaDashboardPage() {
  const { customer, isLoading, error } = useCustomer();
  const { count: wishlistCount } = useWishlist();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <AccountSkeletonHeader />
        <AccountSkeletonGrid cols={2} count={4} />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-[26px] sm:text-[30px] lg:text-[32px] font-normal tracking-tight text-foreground leading-tight">
          Mi cuenta
        </h1>
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          No pudimos cargar la información de tu cuenta. Recargá la página o
          intentá de nuevo en unos minutos.
        </div>
      </div>
    );
  }

  const lastOrder = customer.orders?.edges?.[0]?.node ?? null;
  const defaultAddress = customer.defaultAddress ?? null;
  const firstName = customer.firstName?.trim() || "tú";

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <header className="space-y-1.5">
        <h1 className="font-display text-[26px] sm:text-[30px] lg:text-[32px] font-normal tracking-tight text-foreground leading-tight">
          Hola, {firstName}
        </h1>
        <p className="text-sm sm:text-[15px] text-muted-foreground">
          Bienvenido de vuelta a tu cuenta
        </p>
      </header>

      {/* Grid de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Último pedido */}
        <DashboardSummaryCard
          icon={<Package className="w-[18px] h-[18px]" />}
          title="Último pedido"
          href={
            lastOrder ? `/cuenta/mis-compras/${lastOrder.orderNumber}` : undefined
          }
          cta={lastOrder ? "Ver detalle" : undefined}
        >
          {lastOrder ? (
            <LastOrderContent order={lastOrder} />
          ) : (
            <div className="space-y-3">
              <DashboardSummaryEmpty message="Aún no realizaste compras." />
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Explorar productos
              </Link>
            </div>
          )}
        </DashboardSummaryCard>

        {/* Dirección por defecto */}
        <DashboardSummaryCard
          icon={<MapPin className="w-[18px] h-[18px]" />}
          title="Dirección de envío"
          href="/cuenta/direcciones"
          cta={defaultAddress ? "Editar direcciones" : "Agregar dirección"}
        >
          {defaultAddress ? (
            <address className="not-italic text-sm text-foreground space-y-0.5 leading-relaxed">
              <p className="font-medium">{defaultAddress.address1}</p>
              {defaultAddress.address2 && <p>{defaultAddress.address2}</p>}
              <p className="text-muted-foreground">
                {defaultAddress.city}
                {defaultAddress.province && `, ${defaultAddress.province}`}
                {defaultAddress.zip && ` — ${defaultAddress.zip}`}
              </p>
              <p className="text-muted-foreground">{defaultAddress.country}</p>
            </address>
          ) : (
            <DashboardSummaryEmpty message="Aún no tenés una dirección de envío predeterminada." />
          )}
        </DashboardSummaryCard>

        {/* Favoritos */}
        <DashboardSummaryCard
          icon={<Heart className="w-[18px] h-[18px]" />}
          title="Favoritos"
          href={wishlistCount > 0 ? "/cuenta/favoritos" : "/products"}
          cta={wishlistCount > 0 ? "Ver lista" : "Explorar productos"}
        >
          {wishlistCount > 0 ? (
            <div className="space-y-1">
              <p className="font-display text-[28px] font-normal tracking-tight text-foreground leading-none">
                {wishlistCount}
              </p>
              <p className="text-sm text-muted-foreground">
                {wishlistCount === 1
                  ? "producto guardado"
                  : "productos guardados"}
              </p>
            </div>
          ) : (
            <DashboardSummaryEmpty message="Tu lista de favoritos está vacía. Tocá el corazón en cualquier producto para guardarlo." />
          )}
        </DashboardSummaryCard>

        {/* Datos de contacto */}
        <DashboardSummaryCard
          icon={<Mail className="w-[18px] h-[18px]" />}
          title="Datos de contacto"
          href="/cuenta/perfil"
          cta="Editar perfil"
        >
          <div className="space-y-1.5 text-sm">
            <p className="text-foreground break-words">{customer.email}</p>
            {customer.phone ? (
              <p className="text-muted-foreground">{customer.phone}</p>
            ) : (
              <p className="text-muted-foreground italic">
                Sin teléfono registrado
              </p>
            )}
          </div>
        </DashboardSummaryCard>
      </div>

      {/* Banner CTA premium */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/8 via-white to-secondary/8 pointer-events-none"
          aria-hidden
        />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary uppercase tracking-[0.1em]">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Catálogo
            </div>
            <h2 className="font-display text-[22px] sm:text-[26px] font-normal tracking-tight text-foreground leading-tight">
              ¿Buscás algo nuevo?
            </h2>
            <p className="text-sm sm:text-[15px] text-muted-foreground">
              Descubrí nuestro catálogo completo de hogar y ferretería con las
              mejores marcas y financiación en cuotas sin interés.
            </p>
          </div>
          <GlassButton variant="light" size="lg" asChild>
            <Link href="/products">Explorar productos</Link>
          </GlassButton>
        </div>
      </section>
    </div>
  );
}

function LastOrderContent({ order }: { order: Order }) {
  const status = getOrderStatus(order);
  const formattedDate = new Date(order.processedAt).toLocaleDateString(
    "es-UY",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const itemCount = order.lineItems?.edges?.length ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-foreground text-sm">
          #{order.orderNumber}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">{formattedDate}</div>
      <div className="text-sm flex items-center gap-2">
        <span className="font-semibold text-foreground">
          ${order.totalPrice.amount}{" "}
          <span className="text-xs font-medium text-muted-foreground">
            {order.totalPrice.currencyCode}
          </span>
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">
          {itemCount} producto{itemCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

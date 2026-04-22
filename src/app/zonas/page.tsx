import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ZONE_CONTENT } from "@/lib/constants/zoneContent";
import { MapPin, ArrowRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Zonas de envío en Uruguay — Montevideo, Canelones y Maldonado | CompraHogar",
  description: "Enviamos a todo Uruguay. Conocé los plazos, costos y zonas de entrega en Montevideo, Canelones, Maldonado y el resto del país. Hasta 12 cuotas sin interés.",
  alternates: { canonical: "/zonas" },
};

export default function ZonasIndexPage() {
  const zones = Object.values(ZONE_CONTENT);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Zonas de envío", item: `${SITE_URL}/zonas` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Zonas de envío", isLast: true }]} />
        </div>

        <header className="pt-6 md:pt-10 pb-8 md:pb-12 max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            Zonas de envío en Uruguay
          </h1>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">
            En CompraHogar hacemos envíos a todo Uruguay. Elegí tu zona para conocer los
            tiempos de entrega, los costos de flete y los barrios o localidades que
            cubrimos. Todas las compras tienen opción de pago en hasta 12 cuotas sin interés.
          </p>
        </header>

        <section aria-label="Zonas disponibles" className="mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-3 gap-5">
          {zones.map((zone) => (
            <Link
              key={zone.slug}
              href={`/zonas/${zone.slug}`}
              className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all flex flex-col"
            >
              <MapPin className="w-6 h-6 text-primary mb-3" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {zone.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-3">
                Entrega en {zone.deliveryInfo.timing}.
                {zone.deliveryInfo.freeShippingThreshold ? ` ${zone.deliveryInfo.freeShippingThreshold}` : ""}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Ver detalles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>
      </Container>
    </div>
  );
}

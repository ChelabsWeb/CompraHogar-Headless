import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getZoneContent, ZONE_SLUGS } from "@/lib/constants/zoneContent";
import { MAIN_COLLECTION_HANDLES, COLLECTION_HIERARCHY } from "@/lib/constants/collectionHierarchy";
import { Truck, CreditCard, Shield, ArrowRight, MessageCircle } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateStaticParams() {
  return ZONE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const zone = getZoneContent(slug);
  if (!zone) return {};

  const title = `${zone.fullName} — Envíos 24-48hs | CompraHogar`;
  const description = `Comprá materiales de construcción, herramientas y todo para el hogar con envío a ${zone.name}. ${zone.deliveryInfo.timing}, hasta 12 cuotas sin interés. ${zone.deliveryInfo.freeShippingThreshold || ""}`.trim();

  return {
    title,
    description,
    alternates: { canonical: `/zonas/${zone.slug}` },
    openGraph: {
      title,
      description,
      url: `/zonas/${zone.slug}`,
      type: "website",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: `CompraHogar — ${zone.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}

export default async function ZonePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const zone = getZoneContent(slug);
  if (!zone) return notFound();

  const zoneUrl = `${SITE_URL}/zonas/${zone.slug}`;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${zoneUrl}#store`,
    name: `CompraHogar — ${zone.name}`,
    description: zone.intro,
    url: zoneUrl,
    image: `${SITE_URL}/og-default.png`,
    telephone: "+598 96 244 003",
    email: "ventas@comprahogar.com.uy",
    priceRange: "$$",
    currenciesAccepted: "UYU",
    paymentAccepted: "Tarjetas de crédito, OCA, Abitab, RedPagos, Transferencia bancaria, Mercado Pago",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UY",
      addressRegion: zone.name,
    },
    ...(zone.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: zone.coordinates.lat,
        longitude: zone.coordinates.lng,
      },
    }),
    areaServed: zone.deliveryInfo.zones.map((z) => ({ "@type": "Place", name: z })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: zone.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Zonas de envío", item: `${SITE_URL}/zonas` },
      { "@type": "ListItem", position: 3, name: zone.name, item: zoneUrl },
    ],
  };

  const mainCategories = MAIN_COLLECTION_HANDLES.slice(0, 6).map((handle) => ({
    handle,
    label: handle.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
  }));

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs
            items={[
              { label: "Zonas de envío", href: "/zonas" },
              { label: zone.name, isLast: true },
            ]}
          />
        </div>

        <header className="pt-6 md:pt-10 pb-8 md:pb-12 max-w-3xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wide mb-3">
            Envíos a {zone.name}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
            {zone.fullName}
          </h1>
          <p className="text-base md:text-lg text-slate-700 leading-relaxed">{zone.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver catálogo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/59896244003"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-900 font-semibold text-sm px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </header>

        {/* Delivery info cards */}
        <section aria-label="Información de envíos" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 md:mb-16">
          <div className="bg-slate-50 rounded-xl p-5">
            <Truck className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-semibold text-slate-900 mb-1">Tiempo de entrega</h2>
            <p className="text-sm text-slate-700">{zone.deliveryInfo.timing}</p>
          </div>
          {zone.deliveryInfo.freeShippingThreshold && (
            <div className="bg-slate-50 rounded-xl p-5">
              <Shield className="w-6 h-6 text-primary mb-3" />
              <h2 className="font-semibold text-slate-900 mb-1">Envío gratis</h2>
              <p className="text-sm text-slate-700">{zone.deliveryInfo.freeShippingThreshold}</p>
            </div>
          )}
          <div className="bg-slate-50 rounded-xl p-5">
            <CreditCard className="w-6 h-6 text-primary mb-3" />
            <h2 className="font-semibold text-slate-900 mb-1">Hasta 12 cuotas</h2>
            <p className="text-sm text-slate-700">Sin interés con tarjetas seleccionadas.</p>
          </div>
        </section>

        {/* Why us */}
        <section aria-label="Por qué elegirnos" className="mb-12 md:mb-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Por qué clientes de {zone.name} eligen CompraHogar
          </h2>
          <div className="space-y-6">
            {zone.whyUs.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-700 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Zones covered */}
        <section aria-label="Localidades cubiertas" className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Llegamos a todo {zone.name}
          </h2>
          <p className="text-slate-700 mb-5">
            Enviamos a las siguientes localidades y barrios:
          </p>
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {zone.deliveryInfo.zones.map((area) => (
              <span
                key={area}
                className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-800 text-sm rounded-md"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* Category links — internal link graph */}
        <section aria-label="Categorías" className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Qué podés comprar con envío a {zone.name}
          </h2>
          <p className="text-slate-700 mb-6">
            Todo nuestro catálogo está disponible con envío a {zone.name}. Explorá las categorías principales:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mainCategories.map((cat) => {
              const subs = COLLECTION_HIERARCHY[cat.handle];
              return (
                <Link
                  key={cat.handle}
                  href={`/collections/${cat.handle}`}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-primary hover:shadow-sm transition-all group"
                >
                  <h3 className="font-semibold text-slate-900 text-[15px] group-hover:text-primary transition-colors">
                    {cat.label}
                  </h3>
                  {subs && subs.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {subs.slice(0, 3).map((s) => s.name).join(" · ")}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Preguntas frecuentes" className="mb-16 md:mb-24 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Preguntas frecuentes sobre envíos a {zone.name}
          </h2>
          <div className="space-y-6">
            {zone.faq.map((item) => (
              <div key={item.question} className="border-b border-slate-200 pb-5 last:border-0">
                <h3 className="font-semibold text-slate-900 mb-2">{item.question}</h3>
                <p className="text-slate-700 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

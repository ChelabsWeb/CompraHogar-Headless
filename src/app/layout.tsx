import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/shop/WishlistProvider";
import { CompareProvider } from "@/components/shop/CompareProvider";
import { ToastProvider } from "@/components/ui/toast";
import { CompareBar } from "@/components/shop/CompareBar";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery } from "@/lib/queries";
import { cookies } from "next/headers";
import type { ShopifyCollection, ShopifyCollectionEdge } from "@/lib/types";
import { ExitIntentPopup } from "@/components/shared/ExitIntentPopup";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ServiceWorkerRegister } from "@/components/shared/ServiceWorkerRegister";

// Pure clean geometry: Single highly readable sans-serif
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Cal Sans — display font for headings (Cal.com aesthetic)
const calSans = localFont({
  src: "../../public/fonts/CalSans-Regular.woff2",
  variable: "--font-cal-sans",
  display: "swap",
  weight: "400 700",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CompraHogar Uruguay — Materiales, Herramientas y Equipamiento | Envíos en 24-48hs",
    template: "%s | CompraHogar Uruguay",
  },
  description: "Tu ferretería online en Uruguay. Materiales de construcción, herramientas, sanitaria, electricidad y más. Envíos a todo el país en 24-48hs. Hasta 12 cuotas sin interés.",
  applicationName: "CompraHogar",
  manifest: "/manifest.webmanifest",
  alternates: {
    languages: {
      "es-UY": "/",
      "es": "/",
    },
  },
  appleWebApp: {
    capable: true,
    title: "CompraHogar",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "CompraHogar Uruguay" }],
    siteName: "Compra Hogar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#21645d",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let collections: ShopifyCollection[] = [];
  try {
    const { body } = await shopifyFetch({
      query: getCollectionsQuery,
      tags: ['collections'],
      variables: { first: 20 },
    });
    collections = body?.data?.collections?.edges?.map((edge: ShopifyCollectionEdge) => edge.node) || [];
  } catch {
    // Shopify unreachable — render with empty collections
  }

  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get("customerAccessToken")?.value;
  const isLoggedIn = !!customerAccessToken;

  const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gtmId = rawGtmId && /^GTM-[A-Z0-9]+$/.test(rawGtmId) ? rawGtmId : null;

  const rawFbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const fbPixelId = rawFbPixelId && /^\d{15,16}$/.test(rawFbPixelId) ? rawFbPixelId : null;

  return (
    <html lang="es-UY" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://cdn.judge.me" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "CompraHogar",
                  legalName: "CompraHogar Uruguay",
                  url: siteUrl,
                  logo: {
                    "@type": "ImageObject",
                    url: `${siteUrl}/logo.png`,
                    width: 512,
                    height: 512,
                  },
                  image: `${siteUrl}/og-default.png`,
                  description: "Ferretería online en Uruguay. Materiales de construcción, herramientas, sanitaria, electricidad, pinturas y equipamiento para el hogar. Envíos a todo el país en 24-48hs.",
                  email: "ventas@comprahogar.com.uy",
                  telephone: "+598 96 244 003",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "UY",
                    addressRegion: "Montevideo",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    telephone: "+598 96 244 003",
                    email: "ventas@comprahogar.com.uy",
                    availableLanguage: ["Spanish", "es-UY"],
                    areaServed: "UY",
                  },
                },
                {
                  "@type": "Store",
                  "@id": `${siteUrl}/#store`,
                  name: "CompraHogar",
                  url: siteUrl,
                  image: `${siteUrl}/og-default.png`,
                  description: "Ferretería online uruguaya con envíos en 24-48hs a todo el país.",
                  priceRange: "$$",
                  currenciesAccepted: "UYU",
                  paymentAccepted: "Tarjetas de crédito, OCA, Abitab, RedPagos, Transferencia bancaria, Mercado Pago",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "UY",
                    addressRegion: "Montevideo",
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "Uruguay",
                  },
                  telephone: "+598 96 244 003",
                  email: "ventas@comprahogar.com.uy",
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "CompraHogar",
                  inLanguage: "es-UY",
                  publisher: { "@id": `${siteUrl}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        {gtmId && (
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {fbPixelId && (
          <Script
            id="fb-pixel-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${fbPixelId}');
fbq('track', 'PageView');`,
            }}
          />
        )}
        {fbPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        <Script
          src="https://cdn.judge.me/widget_preloader.js"
          strategy="lazyOnload"
          data-shop-domain="comprahogaruy.myshopify.com"
        />
        <Script
          src="https://cdn.judge.me/assets/installed.js"
          strategy="lazyOnload"
        />
      </head>
      <body vaul-drawer-wrapper="" className={`${inter.variable} ${calSans.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-brand-teal/20 selection:text-brand-teal flex flex-col`}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <CartProvider customerAccessToken={customerAccessToken}>
          <WishlistProvider isLoggedIn={isLoggedIn}>
            <ToastProvider>
              <CompareProvider>
                <Header collections={collections} isLoggedIn={isLoggedIn} />
                <main className="flex-1 w-full pt-[96px] lg:pt-[128px]">
                  {children}
                </main>
                <Footer />
                <ExitIntentPopup />
                <WhatsAppButton />
                <CompareBar />
                <ServiceWorkerRegister />
              </CompareProvider>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

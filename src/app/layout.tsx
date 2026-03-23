import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/shop/WishlistProvider";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery } from "@/lib/queries";
import { cookies } from "next/headers";
import type { ShopifyCollection, ShopifyCollectionEdge } from "@/lib/types";

// Pure clean geometry: Single highly readable sans-serif
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Compra Hogar | Tienda Oficial",
    template: "%s | Compra Hogar",
  },
  description: "Equipamiento premium para construcción y hogar. Envíos a todo Uruguay.",
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: "Compra Hogar",
  },
  robots: {
    index: true,
    follow: true,
  },
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

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
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
      <body vaul-drawer-wrapper="" className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-brand-teal/20 selection:text-brand-teal flex flex-col`}>
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
            <Header collections={collections} isLoggedIn={isLoggedIn} />
            <main className="flex-1 w-full pt-[96px] lg:pt-[116px]">
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

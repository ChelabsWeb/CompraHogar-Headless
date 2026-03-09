import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery } from "@/lib/queries";
import { cookies } from "next/headers";

// Pure clean geometry: Single highly readable sans-serif
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Compra Hogar | Tienda Oficial",
  description: "Equipamiento premium para construcción y hogar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { body } = await shopifyFetch({
    query: getCollectionsQuery,
    variables: { first: 20 },
  });

  const collections = body?.data?.collections?.edges?.map((edge: any) => edge.node) || [];

  const cookieStore = await cookies();
  const customerAccessToken = cookieStore.get("customerAccessToken")?.value;
  const isLoggedIn = !!customerAccessToken;

  return (
    <html lang="es" className="scroll-smooth">
      <body vaul-drawer-wrapper="" className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-brand-teal/20 selection:text-brand-teal flex flex-col`}>
        <CartProvider customerAccessToken={customerAccessToken}>
          <Header collections={collections} isLoggedIn={isLoggedIn} />
          <main className="flex-1 w-full pt-[116px]">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery } from "@/lib/queries";

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

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-brand-teal/20 selection:text-brand-teal flex flex-col`}>
        <Header collections={collections} />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

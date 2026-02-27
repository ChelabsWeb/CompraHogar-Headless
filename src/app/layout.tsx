import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MSWProvider } from "@/components/MSWProvider";
import { shopifyFetch } from "@/lib/shopify/fetch";
import { getCollectionsQuery } from "@/lib/queries";

// Variable fonts usage
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Compra Hogar | Store",
  description: "E-Commerce as a premium experience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site-wide collections for navigation
  const { body } = await shopifyFetch<{ data: { collections: { edges: { node: { id: string; title: string; handle: string; } }[] } } }>({
    query: getCollectionsQuery,
    variables: { first: 20 },
  });

  const collections = body?.data?.collections?.edges?.map((edge) => edge.node) || [];

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-black/10 selection:text-black`}>
        <Header collections={collections} />
        <main className="relative z-10 w-full min-h-screen">
          <MSWProvider>{children}</MSWProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}

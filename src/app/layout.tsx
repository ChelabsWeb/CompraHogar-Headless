import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { shopifyFetch } from "@/lib/shopify";
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
  const { body } = await shopifyFetch({
    query: getCollectionsQuery,
    variables: { first: 20 },
  });

  const collections = body?.data?.collections?.edges?.map((edge: any) => edge.node) || [];

  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-black/10 selection:text-black`}>
        <Header collections={collections} />
        <main className="relative z-10 w-full min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

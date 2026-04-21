import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery, getProductRecommendationsQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import { ProductPageTracker } from "@/components/analytics/ProductPageTracker";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";
import { ProductViewTracker } from "@/components/shop/ProductViewTracker";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    if (!resolvedParams?.handle) {
        return {};
    }

    const { body } = await shopifyFetch({
        query: getProductByHandleQuery,
        tags: ['products', `product:${resolvedParams.handle}`],
        variables: { handle: resolvedParams.handle },
    });

    const product = body?.data?.productByHandle;

    if (!product) {
        return {};
    }

    const title = product.title;
    const description = product.description;
    const coverImage = product.media?.edges?.[0]?.node?.previewImage?.url;
    const canonicalUrl = `/products/${resolvedParams.handle}`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: canonicalUrl,
            ...(coverImage && { images: [{ url: coverImage }] }),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(coverImage && { images: [coverImage] }),
        }
    };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
    const resolvedParams = await params;

    if (!resolvedParams?.handle) {
        return notFound();
    }

    const { body } = await shopifyFetch({
        query: getProductByHandleQuery,
        tags: ['products', `product:${resolvedParams.handle}`],
        variables: { handle: resolvedParams.handle },
    });

    const product = body?.data?.productByHandle;

    if (!product) return notFound();

    const { body: recBody } = await shopifyFetch({
        query: getProductRecommendationsQuery,
        tags: ['products'],
        variables: { productId: product.id },
    });

    const recommendations = recBody?.data?.productRecommendations || [];

    const collectionNode = product.collections?.edges?.[0]?.node;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const productPrice = product.priceRange?.minVariantPrice?.amount;
    const productCurrency = product.priceRange?.minVariantPrice?.currencyCode || "UYU";
    const productImage = product.media?.edges?.[0]?.node?.previewImage?.url || product.media?.edges?.[0]?.node?.image?.url;
    const isAvailable = product.variants?.edges?.some((v: { node: { availableForSale: boolean } }) => v.node.availableForSale) ?? true;

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: productImage,
        url: `${siteUrl}/products/${product.handle}`,
        brand: {
            "@type": "Brand",
            name: "CompraHogar",
        },
        offers: {
            "@type": "Offer",
            url: `${siteUrl}/products/${product.handle}`,
            priceCurrency: productCurrency,
            price: productPrice,
            availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "CompraHogar",
            },
        },
    };

    const productUrl = `${siteUrl}/products/${product.handle}`;
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Catálogo", item: `${siteUrl}/products` },
            ...(collectionNode
                ? [{ "@type": "ListItem", position: 3, name: collectionNode.title, item: `${siteUrl}/collections/${collectionNode.handle}` }]
                : []),
            { "@type": "ListItem", position: collectionNode ? 4 : 3, name: product.title, item: productUrl },
        ],
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full pt-8 lg:pt-12 pb-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <Container>
                <div className="mb-4 md:mb-6">
                    <Breadcrumbs
                        items={[
                            { label: "Catálogo", href: "/products" },
                            ...(collectionNode
                                ? [{ label: collectionNode.title, href: `/collections/${collectionNode.handle}` }]
                                : []),
                            { label: product.title, isLast: true }
                        ]}
                    />
                </div>
                <ProductPageTracker product={{
                    item_id: product.id,
                    item_name: product.title,
                    price: Number(product.priceRange?.minVariantPrice?.amount || 0),
                    currency: product.priceRange?.minVariantPrice?.currencyCode || 'USD',
                    quantity: 1
                }} />
                <ProductView product={product} />
                
                <ProductViewTracker
                    product={{
                        id: product.id,
                        handle: product.handle,
                        title: product.title,
                        price: Number(product.priceRange?.minVariantPrice?.amount || 0),
                        image: productImage,
                        imageAlt: product.title,
                    }}
                />

                {recommendations.length > 0 && (
                    <div className="mt-8 lg:mt-12">
                        <ProductCarousel title="También te puede interesar" products={recommendations} />
                    </div>
                )}

                <RecentlyViewed excludeHandle={product.handle} />

            </Container>
        </div>
    );
}

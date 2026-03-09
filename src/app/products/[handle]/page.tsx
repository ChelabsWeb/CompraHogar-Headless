import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery, getProductRecommendationsQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import VendorReviews from "@/components/shop/VendorReviews";
import { ProductPageTracker } from "@/components/analytics/ProductPageTracker";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
    const resolvedParams = await params;

    if (!resolvedParams?.handle) {
        return {};
    }

    const { body } = await shopifyFetch({
        query: getProductByHandleQuery,
        variables: { handle: resolvedParams.handle },
    });

    const product = body?.data?.productByHandle;

    if (!product) {
        return {};
    }

    const title = product.title;
    const description = product.description;
    const coverImage = product.media?.edges?.[0]?.node?.previewImage?.url;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
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
        variables: { handle: resolvedParams.handle },
    });

    const product = body?.data?.productByHandle;

    if (!product) return notFound();

    const { body: recBody } = await shopifyFetch({
        query: getProductRecommendationsQuery,
        variables: { productId: product.id },
    });

    const recommendations = recBody?.data?.productRecommendations || [];

    const collectionNode = product.collections?.edges?.[0]?.node;

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full pt-8 lg:pt-12 pb-12">
            <Container>
                <div className="mb-6 hidden md:block">
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
                
                {recommendations.length > 0 && (
                    <div className="mt-8 lg:mt-12">
                        <ProductCarousel title="Quienes vieron esto también compraron" products={recommendations} />
                    </div>
                )}
                
                <VendorReviews productHandle={resolvedParams.handle} />
            </Container>
        </div>
    );
}

import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";
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
    const coverImage = product.images?.edges?.[0]?.node?.url;

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

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full pt-20 lg:pt-28 pb-12">
            <Container>
                <div className="mb-6 hidden md:block">
                    <Breadcrumbs 
                        items={[
                            { label: "Catálogo", href: "/collections/all" },
                            { label: product.productType || "Productos", href: `/collections/${product.productType?.toLowerCase() || 'all'}` },
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
                <VendorReviews productId={product.id} />
            </Container>
        </div>
    );
}

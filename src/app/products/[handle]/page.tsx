import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery } from "@/lib/queries";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/shop/ProductView";

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
        <div className="min-h-screen bg-[#f8fafc] p-2 md:p-6 lg:p-10 pb-0 flex items-start justify-center pt-24 lg:pt-[84px]">
            <ProductView product={product} />
        </div>
    );
}

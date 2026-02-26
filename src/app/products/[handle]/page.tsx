import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery } from "@/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

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

    const images = product.images.edges;
    const price = product.priceRange.minVariantPrice;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground md:flex-row">

            {/* Left: Product Images Stack */}
            <div className="w-full md:w-1/2 lg:w-[55%] flex flex-col gap-1 md:gap-4 p-4 md:p-8">
                {images.map(({ node }: any, i: number) => (
                    <div key={i} className="relative w-full aspect-[4/5] bg-secondary flex items-center justify-center overflow-hidden">
                        <Image
                            src={node.url}
                            alt={node.altText || `${product.title} image ${i + 1}`}
                            fill
                            priority={i === 0}
                            className="object-contain object-center scale-90"
                            sizes="(max-width: 768px) 100vw, 55vw"
                        />
                    </div>
                ))}
            </div>

            {/* Right: Sticky Product Info & Add to Cart */}
            <div className="w-full md:w-1/2 lg:w-[45%] bg-background p-6 md:p-12 lg:p-16 flex flex-col">
                <div className="sticky top-24 flex flex-col gap-6 max-w-xl">
                    <div className="flex items-center gap-2 text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                        <span>Marca</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-foreground leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3 text-black fill-black" />
                        ))}
                        <span className="text-[13px] text-muted-foreground ml-2 font-medium">120 Reseñas</span>
                    </div>

                    <p className="text-xl md:text-2xl font-medium text-foreground mt-4">
                        {price.currencyCode} ${Number(price.amount).toFixed(2)}
                    </p>

                    <div
                        className="prose prose-sm prose-p:text-muted-foreground prose-p:leading-relaxed font-medium mt-6"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />

                    {/* Add To Cart */}
                    <div className="w-full mt-10">
                        <button className="w-full bg-black text-white py-4 md:py-5 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-black/90 transition-colors">
                            Agregar al Carrito
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-12 pt-8 border-t border-border text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">
                        <div>✓ Envío Express a Uruguay</div>
                        <div>✓ Garantía de 12 meses</div>
                        <div>✓ Pago Seguro TLS</div>
                        <div>✓ Política de Retorno 30d</div>
                    </div>
                </div>
            </div>

        </div>
    );
}

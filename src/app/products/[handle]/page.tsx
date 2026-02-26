import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery } from "@/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";

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
        <div className="flex flex-col min-h-screen bg-background text-foreground md:flex-row -mt-24">

            {/* Left: Scrollytelling Image Gallery */}
            <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col">
                {images.map(({ node }: any, i: number) => (
                    <div key={i} className="sticky top-0 h-[100svh] w-full bg-black flex items-center justify-center overflow-hidden">

                        {/* Visual First - High Performance Image */}
                        <Image
                            src={node.url}
                            alt={node.altText || `${product.title} image ${i + 1}`}
                            fill
                            priority={i === 0}
                            className="object-cover opacity-90 hover:scale-105 hover:opacity-100 transition-all duration-[2s] ease-out"
                            sizes="(max-width: 768px) 100vw, 60vw"
                        />

                        {/* Overlay Gradient for contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />

                        {/* Scroll Indicator */}
                        {i === 0 && (
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest uppercase flex flex-col items-center gap-2 animate-pulse">
                                <span>Deslizar</span>
                                <div className="w-[1px] h-8 bg-white/20"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Sticky Product Info & Add to Cart */}
            <div className="w-full md:w-1/2 lg:w-[40%] bg-background z-20 p-8 md:p-16 flex flex-col justify-center min-h-screen sticky top-0 md:top-24 h-fit pb-32 md:pb-16 border-l border-white/5">

                <div className="flex flex-col gap-6 max-w-md">
                    <div className="flex items-center gap-2 text-white/60 text-sm tracking-widest uppercase">
                        <span>Herramientas</span>
                        <div className="w-1 h-1 bg-white/30 rounded-full" />
                        <span>Premium</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-white">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-4 h-4 text-white/80 fill-white/80" />
                        ))}
                        <span className="text-sm text-white/50 ml-2">(4.9/5) Basado en 120 reseñas</span>
                    </div>

                    <p className="text-3xl font-light text-white mt-6">
                        {price.currencyCode} ${Number(price.amount).toFixed(2)}
                    </p>

                    <div
                        className="prose prose-invert prose-p:text-white/60 prose-p:leading-relaxed prose-p:font-light mt-8"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />

                    {/* Sticky Mobile Add To Cart / Static Desktop */}
                    <div className="fixed bottom-0 left-0 right-0 md:static p-6 md:p-0 bg-background/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-white/10 md:border-none mt-12 z-50">
                        <button className="w-full group relative overflow-hidden bg-white text-black py-5 md:py-6 rounded-2xl md:rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Agregar al Carrito <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10 text-sm text-white/40">
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

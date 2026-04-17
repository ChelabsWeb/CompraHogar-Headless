import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CollectionHeroProps {
    title: string;
    description?: string | null;
    image?: { url: string; altText?: string | null } | null;
    productCount?: number;
}

export function CollectionHero({ title, description, image, productCount }: CollectionHeroProps) {
    const hasImage = !!image?.url;

    return (
        <section className="relative w-full overflow-hidden">
            <div className="relative h-[200px] sm:h-[260px] md:h-[320px] w-full">
                {hasImage ? (
                    <>
                        <Image
                            src={image!.url}
                            alt={image!.altText || title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#1a504a]">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                    </div>
                )}

                <div className="relative h-full container mx-auto max-w-[1200px] px-4 md:px-6 flex flex-col justify-end pb-6 md:pb-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-1.5 text-white/80 text-xs md:text-sm mb-3 md:mb-4"
                    >
                        <Link href="/" className="hover:text-white transition-colors">
                            Inicio
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href="/products" className="hover:text-white transition-colors">
                            Catálogo
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-white font-medium truncate">{title}</span>
                    </nav>

                    <h1 className="text-white text-[28px] sm:text-4xl md:text-[44px] font-bold tracking-tight capitalize leading-[1.1]">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-white/90 text-sm md:text-base mt-2 md:mt-3 max-w-2xl line-clamp-2">
                            {description}
                        </p>
                    )}

                    {typeof productCount === "number" && productCount > 0 && (
                        <p className="text-white/70 text-xs md:text-sm mt-3 md:mt-4 font-medium">
                            {productCount} {productCount === 1 ? "producto" : "productos"} disponibles
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

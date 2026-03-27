"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Truck } from "lucide-react";

interface Slide {
  headline: string;
  highlight: string;
  subtitle: string;
  cta: string;
  href: string;
  badge: string;
  image: string;
}

const slides: Slide[] = [
  {
    headline: "Hasta",
    highlight: "40% OFF",
    subtitle: "en Herramientas Profesionales",
    cta: "Ver Ofertas",
    href: "/collections/herramientas-y-maquinaria",
    badge: "Envío gratis en compras +$300k",
    image: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=1600&q=75&auto=format&fit=crop",
  },
  {
    headline: "Nueva Temporada",
    highlight: "Obra 2026",
    subtitle: "Cemento, hierro y bloques al mejor precio",
    cta: "Comprar Ahora",
    href: "/collections/obra-gruesa",
    badge: "Precios mayoristas",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=75&auto=format&fit=crop",
  },
  {
    headline: "Alquilá",
    highlight: "Equipos",
    subtitle: "Hormigoneras, andamios y más — por día, semana o mes",
    cta: "Ver Alquileres",
    href: "/collections/servicios-y-alquileres",
    badge: "Sin depósito previo",
    image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1600&q=75&auto=format&fit=crop",
  },
  {
    headline: "Renovación",
    highlight: "Total",
    subtitle: "Pinturas, grifería e iluminación con descuentos exclusivos",
    cta: "Descubrir",
    href: "/collections/pinturas-y-acabados",
    badge: "Cuotas sin interés",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=75&auto=format&fit=crop",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden h-[60svh] min-h-[380px] lg:h-[70vh] lg:min-h-[500px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background images with transition */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={`${s.headline} ${s.highlight}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 pb-16 sm:justify-center sm:p-8 md:p-16 lg:p-20 xl:p-24">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 w-fit mb-3 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-[11px] sm:text-xs font-semibold transition-all duration-500">
          <Truck className="w-3.5 h-3.5" strokeWidth={2} />
          {slide.badge}
        </span>

        {/* Headline */}
        <h1
          key={`h-${current}`}
          className="text-[28px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-2 sm:mb-3 max-w-[300px] sm:max-w-md lg:max-w-lg xl:max-w-xl animate-[fadeUp_0.5s_ease-out]"
        >
          {slide.headline}{" "}
          <span className="text-secondary drop-shadow-[0_2px_16px_rgba(243,132,62,0.5)]">
            {slide.highlight}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          key={`s-${current}`}
          className="text-white/85 text-[13px] sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 font-medium leading-snug max-w-[260px] sm:max-w-sm lg:max-w-md animate-[fadeUp_0.5s_ease-out_0.1s_both]"
        >
          {slide.subtitle}
        </p>

        {/* CTA */}
        <Link
          href={slide.href}
          key={`c-${current}`}
          className="relative inline-flex items-center gap-2 w-fit bg-secondary text-white font-bold text-[13px] sm:text-base lg:text-lg px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-full shadow-[0_4px_24px_rgba(243,132,62,0.4)] overflow-hidden hover:brightness-110 transition-all animate-[fadeUp_0.5s_ease-out_0.2s_both]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          {slide.cta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current
                ? "w-7 bg-secondary"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

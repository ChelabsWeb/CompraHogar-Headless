import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Sobre nosotros | CompraHogar",
  description: "Conocenos. Somos tu socio confiable en equipamiento para el hogar y la construcción en Uruguay.",
};

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Sobre nosotros", isLast: true }]} />
        </div>

        {/* Hero */}
        <section className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-primary mt-4 md:mt-6 py-14 md:py-20 px-6 md:px-12">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_white,_transparent_70%)]" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-[44px] font-bold tracking-tight text-white leading-[1.1]">
              Conocé CompraHogar
            </h1>
            <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
              Nacimos con un propósito claro: redefinir la experiencia de compra de
              equipamiento, materiales de construcción y artículos para el hogar en
              todo Uruguay.
            </p>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">Nuestra misión</h2>
            <p className="text-slate-600 leading-relaxed">
              Ofrecer un catálogo seleccionado, precios competitivos y un servicio de
              entrega eficiente para que profesionales y familias construyan el hogar
              de sus sueños sin complicaciones, garantizando siempre calidad y
              transparencia en cada transacción.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">Nuestra visión</h2>
            <p className="text-slate-600 leading-relaxed">
              Convertirnos en la plataforma digital líder en soluciones integrales para
              la construcción y reforma en Uruguay, destacándonos por nuestra
              innovación tecnológica y un servicio al cliente que marca un estándar de
              excelencia a nivel nacional.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="mt-10 md:mt-14">
          <div className="max-w-2xl mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Nuestros valores
            </h2>
            <p className="mt-2 text-slate-600 text-base md:text-lg">
              Los pilares que sostienen cada decisión y cada entrega a lo largo y ancho
              del país.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">🤝 Confianza uruguaya</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed">
                Entendemos la importancia de la palabra. Lo que ves y lo que te
                prometemos, es lo que recibís.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">⚡ Agilidad total</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed">
                Elegimos soluciones rápidas y un armado logístico que nos permite
                llegar hasta donde estés.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">✨ Calidad cuidada</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed">
                Trabajamos codo a codo con importadores y marcas que responden a los
                más altos estándares.
              </p>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="mt-12 md:mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            ¿Querés armar tu proyecto con nosotros?
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg max-w-xl mx-auto">
            Descubrí nuestro catálogo. Estamos listos para ayudarte.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90">
              <Link href="/products">Ver catálogo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl h-12 px-8 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary hover:border-primary"
            >
              <a href="https://wa.me/59896244003" target="_blank" rel="noopener noreferrer">
                Escribinos por WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sobre Nosotros | CompraHogar",
  description: "Conocenos. Somos tu socio confiable en equipamiento para el hogar y la construcción.",
};

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-primary py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Acerca de CompraHogar
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Nacimos con un propósito claro: redefinir la experiencia de compra de equipamiento, materiales de construcción y artículos para el hogar en todo el Uruguay.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 -mt-10 relative z-20">
        
        <div className="bg-card shadow-lg border rounded-2xl p-8 sm:p-10 space-y-4 hover-lift">
          <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Nuestra Misión</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ofrecer un catálogo seleccionado, precios competitivos y un servicio de entrega eficiente para que profesionales y familias construyan el hogar de sus sueños sin complicaciones, garantizando siempre calidad y transparencia en cada transacción.
          </p>
        </div>

        <div className="bg-card shadow-lg border rounded-2xl p-8 sm:p-10 space-y-4 hover-lift">
          <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Nuestra Visión</h2>
          <p className="text-muted-foreground leading-relaxed">
            Convertirnos en la plataforma digital líder en soluciones integrales para la construcción y reforma en Uruguay, destacándonos por nuestra innovación tecnológica y un servicio al cliente que marca un estándar de excelencia a nivel nacional.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Nuestros Valores
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los pilares que sostienen cada decisión y cada entrega a lo largo y ancho del país.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="space-y-3 p-6">
              <h3 className="text-xl font-bold text-foreground">🤝 Confianza Rioplatense</h3>
              <p className="text-muted-foreground">Entendemos la importancia de la palabra. Lo que ves y lo que te prometemos, es lo que recibís.</p>
            </div>
            <div className="space-y-3 p-6">
              <h3 className="text-xl font-bold text-foreground">⚡ Agilidad Total</h3>
              <p className="text-muted-foreground">Optamos por soluciones rápidas y un armado de logística que nos permite llegar hasta donde estés.</p>
            </div>
            <div className="space-y-3 p-6">
              <h3 className="text-xl font-bold text-foreground">🛋️ Calidad Cuidada</h3>
              <p className="text-muted-foreground">Trabajamos codo a codo con importadores y marcas que responden a los más altos estándares.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background border-t">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-foreground">¿Querés armar tu proyecto con nosotros?</h2>
          <p className="text-lg text-muted-foreground">
            Descubrí nuestro catálogo. Estamos listos para ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="px-8 bg-primary hover:bg-primary/90">
              <Link href="/collections/all">Ver Catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 border-primary text-primary hover:bg-primary/5">
              <Link href="/contacto">Contactanos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-background mt-auto pt-16 pb-12 border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 lg:gap-24">
                
                {/* Newsletter Section (Kickgame style) */}
                <div className="flex-1 md:max-w-md">
                    <h2 className="text-2xl md:text-[28px] font-black uppercase tracking-tighter text-foreground mb-4">
                        CONSEGUÍ 10% DE DESCUENTO
                    </h2>
                    <p className="text-muted-foreground text-[14px] mb-6 font-medium">
                        Suscribite a nuestro newsletter para recibir acceso exclusivo a las mejores ofertas en materiales y noticias del sector.
                    </p>
                    <form className="flex w-full group">
                        <input 
                            type="email" 
                            placeholder="Tu dirección de email" 
                            className="w-full bg-muted text-foreground px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground/70"
                        />
                        <button type="submit" className="bg-black text-white px-5 flex items-center justify-center hover:bg-black/80 transition-colors">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Footer Links Columns */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-2">Información</h3>
                        <Link href="/about" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Sobre nosotros</Link>
                        <Link href="/contact" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Contacto</Link>
                        <Link href="/stores" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Nuestras Tiendas</Link>
                        <Link href="/careers" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Trabaja con nosotros</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-2">Categorías Top</h3>
                        <Link href="/collections/acero" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Acero de Construcción</Link>
                        <Link href="/collections/impermeabilizantes" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Impermeabilizantes</Link>
                        <Link href="/collections/herramientas" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Herramientas Eléctricas</Link>
                        <Link href="/collections/all" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Ver Todo el Catálogo</Link>
                    </div>

                    <div className="flex flex-col gap-4 col-span-2 lg:col-span-1 mt-4 lg:mt-0">
                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-2">Servicio al Cliente</h3>
                        <Link href="/faq" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Preguntas Frecuentes</Link>
                        <Link href="/shipping" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Políticas de Envío</Link>
                        <Link href="/returns" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Garantías & Retornos</Link>
                        <Link href="/terms" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Términos de Servicio</Link>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[12px] font-medium text-muted-foreground">
                    &copy; {new Date().getFullYear()} COMPRA HOGAR. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-4 text-[12px] font-medium text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
                    <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
                </div>
            </div>
        </footer>
    );
}

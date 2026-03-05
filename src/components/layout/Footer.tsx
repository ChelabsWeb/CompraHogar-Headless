import Link from "next/link";
import { Instagram, Facebook, Linkedin, MapPin, Mail, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-border mt-auto">
      <Container className="pt-16 pb-8 md:pt-24 md:pb-12">
        {/* Top Section - Newsletter & Value Props */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-16">
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Suscríbete a nuestras novedades.
            </h3>
            <p className="text-slate-400 max-w-sm">
              Recibe acceso anticipado a nuevos ingresos, descuentos exclusivos para profesionales y consejos de obra.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Ingresa tu correo electrónico" 
              className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-12 focus-visible:ring-1 focus-visible:ring-primary w-full lg:max-w-md"
            />
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-0 transition-colors whitespace-nowrap">
              Suscribirse <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-16" />

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Categorías</h4>
            <ul className="space-y-3">
              <li><Link href="/collections/obra-gruesa" className="text-sm hover:text-white transition-colors">Obra Gruesa</Link></li>
              <li><Link href="/collections/herramientas" className="text-sm hover:text-white transition-colors">Herramientas</Link></li>
              <li><Link href="/collections/iluminacion" className="text-sm hover:text-white transition-colors">Iluminación</Link></li>
              <li><Link href="/collections/sanitaria" className="text-sm hover:text-white transition-colors">Sanitaria</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/shipping" className="text-sm hover:text-white transition-colors">Envíos y Entregas</Link></li>
              <li><Link href="/returns" className="text-sm hover:text-white transition-colors">Cambios y Devoluciones</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/b2b" className="text-sm hover:text-white transition-colors">Ventas Corporativas</Link></li>
              <li><Link href="/stores" className="text-sm hover:text-white transition-colors">Nuestras Sucursales</Link></li>
              <li><Link href="/careers" className="text-sm hover:text-white transition-colors">Trabaja con Nosotros</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">Av. Italia 4567<br/>Montevideo, Uruguay</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>2619 0000</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contacto@comprahogar.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-slate-500">
             <div className="flex items-center gap-1.5 text-primary">
               <ShieldCheck className="w-4 h-4" /> Compra 100% Segura
             </div>
             <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-white transition-colors">Políticas de Privacidad</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link>
             </div>
             <p>&copy; {new Date().getFullYear()} CompraHogar. Todos los derechos reservados.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

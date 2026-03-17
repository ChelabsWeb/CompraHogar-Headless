import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";

const FOOTER_LINKS = [
  {
    title: "Categorías",
    links: [
      { name: "Obra Gruesa", href: "/collections/obra-gruesa" },
      { name: "Herramientas", href: "/collections/herramientas" },
      { name: "Iluminación", href: "/collections/iluminacion" },
      { name: "Sanitaria", href: "/collections/sanitaria" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { name: "Centro de Ayuda", href: "/contact" },
      { name: "Envíos y Entregas", href: "/shipping" },
      { name: "Cambios y Devoluciones", href: "/returns" },
      { name: "Preguntas Frecuentes", href: "/faq" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { name: "Sobre Nosotros", href: "/about" },
      { name: "Ventas Corporativas", href: "/b2b" },
      { name: "Nuestras Sucursales", href: "/stores" },
      { name: "Trabaja con Nosotros", href: "/careers" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#FAFAFA] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white to-[#F1F5F9] text-slate-600 border-t border-slate-200 mt-auto overflow-hidden relative">
      <Container className="pt-10 md:pt-24 relative z-10">

        {/* Newsletter Section — compact on mobile */}
        <div className="relative overflow-hidden rounded-xl md:rounded-[2rem] bg-primary p-5 md:p-12 mb-8 md:mb-16">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-12 items-center">
            <div>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight text-white mb-1 md:mb-3">
                Recibí ofertas exclusivas
              </h3>
              <p className="text-white/70 text-[13px] md:text-base leading-snug">
                Novedades y descuentos directo a tu bandeja.
              </p>
            </div>
            <div className="flex flex-row gap-2 w-full md:justify-end">
              <Input
                type="email"
                placeholder="tu@correo.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 md:h-14 md:min-w-[280px] focus-visible:ring-white/30 rounded-lg flex-1 md:flex-none"
              />
              <Button size="lg" className="h-11 md:h-14 px-5 md:px-8 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-lg shrink-0">
                <ArrowRight className="h-4 w-4 md:hidden" />
                <span className="hidden md:inline">Suscribirme</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-10 md:mb-16">

          {/* Mobile: simple link columns. Desktop: full sections */}

          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-[13px] font-bold text-slate-900 tracking-wider uppercase">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] font-medium text-slate-500 hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1 space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
            <h4 className="text-[13px] font-bold text-slate-900 tracking-wider uppercase">Contacto</h4>
            <ul className="space-y-2 text-[13px] text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Av. Italia 4567, Montevideo</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="tel:26190000" className="hover:text-primary transition-colors">2619 0000</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href="mailto:ventas@comprahogar.com.uy" className="hover:text-primary transition-colors">ventas@comprahogar.com.uy</a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-200 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
          <div className="flex items-center gap-3">
            <Link href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1">
              <Instagram className="h-[18px] w-[18px]" />
            </Link>
            <Link href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1">
              <Facebook className="h-[18px] w-[18px]" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1">
              <Linkedin className="h-[18px] w-[18px]" />
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> 
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0 font-semibold">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Términos</Link>
            </div>
            <p className="mt-2 md:mt-0 text-slate-400 text-xs md:text-sm font-medium">
              &copy; {new Date().getFullYear()} CompraHogar. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

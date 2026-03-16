import Link from "next/link";
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  Car,
  Home as HomeIcon,
  Laptop,
  Sofa,
  Wrench,
  Hammer,
  Dumbbell,
  Shirt,
  Gamepad2,
  Watch,
  Plus,
  User,
  ShoppingBag,
  Heart,
  HelpCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";

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
      <Container className="pt-16 md:pt-24 relative z-10">
        
        {/* Newsletter Section - Premium Glassmorphism Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-8 md:p-12 mb-16 shadow-xl shadow-slate-200/50 group">
          {/* Subtle animated background gradients */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none transition-all duration-1000 group-hover:bg-primary/20" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none transition-all duration-1000 group-hover:bg-blue-500/10" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm w-fit">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-slate-600">Únete a la comunidad de CompraHogar</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">
                Diseña tu espacio ideal.
              </h3>
              <p className="text-slate-500 max-w-md leading-relaxed text-sm md:text-base">
                Recibe novedades exclusivas, descuentos por lanzamiento y asesoría de obra directamente en tu bandeja de entrada.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Input 
                type="email" 
                placeholder="tu@correo.com" 
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-14 md:min-w-[320px] focus-visible:ring-primary shadow-sm transition-all rounded-xl"
              />
              <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all group/btn rounded-xl shadow-[0_4px_14px_0_rgba(var(--primary),0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary),0.3)] hover:-translate-y-0.5">
                Suscribirme
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Mobile Footer (ML Clone) */}
          <div className="md:hidden col-span-1 pt-4 pb-8 border-t border-slate-200">
            {/* 4x3 Category Grid */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-2 mb-8">
                {[
                    { icon: Car, label: "Autos" },
                    { icon: HomeIcon, label: "Inmuebles" },
                    { icon: Laptop, label: "Tecnología" },
                    { icon: Sofa, label: "Hogar y Muebles" },
                    { icon: Wrench, label: "Herramientas" },
                    { icon: Hammer, label: "Construcción" },
                    { icon: Dumbbell, label: "Deportes" },
                    { icon: Shirt, label: "Moda" },
                    { icon: Gamepad2, label: "Juegos" },
                    { icon: Watch, label: "Accesorios" },
                    { icon: Plus, label: "Más categorías" }
                ].map((cat, i) => (
                    <Link href="/collections/all" key={i} className="flex flex-col items-center gap-2 group cursor-pointer text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#ef7c1c]/10 group-hover:text-[#ef7c1c] transition-colors shadow-sm">
                            <cat.icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] leading-tight text-slate-500 font-medium px-1 max-w-[80px]">{cat.label}</span>
                    </Link>
                ))}
            </div>

            {/* Bottom Text Links */}
            <div className="flex flex-col border-t border-slate-200 pt-6 px-4">
                <div className="flex justify-between items-center mb-4">
                    <Link href="/cuenta" className="text-[14px] text-slate-700 font-medium flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-400" /> Mi Cuenta
                    </Link>
                    <Link href="/cuenta/compras" className="text-[14px] text-slate-700 font-medium flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-slate-400" /> Mis Compras
                    </Link>
                </div>
                <div className="flex justify-between items-center">
                    <Link href="/cuenta/favoritos" className="text-[14px] text-slate-700 font-medium flex items-center gap-2">
                        <Heart className="w-5 h-5 text-slate-400" /> Favoritos
                    </Link>
                    <Link href="/ayuda" className="text-[14px] text-slate-700 font-medium flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-slate-400" /> Ayuda
                    </Link>
                </div>
            </div>
          </div>

          {/* Desktop Links Grid */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="hidden md:block space-y-6">
              <h4 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-8">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-medium text-slate-500 hover:text-primary transition-colors relative group inline-flex items-center">
                      <span className="relative">
                        {link.name}
                        {/* Subrayado animado al estilo hover-slide */}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info (Visible on both Mobile and Desktop) */}
          <div className="col-span-1 space-y-6 pt-6 md:pt-0 border-t border-slate-200 md:border-t-0">
            <h4 className="text-sm font-bold text-slate-900 tracking-wider uppercase md:mb-8">Contacto</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex flex-shrink-0 items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-sm text-slate-900 font-semibold mb-1">Dirección</span>
                  <span className="text-sm font-medium text-slate-500 leading-relaxed">Av. Italia 4567<br/>Montevideo, Uruguay</span>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex flex-shrink-0 items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-900 font-semibold mb-1">Teléfono</span>
                  <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-primary">2619 0000</span>
                </div>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex flex-shrink-0 items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-900 font-semibold mb-1">Email</span>
                  <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-primary">ventas@comprahogar.com.uy</span>
                </div>
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

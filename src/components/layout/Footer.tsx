"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassButton } from "@/components/ui/glass-button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { PaymentMethodIcons } from "@/components/shared/PaymentMethodIcons";
import { MAIN_CATEGORIES, categoryHref } from "@/lib/constants/categories";

// Collection handles come from MAIN_CATEGORIES — the single source of truth
// shared with the header nav and the home shortcuts.
const FOOTER_LINKS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: "Categorías",
    // Show the first five main categories in the footer using their long names.
    links: MAIN_CATEGORIES.slice(0, 5).map((cat) => ({
      name: cat.longName,
      href: categoryHref(cat.handle),
    })),
  },
  {
    title: "Ayuda",
    links: [
      { name: "Envíos y entregas", href: "/envios-y-entregas" },
      { name: "Zonas de envío", href: "/zonas" },
      { name: "Cambios y devoluciones", href: "/devoluciones-y-garantias" },
      { name: "Términos y condiciones", href: "/terminos-y-condiciones" },
      { name: "Política de privacidad", href: "/politica-privacidad" },
    ],
  },
  {
    title: "CompraHogar",
    links: [
      { name: "Sobre nosotros", href: "/sobre-nosotros" },
      { name: "Mi cuenta", href: "/cuenta" },
      { name: "Mis pedidos", href: "/cuenta/mis-compras" },
    ],
  },
];

// Real contact info — update here when values change.
const CONTACT = {
  address: "Av. Italia 4567, Montevideo", // TODO: confirmar dirección real
  phone: { display: "2619 0000", tel: "+59826190000" }, // TODO: confirmar número real
  email: "ventas@comprahogar.com.uy",
  whatsapp: "59896244003",
};

// Social links — only rendered if href is set. Leave empty string to hide.
// TODO: completar con URLs reales de redes.
const SOCIAL = {
  instagram: "",
  facebook: "",
  linkedin: "",
};

export function Footer() {
  const [newsletterSent, setNewsletterSent] = useState(false);
  const hasAnySocial = Boolean(SOCIAL.instagram || SOCIAL.facebook || SOCIAL.linkedin);

  return (
    <footer className="w-full bg-slate-50 text-slate-600 border-t border-slate-200 mt-auto">
      <Container className="pt-10 md:pt-16">
        {/* Newsletter */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-primary p-5 md:p-10 lg:p-14 mb-10 md:mb-14">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-10 items-center">
            <div>
              <h3 className="text-xl md:text-3xl lg:text-[34px] font-bold tracking-tight text-white mb-1 md:mb-3">
                Recibí ofertas exclusivas
              </h3>
              <p className="text-white/75 text-[13px] md:text-base leading-snug">
                Novedades y descuentos directo a tu bandeja.
              </p>
            </div>
            {newsletterSent ? (
              <div className="flex items-center gap-2 text-white/95 bg-white/10 border border-white/20 rounded-xl px-4 py-3 w-full md:max-w-md md:ml-auto">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  ¡Gracias! Te mantendremos al tanto.
                </span>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
                  try {
                    const res = await fetch("/api/newsletter", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    if (res.ok) setNewsletterSent(true);
                  } catch {}
                }}
                className="flex flex-row gap-2 w-full md:justify-end"
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="tu@correo.com"
                  required
                  aria-label="Correo electrónico"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 md:h-14 md:min-w-[280px] lg:min-w-[340px] focus-visible:ring-white/30 rounded-xl flex-1 md:flex-none"
                />
                <GlassButton
                  type="submit"
                  variant="dark"
                  size="md"
                  className="h-11 md:h-14 px-5 md:px-8 shrink-0"
                >
                  <ArrowRight className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Suscribirme</span>
                </GlassButton>
              </form>
            )}
          </div>
        </div>

        {/* Navigation grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 mb-10 md:mb-14">
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-[12px] font-bold text-slate-900 tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] lg:text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-1 space-y-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
            <h4 className="text-[12px] font-bold text-slate-900 tracking-wider uppercase">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-[13px] text-slate-500">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <a href={`tel:${CONTACT.phone.tel}`} className="hover:text-primary transition-colors">
                  {CONTACT.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors break-all">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="flex flex-col items-center gap-3 mb-8 md:mb-10">
          <h4 className="text-[11px] font-bold text-slate-600 tracking-widest uppercase">
            Medios de pago
          </h4>
          <PaymentMethodIcons />
        </div>

        <Separator className="bg-slate-200 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-8 md:pb-10">
          {/* Social + trust badge */}
          <div className="flex items-center gap-3 order-2 md:order-1">
            {hasAnySocial && (
              <>
                {SOCIAL.instagram && (
                  <Link
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </Link>
                )}
                {SOCIAL.facebook && (
                  <Link
                    href={SOCIAL.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </Link>
                )}
                {SOCIAL.linkedin && (
                  <Link
                    href={SOCIAL.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                )}
                <div className="w-px h-5 bg-slate-200 mx-1" />
              </>
            )}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Compra 100% segura
            </div>
          </div>

          {/* Copyright */}
          <p className="text-[12px] text-slate-600 font-medium order-1 md:order-2">
            © {new Date().getFullYear()} CompraHogar · Uruguay
          </p>
        </div>
      </Container>
    </footer>
  );
}

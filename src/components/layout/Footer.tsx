import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone, ArrowRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-[#153f3a] text-white overflow-hidden border-t border-white/5 mt-auto flex flex-col pt-16 lg:pt-32 relative z-10">
            {/* Ambient Base Glow */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#21645d] to-transparent opacity-50 blur-3xl -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 flex flex-col z-20 w-full">
                {/* Top Section - Newsletter & Big Statement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 pb-16 lg:pb-32 border-b border-white/10">
                    <div className="flex flex-col">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black font-['Syne'] tracking-tighter uppercase leading-[0.9] text-white">
                            Fundaciones <span className="block text-[#f3843e] italic mt-2">Perfectas.</span>
                        </h2>
                        <p className="mt-8 max-w-md text-white/70 font-medium text-sm md:text-base leading-relaxed">
                            Equipamiento premium para construcción y hogar. Calidad, diseño y solidez institucional a tu alcance para todos tus proyectos de alta escala.
                        </p>
                    </div>

                    <div className="flex flex-col justify-end lg:pl-16">
                        <div className="flex flex-col gap-6">
                            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#f3843e]">
                                Especificaciones & Acceso Temprano a Novedades
                            </span>
                            <div className="relative group flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="INTRODUCE TU E-MAIL PARA ARQUITECTOS"
                                    className="w-full bg-transparent border-b-2 border-white/20 px-0 py-4 text-white placeholder:text-white/40 font-bold tracking-widest uppercase text-xs focus:outline-none focus:border-[#f3843e] transition-colors rounded-none"
                                />
                                <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/40 group-focus-within:text-[#f3843e] hover:text-white transition-colors hidden sm:flex">
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                                <button className="sm:hidden mt-4 w-full h-14 bg-[#f3843e] text-white hover:bg-[#e07534] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-xl transition-all">
                                    Ingresar Proyecto <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 lg:py-20 border-b border-white/10">
                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f3843e]">Catálogo Central</span>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/collections/obra-gruesa" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Materiales Obra Gruesa</Link></li>
                            <li><Link href="/collections/herramientas-y-maquinaria" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Herramientas Pesadas</Link></li>
                            <li><Link href="/collections/electricidad-e-iluminacion" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Sistemas Eléctricos</Link></li>
                            <li><Link href="/collections/sanitaria-y-griferia" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Redes Sanitarias</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f3843e]">Soporte & Logística</span>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/contact" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Centro de Contacto</Link></li>
                            <li><Link href="/shipping" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Status de Envíos Obra</Link></li>
                            <li><Link href="/faq" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Garantías & FAQ</Link></li>
                            <li><Link href="/returns" className="text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors">Retornos de Material</Link></li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f3843e]">Directorio</span>
                        <ul className="flex flex-col gap-4 text-white/70 text-sm font-bold tracking-wide">
                            <li className="flex items-center gap-3"><MapPin className="w-5 h-5 text-white/40" /> Centro de Distribución<br />Buenos Aires, AR</li>
                            <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-white/40" /> info@comprahogar.com</li>
                            <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-white/40" /> +54 11 1234 5678</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f3843e]">Ecosistema</span>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="#" className="group flex items-center gap-3 text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors"><Instagram className="w-5 h-5 text-white/40 group-hover:text-[#f3843e] transition-colors" /> Instagram</Link></li>
                            <li><Link href="#" className="group flex items-center gap-3 text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors"><Twitter className="w-5 h-5 text-white/40 group-hover:text-[#f3843e] transition-colors" /> Twitter/X</Link></li>
                            <li><Link href="#" className="group flex items-center gap-3 text-white/70 hover:text-white text-sm font-bold tracking-wide transition-colors"><Facebook className="w-5 h-5 text-white/40 group-hover:text-[#f3843e] transition-colors" /> Facebook</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Micro Footer Information */}
                <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} COMPRAHOGAR INC. <span className="hidden md:inline">TODOS LOS DERECHOS RESERVADOS.</span>
                    </p>
                    <div className="flex gap-6 text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">
                        <Link href="/terms" className="hover:text-white transition-colors">Términos Legales</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link>
                    </div>
                </div>
            </div>

            {/* Massive Architecture Branding */}
            <div className="w-full relative overflow-hidden flex items-end justify-center pointer-events-none opacity-[0.03] -mb-2 sm:-mb-6 md:-mb-12 lg:-mb-16 select-none mix-blend-screen h-24 sm:h-32 md:h-48 lg:h-64 mt-8">
                <span className="absolute bottom-0 text-[15vw] xl:text-[20vw] font-black font-['Syne'] leading-[0.75] text-white tracking-tighter whitespace-nowrap">
                    COMPRAHOGAR
                </span>
            </div>
        </footer>
    );
}

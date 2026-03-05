"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Building2, TrendingUp, Users } from "lucide-react";

export default function VenderPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="relative w-full h-[400px] md:h-[500px] bg-[#21645d] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80')] opacity-20 mix-blend-overlay bg-cover bg-center" />
                <div className="relative z-10 container mx-auto max-w-[1200px] h-full flex flex-col justify-center px-4 md:px-8">
                    <div className="max-w-2xl">
                        <span className="inline-block py-1 px-3 bg-[#f3843e] text-white text-[11px] font-bold uppercase tracking-wider rounded-sm mb-4">
                            CompraHogar Empresas
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            Soluciones integrales para constructoras y profesionales.
                        </h1>
                        <p className="text-lg text-white/90 mb-8 max-w-xl">
                            Accedé a precios mayoristas, líneas de crédito exclusivas y un ejecutivo de cuentas dedicado para tu próximo proyecto.
                        </p>
                        <Button className="bg-white text-[#21645d] hover:bg-slate-100 font-bold h-12 px-8 text-[16px]">
                            Solicitar contacto comercial
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-[#ebebeb]">
                <div className="container mx-auto max-w-[1200px] px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Potenciamos tu negocio</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Diseñamos un ecosistema pensado exclusivamente para agilizar las compras recurrentes y de alto volumen.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Precios Mayoristas</h3>
                            <p className="text-slate-600">Escala de descuentos por volumen y listas de precios especiales para compras recurrentes.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Crédito Corporativo</h3>
                            <p className="text-slate-600">Líneas de financiación a 30, 60 y 90 días con análisis crediticio en 48 horas hábiles.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-orange-50 text-[#f3843e] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Asesor Asignado</h3>
                            <p className="text-slate-600">Un ejecutivo de cuentas dedicado para resolver tus cotizaciones y coordinar logística de obra.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto max-w-[1000px] px-4 flex flex-col md:flex-row gap-12 items-center">

                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Dejanos tus datos y te llamamos.</h2>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <span className="text-slate-700">Cotizaciones formales en el día.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <span className="text-slate-700">Abastecimiento sincronizado con el avance de obra.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <span className="text-slate-700">Facturación unificada y cuenta corriente.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex-1 w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="razon-social">Razón Social</Label>
                                <Input id="razon-social" placeholder="Nombre de tu empresa" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rut">RUT</Label>
                                <Input id="rut" placeholder="RUT de la empresa" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email laboral</Label>
                                <Input id="email" type="email" placeholder="correo@empresa.com.uy" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tel">Teléfono</Label>
                                <Input id="tel" type="tel" placeholder="09X XXX XXX" required />
                            </div>
                            <Button className="w-full bg-[#f3843e] hover:bg-[#d97435] text-white font-bold h-12 mt-4">
                                Enviar Solicitud
                            </Button>
                        </form>
                    </div>

                </div>
            </section>

        </div>
    );
}

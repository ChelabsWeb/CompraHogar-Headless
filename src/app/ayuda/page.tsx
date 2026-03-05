"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Package, MapPin, CreditCard, ShieldCheck } from "lucide-react";

export default function AyudaPage() {
    return (
        <div className="min-h-screen bg-[#ebebeb] pb-16">

            {/* Help Header */}
            <div className="bg-[#21645d] h-[240px] flex flex-col items-center justify-center text-white px-4">
                <h1 className="text-3xl font-bold mb-6">¿Con qué podemos ayudarte?</h1>
                <div className="relative w-full max-w-2xl shadow-lg">
                    <input
                        type="text"
                        placeholder="Buscá en nuestro centro de ayuda..."
                        className="w-full h-14 pl-12 pr-4 rounded-md text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-4 top-4 text-slate-400 w-6 h-6" />
                </div>
            </div>

            {/* Main Categories */}
            <div className="container mx-auto max-w-4xl px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

                    <Link href="#" className="bg-white p-6 rounded-md shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Mis compras</h3>
                        <p className="text-sm text-slate-500 leading-tight">Seguimiento, cambios y devoluciones</p>
                    </Link>

                    <Link href="#" className="bg-white p-6 rounded-md shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Envíos</h3>
                        <p className="text-sm text-slate-500 leading-tight">Costos, tiempos y cobertura</p>
                    </Link>

                    <Link href="#" className="bg-white p-6 rounded-md shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Pagos</h3>
                        <p className="text-sm text-slate-500 leading-tight">Tarjetas, cuotas y facturación</p>
                    </Link>

                    <Link href="#" className="bg-white p-6 rounded-md shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-800">Seguridad</h3>
                        <p className="text-sm text-slate-500 leading-tight">Garantías y protección</p>
                    </Link>

                </div>

                {/* FAQ Section */}
                <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Preguntas Frecuentes</h2>
                <div className="bg-white rounded-md shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">

                    <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <span className="font-medium text-slate-800 group-hover:text-blue-600">¿Cómo hago un seguimiento de mi envío?</span>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <span className="font-medium text-slate-800 group-hover:text-blue-600">¿Cuáles son los medios de pago aceptados?</span>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <span className="font-medium text-slate-800 group-hover:text-blue-600">¿Tienen local físico para retirar?</span>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <span className="font-medium text-slate-800 group-hover:text-blue-600">Tengo un problema con un producto, ¿qué hago?</span>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>

                </div>
            </div>
        </div>
    );
}

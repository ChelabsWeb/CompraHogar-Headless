"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const MOCK_HISTORY = [
    { title: "Taladro Percutor Makita 710W", category: "Herramientas", handle: "taladro-makita", price: "$ 4.590", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop", viewedOn: "Hoy" },
    { title: "Kit Herramientas Manuales 109 Piezas", category: "Kits", handle: "kit-109", price: "$ 12.400", image: "https://images.unsplash.com/photo-1542617300-47daff7b1d9b?w=400&h=300&fit=crop", viewedOn: "Ayer" },
    { title: "Cinta Métrica Industrial 8m", category: "Medición", handle: "cinta-8m", price: "$ 890", image: "https://images.unsplash.com/photo-1520699049698-acd2fce18736?w=400&h=300&fit=crop", viewedOn: "Ayer" },
    { title: "Set Llaves Combinadas Profesionales", category: "Herramientas de Mano", handle: "set-llaves", price: "$ 2.100", image: "https://images.unsplash.com/photo-1498627883204-629a44f80c65?w=400&h=300&fit=crop", viewedOn: "Hace 2 días" },
    { title: "Pintura Látex Interior Blanca 20L", category: "Pinturas", handle: "latex-20l", price: "$ 3.990", image: "https://images.unsplash.com/photo-1562259929-b7e181d8d012?w=400&h=300&fit=crop", viewedOn: "Hace 4 días" },
    { title: "Rodillo Epoxi Anti Gota Pelo Corto", category: "Pintor", handle: "rodillo", price: "$ 450", image: "https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?w=400&h=300&fit=crop", viewedOn: "Hace 4 días" }
];

export default function HistorialPage() {
    return (
        <div className="min-h-screen bg-[#ebebeb] py-8">
            <div className="container mx-auto max-w-[1200px] px-4 md:px-0">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                    <h1 className="text-2xl font-bold text-slate-900">Tu historial</h1>
                    <Button variant="ghost" className="text-blue-500 hover:text-blue-700 font-medium">
                        Borrar tu historial
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {MOCK_HISTORY.map((product, idx) => (
                        <div key={idx} className="group bg-white rounded-md border border-slate-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer relative">

                            {/* Date Badge */}
                            <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm text-[11px] font-medium text-slate-600 shadow-sm border border-slate-100/50">
                                Visto {product.viewedOn.toLowerCase()}
                            </div>

                            <Link href={`/products/${product.handle}`} className="flex-1 flex flex-col outline-none">
                                {/* Image Container */}
                                <div className="relative w-full aspect-[4/3] bg-white border-b border-slate-100 p-4 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 max-h-full"
                                    />
                                </div>

                                {/* Information */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex items-start gap-1 mb-2">
                                        <span className="text-sm font-normal text-slate-800 mt-1">$</span>
                                        <span className="text-[24px] font-normal text-slate-800 leading-none">{product.price.split(' ')[1]}</span>
                                    </div>
                                    <h3 className="text-[14px] text-slate-500 font-normal leading-tight line-clamp-2 mt-auto group-hover:text-blue-500 transition-colors">
                                        {product.title}
                                    </h3>
                                </div>
                            </Link>

                            <Button variant="ghost" className="w-full text-[13px] font-semibold text-blue-500 border-t border-slate-100 rounded-none h-10 hover:bg-slate-50 hover:text-blue-600">
                                Ocultar
                            </Button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

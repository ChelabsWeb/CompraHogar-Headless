"use client";

import Link from "next/link";
import { ChevronRight, Package, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_ORDERS = [
    {
        id: "CH-10042",
        date: "28 Feb 2026",
        status: "Entregado",
        statusColor: "text-green-600 bg-green-50",
        total: "$ 4.590",
        items: [
            { title: "Taladro Percutor Makita 710W", qty: 1, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=100&h=100&fit=crop" }
        ]
    },
    {
        id: "CH-10021",
        date: "15 Ene 2026",
        status: "En preparación",
        statusColor: "text-amber-600 bg-amber-50",
        total: "$ 12.400",
        items: [
            { title: "Kit Herramientas Manuales 109 Piezas", qty: 1, image: "https://images.unsplash.com/photo-1542617300-47daff7b1d9b?w=100&h=100&fit=crop" },
            { title: "Cinta Métrica Industrial 8m", qty: 2, image: "https://images.unsplash.com/photo-1520699049698-acd2fce18736?w=100&h=100&fit=crop" }
        ]
    }
];

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-[#ebebeb] py-8">
            <div className="container mx-auto max-w-[1000px] px-4 md:px-0">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Mis Compras</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" className="text-sm h-9 bg-white">Todo</Button>
                        <Button variant="ghost" className="text-sm h-9 text-slate-500 hover:text-slate-900">Pendientes</Button>
                        <Button variant="ghost" className="text-sm h-9 text-slate-500 hover:text-slate-900">Entregados</Button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {MOCK_ORDERS.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Order Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[12px] text-slate-500 uppercase font-medium">Fecha</p>
                                        <p className="text-[14px] font-semibold text-slate-900">{order.date}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[12px] text-slate-500 uppercase font-medium">Total</p>
                                        <p className="text-[14px] font-semibold text-slate-900">{order.total}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[12px] text-slate-500 uppercase font-medium">Orden N°</p>
                                        <p className="text-[14px] font-medium text-blue-600">{order.id}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="hidden md:flex ml-4">
                                        Ver detalle
                                    </Button>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-6 py-5">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium mb-4 ${order.statusColor}`}>
                                    {order.status === "Entregado" ? <Package className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    {order.status}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex flex-col gap-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-md bg-white border border-slate-200 overflow-hidden shrink-0 relative">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-medium text-slate-900 line-clamp-1">{item.title}</p>
                                                    <p className="text-[13px] text-slate-500">Cantidad: {item.qty}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 min-w-[200px] shrink-0">
                                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm font-medium">
                                            Volver a comprar
                                        </Button>
                                        {order.status === "Entregado" ? (
                                            <Button variant="outline" className="w-full text-blue-500 border-none hover:bg-blue-50">
                                                Opinar sobre el producto
                                            </Button>
                                        ) : (
                                            <Button variant="outline" className="w-full text-blue-500 border-none hover:bg-blue-50">
                                                Seguir envío
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 mb-4">¿No ves una compra reciente?</p>
                    <Link href="/ayuda" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        Ir al Centro de Ayuda
                    </Link>
                </div>

            </div>
        </div>
    );
}

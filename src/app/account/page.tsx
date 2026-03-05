"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";

export default function AccountPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#ebebeb] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">

                {/* LOGIN SECTION */}
                <div className="flex-1 p-8 md:p-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ingresar a tu cuenta</h2>
                        <p className="text-sm text-slate-500">
                            Ingresá tus datos para ver tus compras, gestionar direcciones y acceder a beneficios exclusivos.
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email-login">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email-login"
                                    type="email"
                                    placeholder="tu-correo@ejemplo.com"
                                    className="pl-10 h-12 focus-visible:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password-login">Contraseña</Label>
                                <Link href="#" className="text-sm text-blue-500 hover:text-blue-700 font-medium">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password-login"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-12 focus-visible:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-[16px]">
                            Ingresar
                        </Button>
                    </form>
                </div>

                {/* DIVIDER */}
                <div className="hidden md:block w-[1px] bg-slate-100 my-8"></div>
                <div className="md:hidden h-[1px] w-full bg-slate-100 mx-8"></div>

                {/* REGISTER SECTION */}
                <div className="flex-1 p-8 md:p-12 bg-slate-50 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Crear cuenta</h2>
                        <p className="text-sm text-slate-500">
                            Si aún no tenés cuenta en CompraHogar, registrate ahora para una experiencia de compra rápida y segura.
                        </p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            Guardá tus direcciones para envíos ultra rápidos.
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            Accedé al historial completo de tus compras.
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-600">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            Recibí ofertas exclusivas para miembros.
                        </li>
                    </ul>

                    <Button variant="outline" className="w-full h-12 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium text-[16px] group">
                        Crear nueva cuenta
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        if (e.clientY <= 0 && !sessionStorage.getItem("exit-popup-shown")) {
            setIsVisible(true);
            sessionStorage.setItem("exit-popup-shown", "true");
        }
    }, []);

    useEffect(() => {
        // Don't show on mobile (no mouse leave) or if already dismissed
        if (typeof window === "undefined") return;
        if (sessionStorage.getItem("exit-popup-shown")) return;

        // Delay listener so it doesn't fire immediately
        const timer = setTimeout(() => {
            document.addEventListener("mouseleave", handleMouseLeave);
        }, 5000);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [handleMouseLeave]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            setIsSubmitted(true);
        } catch {
            // Silent fail — still show success to not frustrate user
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-300">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Close button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header banner */}
                <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                        <Gift className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        10% OFF en tu primera compra
                    </h2>
                    <p className="text-white/80 text-sm">
                        Suscribite y recibí tu código de descuento
                    </p>
                </div>

                {/* Form */}
                <div className="p-6">
                    {isSubmitted ? (
                        <div className="text-center py-4">
                            <div className="text-3xl mb-2">🎉</div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                ¡Listo! Revisá tu email
                            </h3>
                            <p className="text-sm text-slate-500">
                                Te enviamos tu código de descuento del 10%.
                            </p>
                            <Button
                                onClick={() => setIsVisible(false)}
                                className="mt-4 bg-primary hover:bg-primary/90 text-white"
                            >
                                Seguir comprando
                            </Button>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    required
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 text-sm"
                                >
                                    {isSubmitting ? "Enviando..." : "Quiero mi 10% OFF"}
                                </Button>
                            </form>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 mt-3 transition-colors"
                            >
                                No gracias, prefiero pagar precio completo
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

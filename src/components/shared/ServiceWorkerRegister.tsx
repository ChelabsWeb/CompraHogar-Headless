"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export function ServiceWorkerRegister() {
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;
        if (process.env.NODE_ENV !== "production") return;

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register("/sw.js", {
                    scope: "/",
                });

                // When a NEW SW is found while one is already controlling the page,
                // notify the user. First-time installs (controller === null) stay silent.
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener("statechange", () => {
                        if (
                            newWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            toast({
                                title: "Nueva versión disponible",
                                description: "Recargá la página para aplicar los cambios.",
                                variant: "info",
                            });
                        }
                    });
                });
            } catch (err) {
                console.warn("SW registration failed:", err);
            }
        };

        if (document.readyState === "complete") {
            register();
        } else {
            window.addEventListener("load", register, { once: true });
        }
    }, [toast]);

    return null;
}

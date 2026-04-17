"use client";

import { useState } from "react";
import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "./CompareProvider";

interface CompareButtonProps {
    productId: string;
    size?: "sm" | "md";
    className?: string;
}

export function CompareButton({
    productId,
    size = "sm",
    className = "",
}: CompareButtonProps) {
    const { toggle, has, isFull } = useCompare();
    const isActive = has(productId);
    const [shake, setShake] = useState(false);

    const sizeClasses = size === "sm" ? "h-8 w-8" : "h-11 w-11";
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isActive && isFull) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        toggle(productId);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={
                isActive ? "Quitar del comparador" : "Agregar al comparador"
            }
            aria-pressed={isActive}
            onClick={handleClick}
            className={`rounded-full ${sizeClasses} bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100/50 z-10 transition-all ${
                isActive
                    ? "text-[#21645d] hover:text-[#1a504a] bg-[#21645d]/10 border-[#21645d]/30"
                    : "text-slate-400 hover:text-[#21645d] hover:bg-[#21645d]/5"
            } ${shake ? "animate-shake" : ""} ${className}`}
        >
            <GitCompare
                className={`${iconSize} transition-all ${
                    isActive ? "scale-110" : ""
                }`}
            />
        </Button>
    );
}

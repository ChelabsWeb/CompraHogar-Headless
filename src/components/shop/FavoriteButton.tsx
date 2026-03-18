"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "./WishlistProvider";

interface FavoriteButtonProps {
    productId: string;
    size?: "sm" | "md";
    className?: string;
}

export function FavoriteButton({ productId, size = "sm", className = "" }: FavoriteButtonProps) {
    const { toggle, has } = useWishlist();
    const isFavorite = has(productId);

    const sizeClasses = size === "sm"
        ? "h-8 w-8"
        : "h-11 w-11";

    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(productId);
            }}
            className={`rounded-full ${sizeClasses} bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100/50 z-10 transition-all ${
                isFavorite
                    ? "text-red-500 hover:text-red-600 bg-red-50/90 border-red-200/50"
                    : "text-slate-400 hover:text-red-500 hover:bg-red-50/80"
            } ${className}`}
        >
            <Heart
                className={`${iconSize} transition-all ${
                    isFavorite ? "fill-red-500 text-red-500 scale-110" : ""
                }`}
            />
        </Button>
    );
}

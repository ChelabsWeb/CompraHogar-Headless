"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ShopifyMediaNode } from "@/lib/types";

interface ProductImageLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    media: { node: ShopifyMediaNode }[];
    activeIndex: number;
    onIndexChange: (index: number) => void;
    productTitle: string;
}

/**
 * Fullscreen lightbox for product images.
 *
 * - Esc closes, arrow keys navigate, click on backdrop closes.
 * - Click on image itself does nothing (so zoom gestures / selection work).
 * - Swipe left/right on mobile changes image.
 * - Navigation wraps (first ↔ last) consistent with the gallery below.
 * - Locks body scroll while open.
 * - Renders into document.body via portal so it escapes any transform/overflow
 *   parent that would otherwise clip the fullscreen overlay.
 */
export function ProductImageLightbox({
    isOpen,
    onClose,
    media,
    activeIndex,
    onIndexChange,
    productTitle,
}: ProductImageLightboxProps) {
    const count = media.length;

    const goPrev = useCallback(() => {
        if (count === 0) return;
        onIndexChange(activeIndex === 0 ? count - 1 : activeIndex - 1);
    }, [activeIndex, count, onIndexChange]);

    const goNext = useCallback(() => {
        if (count === 0) return;
        onIndexChange((activeIndex + 1) % count);
    }, [activeIndex, count, onIndexChange]);

    // Keyboard navigation (Esc + arrows) — only while open.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft") goPrev();
            else if (e.key === "ArrowRight") goNext();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose, goPrev, goNext]);

    // Lock body scroll while open.
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // Swipe detection (mobile).
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const onTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        touchStartRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        const start = touchStartRef.current;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        // Horizontal swipe only; ignore if mostly vertical (likely scroll attempt).
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) goPrev();
            else goNext();
        }
        touchStartRef.current = null;
    };

    if (typeof document === "undefined") return null;

    const activeMedia = media[activeIndex]?.node;
    const imageUrl = activeMedia?.image?.url || activeMedia?.previewImage?.url;
    const alt = activeMedia?.alt || activeMedia?.previewImage?.altText || productTitle;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
                    onClick={onClose}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Imagen ampliada: ${productTitle}`}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        aria-label="Cerrar"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Counter */}
                    {count > 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full pointer-events-none">
                            {activeIndex + 1} / {count}
                        </div>
                    )}

                    {/* Prev / Next — desktop only (mobile uses swipe) */}
                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                aria-label="Imagen anterior"
                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                aria-label="Imagen siguiente"
                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Main image — stop click propagation so clicking the image doesn't close */}
                    {imageUrl && (
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full h-full max-w-[min(1400px,95vw)] max-h-[90vh] mx-auto flex items-center justify-center px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={imageUrl}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="95vw"
                                priority
                            />
                        </motion.div>
                    )}

                    {/* Thumbnail strip at the bottom — desktop only for now */}
                    {count > 1 && (
                        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-10 gap-2 max-w-[90vw] overflow-x-auto no-scrollbar px-2">
                            {media.map(({ node }, i) => {
                                const thumb = node.previewImage?.url || node.image?.url;
                                if (!thumb) return null;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onIndexChange(i); }}
                                        aria-label={`Ver imagen ${i + 1}`}
                                        className={`relative w-14 h-14 rounded-md overflow-hidden shrink-0 transition-all ${
                                            i === activeIndex
                                                ? "ring-2 ring-white opacity-100"
                                                : "opacity-50 hover:opacity-80"
                                        }`}
                                    >
                                        <Image
                                            src={thumb}
                                            alt={node.alt || `Vista ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

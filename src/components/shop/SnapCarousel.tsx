"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SnapCarouselProps {
    children: React.ReactNode;
    /** Extra classes for the scrollable track (gap, padding, negative margins, etc.). */
    trackClassName?: string;
    ariaLabel?: string;
}

/**
 * Horizontally-scrolling snap carousel with desktop prev/next arrows.
 *
 * - Arrows are conditional: only rendered when there's scroll available in
 *   that direction. This avoids disabled buttons the user can click in vain.
 * - Arrows are desktop-only (lg+). On mobile users swipe — surfacing an arrow
 *   UI on touch screens fights the natural interaction.
 * - Each page-step moves ~85% of the viewport width, which feels less jarring
 *   than snapping one card at a time and is predictable regardless of card
 *   width.
 * - Uses a ResizeObserver so the arrow visibility re-evaluates when the
 *   container width changes (e.g. sidebar collapse, mobile rotation).
 */
export function SnapCarousel({ children, trackClassName, ariaLabel }: SnapCarouselProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        // 1px tolerance for sub-pixel rounding at the edges.
        setCanPrev(el.scrollLeft > 1);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    useEffect(() => {
        updateArrows();
        const el = trackRef.current;
        if (!el) return;
        const observer = new ResizeObserver(updateArrows);
        observer.observe(el);
        return () => observer.disconnect();
    }, [updateArrows]);

    const scrollPage = (direction: "prev" | "next") => {
        const el = trackRef.current;
        if (!el) return;
        const delta = el.clientWidth * 0.85 * (direction === "prev" ? -1 : 1);
        el.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <div className="relative group/snap-carousel">
            <div
                ref={trackRef}
                className={cn(
                    "flex overflow-x-auto snap-x snap-mandatory no-scrollbar",
                    trackClassName
                )}
                onScroll={updateArrows}
                aria-label={ariaLabel}
            >
                {children}
            </div>

            {canPrev && (
                <button
                    type="button"
                    aria-label="Anterior"
                    onClick={() => scrollPage("prev")}
                    className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {canNext && (
                <button
                    type="button"
                    aria-label="Siguiente"
                    onClick={() => scrollPage("next")}
                    className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}

"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Loader2, ArrowDown } from "lucide-react";

const THRESHOLD_PX = 70;       // distance needed to arm a refresh
const MAX_PULL_PX = 110;       // visual cap so the indicator doesn't fly off
const DAMPING = 0.5;           // resistance factor (lower = harder pull)
const MIN_REFRESH_DURATION_MS = 600; // minimum spinner time so feedback feels real

interface PullToRefreshProps {
    /**
     * Callback fired when the user releases past the threshold. May return a
     * Promise — the spinner stays visible until it resolves (with a 600ms floor).
     */
    onRefresh: () => void | Promise<void>;
    children: ReactNode;
    /** Defaults to true. Pass false to disable (e.g. on pages where it interferes). */
    enabled?: boolean;
}

function isAnyDrawerOpen() {
    return Boolean(
        document.querySelector('[data-vaul-drawer]') ||
        document.querySelector('[role="dialog"][data-state="open"]')
    );
}

export function PullToRefresh({ onRefresh, children, enabled = true }: PullToRefreshProps) {
    const [pull, setPull] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // Refs avoid stale-closure issues inside the global touch listeners
    const startY = useRef<number | null>(null);
    const currentPull = useRef(0);
    const refreshingRef = useRef(false);
    const onRefreshRef = useRef(onRefresh);

    useEffect(() => {
        onRefreshRef.current = onRefresh;
    }, [onRefresh]);

    useEffect(() => {
        refreshingRef.current = refreshing;
    }, [refreshing]);

    useEffect(() => {
        if (!enabled) return;
        if (typeof window === "undefined") return;
        // Mobile/touch viewports only. Desktop pointer users don't expect this gesture.
        if (!window.matchMedia("(max-width: 768px)").matches) return;

        const onTouchStart = (e: TouchEvent) => {
            if (window.scrollY > 2) return;
            if (refreshingRef.current) return;
            if (isAnyDrawerOpen()) return;
            startY.current = e.touches[0].clientY;
            currentPull.current = 0;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (startY.current === null) return;
            const delta = e.touches[0].clientY - startY.current;
            if (delta > 0) {
                const damped = Math.min(MAX_PULL_PX, delta * DAMPING);
                currentPull.current = damped;
                setPull(damped);
            } else {
                // User started pulling but then went up — abort.
                startY.current = null;
                currentPull.current = 0;
                setPull(0);
            }
        };

        const onTouchEnd = async () => {
            if (startY.current === null) return;
            startY.current = null;
            const finalPull = currentPull.current;
            currentPull.current = 0;

            if (finalPull >= THRESHOLD_PX) {
                setRefreshing(true);
                setPull(THRESHOLD_PX);
                const start = Date.now();
                try {
                    await onRefreshRef.current();
                } catch (err) {
                    console.error("Pull-to-refresh handler failed:", err);
                }
                const elapsed = Date.now() - start;
                if (elapsed < MIN_REFRESH_DURATION_MS) {
                    await new Promise((r) =>
                        setTimeout(r, MIN_REFRESH_DURATION_MS - elapsed)
                    );
                }
                setRefreshing(false);
                setPull(0);
            } else {
                setPull(0);
            }
        };

        document.addEventListener("touchstart", onTouchStart, { passive: true });
        document.addEventListener("touchmove", onTouchMove, { passive: true });
        document.addEventListener("touchend", onTouchEnd, { passive: true });
        document.addEventListener("touchcancel", onTouchEnd, { passive: true });

        return () => {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            document.removeEventListener("touchcancel", onTouchEnd);
        };
    }, [enabled]);

    const showIndicator = pull > 0 || refreshing;
    const armed = pull >= THRESHOLD_PX || refreshing;

    return (
        <>
            {enabled && (
                <div
                    className="fixed top-safe left-0 right-0 z-[55] flex justify-center pointer-events-none transition-opacity duration-150"
                    style={{
                        transform: `translateY(${pull}px)`,
                        opacity: showIndicator ? 1 : 0,
                    }}
                    aria-hidden={!refreshing}
                    aria-live="polite"
                >
                    <div className="mt-4 bg-white rounded-full shadow-md border border-slate-200 px-4 py-2 flex items-center gap-2">
                        {refreshing ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                            <ArrowDown
                                className="w-4 h-4 text-slate-600 transition-transform duration-150"
                                style={{ transform: `rotate(${armed ? 180 : 0}deg)` }}
                            />
                        )}
                        <span className="text-xs font-medium text-slate-700">
                            {refreshing
                                ? "Actualizando…"
                                : armed
                                ? "Soltá para actualizar"
                                : "Tirá para actualizar"}
                        </span>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}

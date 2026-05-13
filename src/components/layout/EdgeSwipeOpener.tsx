"use client";

import { useEffect } from "react";

const EDGE_ZONE_PX = 96;
const MIN_HORIZONTAL_PX = 60;
const MAX_VERTICAL_PX = 40;

interface EdgeSwipeOpenerProps {
  onOpen: () => void;
}

export function EdgeSwipeOpener({ onOpen }: EdgeSwipeOpenerProps) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let armed = false;

    const isAnyDrawerOpen = () => {
      // Vaul exposes [data-vaul-drawer] when its drawer is mounted.
      // Radix dialogs expose [role="dialog"][data-state="open"].
      return Boolean(
        document.querySelector('[data-vaul-drawer]') ||
          document.querySelector('[role="dialog"][data-state="open"]')
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isAnyDrawerOpen()) return;
      const t = e.touches[0];
      if (!t) return;
      if (t.clientX <= EDGE_ZONE_PX) {
        startX = t.clientX;
        startY = t.clientY;
        armed = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!armed) return;
      const t = e.touches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dx >= MIN_HORIZONTAL_PX && dy <= MAX_VERTICAL_PX) {
        armed = false;
        onOpen();
      }
    };

    const onTouchEnd = () => { armed = false; };

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
  }, [onOpen]);

  return null;
}

"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * App Router `template.tsx` re-renders on every navigation (unlike `layout.tsx`
 * which persists). Wrapping children in a `motion.div` gives every route a
 * subtle fade-up on enter. Honours `prefers-reduced-motion`: when set, the
 * transition collapses to a near-instant opacity flicker with no Y movement.
 */
export default function Template({ children }: { children: React.ReactNode }) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.05 }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

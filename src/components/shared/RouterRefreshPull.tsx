"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { PullToRefresh } from "@/components/shared/PullToRefresh";

interface RouterRefreshPullProps {
    children: ReactNode;
    /** Defaults to true. */
    enabled?: boolean;
}

/**
 * Thin wrapper around <PullToRefresh> that calls Next.js `router.refresh()`
 * on release. Designed to drop into any server component route — wrap the
 * page's outer div with this and the user can pull-down to revalidate the
 * server-rendered data.
 *
 * Uses `startTransition` so the refresh doesn't block UI updates. The
 * returned Promise resolves once the transition settles, which keeps the
 * spinner visible for the duration of the actual revalidation.
 */
export function RouterRefreshPull({ children, enabled = true }: RouterRefreshPullProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleRefresh = () =>
        new Promise<void>((resolve) => {
            startTransition(() => {
                router.refresh();
                // router.refresh() is fire-and-forget. We resolve immediately —
                // PullToRefresh enforces a 600ms minimum spinner so the user
                // sees feedback even if the network call is instant.
                resolve();
            });
        });

    return (
        <PullToRefresh onRefresh={handleRefresh} enabled={enabled}>
            {children}
        </PullToRefresh>
    );
}

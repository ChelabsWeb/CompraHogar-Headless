"use client";

import { useEffect } from "react";
import { trackProductView } from "@/components/shop/RecentlyViewed";

interface ProductViewTrackerProps {
    product: {
        id: string;
        handle: string;
        title: string;
        price: number;
        image?: string;
        imageAlt?: string;
    };
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
    // Solo re-trackeamos cuando cambia el producto (id), no en cada re-render del padre.
    useEffect(() => {
        trackProductView(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    return null;
}

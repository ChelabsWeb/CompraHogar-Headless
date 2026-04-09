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
    useEffect(() => {
        trackProductView(product);
    }, [product.id]);

    return null;
}

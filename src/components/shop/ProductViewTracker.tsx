"use client";

import { useEffect } from "react";
import { trackProductView } from "@/components/shop/RecentlyViewed";

interface ProductViewTrackerProps {
  product: {
    id: string;
  };
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  useEffect(() => {
    trackProductView(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}

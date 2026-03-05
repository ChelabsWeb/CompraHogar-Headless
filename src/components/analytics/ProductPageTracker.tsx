'use client';

import { useEffect } from 'react';
import { pushDatalayerEvent, AnalyticsItem } from '@/lib/analytics';

export function ProductPageTracker({ product }: { product: AnalyticsItem }) {
  
  // Efecto montado al visitar y renderizar por primera vez la página del producto
  useEffect(() => {
    pushDatalayerEvent({
      event: 'view_item',
      ecommerce: {
        currency: product.currency || 'USD',
        value: product.price,
        items: [{
          ...product,
          quantity: 1
        }]
      }
    });
  }, [product]);

  return null; // Componente renderless que opera tras bambalinas
}

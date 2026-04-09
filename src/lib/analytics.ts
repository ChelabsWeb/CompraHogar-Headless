// 1. Interfaces Estrictas (GA4 E-commerce Standard)
export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_variant?: string;
  currency?: string;
}

export interface ViewItemEvent {
  event: 'view_item';
  ecommerce: {
    currency: string;
    value: number;
    items: AnalyticsItem[];
  };
}

export interface AddToCartEvent {
  event: 'add_to_cart';
  ecommerce: {
    currency: string;
    value: number;
    items: AnalyticsItem[];
  };
}

// Unión de tipos permitidos en la capa de comercio
export type EcommerceEventPayload = ViewItemEvent | AddToCartEvent;

// Extendemos globalmente el Objeto Window para soportar GTM y Meta Pixel
declare global {
  interface Window {
    dataLayer: any[];
    fbq?: (...args: any[]) => void;
  }
}

// 2. Función Proxy Preventiva
export function pushDatalayerEvent(payload: EcommerceEventPayload): void {
  // Blindaje SSR: Impedir ejecución en Server Components
  if (typeof window === 'undefined') return;

  // Inicialización segura por si el snippet de GTM no ha cargado aún
  window.dataLayer = window.dataLayer || [];

  // Best Practice GA4: Limpiar el objeto ecommerce para evitar herencia de arrays pasados
  window.dataLayer.push({ ecommerce: null }); 
  
  // Irrogar el nuevo payload capturable por el Trigger de GTM
  window.dataLayer.push(payload);

  // Meta Pixel: enviar eventos equivalentes
  if (typeof window.fbq === 'function') {
    if (payload.event === 'view_item') {
      window.fbq('track', 'ViewContent', {
        content_ids: payload.ecommerce.items.map(i => i.item_id),
        content_type: 'product',
        value: payload.ecommerce.value,
        currency: payload.ecommerce.currency,
      });
    } else if (payload.event === 'add_to_cart') {
      window.fbq('track', 'AddToCart', {
        content_ids: payload.ecommerce.items.map(i => i.item_id),
        content_type: 'product',
        value: payload.ecommerce.value,
        currency: payload.ecommerce.currency,
      });
    }
  }
}

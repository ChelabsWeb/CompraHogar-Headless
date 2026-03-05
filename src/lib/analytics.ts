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

// Extendemos globalmente el Objeto Window para soportar GTM
declare global {
  interface Window {
    dataLayer: any[];
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
}

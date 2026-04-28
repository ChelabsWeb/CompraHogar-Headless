/**
 * Main category catalog — the single source of truth used by the header nav,
 * home shortcuts and footer links.
 *
 * Each entry carries both a `shortName` (header nav bar, home bubbles) and a
 * `longName` (footer, breadcrumbs, SEO copy) because those surfaces benefit
 * from different copy density. Adding or removing a category? Edit this list
 * and every consumer picks it up.
 *
 * `handle` must match a real Shopify collection slug — mismatches produce 404s.
 */
export interface MainCategory {
  /** Short label for tight spaces (header nav, home bubbles). */
  shortName: string;
  /** Long-form label for more breathable surfaces (footer, breadcrumbs). */
  longName: string;
  /** Shopify collection handle — must match the real slug in the store. */
  handle: string;
  /** Emoji shown as fallback when no category image is available. */
  icon: string;
  /**
   * Asset key for the home category bubble crossfade animation.
   * Resolves to /public/categories/{imageKey}-off.jpg and -on.jpg.
   * Kept short on purpose so the asset names don't drift if the
   * Shopify handle ever gets renamed.
   */
  imageKey: string;
}

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    shortName: "Obra gruesa",
    longName: "Obra gruesa",
    handle: "obra-gruesa",
    icon: "🏗️",
    imageKey: "obra-gruesa",
  },
  {
    shortName: "Herramientas",
    longName: "Herramientas y maquinaria",
    handle: "herramientas-y-maquinaria",
    icon: "🛠️",
    imageKey: "herramientas",
  },
  {
    shortName: "Electricidad",
    longName: "Electricidad e iluminación",
    handle: "electricidad-e-iluminacion",
    icon: "⚡",
    imageKey: "electricidad",
  },
  {
    shortName: "Sanitaria",
    longName: "Sanitaria y grifería",
    handle: "sanitaria-y-griferia",
    icon: "🚿",
    imageKey: "sanitaria",
  },
  {
    shortName: "Pinturas",
    longName: "Pinturas y acabados",
    handle: "pinturas-y-acabados",
    icon: "🎨",
    imageKey: "pinturas",
  },
  {
    shortName: "Decoración",
    longName: "Hogar y decoración",
    handle: "hogar-y-decoracion",
    icon: "🛋️",
    imageKey: "decoracion",
  },
  {
    shortName: "Servicios",
    longName: "Servicios y alquileres",
    handle: "servicios-y-alquileres",
    icon: "🔧",
    imageKey: "servicios",
  },
];

/** Shortcut to build a collection URL from a handle. */
export const categoryHref = (handle: string) => `/collections/${handle}`;

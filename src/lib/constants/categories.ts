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
  /** Emoji shown in the home page category shortcuts row. */
  icon: string;
}

export const MAIN_CATEGORIES: MainCategory[] = [
  {
    shortName: "Obra gruesa",
    longName: "Obra gruesa",
    handle: "obra-gruesa",
    icon: "🏗️",
  },
  {
    shortName: "Herramientas",
    longName: "Herramientas y maquinaria",
    handle: "herramientas-y-maquinaria",
    icon: "🛠️",
  },
  {
    shortName: "Electricidad",
    longName: "Electricidad e iluminación",
    handle: "electricidad-e-iluminacion",
    icon: "⚡",
  },
  {
    shortName: "Sanitaria",
    longName: "Sanitaria y grifería",
    handle: "sanitaria-y-griferia",
    icon: "🚿",
  },
  {
    shortName: "Pinturas",
    longName: "Pinturas y acabados",
    handle: "pinturas-y-acabados",
    icon: "🎨",
  },
  {
    shortName: "Decoración",
    longName: "Hogar y decoración",
    handle: "hogar-y-decoracion",
    icon: "🛋️",
  },
  {
    shortName: "Servicios",
    longName: "Servicios y alquileres",
    handle: "servicios-y-alquileres",
    icon: "🔧",
  },
];

/** Shortcut to build a collection URL from a handle. */
export const categoryHref = (handle: string) => `/collections/${handle}`;

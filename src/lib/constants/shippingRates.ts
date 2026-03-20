export const FREE_SHIPPING_THRESHOLD = 4000;

export const SHIPPING_ZONES: Record<string, { rate: number; estimate: string }> = {
  "Montevideo": { rate: 250, estimate: "1-2 d\u00edas h\u00e1biles" },
  "Canelones": { rate: 350, estimate: "2-3 d\u00edas h\u00e1biles" },
  "Maldonado": { rate: 450, estimate: "3-5 d\u00edas h\u00e1biles" },
  "Colonia": { rate: 450, estimate: "3-5 d\u00edas h\u00e1biles" },
  "San Jos\u00e9": { rate: 450, estimate: "3-5 d\u00edas h\u00e1biles" },
  "Florida": { rate: 450, estimate: "3-5 d\u00edas h\u00e1biles" },
  "Artigas": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Cerro Largo": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Durazno": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Flores": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Lavalleja": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Paysand\u00fa": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "R\u00edo Negro": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Rivera": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Rocha": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Salto": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Soriano": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Tacuaremb\u00f3": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
  "Treinta y Tres": { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" },
};

export function getShippingRate(department: string | null, cartTotal: number): { rate: number; estimate: string } | null {
  if (!department) return null;
  if (cartTotal >= FREE_SHIPPING_THRESHOLD) return { rate: 0, estimate: "Env\u00edo gratis" };
  return SHIPPING_ZONES[department] || { rate: 550, estimate: "4-7 d\u00edas h\u00e1biles" };
}

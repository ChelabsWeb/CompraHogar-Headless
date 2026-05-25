/**
 * Fuente única para saber si el checkout (pago online) está habilitado.
 *
 * Fail-closed: si NEXT_PUBLIC_CHECKOUT_ENABLED no es exactamente "true",
 * el pago está APAGADO. Es intencional — nunca queremos cobrar si no
 * estamos listos para cumplir la venta.
 *
 * Para habilitar ventas online: setear NEXT_PUBLIC_CHECKOUT_ENABLED=true
 * en el entorno y redeploy. Cero cambios de código.
 */
export function isCheckoutEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";
}

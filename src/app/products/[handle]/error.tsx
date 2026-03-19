"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function ProductError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorFallback
      title="No pudimos cargar este producto"
      description="Ocurrió un error al intentar cargar el producto. Por favor intentá de nuevo."
      reset={reset}
    />
  );
}

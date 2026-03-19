"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function CuentaError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorFallback
      title="No pudimos cargar tu cuenta"
      description="Ocurrió un error al intentar cargar tu cuenta. Por favor intentá de nuevo."
      reset={reset}
    />
  );
}

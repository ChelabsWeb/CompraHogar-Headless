"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorFallback
      title="Algo salió mal"
      description="Ocurrió un error inesperado. Por favor intentá de nuevo."
      reset={reset}
    />
  );
}

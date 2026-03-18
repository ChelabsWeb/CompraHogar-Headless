"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function CollectionError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorFallback
      title="No pudimos cargar esta colección"
      description="Ocurrió un error al intentar cargar la colección. Por favor intentá de nuevo."
      reset={reset}
    />
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginCustomer } from "./actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await loginCustomer(formData);

    // If redirect() was called server-side, this code won't execute.
    // We only reach here if the action returned an error response.
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectParam} />
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
            Correo electrónico
          </label>
          <Input 
            id="email"
            name="email"
            type="email" 
            placeholder="tumail@ejemplo.com"
            iconLeft={<Mail className="w-5 h-5" />}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Contraseña
            </label>
            <Link 
              href="/olvide-password" 
              className="text-xs text-primary font-medium hover:underline"
              tabIndex={-1}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input 
            id="password"
            name="password"
            type="password" 
            placeholder="••••••••"
            iconLeft={<Lock className="w-5 h-5" />}
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-2" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          ¿No tienes una cuenta?{" "}
          <Link href="/registro" className="text-primary font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </form>
  );
}

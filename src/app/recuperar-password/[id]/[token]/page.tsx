"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "./actions";
import Link from "next/link";
import { KeyRound, ArrowRight, Loader2, Lock } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage({
  params,
}: {
  params: { id: string; token: string };
}) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

  return (
    <AuthShell
      title="Restablecer contraseña"
      description="Ingresá tu nueva contraseña para acceder a tu cuenta."
      icon={<KeyRound className="w-6 h-6 text-primary" />}
      footer={
        <>
          ¿La recordaste?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Iniciá sesión
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-5">
        {/* URL params — reset token identifiers */}
        <input type="hidden" name="id" value={params.id} />
        <input type="hidden" name="token" value={params.token} />

        {state?.error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 text-center">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nueva contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={5}
            placeholder="Mín. 5 caracteres"
            iconLeft={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
            Confirmar contraseña
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={5}
            placeholder="Repetí tu contraseña"
            iconLeft={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              Guardar contraseña
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

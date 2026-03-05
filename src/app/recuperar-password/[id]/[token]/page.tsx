"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "./actions";
import Link from "next/link";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";

export default function ResetPasswordPage({
  params,
}: {
  params: { id: string; token: string };
}) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Restablecer Contraseña
          </h1>
          <p className="text-slate-500 text-center mt-2">
            Ingresa tu nueva contraseña para acceder a tu cuenta.
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          {/* Hidden fields for URL parameters */}
          <input type="hidden" name="id" value={params.id} />
          <input type="hidden" name="token" value={params.token} />

          {state?.error && (
            <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 text-center">
              {state.error}
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700 block"
            >
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              minLength={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              placeholder="Min. 5 caracteres"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700 block"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              minLength={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              placeholder="Ingresa la misma contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                Guardar Contraseña
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          ¿Recordaste tu contraseña?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

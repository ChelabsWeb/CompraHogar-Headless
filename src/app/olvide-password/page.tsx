"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "./actions";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        
        {state?.success ? (
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">
               Revisa tu correo
             </h1>
             <p className="text-slate-600 text-center mb-8">
               {state.success}
             </p>
             <Link 
               href="/login"
               className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
             >
               Volver a Iniciar Sesión
             </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 text-center">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-slate-500 text-center mt-2">
                Ingresa tu correo electrónico y te enviaremos un enlace para que puedas recuperar el acceso.
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              
              {state?.error && (
                <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 text-center">
                  {state.error}
                </div>
              )}

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 block"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  placeholder="ejemplo@correo.com"
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
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Instrucciones
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
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerRecoverAction, type RecoverActionState } from "./actions";

const initialState: RecoverActionState = {
  success: false,
};

export default function RecoverPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    customerRecoverAction,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col gap-6 items-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Correo enviado</h2>
          <p className="text-slate-600 mb-6 max-w-sm">
            {state.message}
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Iniciar Sesión
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
            Correo electrónico
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Ingresa el correo electrónico asociado a tu cuenta y te enviaremos las instrucciones para restablecer tu contraseña.
          </p>
          <Input 
            id="email"
            name="email"
            type="email" 
            placeholder="tumail@ejemplo.com"
            iconLeft={<Mail className="w-5 h-5" />}
            required
            autoComplete="email"
            disabled={isPending}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-2" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando enlace...
          </>
        ) : (
          "Restablecer contraseña"
        )}
      </Button>

      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-slate-500 hover:text-primary font-medium flex items-center justify-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a iniciar sesión
        </Link>
      </div>
    </form>
  );
}

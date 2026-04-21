"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "./actions";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  if (state?.success) {
    return (
      <AuthShell
        title="Revisá tu correo"
        description={state.success}
        icon={<CheckCircle2 className="w-6 h-6 text-primary" />}
      >
        <Link
          href="/login"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
        >
          Volver a iniciar sesión
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="¿Olvidaste tu contraseña?"
      description="Ingresá tu correo electrónico y te enviaremos un enlace para recuperar el acceso."
      icon={<Mail className="w-6 h-6 text-primary" />}
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
        {state?.error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 text-center">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Correo electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tumail@ejemplo.com"
            iconLeft={<Mail className="w-5 h-5" />}
          />
        </div>

        <Button type="submit" size="lg" className="w-full mt-2" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Enviar instrucciones
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}

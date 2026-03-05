"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerCustomer } from "./actions";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    
    if (password.length < 5) {
      setError("La contraseña de Shopify debe tener al menos 5 caracteres.");
      setIsPending(false);
      return;
    }

    const result = await registerCustomer(formData);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      if(result.warning) {
        // Registration success, but auto-login failed.
        router.push("/login");
      } else {
        router.push("/cuenta");
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="firstName">
            Nombre
          </label>
          <Input 
            id="firstName"
            name="firstName"
            type="text" 
            placeholder="Juan"
            iconLeft={<User className="w-4 h-4" />}
            required
            autoComplete="given-name"
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="lastName">
            Apellido
          </label>
          <Input 
            id="lastName"
            name="lastName"
            type="text" 
            placeholder="Pérez"
            required
            autoComplete="family-name"
          />
        </div>
      </div>

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
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
            Contraseña
          </label>
          <Input 
            id="password"
            name="password"
            type="password" 
            placeholder="••••••••"
            iconLeft={<Lock className="w-5 h-5" />}
            required
            minLength={5}
            autoComplete="new-password"
          />
          <p className="text-[11px] text-slate-500 mt-1">Mínimo 5 caracteres.</p>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-2" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Registrarme"
        )}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </form>
  );
}

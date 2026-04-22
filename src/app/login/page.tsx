import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./login-form";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata = {
  title: "Iniciar sesión | CompraHogar",
  description: "Ingresá a tu cuenta para ver el estado de tus pedidos y guardar tus direcciones.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Ingresá a tu cuenta"
      description="Revisá tus compras y guardá tus direcciones."
      footer={
        <>
          ¿Todavía no tenés cuenta?{" "}
          <Link href="/registro" className="text-primary font-semibold hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-slate-500">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

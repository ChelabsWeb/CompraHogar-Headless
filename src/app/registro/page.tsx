import { Suspense } from "react";
import Link from "next/link";
import RegisterForm from "./register-form";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata = {
  title: "Crear cuenta | CompraHogar",
  description: "Creá tu cuenta en CompraHogar para acceder a beneficios, seguimiento de pedidos y más.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Creá tu cuenta"
      description="Comprá más rápido y llevá el control de tus pedidos."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Iniciá sesión
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-slate-500">Cargando...</div>}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}

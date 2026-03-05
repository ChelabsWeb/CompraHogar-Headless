import { Suspense } from "react";
import RegisterForm from "./register-form";

export const metadata = {
  title: "Regístrate | CompraHogar",
  description: "Crea tu cuenta en CompraHogar para acceder a beneficios, seguimiento de pedidos y más.",
};

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Creá tu cuenta</h1>
          <p className="text-sm text-slate-500">
            Comprá más rápido y llevá el control de tus pedidos.
          </p>
        </div>
        
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Cargando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

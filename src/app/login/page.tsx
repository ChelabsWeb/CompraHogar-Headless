import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Iniciar Sesión | CompraHogar",
  description: "Ingresa a tu cuenta para ver el estado de tus pedidos y guardar tus direcciones.",
};

export default function LoginPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Ingresa a tu cuenta</h1>
          <p className="text-sm text-slate-500">
            Revisá tus compras y guardá tus direcciones.
          </p>
        </div>
        
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

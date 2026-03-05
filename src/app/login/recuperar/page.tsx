import type { Metadata } from "next";
import RecoverPasswordForm from "./recover-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña | CompraHogar",
  description: "Restablece la contraseña de tu cuenta CompraHogar.",
};

export default function RecoverPasswordPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-4 min-h-[70vh] bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Recuperar contraseña</h1>
        </div>
        <RecoverPasswordForm />
      </div>
    </div>
  );
}

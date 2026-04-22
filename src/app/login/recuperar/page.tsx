import type { Metadata } from "next";
import { Mail } from "lucide-react";
import RecoverPasswordForm from "./recover-form";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata: Metadata = {
  title: "Recuperar contraseña | CompraHogar",
  description: "Restablecé la contraseña de tu cuenta CompraHogar.",
};

// NOTE: this route duplicates /olvide-password. Both end up calling Shopify's
// customerRecover, differ only in UI wording. Consider consolidating in a
// follow-up cleanup — the link from login-form.tsx points to /olvide-password,
// so this route is effectively orphaned.
export default function RecoverPasswordPage() {
  return (
    <AuthShell
      title="Recuperar contraseña"
      description="Ingresá tu correo y te enviamos las instrucciones para restablecer el acceso."
      icon={<Mail className="w-6 h-6 text-primary" />}
    >
      <RecoverPasswordForm />
    </AuthShell>
  );
}

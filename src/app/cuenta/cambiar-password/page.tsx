"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Check, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AccountSectionHeader } from "@/components/cuenta/AccountSectionHeader";
import { AccountCard } from "@/components/cuenta/AccountCard";
import { updateCustomerProfile } from "../actions";

const MIN_PASSWORD_LENGTH = 5;

interface FieldErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export default function CambiarPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!newPassword) {
      errors.newPassword = "La contraseña es obligatoria";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      errors.newPassword = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setErrorMsg("");

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await updateCustomerProfile({ password: newPassword });

      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        setErrorMsg(result.customerUserErrors[0].message);
      } else {
        setSuccess("Contraseña actualizada correctamente.");
        setNewPassword("");
        setConfirmPassword("");
        setFieldErrors({});
      }
    } catch {
      setErrorMsg(
        "Ocurrió un error al actualizar la contraseña. Intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <AccountSectionHeader
        title="Cambiar contraseña"
        description={`Elegí una contraseña segura. Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
      />

      {success && (
        <div
          role="status"
          className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
        >
          <Check className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
          <span>{success}</span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          {errorMsg}
        </div>
      )}

      <AccountCard padding="lg" as="section">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-md"
          noValidate
        >
          {/* New password */}
          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-foreground"
            >
              Nueva contraseña
            </label>
            <Input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (fieldErrors.newPassword)
                  setFieldErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
              }}
              placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
              autoComplete="new-password"
              error={fieldErrors.newPassword}
              iconLeft={<Lock className="w-4 h-4" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-muted-foreground hover:text-foreground transition-colors pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                  tabIndex={-1}
                  aria-label={
                    showNew ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-foreground"
            >
              Confirmar contraseña
            </label>
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword)
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
              }}
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
              iconLeft={<Lock className="w-4 h-4" />}
              iconRight={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-muted-foreground hover:text-foreground transition-colors pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded"
                  tabIndex={-1}
                  aria-label={
                    showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
          </div>

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck
              className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70"
              aria-hidden
            />
            <span>
              Tu contraseña se actualiza inmediatamente. Por seguridad, no
              compartas tus credenciales con nadie.
            </span>
          </p>

          <Button
            type="submit"
            isLoading={loading}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </form>
      </AccountCard>
    </div>
  );
}

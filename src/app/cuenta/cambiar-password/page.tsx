"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { updateCustomerProfile } from "../actions";

export default function CambiarPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  function validate(): boolean {
    const errors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      errors.newPassword = "La contraseña es obligatoria";
    } else if (newPassword.length < 5) {
      errors.newPassword = "La contraseña debe tener al menos 5 caracteres";
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
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const result = await updateCustomerProfile({ password: newPassword });

      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        setError(result.customerUserErrors[0].message);
      } else {
        setSuccess("Contraseña actualizada correctamente");
        setNewPassword("");
        setConfirmPassword("");
        setFieldErrors({});
      }
    } catch {
      setError("Ocurrió un error al actualizar la contraseña. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full h-11 pl-10 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d] transition-colors";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Cambiar Contraseña</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          {success && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* New password */}
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (fieldErrors.newPassword) setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                placeholder="Mínimo 5 caracteres"
                className={`${inputClass} ${fieldErrors.newPassword ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.newPassword && (
              <p className="text-xs text-red-600">{fieldErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="Repetí tu contraseña"
                className={`${inputClass} ${fieldErrors.confirmPassword ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#21645d] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a504a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

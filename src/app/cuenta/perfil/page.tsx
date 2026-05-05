"use client";

import { useEffect, useState } from "react";
import { Pencil, Check, X, User as UserIcon, Mail, Phone, Bell } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { updateCustomerProfile } from "../actions";
import { AccountSectionHeader } from "@/components/cuenta/AccountSectionHeader";
import { AccountCard } from "@/components/cuenta/AccountCard";
import {
  AccountSkeletonHeader,
  AccountSkeletonCard,
} from "@/components/cuenta/AccountSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function PerfilPage() {
  const { customer, isLoading, error, mutate } = useCustomer();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");

  useEffect(() => {
    if (customer && !editing) {
      setFirstName(customer.firstName || "");
      setLastName(customer.lastName || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
      setAcceptsMarketing(customer.acceptsMarketing ?? false);
    }
  }, [customer, editing]);

  function handleEdit() {
    if (!customer) return;
    setFirstName(customer.firstName || "");
    setLastName(customer.lastName || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setAcceptsMarketing(customer.acceptsMarketing ?? false);
    setSuccess("");
    setErrorMsg("");
    setFirstNameError("");
    setEditing(true);
  }

  function handleCancel() {
    if (customer) {
      setFirstName(customer.firstName || "");
      setLastName(customer.lastName || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
      setAcceptsMarketing(customer.acceptsMarketing ?? false);
    }
    setEditing(false);
    setErrorMsg("");
    setFirstNameError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccess("");
    setFirstNameError("");

    if (!firstName.trim()) {
      setFirstNameError("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const result = await updateCustomerProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        acceptsMarketing,
      });

      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        setErrorMsg(
          result.customerUserErrors
            .map((err: { message: string }) => err.message)
            .join(". ")
        );
        return;
      }

      await mutate();
      setSuccess("Perfil actualizado correctamente.");
      setEditing(false);
    } catch {
      setErrorMsg("Error al guardar los cambios. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AccountSkeletonHeader />
        <AccountSkeletonCard rows={5} />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <AccountSectionHeader
          title="Mi perfil"
          description="Gestioná tus datos personales y preferencias de comunicación"
        />
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          No pudimos cargar tu perfil. Recargá la página o intentá de nuevo en
          unos minutos.
        </div>
      </div>
    );
  }

  const initials =
    (customer.firstName?.charAt(0) || "") +
    (customer.lastName?.charAt(0) || "");

  return (
    <div className="space-y-6">
      <AccountSectionHeader
        title="Mi perfil"
        description="Gestioná tus datos personales y preferencias de comunicación"
        action={
          !editing && (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Pencil className="w-4 h-4" />
              Editar
            </Button>
          )
        }
      />

      {success && (
        <div
          role="status"
          className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
        >
          <Check className="w-4 h-4 mt-0.5 shrink-0" />
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

      {editing ? (
        <AccountCard padding="lg" as="section">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-foreground"
                >
                  Nombre <span className="text-destructive">*</span>
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (firstNameError) setFirstNameError("");
                  }}
                  error={firstNameError}
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-foreground"
                >
                  Apellido
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                iconLeft={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground"
              >
                Teléfono
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                iconLeft={<Phone className="w-4 h-4" />}
                autoComplete="tel"
                placeholder="099 123 456"
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <Switch
                id="acceptsMarketing"
                checked={acceptsMarketing}
                onCheckedChange={setAcceptsMarketing}
                aria-label="Recibir ofertas y novedades por email"
              />
              <label
                htmlFor="acceptsMarketing"
                className="text-sm text-foreground cursor-pointer leading-tight"
              >
                Recibir ofertas y novedades por email
                <span className="block text-xs text-muted-foreground mt-0.5">
                  Podés cancelar la suscripción en cualquier momento.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <Button
                type="submit"
                isLoading={saving}
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              >
                <Check className="w-4 h-4" />
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </AccountCard>
      ) : (
        <>
          {/* Identidad */}
          <AccountCard padding="lg" as="section">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-2xl sm:text-3xl shrink-0 shadow-md"
                aria-hidden
              >
                {initials || <UserIcon className="w-8 h-8" />}
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <h2 className="font-display text-[20px] sm:text-[22px] font-normal tracking-tight text-foreground leading-snug">
                  {customer.firstName} {customer.lastName}
                </h2>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground break-words flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden />
                    {customer.email}
                  </p>
                  {customer.phone ? (
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden />
                      {customer.phone}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden />
                      Sin teléfono registrado
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AccountCard>

          {/* Preferencias */}
          <AccountCard padding="md" as="section">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden
                >
                  <Bell className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-foreground">
                    Comunicaciones por email
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ofertas, novedades y campañas de CompraHogar
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                {customer.acceptsMarketing ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    Suscrito
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    No suscrito
                  </span>
                )}
              </div>
            </div>
          </AccountCard>
        </>
      )}
    </div>
  );
}

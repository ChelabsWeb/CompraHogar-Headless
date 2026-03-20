"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updateCustomerProfile } from "../actions";

interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
}

export default function PerfilPage() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/profile");
      if (!res.ok) throw new Error("Error al cargar perfil");
      const data = await res.json();
      const c = data.customer;
      setCustomer(c);
      populateForm(c);
    } catch {
      setErrorMessage("No se pudo cargar tu perfil. Intent\u00e1 de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  function populateForm(c: CustomerProfile) {
    setFirstName(c.firstName || "");
    setLastName(c.lastName || "");
    setEmail(c.email || "");
    setPhone(c.phone || "");
    setAcceptsMarketing(c.acceptsMarketing ?? false);
  }

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function handleEdit() {
    if (customer) populateForm(customer);
    setSuccessMessage("");
    setErrorMessage("");
    setEditing(true);
  }

  function handleCancel() {
    if (customer) populateForm(customer);
    setEditing(false);
    setErrorMessage("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setErrorMessage("El nombre es obligatorio.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await updateCustomerProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        acceptsMarketing,
      });

      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        setErrorMessage(
          result.customerUserErrors.map((err: { message: string }) => err.message).join(". ")
        );
        return;
      }

      if (result.customer) {
        const updated: CustomerProfile = {
          firstName: result.customer.firstName ?? firstName,
          lastName: result.customer.lastName ?? lastName,
          email: result.customer.email ?? email,
          phone: result.customer.phone ?? phone,
          acceptsMarketing,
        };
        setCustomer(updated);
        populateForm(updated);
      }

      setSuccessMessage("Perfil actualizado correctamente.");
      setEditing(false);
    } catch {
      setErrorMessage("Error al guardar los cambios. Intent\u00e1 de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#21645d]" />
      </div>
    );
  }

  if (!customer && !loading) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm">
        No se pudo cargar tu perfil. Intent\u00e1 de nuevo m\u00e1s tarde.
      </div>
    );
  }

  const infoRows: { label: string; value: string }[] = [
    { label: "Nombre", value: customer?.firstName || "-" },
    { label: "Apellido", value: customer?.lastName || "-" },
    { label: "Email", value: customer?.email || "-" },
    { label: "Tel\u00e9fono", value: customer?.phone || "-" },
    {
      label: "Marketing",
      value: customer?.acceptsMarketing ? "Suscrito" : "No suscrito",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        {!editing && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#21645d] hover:text-[#1a504a] transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </button>
        )}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-sm">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-5">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                Tel\u00e9fono
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
              />
            </div>

            {/* Accepts Marketing */}
            <div className="flex items-center gap-3">
              <input
                id="acceptsMarketing"
                type="checkbox"
                checked={acceptsMarketing}
                onChange={(e) => setAcceptsMarketing(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#21645d] focus:ring-[#21645d]/20"
              />
              <label htmlFor="acceptsMarketing" className="text-sm text-slate-700">
                Recibir ofertas y novedades por email
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#21645d] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a504a] transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="divide-y divide-slate-100">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row py-3 first:pt-0 last:pb-0"
              >
                <span className="text-sm text-slate-500 sm:w-32 shrink-0">
                  {row.label}
                </span>
                <span className="text-sm text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

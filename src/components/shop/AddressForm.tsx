"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export interface AddressFormData {
  label: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
  setAsDefault: boolean;
}

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AddressFormData) => Promise<void>;
  initialData?: Partial<AddressFormData>;
  title: string;
}

const URUGUAYAN_DEPARTMENTS = [
  "Artigas",
  "Canelones",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Maldonado",
  "Montevideo",
  "Paysandú",
  "Río Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
];

const LABEL_OPTIONS = ["Casa", "Oficina", "Otra"];

const emptyForm: AddressFormData = {
  label: "Casa",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  zip: "",
  country: "Uruguay",
  phone: "",
  setAsDefault: false,
};

const inputClass =
  "w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]";
const selectClass =
  "w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d] bg-white";

export default function AddressForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
}: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...emptyForm, ...initialData });
      setErrors({});
      setSaving(false);
    }
  }, [isOpen, initialData]);

  function update(field: keyof AddressFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};

    if (!form.label) newErrors.label = "Seleccioná una etiqueta";
    if (!form.firstName.trim()) newErrors.firstName = "El nombre es obligatorio";
    if (!form.lastName.trim()) newErrors.lastName = "El apellido es obligatorio";
    if (!form.address1.trim()) newErrors.address1 = "La dirección es obligatoria";
    if (!form.city.trim()) newErrors.city = "La ciudad es obligatoria";
    if (!form.province) newErrors.province = "Seleccioná un departamento";
    if (!form.zip.trim()) {
      newErrors.zip = "El código postal es obligatorio";
    } else if (!/^\d{5}$/.test(form.zip.trim())) {
      newErrors.zip = "El código postal debe tener 5 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Etiqueta <span className="text-red-500">*</span>
            </label>
            <select
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              {LABEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.label && (
              <p className="text-xs text-red-500 mt-1">{errors.label}</p>
            )}
          </div>

          {/* First + Last Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputClass}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputClass}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Address 1 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.address1}
              onChange={(e) => update("address1", e.target.value)}
              placeholder="Calle y número"
              className={inputClass}
            />
            {errors.address1 && (
              <p className="text-xs text-red-500 mt-1">{errors.address1}</p>
            )}
          </div>

          {/* Address 2 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Apartamento, piso, etc.
            </label>
            <input
              type="text"
              value={form.address2}
              onChange={(e) => update("address2", e.target.value)}
              placeholder="Opcional"
              className={inputClass}
            />
          </div>

          {/* City + Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className={selectClass}
              >
                <option value="">Seleccionar...</option>
                {URUGUAYAN_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-xs text-red-500 mt-1">{errors.province}</p>
              )}
            </div>
          </div>

          {/* Zip + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Código Postal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.zip}
                onChange={(e) => update("zip", e.target.value)}
                maxLength={5}
                placeholder="12345"
                className={inputClass}
              />
              {errors.zip && (
                <p className="text-xs text-red-500 mt-1">{errors.zip}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                País
              </label>
              <input
                type="text"
                value={form.country}
                readOnly
                className={`${inputClass} bg-slate-50 text-slate-500 cursor-not-allowed`}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Teléfono
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Opcional"
              className={inputClass}
            />
          </div>

          {/* Set as default checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="setAsDefault"
              type="checkbox"
              checked={form.setAsDefault}
              onChange={(e) => update("setAsDefault", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#21645d] focus:ring-[#21645d]/20"
            />
            <label htmlFor="setAsDefault" className="text-sm text-slate-700">
              Marcar como predeterminada
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#21645d] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a504a] transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

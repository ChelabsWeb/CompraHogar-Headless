"use client";

import { Pencil, Trash2 } from "lucide-react";

interface AddressCardProps {
  address: {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone?: string;
  };
  label: string;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const labelColors: Record<string, string> = {
  Casa: "bg-blue-50 text-blue-700",
  Oficina: "bg-amber-50 text-amber-700",
  Otra: "bg-slate-100 text-slate-600",
};

export default function AddressCard({
  address,
  label,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4">
      {/* Top: badges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
              labelColors[label] || labelColors.Otra
            }`}
          >
            {label}
          </span>
          {isDefault && (
            <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Predeterminada
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-slate-900">
          {address.firstName} {address.lastName}
        </p>

        {/* Address lines */}
        <p className="text-sm text-slate-600 mt-1">{address.address1}</p>
        {address.address2 && (
          <p className="text-sm text-slate-600">{address.address2}</p>
        )}
        <p className="text-sm text-slate-600">
          {address.city}, {address.province} {address.zip}
        </p>
        <p className="text-sm text-slate-600">{address.country}</p>

        {/* Phone */}
        {address.phone && (
          <p className="text-sm text-slate-500 mt-1">{address.phone}</p>
        )}
      </div>

      {/* Bottom: actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#21645d] transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar
          </button>
        </div>

        {!isDefault && (
          <button
            onClick={onSetDefault}
            className="text-xs font-medium text-[#21645d] hover:text-[#1a504a] transition-colors"
          >
            Marcar como predeterminada
          </button>
        )}
      </div>
    </div>
  );
}

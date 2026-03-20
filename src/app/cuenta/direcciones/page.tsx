"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2, MapPin } from "lucide-react";
import AddressCard from "@/components/shop/AddressCard";
import AddressForm, { type AddressFormData } from "@/components/shop/AddressForm";
import {
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,
} from "../actions";

interface AddressNode {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
}

const LABELS_STORAGE_KEY = "comprahogar_address_labels";

function getLabels(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LABELS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLabel(addressId: string, label: string) {
  const labels = getLabels();
  labels[addressId] = label;
  localStorage.setItem(LABELS_STORAGE_KEY, JSON.stringify(labels));
}

function removeLabel(addressId: string) {
  const labels = getLabels();
  delete labels[addressId];
  localStorage.setItem(LABELS_STORAGE_KEY, JSON.stringify(labels));
}

export default function DireccionesPage() {
  const [addresses, setAddresses] = useState<AddressNode[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressNode | null>(null);

  // Confirm delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/customer/profile");
      if (!res.ok) throw new Error("Error al cargar direcciones");
      const data = await res.json();
      const customer = data.customer;

      const addressList: AddressNode[] =
        customer.addresses?.edges?.map(
          (edge: { node: AddressNode }) => edge.node
        ) || [];

      setAddresses(addressList);
      setDefaultAddressId(customer.defaultAddress?.id || null);
      setLabels(getLabels());
    } catch {
      setError("No se pudieron cargar las direcciones. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  function handleOpenCreate() {
    setEditingAddress(null);
    setFormOpen(true);
  }

  function handleOpenEdit(address: AddressNode) {
    setEditingAddress(address);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingAddress(null);
  }

  async function handleSave(data: AddressFormData) {
    const addressInput = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      address1: data.address1.trim(),
      address2: data.address2.trim() || undefined,
      city: data.city.trim(),
      province: data.province,
      zip: data.zip.trim(),
      country: data.country,
      phone: data.phone.trim() || undefined,
    };

    try {
      if (editingAddress) {
        // Update existing
        const result = await updateCustomerAddress(editingAddress.id, addressInput);
        if (result.customerUserErrors?.length > 0) {
          throw new Error(result.customerUserErrors[0].message);
        }
        saveLabel(editingAddress.id, data.label);

        if (data.setAsDefault) {
          await setDefaultAddress(editingAddress.id);
        }
      } else {
        // Create new
        const result = await createCustomerAddress(addressInput);
        if (result.customerUserErrors?.length > 0) {
          throw new Error(result.customerUserErrors[0].message);
        }

        const newId = result.customerAddress?.id;
        if (newId) {
          saveLabel(newId, data.label);
          if (data.setAsDefault) {
            await setDefaultAddress(newId);
          }
        }
      }

      handleCloseForm();
      await fetchAddresses();
    } catch (err) {
      throw err;
    }
  }

  function handleDeleteRequest(addressId: string) {
    setDeletingId(addressId);
    setDeleteConfirm(true);
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;

    try {
      const result = await deleteCustomerAddress(deletingId);
      if (result.customerUserErrors?.length > 0) {
        setError(result.customerUserErrors[0].message);
      } else {
        removeLabel(deletingId);
      }
      await fetchAddresses();
    } catch {
      setError("Error al eliminar la dirección. Intentá de nuevo.");
    } finally {
      setDeleteConfirm(false);
      setDeletingId(null);
    }
  }

  async function handleSetDefault(addressId: string) {
    try {
      const result = await setDefaultAddress(addressId);
      if (result.customerUserErrors?.length > 0) {
        setError(result.customerUserErrors[0].message);
        return;
      }
      await fetchAddresses();
    } catch {
      setError("Error al actualizar la dirección predeterminada.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#21645d]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mis Direcciones</h1>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 bg-[#21645d] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1a504a] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar dirección
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {addresses.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
          <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            No tenés direcciones guardadas todavía.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 text-sm font-medium text-[#21645d] hover:text-[#1a504a] transition-colors"
          >
            Agregar tu primera dirección
          </button>
        </div>
      )}

      {/* Address grid */}
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              label={labels[addr.id] || "Otra"}
              isDefault={addr.id === defaultAddressId}
              onEdit={() => handleOpenEdit(addr)}
              onDelete={() => handleDeleteRequest(addr.id)}
              onSetDefault={() => handleSetDefault(addr.id)}
            />
          ))}
        </div>
      )}

      {/* Address form modal */}
      <AddressForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        title={editingAddress ? "Editar dirección" : "Nueva dirección"}
        initialData={
          editingAddress
            ? {
                label: labels[editingAddress.id] || "Otra",
                firstName: editingAddress.firstName || "",
                lastName: editingAddress.lastName || "",
                address1: editingAddress.address1 || "",
                address2: editingAddress.address2 || "",
                city: editingAddress.city || "",
                province: editingAddress.province || "",
                zip: editingAddress.zip || "",
                country: editingAddress.country || "Uruguay",
                phone: editingAddress.phone || "",
                setAsDefault: editingAddress.id === defaultAddressId,
              }
            : undefined
        }
      />

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setDeleteConfirm(false);
              setDeletingId(null);
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Eliminar dirección
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              ¿Estás seguro de que querés eliminar esta dirección? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirm(false);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

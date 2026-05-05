"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import AddressCard from "@/components/shop/AddressCard";
import AddressForm, { type AddressFormData } from "@/components/shop/AddressForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useCustomer } from "@/hooks/useCustomer";
import { AccountSectionHeader } from "@/components/cuenta/AccountSectionHeader";
import { AccountCard } from "@/components/cuenta/AccountCard";
import {
  AccountSkeletonHeader,
  AccountSkeletonGrid,
} from "@/components/cuenta/AccountSkeleton";
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
  const { customer, isLoading, error, mutate } = useCustomer();

  const [labels, setLabels] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressNode | null>(
    null
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingInProgress, setDeletingInProgress] = useState(false);

  useEffect(() => {
    setLabels(getLabels());
  }, []);

  const addresses: AddressNode[] =
    customer?.addresses?.edges?.map(
      (edge) => edge.node as unknown as AddressNode
    ) ?? [];
  const defaultAddressId = customer?.defaultAddress?.id ?? null;

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

    if (editingAddress) {
      const result = await updateCustomerAddress(editingAddress.id, addressInput);
      if (result.customerUserErrors?.length > 0) {
        throw new Error(result.customerUserErrors[0].message);
      }
      saveLabel(editingAddress.id, data.label);
      setLabels(getLabels());
      if (data.setAsDefault) {
        await setDefaultAddress(editingAddress.id);
      }
    } else {
      const result = await createCustomerAddress(addressInput);
      if (result.customerUserErrors?.length > 0) {
        throw new Error(result.customerUserErrors[0].message);
      }
      const newId = result.customerAddress?.id;
      if (newId) {
        saveLabel(newId, data.label);
        setLabels(getLabels());
        if (data.setAsDefault) {
          await setDefaultAddress(newId);
        }
      }
    }

    handleCloseForm();
    await mutate();
  }

  function handleDeleteRequest(addressId: string) {
    setDeletingId(addressId);
    setDeleteConfirmOpen(true);
  }

  function handleDeleteCancel() {
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    setDeletingInProgress(true);
    setActionError("");
    try {
      const result = await deleteCustomerAddress(deletingId);
      if (result.customerUserErrors?.length > 0) {
        setActionError(result.customerUserErrors[0].message);
      } else {
        removeLabel(deletingId);
        setLabels(getLabels());
      }
      await mutate();
    } catch {
      setActionError("Error al eliminar la dirección. Intentá de nuevo.");
    } finally {
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      setDeletingInProgress(false);
    }
  }

  async function handleSetDefault(addressId: string) {
    setActionError("");
    try {
      const result = await setDefaultAddress(addressId);
      if (result.customerUserErrors?.length > 0) {
        setActionError(result.customerUserErrors[0].message);
        return;
      }
      await mutate();
    } catch {
      setActionError("Error al actualizar la dirección predeterminada.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AccountSkeletonHeader />
        <AccountSkeletonGrid cols={2} count={2} />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <AccountSectionHeader
          title="Mis direcciones"
          description="Gestioná tus direcciones de envío"
        />
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          No pudimos cargar tus direcciones. Recargá la página o intentá de
          nuevo en unos minutos.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountSectionHeader
        title="Mis direcciones"
        description={
          addresses.length > 0
            ? `${addresses.length} dirección${addresses.length === 1 ? "" : "es"} guardada${addresses.length === 1 ? "" : "s"}`
            : "Gestioná tus direcciones de envío"
        }
        action={
          <Button
            type="button"
            size="sm"
            onClick={handleOpenCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Agregar dirección
          </Button>
        }
      />

      {actionError && (
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          {actionError}
        </div>
      )}

      {addresses.length === 0 ? (
        <AccountCard
          padding="lg"
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <span
            className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"
            aria-hidden
          >
            <MapPin className="w-6 h-6" />
          </span>
          <h2 className="font-display text-[18px] sm:text-[20px] font-normal tracking-tight text-foreground mb-1.5">
            Aún no tenés direcciones guardadas
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Agregá tu primera dirección para agilizar el checkout en cada
            compra.
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleOpenCreate}
            className="text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4" />
            Agregar tu primera dirección
          </Button>
        </AccountCard>
      ) : (
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

      {/* Address form modal (componente externo con su propio modal) */}
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

      {/* Delete confirmation — Modal del sistema */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        title="Eliminar dirección"
        description="¿Estás seguro de que querés eliminar esta dirección? Esta acción no se puede deshacer."
        className="max-w-sm"
      >
        <div className="flex items-center gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDeleteCancel}
            disabled={deletingInProgress}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            isLoading={deletingInProgress}
            disabled={deletingInProgress}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

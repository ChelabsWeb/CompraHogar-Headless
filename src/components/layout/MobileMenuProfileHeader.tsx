"use client";

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/shop/WishlistProvider";

interface MobileMenuProfileHeaderProps {
  onClose: () => void;
}

export function MobileMenuProfileHeader({ onClose }: MobileMenuProfileHeaderProps) {
  const { customer, isLoading } = useCustomer();
  const { totalQuantity, setIsCartOpen } = useCart();
  const wishlist = useWishlist();
  const wishlistCount = wishlist?.count ?? 0;

  // Skeleton while customer fetch is in-flight to avoid layout flash
  if (isLoading) {
    return (
      <div className="px-5 pt-safe pb-4 border-b border-neutral-100">
        <div className="mt-12 h-11 w-11 rounded-full bg-slate-100 animate-pulse" />
        <div className="mt-3 h-4 w-32 rounded bg-slate-100 animate-pulse" />
        <div className="mt-1.5 h-3 w-44 rounded bg-slate-100 animate-pulse" />
      </div>
    );
  }

  // Guest state
  if (!customer) {
    return (
      <div className="px-5 pt-safe pb-4 border-b border-neutral-100">
        <div className="mt-12 flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
            aria-hidden
          >
            <UserIcon size={22} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-900 tracking-tight">Invitado</p>
            <p className="text-[13px] text-slate-500">Ingresá para ver tus pedidos</p>
          </div>
        </div>
        <Link
          href="/login"
          onClick={onClose}
          className="mt-3 inline-flex items-center justify-center w-full h-10 rounded-lg bg-primary text-white text-[14px] font-semibold active:bg-primary/90 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  // Logged-in state
  const initial = (customer.firstName?.[0] ?? customer.email?.[0] ?? "?").toUpperCase();
  const displayName = customer.firstName
    ? `${customer.firstName}${customer.lastName ? ` ${customer.lastName}` : ""}`
    : "Mi cuenta";

  return (
    <div className="px-5 pt-safe pb-4 border-b border-neutral-100">
      <div className="mt-12">
        <div
          className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-[17px]"
          aria-hidden
        >
          {initial}
        </div>
        <p className="mt-3 text-[16px] font-bold text-slate-900 tracking-tight">
          {displayName}
        </p>
        {customer.email && (
          <p className="text-[13px] text-slate-500 truncate">{customer.email}</p>
        )}
        <div className="mt-3 flex gap-4 text-[12px] text-slate-600">
          <button
            type="button"
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            className="hover:text-primary transition-colors text-left"
          >
            <strong className="text-slate-900 font-bold">{totalQuantity}</strong> en carrito
          </button>
          <Link
            href="/cuenta/favoritos"
            onClick={onClose}
            className="hover:text-primary transition-colors"
          >
            <strong className="text-slate-900 font-bold">{wishlistCount}</strong> favoritos
          </Link>
        </div>
      </div>
    </div>
  );
}
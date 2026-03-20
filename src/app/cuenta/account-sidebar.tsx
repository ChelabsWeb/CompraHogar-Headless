"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package, Heart, Lock, LogOut } from "lucide-react";
import { logout } from "./actions";

interface AccountSidebarProps {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const navItems = [
  { href: "/cuenta/perfil", label: "Mi Perfil", shortLabel: "Perfil", icon: User },
  { href: "/cuenta/direcciones", label: "Mis Direcciones", shortLabel: "Direcciones", icon: MapPin },
  { href: "/cuenta/mis-compras", label: "Mis Compras", shortLabel: "Compras", icon: Package },
  { href: "/cuenta/favoritos", label: "Favoritos", shortLabel: "Favoritos", icon: Heart },
  { href: "/cuenta/cambiar-password", label: "Cambiar Contraseña", shortLabel: "Contraseña", icon: Lock },
];

export function AccountSidebar({ customer }: AccountSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const initials =
    (customer.firstName?.charAt(0) || "") +
    (customer.lastName?.charAt(0) || "");

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0">
        <div className="sticky top-[140px] bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* User Info */}
          <div className="p-6 pb-4">
            <div className="w-14 h-14 bg-[#21645d]/10 text-[#21645d] rounded-full flex items-center justify-center mb-3 text-lg font-bold">
              {initials}
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-sm text-slate-500 truncate">{customer.email}</p>
          </div>

          {/* Navigation */}
          <nav className="px-3 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#21645d]/10 text-[#21645d]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-4 pt-1">
            <div className="border-t border-slate-100 pt-3">
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4.5 h-4.5 shrink-0" />
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="lg:hidden sticky top-[72px] z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-slate-50 pb-4">
        <nav className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 min-h-[44px] ${
                  active
                    ? "bg-[#21645d] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.shortLabel}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

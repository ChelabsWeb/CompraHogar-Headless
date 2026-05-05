"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  MapPin,
  Package,
  Heart,
  Lock,
  LogOut,
} from "lucide-react";
import { logout } from "./actions";

interface AccountSidebarProps {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Mi cuenta",
    items: [
      { href: "/cuenta", label: "Inicio", shortLabel: "Inicio", icon: Home, exact: true },
      { href: "/cuenta/perfil", label: "Mi perfil", shortLabel: "Perfil", icon: User },
      { href: "/cuenta/cambiar-password", label: "Cambiar contraseña", shortLabel: "Contraseña", icon: Lock },
    ],
  },
  {
    label: "Compras",
    items: [
      { href: "/cuenta/mis-compras", label: "Mis compras", shortLabel: "Compras", icon: Package },
      { href: "/cuenta/direcciones", label: "Mis direcciones", shortLabel: "Direcciones", icon: MapPin },
    ],
  },
  {
    label: "Deseos",
    items: [
      { href: "/cuenta/favoritos", label: "Favoritos", shortLabel: "Favoritos", icon: Heart },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

export function AccountSidebar({ customer }: AccountSidebarProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const initials =
    (customer.firstName?.charAt(0) || "") +
    (customer.lastName?.charAt(0) || "");

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="sticky top-[140px] bg-white rounded-2xl border border-neutral-200/70 shadow-sm overflow-hidden">
          {/* User Info */}
          <div className="p-6 pb-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3 text-lg font-medium text-white shadow-md bg-gradient-to-br from-primary to-secondary font-display tracking-tight"
              aria-hidden
            >
              {initials || <User className="w-6 h-6" />}
            </div>
            <h2 className="font-display text-[17px] font-normal text-foreground tracking-tight truncate leading-snug">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {customer.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="px-3 pb-2 space-y-3" aria-label="Navegación de cuenta">
            {navGroups.map((group, gIdx) => (
              <div key={group.label}>
                {gIdx > 0 && (
                  <div className="border-t border-neutral-100 mb-3" aria-hidden />
                )}
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-slate-600 hover:bg-neutral-100 hover:text-slate-900"
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px] shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-4 pt-2">
            <div className="border-t border-neutral-100 pt-3">
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
                >
                  <LogOut className="w-[18px] h-[18px] shrink-0" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="lg:hidden sticky top-[72px] z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-neutral-50 pb-3 pt-1">
        <nav
          className="flex gap-2 overflow-x-auto scrollbar-hide py-1"
          aria-label="Navegación de cuenta"
        >
          {allItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 min-h-[44px] ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-slate-600 border border-neutral-200/70 hover:bg-neutral-100"
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

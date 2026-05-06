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
  UserCircle2,
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
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  exact?: boolean;
}

const navGroups: { items: NavItem[] }[] = [
  {
    items: [
      { href: "/cuenta", label: "Inicio", shortLabel: "Inicio", icon: Home, exact: true },
      { href: "/cuenta/perfil", label: "Mi perfil", shortLabel: "Perfil", icon: User },
      { href: "/cuenta/cambiar-password", label: "Contraseña", shortLabel: "Contraseña", icon: Lock },
    ],
  },
  {
    items: [
      { href: "/cuenta/mis-compras", label: "Mis compras", shortLabel: "Compras", icon: Package },
      { href: "/cuenta/direcciones", label: "Direcciones", shortLabel: "Direcciones", icon: MapPin },
    ],
  },
  {
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
      {/* Desktop fixed sidebar */}
      <aside
        aria-label="Navegación de cuenta"
        className="hidden lg:fixed lg:top-[140px] lg:bottom-0 lg:left-0 lg:z-30 lg:w-72 lg:flex lg:flex-col lg:bg-white lg:border-r lg:border-neutral-200/70"
      >
        {/* Header interno */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-200/70">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm shrink-0"
            aria-hidden
          >
            <UserCircle2 className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-normal tracking-tight text-foreground leading-tight">
              Mi cuenta
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Gestión de tu perfil
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-px">
            {navGroups.map((group, gIdx) => (
              <li key={gIdx}>
                {gIdx > 0 && (
                  <div
                    className="my-2 mx-2 border-t border-neutral-100"
                    aria-hidden
                  />
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-slate-600 hover:bg-neutral-100 hover:text-slate-900"
                          }`}
                        >
                          <Icon
                            className={`w-[18px] h-[18px] shrink-0 ${
                              active
                                ? "text-primary"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                            strokeWidth={1.75}
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* User footer */}
        <div className="border-t border-neutral-200/70 p-4">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-sm font-medium shadow-sm shrink-0"
              aria-hidden
            >
              {initials || <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate leading-tight">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {customer.email}
              </p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
            >
              <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Tabs (sticky) */}
      <div className="lg:hidden sticky top-[72px] z-30 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200/70">
        <nav
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-6 py-3"
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0 min-h-[40px] ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-white text-slate-600 border border-neutral-200/70 hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                {item.shortLabel}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

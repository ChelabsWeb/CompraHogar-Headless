"use client";

import Link from "next/link";
import Image from "next/image";
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
import { useWishlist } from "@/components/shop/WishlistProvider";
import { logout } from "./actions";

interface AccountSidebarProps {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  counts: {
    orders: number;
    addresses: number;
  };
}

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  exact?: boolean;
  badgeKey?: "orders" | "addresses" | "favorites";
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "General",
    items: [
      { href: "/cuenta", label: "Inicio", shortLabel: "Inicio", icon: Home, exact: true },
      { href: "/cuenta/perfil", label: "Mi perfil", shortLabel: "Perfil", icon: User },
      { href: "/cuenta/cambiar-password", label: "Contraseña", shortLabel: "Contraseña", icon: Lock },
    ],
  },
  {
    label: "Pedidos",
    items: [
      { href: "/cuenta/mis-compras", label: "Mis compras", shortLabel: "Compras", icon: Package, badgeKey: "orders" },
      { href: "/cuenta/direcciones", label: "Direcciones", shortLabel: "Direcciones", icon: MapPin, badgeKey: "addresses" },
    ],
  },
  {
    label: "Deseos",
    items: [
      { href: "/cuenta/favoritos", label: "Favoritos", shortLabel: "Favoritos", icon: Heart, badgeKey: "favorites" },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

export function AccountSidebar({ customer, counts }: AccountSidebarProps) {
  const pathname = usePathname();
  const { count: favoritesCount } = useWishlist();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  const getBadge = (item: NavItem): number | null => {
    if (!item.badgeKey) return null;
    if (item.badgeKey === "favorites") return favoritesCount;
    return counts[item.badgeKey];
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
        {/* Brand header */}
        <div className="px-4 py-4 border-b border-neutral-200/70">
          <Link
            href="/"
            className="flex items-center gap-2.5 -mx-1 px-1 py-1 rounded-lg hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200/80 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[14px] font-normal tracking-tight text-foreground leading-none mb-1">
                CompraHogar
              </p>
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-semibold leading-none">
                Mi cuenta
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {group.label}
              </p>
              <ul className="space-y-px">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  const badge = getBadge(item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                          active
                            ? "bg-primary/[0.08] text-primary"
                            : "text-slate-600 hover:bg-neutral-100 hover:text-slate-900"
                        }`}
                      >
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors shrink-0 ${
                            active
                              ? "bg-primary/[0.12] text-primary"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                          aria-hidden
                        >
                          <Icon
                            className="w-4 h-4"
                            strokeWidth={active ? 2 : 1.75}
                          />
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {badge !== null && badge > 0 && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums shrink-0 ${
                              active
                                ? "bg-primary/15 text-primary"
                                : "bg-neutral-100 text-slate-500 group-hover:bg-neutral-200"
                            }`}
                          >
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-neutral-200/70 p-3 space-y-1">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
            <div className="relative shrink-0">
              <div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-[12px] font-medium shadow-sm"
                aria-hidden
              >
                {initials || <User className="w-4 h-4" />}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                aria-label="Sesión activa"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-foreground truncate leading-tight">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {customer.email}
              </p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
            >
              <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile sticky tabs */}
      <div className="lg:hidden sticky top-[72px] z-30 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200/70">
        <nav
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-6 py-3"
          aria-label="Navegación de cuenta"
        >
          {allItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const badge = getBadge(item);
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
                {badge !== null && badge > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums ${
                      active
                        ? "bg-white/20 text-primary-foreground"
                        : "bg-neutral-100 text-slate-500"
                    }`}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function BottomNav() {
    const pathname = usePathname();
    const { totalQuantity, isCartOpen, setIsCartOpen } = useCart();

    const navItems = [
        {
            label: "Inicio",
            icon: Home,
            href: "/",
            isActive: pathname === "/",
        },
        {
            label: "Categorías",
            icon: Grid3X3,
            href: "/collections",
            isActive: pathname === "/collections" || (pathname?.startsWith("/collections/") ?? false),
        },
        {
            label: "Carrito",
            icon: ShoppingBag,
            action: () => setIsCartOpen(true),
            isActive: isCartOpen,
            badge: totalQuantity > 0 ? totalQuantity : null,
        },
        {
            label: "Mi Cuenta",
            icon: User,
            href: "/cuenta",
            isActive: pathname?.startsWith("/cuenta") ?? false,
        },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <nav className="flex items-center justify-around h-14 px-1">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = item.isActive;
                    const isAction = !!item.action;

                    const content = (
                        <div className="relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-full transition-transform active:scale-95">
                            <div className="relative flex items-center justify-center">
                                <Icon className={`w-[22px] h-[22px] transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`} strokeWidth={isActive ? 2.2 : 1.6} />
                                {item.badge && (
                                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 border-2 border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] leading-none mt-0.5 transition-colors ${isActive ? 'font-semibold text-primary' : 'font-medium text-slate-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    );

                    if (isAction) {
                        return (
                            <button key={index} onClick={item.action} className="flex-1 flex justify-center outline-none h-full">
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link key={index} href={item.href || "#"} className="flex-1 flex justify-center outline-none h-full">
                            {content}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

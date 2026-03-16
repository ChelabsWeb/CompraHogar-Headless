"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
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
            label: "Buscar",
            icon: Search,
            href: "/search",
            // For now, search act as a link. We could make it open a drawer or focus the header input.
            isActive: pathname === "/search",
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
            isActive: pathname?.startsWith("/cuenta"),
        },
    ];

    return (
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-slate-200/60 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] transition-transform duration-300 ${pathname?.startsWith('/products/') ? 'translate-y-full' : 'translate-y-0'}`}>
            <nav className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = item.isActive;
                    const isAction = !!item.action;

                    const content = (
                        <div className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-transform active:scale-95">
                            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isActive ? 'bg-[#2968c8]/10 text-[#2968c8]' : 'text-slate-500'}`}>
                                <Icon className={`w-6 h-6 transition-all ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-[#2968c8]' : 'text-slate-500'}`}>
                                {item.label}
                            </span>
                        </div>
                    );

                    if (isAction) {
                        return (
                            <button key={index} onClick={item.action} className="flex-1 flex justify-center outline-none">
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link key={index} href={item.href || "#"} className="flex-1 flex justify-center outline-none">
                            {content}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

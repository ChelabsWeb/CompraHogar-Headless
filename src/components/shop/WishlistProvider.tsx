"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistContextType {
    items: string[];
    toggle: (productId: string) => void;
    has: (productId: string) => boolean;
    count: number;
}

const WishlistContext = createContext<WishlistContextType>({
    items: [],
    toggle: () => {},
    has: () => false,
    count: 0,
});

const STORAGE_KEY = "comprahogar_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch {}
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const toggle = useCallback((productId: string) => {
        setItems((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    }, []);

    const has = useCallback(
        (productId: string) => items.includes(productId),
        [items]
    );

    return (
        <WishlistContext.Provider value={{ items, toggle, has, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}

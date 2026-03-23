"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface WishlistContextType {
    items: string[];
    toggle: (productId: string) => void;
    has: (productId: string) => boolean;
    count: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType>({
    items: [],
    toggle: () => {},
    has: () => false,
    count: 0,
    isOpen: false,
    setIsOpen: () => {},
});

const STORAGE_KEY = "comprahogar_wishlist";

export function WishlistProvider({
    children,
    isLoggedIn = false,
}: {
    children: React.ReactNode;
    isLoggedIn?: boolean;
}) {
    const [items, setItems] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch {}
        setHydrated(true);
    }, []);

    // If logged in, fetch remote wishlist and merge with localStorage
    useEffect(() => {
        if (!hydrated || !isLoggedIn) return;

        fetch("/api/wishlist/sync")
            .then((res) => res.json())
            .then((data) => {
                const remoteItems: string[] = Array.isArray(data.items) ? data.items : [];
                if (remoteItems.length === 0) return;

                setItems((prev) => {
                    const merged = Array.from(new Set([...prev, ...remoteItems]));
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                    return merged;
                });
            })
            .catch(() => {}); // Silent fail — localStorage remains source of truth
    }, [hydrated, isLoggedIn]);

    // Persist to localStorage whenever items change (after hydration)
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    // Debounced sync to Shopify for logged-in users
    const debouncedSync = useCallback(
        (newItems: string[]) => {
            if (!isLoggedIn) return;
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = setTimeout(() => {
                fetch("/api/wishlist/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productIds: newItems }),
                }).catch(() => {}); // Silent fail — localStorage is the source of truth
            }, 500);
        },
        [isLoggedIn]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        };
    }, []);

    const toggle = useCallback(
        (productId: string) => {
            setItems((prev) => {
                const newItems = prev.includes(productId)
                    ? prev.filter((id) => id !== productId)
                    : [...prev, productId];
                debouncedSync(newItems);
                return newItems;
            });
        },
        [debouncedSync]
    );

    const has = useCallback(
        (productId: string) => items.includes(productId),
        [items]
    );

    return (
        <WishlistContext.Provider value={{ items, toggle, has, count: items.length, isOpen, setIsOpen }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}

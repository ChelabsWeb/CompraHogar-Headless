"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

const STORAGE_KEY = "comprahogar_compare";
const MAX_ITEMS = 4;

interface CompareContextType {
    items: string[];
    toggle: (productId: string) => boolean;
    remove: (productId: string) => void;
    clear: () => void;
    has: (productId: string) => boolean;
    count: number;
    max: number;
    isFull: boolean;
}

const CompareContext = createContext<CompareContextType>({
    items: [],
    toggle: () => false,
    remove: () => {},
    clear: () => {},
    has: () => false,
    count: 0,
    max: MAX_ITEMS,
    isFull: false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        let parsed: string[] | null = null;
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const p = JSON.parse(stored);
                if (Array.isArray(p)) parsed = p;
            }
        } catch {}
        // Diferimos los setState al siguiente paint para no caer en
        // react-hooks/set-state-in-effect (cascading renders).
        const rafId = requestAnimationFrame(() => {
            if (parsed) setItems(parsed.slice(0, MAX_ITEMS));
            setHydrated(true);
        });
        return () => cancelAnimationFrame(rafId);
    }, []);

    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const toggle = useCallback((productId: string): boolean => {
        let added = false;
        setItems((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            }
            if (prev.length >= MAX_ITEMS) {
                return prev;
            }
            added = true;
            return [...prev, productId];
        });
        return added;
    }, []);

    const remove = useCallback((productId: string) => {
        setItems((prev) => prev.filter((id) => id !== productId));
    }, []);

    const clear = useCallback(() => {
        setItems([]);
    }, []);

    const has = useCallback(
        (productId: string) => items.includes(productId),
        [items]
    );

    return (
        <CompareContext.Provider
            value={{
                items,
                toggle,
                remove,
                clear,
                has,
                count: items.length,
                max: MAX_ITEMS,
                isFull: items.length >= MAX_ITEMS,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    return useContext(CompareContext);
}

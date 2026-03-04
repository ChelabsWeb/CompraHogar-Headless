"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { 
    createCartMutation, 
    addToCartMutation, 
    updateCartMutation, 
    removeFromCartMutation,
    getCartQuery 
} from "@/lib/queries";

export type CartItem = {
    id: string; // The line item ID
    quantity: number;
    merchandiseId: string; // The product variant ID
    variantTitle: string;
    productTitle: string;
    productHandle: string;
    productType: string;
    price: number;
    currencyCode: string;
    image: { url: string; altText: string | null } | null;
};

export type CartContextType = {
    cartId: string | null;
    checkoutUrl: string | null;
    items: CartItem[];
    totalQuantity: number;
    subtotal: number;
    isCartLoading: boolean;
    addToCart: (variantId: string, quantity: number) => Promise<void>;
    updateQuantity: (lineId: string, quantity: number) => Promise<void>;
    removeFromCart: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartId, setCartId] = useState<string | null>(null);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [items, setItems] = useState<CartItem[]>([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [isCartLoading, setIsCartLoading] = useState(true);

    // Load Cart ID from local storage on mount
    useEffect(() => {
        const storedCartId = localStorage.getItem("shopify_cart_id");
        if (storedCartId) {
            setCartId(storedCartId);
            fetchCart(storedCartId);
        } else {
            setIsCartLoading(false);
        }
    }, []);

    const parseCartData = (cart: any) => {
        if (!cart) return;

        setCheckoutUrl(cart.checkoutUrl);
        setTotalQuantity(cart.totalQuantity || 0);
        setSubtotal(parseFloat(cart.cost?.subtotalAmount?.amount || "0"));

        const parsedItems: CartItem[] = cart.lines?.edges?.map(({ node }: any) => ({
            id: node.id,
            quantity: node.quantity,
            merchandiseId: node.merchandise.id,
            variantTitle: node.merchandise.title,
            productTitle: node.merchandise.product.title,
            productHandle: node.merchandise.product.handle,
            productType: node.merchandise.product.productType || "Category",
            price: parseFloat(node.merchandise.price?.amount || "0"),
            currencyCode: node.merchandise.price?.currencyCode || "UYU",
            image: node.merchandise.image,
        })) || [];

        setItems(parsedItems);
    };

    const fetchCart = async (id: string) => {
        setIsCartLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: getCartQuery,
                variables: { cartId: id },
            });
            if (body?.data?.cart) {
                parseCartData(body.data.cart);
            } else {
                // Cart might be invalid or expired
                localStorage.removeItem("shopify_cart_id");
                setCartId(null);
            }
        } catch (error) {
            console.error("Error fetching cart", error);
        } finally {
            setIsCartLoading(false);
        }
    };

    const addToCart = async (variantId: string, quantity: number) => {
        setIsCartLoading(true);
        try {
            const lines = [{ merchandiseId: variantId, quantity }];

            if (cartId) {
                // Add to existing cart
                const { body } = await shopifyFetch({
                    query: addToCartMutation,
                    variables: { cartId, lines },
                });
                parseCartData(body?.data?.cartLinesAdd?.cart);
            } else {
                // Create new cart
                const { body } = await shopifyFetch({
                    query: createCartMutation,
                    variables: { lines },
                });
                const newCart = body?.data?.cartCreate?.cart;
                if (newCart) {
                    setCartId(newCart.id);
                    localStorage.setItem("shopify_cart_id", newCart.id);
                    parseCartData(newCart);
                }
            }
        } catch (error) {
            console.error("Error adding to cart", error);
        } finally {
            setIsCartLoading(false);
        }
    };

    const updateQuantity = async (lineId: string, quantity: number) => {
        if (!cartId) return;
        setIsCartLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: updateCartMutation,
                variables: { 
                    cartId, 
                    lines: [{ id: lineId, quantity }] 
                },
            });
            parseCartData(body?.data?.cartLinesUpdate?.cart);
        } catch (error) {
            console.error("Error updating cart quantity", error);
        } finally {
            setIsCartLoading(false);
        }
    };

    const removeFromCart = async (lineId: string) => {
        if (!cartId) return;
        setIsCartLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: removeFromCartMutation,
                variables: { 
                    cartId, 
                    lineIds: [lineId] 
                },
            });
            parseCartData(body?.data?.cartLinesRemove?.cart);
        } catch (error) {
            console.error("Error removing from cart", error);
        } finally {
            setIsCartLoading(false);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartId,
                checkoutUrl,
                items,
                totalQuantity,
                subtotal,
                isCartLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

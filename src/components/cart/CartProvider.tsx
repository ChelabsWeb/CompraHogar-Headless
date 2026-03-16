"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { shopifyFetch } from "@/lib/shopify";
import { 
    createCartMutation, 
    addToCartMutation, 
    updateCartMutation, 
    removeFromCartMutation,
    getCartQuery,
    updateCartBuyerIdentityMutation,
    cartDiscountCodesUpdateMutation,
    cartGiftCardCodesUpdateMutation
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
    estimatedShipping: number | null;
    isCartLoading: boolean;
    addToCart: (variantId: string, quantity: number) => Promise<string | undefined>;
    updateQuantity: (lineId: string, quantity: number) => Promise<void>;
    removeFromCart: (lineId: string) => Promise<void>;
    applyDiscountCode: (code: string) => Promise<{ success: boolean; error?: string }>;
    applyGiftCard: (code: string) => Promise<{ success: boolean; error?: string }>;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, customerAccessToken }: { children: ReactNode, customerAccessToken?: string }) {
    const [cartId, setCartId] = useState<string | null>(null);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [items, setItems] = useState<CartItem[]>([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [estimatedShipping, setEstimatedShipping] = useState<number | null>(null);
    const [isCartLoading, setIsCartLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load Cart ID from local storage on mount
    useEffect(() => {
        const storedCartId = localStorage.getItem("shopify_cart_id");
        if (storedCartId) {
            setCartId(storedCartId);
            fetchCart(storedCartId).then((cartData) => {
                // If we have a token and the cart isn't associated with this user, update identity
                if (customerAccessToken && cartData?.buyerIdentity?.customer?.email === undefined) {
                    associateCustomer(storedCartId, customerAccessToken);
                }
            });
        } else {
            setIsCartLoading(false);
        }
    }, [customerAccessToken]);

    const associateCustomer = async (id: string, token: string) => {
        try {
            await shopifyFetch({
                query: updateCartBuyerIdentityMutation,
                variables: {
                    cartId: id,
                    buyerIdentity: { customerAccessToken: token }
                }
            });
        } catch (error) {
            console.error("Error associating cart to customer", error);
        }
    };

    const parseCartData = (cart: any) => {
        if (!cart) return;

        setCheckoutUrl(cart.checkoutUrl);
        setTotalQuantity(cart.totalQuantity || 0);
        setSubtotal(parseFloat(cart.cost?.subtotalAmount?.amount || "0"));

        let shipping: number | null = null;
        if (cart.deliveryGroups?.edges?.length > 0) {
            const options = cart.deliveryGroups.edges[0].node.deliveryOptions;
            if (options && options.length > 0) {
                const costs = options.map((opt: any) => parseFloat(opt.estimatedCost.amount));
                shipping = Math.min(...costs);
            }
        }
        setEstimatedShipping(shipping);

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
                return body.data.cart;
            } else {
                // Cart might be invalid or expired
                localStorage.removeItem("shopify_cart_id");
                setCartId(null);
                return null;
            }
        } catch (error) {
            console.error("Error fetching cart", error);
            return null;
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
                const newCheckoutUrl = body?.data?.cartLinesAdd?.cart?.checkoutUrl;
                parseCartData(body?.data?.cartLinesAdd?.cart);
                return newCheckoutUrl;
            } else {
                // Create new cart
                const { body } = await shopifyFetch({
                    query: createCartMutation,
                    variables: { 
                        input: {
                            lines,
                            buyerIdentity: customerAccessToken ? { customerAccessToken } : undefined
                        } 
                    },
                });
                const newCart = body?.data?.cartCreate?.cart;
                if (newCart) {
                    setCartId(newCart.id);
                    localStorage.setItem("shopify_cart_id", newCart.id);
                    parseCartData(newCart);
                    return newCart.checkoutUrl;
                }
            }
        } catch (error) {
            console.error("Error adding to cart", error);
        } finally {
            setIsCartLoading(false);
        }
        return undefined;
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

    const applyDiscountCode = async (code: string) => {
        if (!cartId) return { success: false, error: "No hay carrito activo." };
        setIsCartLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: cartDiscountCodesUpdateMutation,
                variables: { cartId, discountCodes: [code] },
            });
            const errors = body?.data?.cartDiscountCodesUpdate?.userErrors;
            if (errors && errors.length > 0) {
                return { success: false, error: errors[0].message };
            }
            if (body?.data?.cartDiscountCodesUpdate?.cart) {
                parseCartData(body.data.cartDiscountCodesUpdate.cart);
            }
            return { success: true };
        } catch (error) {
            console.error("Error applying discount code", error);
            return { success: false, error: "Error de conexión al aplicar el descuento." };
        } finally {
            setIsCartLoading(false);
        }
    };

    const applyGiftCard = async (code: string) => {
        if (!cartId) return { success: false, error: "No hay carrito activo." };
        setIsCartLoading(true);
        try {
            const { body } = await shopifyFetch({
                query: cartGiftCardCodesUpdateMutation,
                variables: { cartId, giftCardCodes: [code] },
            });
            const errors = body?.data?.cartGiftCardCodesUpdate?.userErrors;
            if (errors && errors.length > 0) {
                return { success: false, error: errors[0].message };
            }
            if (body?.data?.cartGiftCardCodesUpdate?.cart) {
                parseCartData(body.data.cartGiftCardCodesUpdate.cart);
            }
            return { success: true };
        } catch (error) {
            console.error("Error applying gift card", error);
            return { success: false, error: "Error de conexión al aplicar la tarjeta de regalo." };
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
                estimatedShipping,
                isCartLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
                applyDiscountCode,
                applyGiftCard,
                isCartOpen,
                setIsCartOpen,
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

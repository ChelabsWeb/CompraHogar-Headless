"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { GlassButton } from "@/components/ui/glass-button";
import { shopifyFetch } from "@/lib/shopify";
import { getProductsByIdsQuery } from "@/lib/customer";
import { AccountSectionHeader } from "@/components/cuenta/AccountSectionHeader";
import { AccountCard } from "@/components/cuenta/AccountCard";
import {
  WishlistCard,
  WishlistCardSkeleton,
  type WishlistCardProduct,
} from "@/components/shop/WishlistCard";

export default function FavoritosPage() {
  const { items } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<WishlistCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const fetchProducts = useCallback(async (ids: string[]) => {
    if (ids.length === 0) {
      setProducts([]);
      setFetchError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(false);
    try {
      const { body } = await shopifyFetch({
        query: getProductsByIdsQuery,
        variables: { ids },
      });
      const fetched: WishlistCardProduct[] =
        body.data?.nodes?.filter(Boolean) || [];
      setProducts(fetched);
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
      setProducts([]);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(items);
  }, [items, fetchProducts]);

  const handleAddToCart = async (product: WishlistCardProduct) => {
    const variantId = product.variants?.edges?.[0]?.node?.id;
    if (!variantId) return;

    setAddingToCart(product.id);
    try {
      await addToCart(variantId, 1);
      setIsCartOpen(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  const count = items.length;
  const description =
    count > 0
      ? `${count} producto${count === 1 ? "" : "s"} guardado${count === 1 ? "" : "s"}`
      : "Tu lista de productos guardados";

  if (!loading && count === 0) {
    return (
      <div className="space-y-6">
        <AccountSectionHeader title="Mis favoritos" description={description} />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountSectionHeader title="Mis favoritos" description={description} />

      {fetchError && !loading && (
        <div
          role="alert"
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl text-sm"
        >
          No pudimos cargar tus productos favoritos. Recargá la página o
          intentá de nuevo en unos minutos.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: count || 4 }).map((_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              isAdding={addingToCart === product.id}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <AccountCard
      padding="lg"
      className="flex flex-col items-center justify-center py-14 text-center"
    >
      <span
        className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5"
        aria-hidden
      >
        <Heart className="w-7 h-7" />
      </span>
      <h2 className="font-display text-[20px] sm:text-[22px] font-normal tracking-tight text-foreground mb-2">
        Aún no tenés favoritos
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-7">
        Cuando encuentres productos que te gusten, tocá el corazón para
        guardarlos acá.
      </p>
      <GlassButton variant="light" size="md" asChild>
        <Link href="/products">Explorar productos</Link>
      </GlassButton>
    </AccountCard>
  );
}

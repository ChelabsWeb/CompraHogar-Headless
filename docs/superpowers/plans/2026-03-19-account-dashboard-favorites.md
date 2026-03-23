# Account Dashboard, Favorites & Order History — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete account dashboard with sidebar navigation, favorites system with header icon + drawer + Shopify sync, and dedicated order history with detail pages.

**Architecture:** Next.js App Router nested layout at `/cuenta/layout.tsx` handles auth guard + sidebar. Each dashboard section is a sub-route with its own `page.tsx`. Favorites use a proxy API route (`/api/wishlist/sync`) for Admin API writes. All existing components/mutations are extended, not rewritten.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI, Framer Motion, lucide-react, Shopify Storefront + Admin API, SWR

**Spec:** `docs/superpowers/specs/2026-03-19-account-dashboard-favorites-design.md`

---

## File Map

### Files to Modify
| File | Responsibility |
|------|---------------|
| `src/lib/customer.ts` | Add `addresses(first:10)` + wishlist metafield to customer query, add `customerDefaultAddressUpdate` mutation, add `getProductsByIds` query |
| `src/app/cuenta/page.tsx` | Replace with redirect to `/cuenta/perfil` |
| `src/app/cuenta/actions.ts` | Add wishlist server actions (`getWishlist`, `syncWishlist`), add `setDefaultAddress` action |
| `src/components/shop/WishlistProvider.tsx` | Add Shopify sync (isLoggedIn prop, merge on mount, debounced sync) |
| `src/components/layout/Header.tsx` | Add Heart icon with badge + FavoritesSheet trigger in desktop bottom bar |
| `src/app/layout.tsx` | Pass `isLoggedIn` to WishlistProvider |

### Files to Create
| File | Responsibility |
|------|---------------|
| `src/app/cuenta/layout.tsx` | Dashboard shell: auth guard + sidebar (desktop) / tabs (mobile) + content area |
| `src/app/cuenta/perfil/page.tsx` | Edit profile form (name, email, phone, marketing) |
| `src/app/cuenta/direcciones/page.tsx` | Address list + add/edit/delete modals |
| `src/app/cuenta/mis-compras/page.tsx` | Order history list with status badges |
| `src/app/cuenta/mis-compras/[id]/page.tsx` | Order detail with timeline, products, shipping, payment |
| `src/app/cuenta/favoritos/page.tsx` | Full favorites page using ProductGrid |
| `src/app/cuenta/cambiar-password/page.tsx` | Change password form |
| `src/components/shop/FavoritesSheet.tsx` | Favorites drawer (right side, like CartSheet) |
| `src/components/shop/AddressCard.tsx` | Single address card with label badge, edit/delete buttons |
| `src/components/shop/AddressForm.tsx` | Address add/edit modal form with validation |
| `src/components/shop/OrderTimeline.tsx` | Visual vertical timeline for order status |
| `src/app/api/wishlist/sync/route.ts` | Admin API proxy for writing wishlist metafield |

---

## Task 1: Extend Shopify Customer API Layer

**Files:**
- Modify: `src/lib/customer.ts`

- [ ] **Step 1: Add addresses + wishlist metafield to getCustomerQuery**

In `src/lib/customer.ts`, replace the `getCustomerQuery` to include `addresses(first: 10)` and `metafield(namespace: "custom", key: "wishlist")`:

```typescript
export const getCustomerQuery = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            shippingAddress {
              address1
              address2
              city
              province
              country
              zip
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            successfulFulfillments {
              trackingInfo {
                number
                url
              }
            }
          }
        }
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
      defaultAddress {
        id
        address1
        address2
        city
        province
        country
        zip
      }
      metafield(namespace: "custom", key: "wishlist") {
        value
      }
    }
  }
`;
```

- [ ] **Step 2: Add customerDefaultAddressUpdate mutation**

Append to `src/lib/customer.ts`:

```typescript
export const customerDefaultAddressUpdateMutation = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export interface CustomerDefaultAddressUpdateResponse {
  data: {
    customerDefaultAddressUpdate: {
      customer: { id: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}
```

- [ ] **Step 3: Add getProductsByIdsQuery for favorites drawer**

Append to `src/lib/customer.ts`:

```typescript
export const getProductsByIdsQuery = `
  query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;
```

- [ ] **Step 4: Update Order type to include new fields**

Update the `Order` interface in `src/lib/customer.ts`:

```typescript
export interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice?: {
    amount: string;
    currencyCode: string;
  };
  totalShippingPrice?: {
    amount: string;
    currencyCode: string;
  };
  shippingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  lineItems: {
    edges: {
      node: OrderLineItem;
    }[];
  };
  successfulFulfillments: Fulfillment[];
}
```

- [ ] **Step 5: Update OrderLineItem to include price**

```typescript
export interface OrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price?: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText?: string;
    } | null;
  } | null;
}
```

- [ ] **Step 6: Verify build**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && npx next build --no-lint 2>&1 | head -30`

Ensure no TypeScript errors in `customer.ts`.

---

## Task 2: Dashboard Layout with Auth Guard

**Files:**
- Create: `src/app/cuenta/layout.tsx`
- Modify: `src/app/cuenta/page.tsx`

- [ ] **Step 1: Create the dashboard layout**

Create `src/app/cuenta/layout.tsx`:

```typescript
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";
import { AccountSidebar } from "./account-sidebar";

export const metadata = {
  title: "Mi Cuenta | CompraHogar",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const { body } = await shopifyFetch({
    query: getCustomerQuery,
    variables: { customerAccessToken: token },
    cache: "no-store",
  });

  const customer = body.data?.customer;

  if (!customer) {
    // Token expired or invalid
    const cookieStore2 = await cookies();
    cookieStore2.delete("customerAccessToken");
    redirect("/login");
  }

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar — desktop */}
          <AccountSidebar customer={customer} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the sidebar component**

Create `src/app/cuenta/account-sidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package, Heart, Lock, LogOut } from "lucide-react";
import { logout } from "./actions";

const NAV_ITEMS = [
  { href: "/cuenta/perfil", label: "Mi Perfil", icon: User },
  { href: "/cuenta/direcciones", label: "Mis Direcciones", icon: MapPin },
  { href: "/cuenta/mis-compras", label: "Mis Compras", icon: Package },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/cuenta/cambiar-password", label: "Cambiar Contraseña", icon: Lock },
];

interface AccountSidebarProps {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function AccountSidebar({ customer }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-[140px]">
          {/* User Avatar */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
            <div className="w-11 h-11 bg-[#21645d]/10 text-[#21645d] rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{customer.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#21645d]/10 text-[#21645d]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-none border-b border-slate-200 bg-white -mt-8 pt-4 pb-0 sticky top-[56px] z-30">
        <div className="flex gap-1 min-w-max pb-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#21645d] text-white"
                    : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        {/* Mobile logout at bottom of each page content instead */}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Replace cuenta/page.tsx with redirect**

Replace `src/app/cuenta/page.tsx`:

```typescript
import { redirect } from "next/navigation";

export default function AccountPage() {
  redirect("/cuenta/perfil");
}
```

- [ ] **Step 4: Verify — visit `/cuenta` redirects to `/cuenta/perfil`**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm dev`

Expected: Navigating to `/cuenta` redirects to `/cuenta/perfil`. Sidebar renders on desktop. Tabs render on mobile.

---

## Task 3: Profile Page

**Files:**
- Create: `src/app/cuenta/perfil/page.tsx`

- [ ] **Step 1: Create the profile page**

Create `src/app/cuenta/perfil/page.tsx` — a client component that receives customer data from the parent layout via a server action fetch pattern. Since the layout already fetches customer data but Next.js App Router doesn't pass layout data to pages, the profile page must re-fetch:

```typescript
"use client";

import { useState, useEffect } from "react";
import { User, Pencil, Check, X, Loader2 } from "lucide-react";
import { updateCustomerProfile } from "../actions";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptsMarketing: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileData>({ firstName: "", lastName: "", email: "", phone: "", acceptsMarketing: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/customer/profile");
      const data = await res.json();
      if (data.customer) {
        setProfile(data.customer);
        setForm(data.customer);
      }
    } catch {
      setMessage({ text: "Error al cargar el perfil", isError: true });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    try {
      const result = await updateCustomerProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        acceptsMarketing: form.acceptsMarketing,
      });

      if (result.customerUserErrors?.length > 0) {
        setMessage({ text: result.customerUserErrors[0].message, isError: true });
      } else {
        setProfile(form);
        setIsEditing(false);
        setMessage({ text: "Perfil actualizado correctamente", isError: false });
      }
    } catch {
      setMessage({ text: "Error al actualizar el perfil", isError: true });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
        {!isEditing && (
          <button
            onClick={() => { setIsEditing(true); setForm(profile!); setMessage(null); }}
            className="flex items-center gap-2 text-sm font-medium text-[#21645d] hover:text-[#1a504a] transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${message.isError ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        {isEditing ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Apellido</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+598 99 123 456"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#21645d]/20 focus:border-[#21645d]"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.acceptsMarketing}
                onChange={(e) => setForm({ ...form, acceptsMarketing: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#21645d] focus:ring-[#21645d]"
              />
              <span className="text-sm text-slate-600">Acepto recibir ofertas y novedades por email</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !form.firstName}
                className="flex items-center gap-2 bg-[#21645d] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a504a] transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Guardar
              </button>
              <button
                onClick={() => { setIsEditing(false); setMessage(null); }}
                className="flex items-center gap-2 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <InfoRow label="Nombre" value={`${profile?.firstName || ""} ${profile?.lastName || ""}`} />
            <InfoRow label="Email" value={profile?.email || ""} />
            <InfoRow label="Teléfono" value={profile?.phone || "No registrado"} />
            <InfoRow label="Marketing" value={profile?.acceptsMarketing ? "Suscrito a ofertas" : "No suscrito"} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm font-medium text-slate-500 sm:w-32 shrink-0">{label}</span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}
```

- [ ] **Step 2: Create API route for profile fetch**

Create `src/app/api/customer/profile/route.ts`:

```typescript
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  try {
    const { body } = await shopifyFetch({
      query: getCustomerQuery,
      variables: { customerAccessToken: token },
      cache: "no-store",
    });

    return NextResponse.json({ customer: body.data?.customer || null });
  } catch {
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify build and test profile page**

Run build to check for errors. Navigate to `/cuenta/perfil` and verify display + edit mode.

---

## Task 4: Address Management Page

**Files:**
- Create: `src/app/cuenta/direcciones/page.tsx`
- Create: `src/components/shop/AddressCard.tsx`
- Create: `src/components/shop/AddressForm.tsx`
- Modify: `src/app/cuenta/actions.ts` (add setDefaultAddress)

- [ ] **Step 1: Add setDefaultAddress server action**

Append to `src/app/cuenta/actions.ts`:

```typescript
import {
  // ... existing imports ...
  customerDefaultAddressUpdateMutation,
  type CustomerDefaultAddressUpdateResponse,
} from "@/lib/customer";

export async function setDefaultAddress(addressId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    throw new Error("No estás autenticado");
  }

  const { body } = await shopifyFetch({
    query: customerDefaultAddressUpdateMutation,
    variables: {
      customerAccessToken: token,
      addressId,
    },
  }) as { body: CustomerDefaultAddressUpdateResponse };

  return body.data.customerDefaultAddressUpdate;
}
```

- [ ] **Step 2: Create AddressCard component**

Create `src/components/shop/AddressCard.tsx`:

A card component showing: label badge, name, full address, phone, "Predeterminada" badge if default, Edit + Delete buttons. Props: `address`, `isDefault`, `label`, `onEdit`, `onDelete`, `onSetDefault`.

- [ ] **Step 3: Create AddressForm component**

Create `src/components/shop/AddressForm.tsx`:

A modal/dialog form with fields: label (select: Casa/Oficina/Otra), firstName, lastName, address1, address2, city, province (dropdown of 19 Uruguayan departments), zip (5 digits), country (default Uruguay), phone. "Marcar como predeterminada" checkbox. Validation: required fields marked. Uses Radix Dialog for modal.

- [ ] **Step 4: Create the addresses page**

Create `src/app/cuenta/direcciones/page.tsx`:

Client component that fetches customer addresses via `/api/customer/profile`, renders grid of AddressCards, "Agregar dirección" button opens AddressForm modal. Uses `createCustomerAddress`, `updateCustomerAddress`, `deleteCustomerAddress`, `setDefaultAddress` server actions.

Note: address labels are stored locally (localStorage key `comprahogar_address_labels` as `{[addressId]: "Casa"|"Oficina"|"Otra"}`), since Shopify doesn't have a label field.

- [ ] **Step 5: Verify build and test address CRUD**

---

## Task 5: Order History Page

**Files:**
- Create: `src/app/cuenta/mis-compras/page.tsx`

- [ ] **Step 1: Create the order history page**

Create `src/app/cuenta/mis-compras/page.tsx`:

Client component that fetches orders via `/api/customer/profile`. Renders order cards (reuse existing `OrderHistory` component or build new cards that link to detail pages). Each card shows: order number, date, status badge (color-coded), total, item count, and is clickable → navigates to `/cuenta/mis-compras/[orderNumber]`.

Status badge mapping:
- `PAID` + `FULFILLED` → "Completado" (green)
- `PAID` + `UNFULFILLED` → "En proceso" (blue)
- `PENDING` → "Pendiente" (yellow)
- `REFUNDED` → "Reembolsado" (gray)

Empty state: existing empty state from `OrderHistory.tsx`.

- [ ] **Step 2: Verify — navigate to `/cuenta/mis-compras`**

---

## Task 6: Order Detail Page with Timeline

**Files:**
- Create: `src/components/shop/OrderTimeline.tsx`
- Create: `src/app/cuenta/mis-compras/[id]/page.tsx`

- [ ] **Step 1: Create OrderTimeline component**

Create `src/components/shop/OrderTimeline.tsx`:

Vertical timeline component. Props: `financialStatus`, `fulfillmentStatus`, `processedAt`, `trackingUrl?`.

Steps:
1. Pedido recibido — always complete, shows `processedAt` date
2. Pago confirmado — complete if `financialStatus === 'PAID'`
3. En preparación — complete if paid + unfulfilled (transitional)
4. Enviado — complete if `fulfillmentStatus === 'PARTIALLY_FULFILLED'` or tracking exists
5. Entregado — complete if `fulfillmentStatus === 'FULFILLED'`

Visual: vertical line with circles (filled green = complete, pulsing teal = current, empty gray = pending).

- [ ] **Step 2: Create order detail page**

Create `src/app/cuenta/mis-compras/[id]/page.tsx`:

Client component. Gets `[id]` param (order number). Fetches all orders from `/api/customer/profile`, finds matching order by `orderNumber`. Displays:
- Back link to `/cuenta/mis-compras`
- Order number + status badge + date
- OrderTimeline component
- Products list with thumbnails, titles, variants, quantities, line totals
- Shipping address section
- Payment summary (subtotal, shipping, total)
- Tracking link if available

- [ ] **Step 3: Verify — click an order from list navigates to detail with timeline**

---

## Task 7: Change Password Page

**Files:**
- Create: `src/app/cuenta/cambiar-password/page.tsx`

- [ ] **Step 1: Create the change password page**

Create `src/app/cuenta/cambiar-password/page.tsx`:

Simple client component with:
- New password input (min 5 chars)
- Confirm password input
- Submit button
- Validation: passwords must match, min 5 chars
- Calls `updateCustomerProfile({ password: newPassword })` server action
- Success/error message display

- [ ] **Step 2: Verify — test password change flow**

---

## Task 8: Wishlist Shopify Sync

**Files:**
- Create: `src/app/api/wishlist/sync/route.ts`
- Modify: `src/app/cuenta/actions.ts`
- Modify: `src/components/shop/WishlistProvider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create the wishlist sync API route**

Create `src/app/api/wishlist/sync/route.ts`:

```typescript
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/customer";

const ADMIN_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get customer ID from Storefront API
  const { body } = await shopifyFetch({
    query: getCustomerQuery,
    variables: { customerAccessToken: token },
    cache: "no-store",
  });

  const customerId = body.data?.customer?.id;
  if (!customerId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { productIds } = await req.json();

  if (!Array.isArray(productIds)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Write metafield via Admin API
  const adminEndpoint = `https://${ADMIN_DOMAIN}/admin/api/2024-04/graphql.json`;

  const mutation = `
    mutation customerMetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }
  `;

  const res = await fetch(adminEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN!,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        metafields: [{
          ownerId: customerId,
          namespace: "custom",
          key: "wishlist",
          type: "json",
          value: JSON.stringify(productIds),
        }],
      },
    }),
  });

  const result = await res.json();

  if (result.data?.metafieldsSet?.userErrors?.length > 0) {
    return NextResponse.json({ error: result.data.metafieldsSet.userErrors[0].message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    return NextResponse.json({ items: [] });
  }

  try {
    const { body } = await shopifyFetch({
      query: getCustomerQuery,
      variables: { customerAccessToken: token },
      cache: "no-store",
    });

    const wishlistMetafield = body.data?.customer?.metafield?.value;
    const items = wishlistMetafield ? JSON.parse(wishlistMetafield) : [];

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
```

- [ ] **Step 2: Update WishlistProvider with Shopify sync**

Modify `src/components/shop/WishlistProvider.tsx` to accept `isLoggedIn` prop, fetch from Shopify on mount if logged in, merge with localStorage, and debounce sync on changes.

Key changes:
- Add `isLoggedIn` prop
- On mount + isLoggedIn: fetch `/api/wishlist/sync` (GET), merge with localStorage
- On toggle + isLoggedIn: optimistic localStorage update, debounced POST to `/api/wishlist/sync`
- Keep all localStorage behavior for non-logged-in users

- [ ] **Step 3: Update layout.tsx to pass isLoggedIn to WishlistProvider**

In `src/app/layout.tsx`, change:
```tsx
<WishlistProvider>
```
to:
```tsx
<WishlistProvider isLoggedIn={isLoggedIn}>
```

- [ ] **Step 4: Verify sync — toggle favorite while logged in, check metafield**

---

## Task 9: Favorites Drawer + Header Icon

**Files:**
- Create: `src/components/shop/FavoritesSheet.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Create FavoritesSheet component**

Create `src/components/shop/FavoritesSheet.tsx`:

Right-side drawer (same pattern as `CartSheet.tsx`). Shows:
- Header: "Favoritos (N)" + close button
- Loading: skeleton cards while fetching product data
- Product list: thumbnail, title (linked), price, availability badge, "Agregar al carrito" button, remove (trash) button
- Empty state: heart icon + "No tenés favoritos aún" + "Explorar productos" link
- Footer: "Ver todos →" link to `/cuenta/favoritos`

Fetches product data by calling Shopify `nodes` query with product IDs from wishlist context. Uses `getProductsByIdsQuery` from `customer.ts`.

- [ ] **Step 2: Add Heart icon to desktop Header**

In `src/components/layout/Header.tsx`, in the desktop bottom bar actions section (around line 223), add Heart icon between "Mis compras" and the cart button:

```tsx
import { Heart } from "lucide-react";
import { useWishlist } from "@/components/shop/WishlistProvider";
import { FavoritesSheet } from "@/components/shop/FavoritesSheet";
```

Add state: `const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);`
Add wishlist: `const { count: wishlistCount } = useWishlist();`

Add the Heart button between "Mis compras" link and cart button:

```tsx
<button
  className="relative flex items-center justify-center w-11 h-11 hover:bg-black/10 rounded-full transition-colors"
  onClick={() => setIsFavoritesOpen(true)}
>
  <Heart className="w-5 h-5" />
  {wishlistCount > 0 && (
    <span className="absolute top-0 right-0 w-4 h-4 bg-white text-[#21645d] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm border border-[#21645d]">
      {wishlistCount}
    </span>
  )}
</button>
```

Render `<FavoritesSheet isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />` next to CartDrawer.

- [ ] **Step 3: Update "Mis Compras" link in Header**

Change both "Mis compras" links in Header from `/cuenta` to `/cuenta/mis-compras`.

- [ ] **Step 4: Add Favoritos link to mobile menu drawer**

In `Header.tsx`, in the mobile drawer links section (around line 121), add a "Favoritos" link:

```tsx
<SheetClose asChild>
  <Link href="/cuenta/favoritos" className="flex items-center gap-4 px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-[15px] transition-colors">
    <Heart className="w-5 h-5 text-slate-400" /> Favoritos
  </Link>
</SheetClose>
```

- [ ] **Step 5: Verify — Heart icon visible in desktop header, click opens drawer, mobile menu has Favoritos link**

---

## Task 10: Favorites Full Page

**Files:**
- Create: `src/app/cuenta/favoritos/page.tsx`

- [ ] **Step 1: Create the favorites page**

Create `src/app/cuenta/favoritos/page.tsx`:

Client component that:
- Gets wishlist items from `useWishlist()` context
- Fetches full product data using `getProductsByIdsQuery` via Shopify Storefront API
- Renders products using a grid layout (similar to `ProductGrid` but simpler — just cards with image, title, price, FavoriteButton, and "Agregar al carrito")
- Shows empty state if no favorites
- Loading skeleton while fetching

- [ ] **Step 2: Verify — navigate to `/cuenta/favoritos` and see favorited products**

---

## Task 11: Final Integration & Verification

- [ ] **Step 1: Run full build**

Run: `cd "C:/Users/Estudiante UCU/Desktop/CompraHogar-Headless" && pnpm build`

Fix any TypeScript or build errors.

- [ ] **Step 2: Test complete flow**

1. Login → redirected to `/cuenta/perfil`
2. Edit profile → save → verify changes persist
3. Navigate to Direcciones → add address with label → edit → delete → set default
4. Navigate to Mis Compras → see order list → click order → see detail with timeline
5. Click Heart in header → drawer opens → see favorited products → "Ver todos" goes to full page
6. Toggle favorite while logged in → refresh → favorites persist (Shopify sync)
7. Mobile: verify tabs, mobile menu Favoritos link, responsive layout

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: complete account dashboard with favorites, orders & profile management

- Dashboard layout with sidebar (desktop) / tabs (mobile)
- Profile editing (name, email, phone, marketing)
- Address management with labels (Casa/Oficina/Otra)
- Order history with detail view and status timeline
- Favorites: header icon, drawer, full page, Shopify metafield sync
- Change password page
- Auth guard in shared layout"
```

"use client";

import useSWR from "swr";
import type { Order, CustomerAddress } from "@/lib/customer";

export interface CustomerDefaultAddress {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
}

export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  acceptsMarketing: boolean;
  metafield?: { value: string } | null;
  orders: { edges: { node: Order }[] };
  addresses: { edges: { node: CustomerAddress }[] };
  defaultAddress?: CustomerDefaultAddress | null;
}

interface CustomerResponse {
  customer: CustomerData | null;
}

async function customerFetcher(url: string): Promise<CustomerResponse> {
  const res = await fetch(url, { credentials: "include" });
  if (res.status === 401) {
    throw new Error("unauthenticated");
  }
  if (!res.ok) {
    throw new Error(`customer_fetch_failed:${res.status}`);
  }
  return res.json();
}

export function useCustomer() {
  const { data, error, isLoading, mutate } = useSWR<CustomerResponse>(
    "/api/customer/profile",
    customerFetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60_000,
      shouldRetryOnError: false,
    }
  );

  return {
    customer: data?.customer ?? null,
    isLoading,
    error: error as Error | undefined,
    mutate,
  };
}

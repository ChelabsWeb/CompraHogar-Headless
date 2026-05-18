"use client";

import useSWR from "swr";

interface LocationApiResponse {
  department: string | null;
}

const LOCATION_KEY = "/api/location";

const fetcher = async (url: string): Promise<LocationApiResponse> => {
  try {
    const res = await fetch(url);
    // Silent-degrade: location is non-critical for UI — both network errors
    // and HTTP errors produce a null department, and consumers show a
    // generic fallback ("Envío a todo Uruguay").
    if (!res.ok) return { department: null };
    return await res.json();
  } catch {
    return { department: null };
  }
};

export function useUserLocation() {
  const { data, isLoading } = useSWR<LocationApiResponse>(LOCATION_KEY, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: false,
    dedupingInterval: 5 * 60 * 1000,
  });

  return {
    department: data?.department ?? null,
    isLoading,
  };
}

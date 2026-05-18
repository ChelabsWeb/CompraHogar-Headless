import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { useUserLocation } from "@/hooks/useUserLocation";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useUserLocation", () => {
  it("returns department when /api/location resolves with one", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ department: "Montevideo" }),
      })
    );

    const { result } = renderHook(() => useUserLocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.department).toBe("Montevideo");
  });

  it("returns null department when /api/location resolves with department=null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ department: null }),
      })
    );

    const { result } = renderHook(() => useUserLocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.department).toBeNull();
  });

  it("returns null department when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const { result } = renderHook(() => useUserLocation(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.department).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCardShipping } from "@/components/shop/ProductCardShipping";

vi.mock("@/hooks/useUserLocation", () => ({
  useUserLocation: vi.fn(),
}));

import { useUserLocation } from "@/hooks/useUserLocation";

beforeEach(() => {
  vi.mocked(useUserLocation).mockReset();
});

describe("ProductCardShipping", () => {
  it("renders nothing when priceAmount is 0", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: false });
    const { container } = render(<ProductCardShipping priceAmount={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows 'Envío gratis' when priceAmount >= 4000", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: false });
    render(<ProductCardShipping priceAmount={4500} />);
    expect(screen.queryByText("Envío gratis")).not.toBeNull();
  });

  it("shows 'Llega en {estimate}' when department is known and price below threshold", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: "Montevideo", isLoading: false });
    render(<ProductCardShipping priceAmount={2500} />);
    expect(screen.queryByText(/Llega en 1-2 días hábiles/)).not.toBeNull();
  });

  it("shows fallback 'Envío a todo Uruguay' when no department and price below threshold", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: false });
    render(<ProductCardShipping priceAmount={2500} />);
    expect(screen.queryByText("Envío a todo Uruguay")).not.toBeNull();
  });

  it("renders nothing while location is loading and price below threshold", () => {
    vi.mocked(useUserLocation).mockReturnValue({ department: null, isLoading: true });
    const { container } = render(<ProductCardShipping priceAmount={2500} />);
    expect(container.firstChild).toBeNull();
  });
});

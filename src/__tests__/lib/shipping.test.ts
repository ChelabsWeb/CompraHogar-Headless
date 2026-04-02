import { describe, it, expect } from 'vitest';
import { SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD, getShippingRate } from '@/lib/constants/shippingRates';

describe('Shipping rates', () => {
  it('covers all 19 departments of Uruguay', () => {
    const departments = Object.keys(SHIPPING_ZONES);
    expect(departments.length).toBe(19);
  });

  it('Montevideo has the lowest rate', () => {
    const mvd = SHIPPING_ZONES['Montevideo'];
    expect(mvd).toBeDefined();
    expect(mvd.rate).toBeLessThanOrEqual(300);
  });

  it('all zones have rate and estimate', () => {
    for (const [dept, zone] of Object.entries(SHIPPING_ZONES)) {
      expect(zone.rate).toBeGreaterThan(0);
      expect(zone.estimate).toBeDefined();
      expect(zone.estimate.length).toBeGreaterThan(0);
    }
  });

  it('free shipping threshold is 4000', () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(4000);
  });

  it('getShippingRate returns free shipping above threshold', () => {
    const result = getShippingRate('Montevideo', 5000);
    expect(result).toEqual({ rate: 0, estimate: 'Envío gratis' });
  });

  it('getShippingRate returns null for no department', () => {
    expect(getShippingRate(null, 1000)).toBeNull();
  });

  it('getShippingRate returns zone rate below threshold', () => {
    const result = getShippingRate('Montevideo', 1000);
    expect(result?.rate).toBe(250);
  });
});

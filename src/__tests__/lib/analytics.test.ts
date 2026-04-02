import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pushDatalayerEvent, type ViewItemEvent } from '@/lib/analytics';

describe('pushDatalayerEvent', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { dataLayer: [] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('pushes event to dataLayer', () => {
    const event: ViewItemEvent = {
      event: 'view_item',
      ecommerce: {
        currency: 'UYU',
        value: 1000,
        items: [{ item_id: '1', item_name: 'Test', price: 1000, quantity: 1 }],
      },
    };

    pushDatalayerEvent(event);

    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer[0]).toEqual({ ecommerce: null });
    expect(window.dataLayer[1]).toEqual(event);
  });

  it('does not crash when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);

    expect(() => {
      pushDatalayerEvent({
        event: 'view_item',
        ecommerce: { currency: 'UYU', value: 0, items: [] },
      });
    }).not.toThrow();
  });
});

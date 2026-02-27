import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('server-only', () => ({}));

import { shopifyFetch } from './fetch';

// Mock validateEnvironment via process.env
describe('shopifyFetch', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.SHOPIFY_STORE_DOMAIN = 'mock.domain.com';
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = 'mock-token';
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  });

  it('throws error if environment variables are missing', async () => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    await expect(shopifyFetch({ query: '{ shop { name } }' })).rejects.toThrow('Missing Shopify environment variables');
  });

  it('successfully fetches data', async () => {
    const mockData = { shop: { name: 'Test Shop' } };
    vi.mocked(fetch).mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ data: mockData }),
    } as Response);

    const result = await shopifyFetch({ query: '{ shop { name } }' });
    
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ data: mockData });
    expect(result.error).toBeUndefined();
    
    // Verify headers
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('mock.domain.com'),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': 'mock-token',
        },
      })
    );
  });

  it('handles GraphQL API errors elegantly without throwing', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ errors: [{ message: 'Field not found' }] }),
    } as Response);

    const result = await shopifyFetch({ query: 'INVALID' });
    
    expect(result.status).toBe(200);
    expect(result.body).toBeNull();
    expect(result.error).toBe('Field not found');
  });

  it('handles network errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network offline'));

    const result = await shopifyFetch({ query: '{ shop { name } }' });
    
    expect(result.status).toBe(500);
    expect(result.body).toBeNull();
    expect(result.error).toBe('Network offline');
  });
});

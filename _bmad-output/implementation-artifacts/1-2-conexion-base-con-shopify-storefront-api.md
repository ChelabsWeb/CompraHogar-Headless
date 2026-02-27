# Story 1.2: Conexión Base con Shopify Storefront API

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a System,
I want a centralized, memoized `shopifyFetch` utility using React.cache(),
So that the application can securely query Shopify data from Server Components without duplication per render cycle.

## Acceptance Criteria

1. **Given** the required Shopify access tokens in `.env.local`
2. **When** a Server Component requests data through `shopifyFetch`
3. **Then** the request is sent asynchronously to the Shopify Edge CDN
4. **And** the response is cached per render cycle via `React.cache()`
5. **And** errors are handled gracefully returning typed objects instead of throwing raw exceptions

## Tasks / Subtasks

- [x] Task 1: Environment & Token Validation (AC: 1)
  - [x] Implement validation to ensure `SHOPIFY_STOREFRONT_ACCESS_TOKEN` and `SHOPIFY_STORE_DOMAIN` exist in server scope.
  - [x] Throw an immediate explicit compilation error if tokens are missing to fail-fast.
- [x] Task 2: Core Fetch Utility Implementation (AC: 2, 3, 4)
  - [x] Implement `shopifyFetch` inside `src/lib/shopify/fetch.ts`.
  - [x] Wrap the `fetch` call natively with `React.cache()` to memoize responses per render tree.
  - [x] Configure `fetch` options: `method: 'POST'`, strict `headers` (Content-Type, X-Shopify-Storefront-Access-Token).
- [x] Task 3: Error Handling & Type Safety (AC: 5)
  - [x] Ensure returning structure does not rely on throwing exceptions that crash Next.js SSR boundaries.
  - [x] Return objects with explicit status definitions (e.g. `{ status: HTTP_CODE, body: JSON, error?: string }`).

## Developer Context & Guardrails

### ⚠️ Technical Requirements
- **Server Only**: This utility MUST run exclusively in the Node.js/Edge runtime. Exposing `SHOPIFY_STOREFRONT_ACCESS_TOKEN` to `NEXT_PUBLIC_` is strictly forbidden.
- **Data Caching**: `React.cache()` memoizes the result of identical requests during a single render pass in a Server Component. Next.js `fetch` might also cache the response across renders. Ensure `next: { revalidate: 300 }` (or similar ISR configuration parameter) is passable via options if needed.

### 🏗️ Architecture Compliance
- **File Structure Boundaires**:
  - Implementation belongs exclusively in `src/lib/shopify/fetch.ts`.
  - Type definitions go to `src/types/shopify.ts`.
- **Naming Conventions**: GraphQL queries relying on this should use the `*Query` suffix (e.g., `getProductQuery`).

### 📚 Library & Framework Requirements
- **Next.js 16 (App Router)**: Native `fetch` API is extended by Next.js. Avoid using heavy clients like Apollo or URQL. Standard `fetch` is required per BMad specifications to hit the LCP budget.
- **TypeScript**:
  - `strict` mode is on. `any` is prohibited.
  - Define interfaces for `ShopifyFetchParams` (query, variables, cache options).

### 🧪 Error Handling Patterns
- According to Architecture Design, do NOT use `throw new Error()` for API rejections.
- Wrap the fetch in a `try/catch` and return an elegant typed error boundary:
  `return { status: 500, error: 'Error receiving data' }` instead of collapsing the Next.js `page.tsx`.

## Previous Story Intelligence (Story 1.1)
- **SSR Poisoning Avoided**: In Story 1.1, we discovered MSW caused SSR React Hydration issues. Make sure the implementation of `shopifyFetch` easily intercepts with our MSW setup in `src/mocks/handlers.ts` without triggering hydration mismatch.
- **Strict Compliance**: The previous story triggered TS lint errors when utilizing `any`. Define generic params cleanly via `Record<string, unknown>`.

## Project Context Reference
- **Anti-Patterns**: DO NOT mix Client and Server fetching. If `shopifyFetch` is in a component, that component CANNOT have `"use client"`. (Source: `_bmad-output/project-context.md#Critical Don't-Miss Rules`).

## Dev Agent Record

### Agent Model Used
Gemini 2.5 Flash

### Debug Log References
- Confirmed Typescript generic returns correct Shopify Fetch definitions without throwing `any` warnings via `tsc --noEmit`.

### Completion Notes List
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Implemented `shopifyFetch` inside `src/lib/shopify/fetch.ts` utilizing native `React.cache()` and strictly requiring `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` from server environment.
- Upgraded `src/app/layout.tsx` to utilize the new robust fetching engine directly.
- **[Code Review Fix]** Added `server-only` directive.
- **[Code Review Fix]** Removed `any` usages originating from legacy files and missing typings in `ProductGrid`.
- **[Code Review Fix]** Created comprehensive unit tests bridging the AC requirements.

### File List
- [NEW] `src/lib/shopify/fetch.ts`
- [NEW] `src/types/shopify.ts`
- [MODIFIED] `src/app/layout.tsx`
- [MODIFIED] `src/mocks/handlers.ts`
- [MODIFIED] `src/components/MSWProvider.tsx`
- [MODIFIED] `src/components/layout/Header.tsx`
- [MODIFIED] `src/components/shop/ProductGrid.tsx`
- [NEW] `src/lib/shopify/fetch.test.ts`
- [DELETED] `src/lib/shopify.ts`

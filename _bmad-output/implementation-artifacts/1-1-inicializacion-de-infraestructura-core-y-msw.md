# Story 1.1: Inicialización de Infraestructura Core y MSW

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to initialize the "Clean Room" Next.js project with Tailwind v4, Shadcn UI Canary, and Mock Service Worker (MSW),
so that the team has a solid, performant foundation (LCP < 2.5s) and can test safely without hitting Shopify API Rate Limits.

## Acceptance Criteria

1. **Given** the project repository is empty or requires the base infrastructure
   **When** the initialization command is run and MSW is configured
   **Then** a Next.js 15/16 app is created with Tailwind v4 and strict TypeScript
2. **And** Shadcn UI Canary is initialized with the "Modern Luxe" base theme (Off-white bg, no heavy shadows)
3. **And** MSW is configured to intercept `shopifyFetch` calls in development/test environments

## Tasks / Subtasks

- [x] Task 1: Initialize Next.js 16 Base Project (AC: 1)
  - [x] Run Next.js CLI with required flags (`--typescript`, `--tailwind`, `--eslint`, `--app`, `--src-dir`, `--import-alias "@/*"`)
  - [x] Verify `next.config.ts`, `tsconfig.json`, and Tailwind v4 (`@tailwindcss/postcss`) structure.
- [x] Task 2: Initialize Shadcn UI Canary (AC: 2)
  - [x] Run `npx shadcn@canary init -d`
  - [x] Ensure the theme selected/configured defaults to "New York".
  - [x] Enforce flat design variables globally (`--radius: 0`, and remove default shadows) to match the "Modern Luxe" PRD mandate.
- [x] Task 3: Setup Mock Service Worker (MSW) for Shopify (AC: 3)
  - [x] Install `msw` dependency.
  - [x] Create the browser and server worker setups (`src/mocks/browser.ts`, `src/mocks/server.ts`, `src/mocks/handlers.ts`).
  - [x] Ensure MSW initializes securely only in `development` or `test` environments.

## Dev Notes

### Technical Requirements & Architecture Compliance
- **Framework Constraint**: Next.js 16.1.6 (App Router) with React 19.
- **Initialization Command mandated by Architecture**: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- **Component System**: Shadcn UI must use the Canary build to support Tailwind v4. Avoid arbitrary custom CSS classes; prioritize composition.
- **Language Rules**: TypeScript v5 with `strict` mode. The use of the `any` keyword is strictly prohibited.
- **Import Rules**: Only use absolute paths (`@/*`). Never use relative back-paths (`../../`).
- **Styling Rules**: "Clean-Luxe Minimalista" is enforced. DO NOT use rounded corners (`rounded-none`) or shadows (`shadow-none`) per the design system constraints.

### Project Structure Notes
- The resulting tree MUST strictly follow the `src/` directory pattern.
- Layout must reside in `src/app/layout.tsx` and UI elements in `src/components/ui`.

### References
- [Architecture Document](file:///_bmad-output/planning-artifacts/architecture.md#starter-template-evaluation)
- [Project Context Rules](file:///_bmad-output/project-context.md#critical-implementation-rules)
- [Epics Document (Story 1.1)](file:///_bmad-output/planning-artifacts/epics.md#story-11-inicializacion-de-infraestructura-core-y-msw)

## Dev Agent Record

### Agent Model Used
Gemini Experimental (bmad-bmm-dev-story execution)

### Debug Log References
- Next.js default folder initialization conflicts (fixed by forcing directory moves).
- Shadcn Canary component preflight bugs and transitive missing dependencies (`radix-ui`/`react-slot`) in generated components causing `npm run build` to fail. Fixed by manually linking the correct transitive deps and purging unused complex default components (waiving them until they are needed by actual design features).
- MSW Provider requires safe window checking (`typeof window !== 'undefined'`) to prevent SSR React Poisoning. (Fixed condition in Code Review to render children unconditionally without waiting for readiness).
- Windows PowerShell UTF-16LE file initialization issues (fixed by rewriting via TS scripts/API explicitly avoiding BOM).

### Completion Notes List
- ✅ **Task 1**: Next.js 16 installed with Turbopack, Tailwind v4 and pristine React 19 structure. Replaced Next.js basic layouts and defaults with minimal `layout.tsx` and `page.tsx` elements to pass compilation. (Fixed TS 'any' rules violations in components).
- ✅ **Task 2**: `globals.css` theme stripped of Next/Shadcn defaults. Tokens for **Clean-Luxe Minimalista** added (Background: `#FCFBF7`, Foreground: `#0A0F1E`, Primary Accents: `#FF4D00`, Flat design strictly enforced with `--radius: 0rem` and `--shadow-none`).
- ✅ **Task 3**: MSW (Mock Service Worker) initialized. Handlers constructed for Shopify (`GetProducts`) to mock Server actions during development avoiding API Rate limits. Interceptor dynamically loaded in `layout.tsx` safely (targeting both `development` and `test` environments without breaking SSR hydration).
- 🚀 `npm run build` succeeds 100%.

### File List
- `[NEW] src/app/globals.css`
- `[MODIFY] src/app/layout.tsx`
- `[MODIFY] src/app/page.tsx`
- `[NEW] src/components/MSWProvider.tsx`
- `[NEW] src/components/layout/Header.tsx`
- `[NEW] src/components/layout/Footer.tsx`
- `[NEW] src/lib/shopify.ts`
- `[NEW] src/lib/queries.ts`
- `[NEW] src/mocks/browser.ts`
- `[NEW] src/mocks/server.ts`
- `[NEW] src/mocks/handlers.ts`
- `[NEW] public/mockServiceWorker.js`
- `[NEW] components.json`
- `[MODIFY] package.json`
- `[MODIFY] tailwind.config.ts` (Removed by Next/Tailwind v4 internally, handled by globals now)

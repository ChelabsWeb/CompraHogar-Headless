---
project_name: 'CompraHogar-Headless'
user_name: 'Chelabs'
date: '2026-02-26T16:07:00-03:00'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 26
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Framework**: Next.js 16.1.6 (App Router)
  - *Rule*: All Shopify GraphQL fetching (`shopifyFetch`) MUST occur in Server Components before client hydration.
  - *Rule*: Always use `next/image` for assets, specifically from `cdn.shopify.com`.
- **UI Library**: React & ReactDOM 19.2.3
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) with custom Shadcn UI ("new-york" style)
  - *Rule*: Prioritize existing Shadcn UI components in `@/components/ui/` over custom Tailwind classes for consistency.
- **Language**: TypeScript v5 (strict mode enabled)
  - *Rule*: Enforce strict mode types. Do not use `any`. Use absolute imports (`@/*`).
- **Animation**: Framer Motion 12.34.3
- **Integrations**: MCP Servers (`@shopify/dev-mcp`, `@akson/mcp-shopify`, `@modelcontextprotocol/server-github`)
  - *Rule*: MCP tools are for development/backend contexts only; do not import them into client components.

## Critical Implementation Rules

### Language-Specific Rules

- **TypeScript Configuration**: Strict mode is enabled. No `any` types. Ensure all interfaces and types are strictly defined, especially for GraphQL responses.
- **Import/Export Patterns**: Always use absolute imports configured in `tsconfig.json` (`@/...`). Avoid relative imports (`../../`) for cross-feature components and utilities.
- **Error Handling Requirements**: Gracefully handle errors when using `shopifyFetch` or interacting with external APIs, ensuring error logs are meaningful and do not leak sensitive information to the client.

### Framework-Specific Rules

- **Component Structure**: Follow the established `src/components/ui/` pattern for reusable Shadcn components. For feature-specific components, organize them logically within `src/components/` (e.g., `layout/`, `shop/`).
- **Data Fetching (Next.js 16)**: Utilize React Server Components (RSC) by default for pages to fetch Shopify data server-side. Pass only serializable, necessary data down to Client Components when interactivity is strictly required. 
- **Client Components**: Minimize the use of `"use client"`. Apply it only at the leaf nodes of your component tree (e.g., specific buttons, forms, or animated components using Framer Motion).
- **Styling Enforcement**: Adhere strictly to the "Clean-Luxe Minimalista" Kickgame clone aesthetic detailed in `DesignSystem.md`. **Flat design is mandatory**: no shadows (`shadow-none`) and no rounded corners on images (`rounded-none`).

### Testing Rules

- **Test Framework Preparation**: While a specific framework is not yet defined, design all components and utilities to be easily testable (e.g., pure functions, dependency injection for API fetches like `shopifyFetch`).
- **Integration over Unit**: When testing is introduced, prioritize testing Next.js pages and critical Shopify data flows over testing isolated UI components unnecessarily.
- **Mocking Shopify GraphQL**: External dependencies, particularly the Shopify Storefront API queries, must always be mocked in test environments to prevent network dependence and ensure fast execution.

### Code Quality & Style Rules

- **Linting & Formatting**: Ensure ESLint passes (`npm run lint`) before committing. Next.js Core Web Vitals and strict TypeScript rules are active and must be adhered to.
- **Code Organization**: Keep business logic out of UI components. Queries to Shopify should live in `src/lib/queries.ts` or specific service files.
- **Naming Conventions**: Use `PascalCase` for React components. Use `camelCase` for utilities, hooks, and variables. Name Shopify queries with a `Query` suffix (e.g., `getCollectionsQuery`).
- **Documentation**: Provide clear markdown documentation in `skills/*.md` or root `.md` files for architectural decisions instead of bloated inline comments. Use JSDoc for complex utility functions.

### Development Workflow Rules

- **Branch Management**: Always propose changes in isolated files before manipulating core layout structure. For MCP commands, always ask for user approval before installation.
- **Deployment Requirements**: Next.js builds (`next build`) must be verified locally before any simulated deployments. All `.env.local` variables for Shopify Storefront API must be clearly defined in `.env.example`.

### Critical Don't-Miss Rules

- **Anti-Patterns to Avoid**: 
  - DO NOT use the native `<img>` tag. Always use `next/image` to comply with the `next.config.ts` CDN setup.
  - DO NOT mix Client and Server component fetching. If `shopifyFetch` is in a component, that component CANNOT have `"use client"`.
  - DO NOT add rounded borders or shadows to UI elements. Adhere to the `DesignSystem.md` rule of flat design (`shadow-none`, `rounded-none`).
- **Testing Edge Cases**: Always verify Next.js hydration issues when mixing Shopify API data with client-side state hooks. Ensure `useEffect` does not cause visual flashing on initial load.
- **Security Rules**: NEVER log or expose the `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in Client Components or browser consoles. 
- **Performance Gotchas**: Avoid over-fetching in GraphQL. Only request the specific Shopify object fields (e.g., `id`, `title`, `handle`, `variants`) needed for the current view.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-02-26T16:16:11-03:00

# NeoVerse Store Architecture

## Module boundaries

- `src/app` contains Next.js route composition only. Pages should assemble feature components and keep data access in services/hooks.
- `src/components/ui` contains reusable, domain-agnostic primitives.
- `src/components/<domain>` contains reusable domain UI such as products, cart, auth, and AR/VR.
- `src/store` contains client-side Zustand state only. Stores must not perform server rendering or own route concerns.
- `src/hooks` contains reusable client hooks that coordinate UI state, auth, and queries.
- `src/lib` contains cross-cutting infrastructure: API clients, configuration, providers, route policy, utilities, and shared service implementations.
- `src/types` contains shared frontend contracts. Keep domain types grouped here until a domain needs a dedicated feature package.
- `backend/routes` defines HTTP boundaries, `backend/controllers` coordinates requests, `backend/services` owns integrations/business workflows, and `backend/models` owns persistence.

## Rules for scalable changes

1. Keep route files thin: validate route input, call a service/hook, and render a component.
2. Keep API URL and runtime configuration in `src/lib/config.ts`; do not read environment variables throughout UI modules.
3. Keep authentication policy separate from middleware implementation in `src/lib/route-policy.ts`.
4. Prefer typed domain contracts over `any`; introduce a named type when a response shape is reused.
5. Do not create empty feature folders. Add a feature folder only when it owns components, hooks, services, or types.
6. Keep server-only code out of client components and keep browser-only code behind `'use client'` boundaries.
7. New backend integrations belong in a service module, not directly in a controller or route.

## Current feature areas

- Authentication: `components/auth`, `hooks/useAuthGuard`, Firebase integration in `lib/firebase.ts`
- Catalog: `components/products`, `components/product`, `lib/services/product-service.ts`, app product routes
- Cart and wishlist: `components/cart`, `store/cart-store.ts`, `store/wishlist-store.ts`
- Immersive experiences: `components/ar-vr`, `app/vr-showroom`
- Dashboard: `components/dashboard`, `app/dashboard`
- Shared platform shell: `components/layout`, `components/ui`, `lib`

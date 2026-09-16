# NeoVerse Store

NeoVerse Store is an immersive commerce prototype for helping customers evaluate products before buying them. The application combines a Next.js storefront with a separate Express API, product browsing, cart and wishlist state, checkout flows, 3D/AR/VR surfaces, and catalog-grounded shopping assistance.

The project is organized as a modular monolith split into two deployable applications:

- **Web app** — Next.js 16 application deployed to Vercel.
- **API** — Express and MongoDB service intended for Render or another Node.js host.

Production URLs:

- Web: [https://neoverse.sujit.top/](https://neoverse.sujit.top/)
- Vercel deployment origin: [https://neoverse-store.vercel.app](https://neoverse-store.vercel.app)
- API health endpoint: configure the deployed API URL and check `/api/health`

## Project status

The storefront is deployed and its public catalog currently reads from the DummyJSON provider through the Next.js application. The Express API contains the server-side order, inventory, Stripe, authentication, and AI integrations.

Before enabling real checkout in production, make the catalog source consistent across the web app and API. At present, the web catalog exposes IDs such as `dummyjson-1`, while the API order flow expects MongoDB product records. Treat this as a production integration task, not as a cosmetic limitation.

## What is implemented

### Storefront

- Product listing, search, filtering, sorting, category browsing, and product detail pages.
- Persistent cart and wishlist state using Zustand.
- Checkout quote flow that can display server-calculated pricing, tax, shipping, stock, and quote expiry.
- User dashboard, orders, addresses, profile, notifications, settings, and recently viewed surfaces.
- Responsive interface for mobile, tablet, and desktop layouts.
- 3D product and showroom components built with Three.js, React Three Fiber, Drei, and model-viewer/WebXR integrations.
- Public pages for shipping, returns, privacy, terms, FAQ, contact, and sizing.

### API

- Express HTTP API with Mongoose models and MongoDB persistence.
- Product, category, cart, order, review, wishlist, user, contact, newsletter, recommendation, upload, email, Stripe, and AI routes.
- Server-side order pricing and stock validation.
- Stripe Checkout session creation and webhook handling.
- Firebase Admin authentication middleware.
- Rate limiting, Helmet security headers, request logging, and centralized error handling.
- AI shopping assistance with Claude as the preferred provider when configured, followed by existing OpenAI and Gemini fallbacks.
- Catalog-grounded recommendation output validated against available products before it is returned to the client.

## Technology

| Area | Implementation |
| --- | --- |
| Web framework | Next.js 16.2.10, React 19, TypeScript |
| Styling | Tailwind CSS v4, project-level semantic design tokens |
| Client state | Zustand with persistence |
| Server state | TanStack Query where applicable |
| 3D and immersive UI | Three.js, React Three Fiber, Drei, model-viewer, WebXR APIs |
| API | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB / MongoDB Atlas |
| Authentication | Firebase client SDK and Firebase Admin SDK |
| Payments | Stripe Checkout and webhooks |
| AI | Anthropic SDK, OpenAI SDK, Gemini integration |
| Media | Cloudinary |
| Email | Resend |
| Web deployment | Vercel for the web app; Render configuration for the API |

## Repository layout

```text
neoverse-store/
├── src/
│   ├── app/                    # Next.js App Router pages and route handlers
│   ├── components/             # Shared UI and feature components
│   ├── hooks/                  # Client hooks
│   ├── lib/                    # API client, config, providers, and utilities
│   ├── store/                  # Zustand stores
│   └── types/                  # Shared frontend types
├── backend/
│   ├── server.js               # Express entry point
│   ├── controllers/            # Request handlers and business operations
│   ├── middleware/             # Auth, validation, and error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── services/               # External providers and Claude integration
│   ├── render.yaml             # Render service configuration
│   └── seeder.js               # Database seed/synchronization utility
├── public/                     # Static assets
├── docs/                       # Product, architecture, and frontend design documents
├── vercel.json                 # Vercel build configuration
├── package.json                # Web app scripts and dependencies
└── DESIGN.md                   # Visual and interaction design contract
```

## Prerequisites

- Node.js 20.9 or newer. Node.js 20 LTS is recommended for local and hosted environments.
- npm.
- A MongoDB database for the API.
- Firebase project credentials if authenticated API requests are needed.
- Stripe credentials for payment flows.
- Provider credentials only for the integrations you intend to enable.

The web app can run its public catalog with the current provider configuration. The API requires MongoDB at startup and exits if it cannot connect.

## Local setup

Clone the repository and install both applications separately:

```bash
git clone <repository-url>
cd neoverse-store
npm install
cd backend
npm install
cd ..
```

### Web environment

Create `.env.local` in the repository root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

`NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000/api` when omitted. In production it must point to the deployed Express API if the browser is expected to use API-backed authentication, cart, orders, checkout, or account features.

### API environment

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/neoverse

# Firebase Admin authentication
FIREBASE_SERVICE_ACCOUNT_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AI providers. Claude is selected first when one of these is present.
ANTHROPIC_API_KEY=
ANTHROPIC_AUTH_TOKEN=
ANTHROPIC_MODEL=claude-opus-5
OPENAI_API_KEY=
GEMINI_API_KEY=

# Media and email
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Optional administrative and platform integrations
ADMIN_EMAIL=
ZENMUX_PLATFORM_API_KEY=
ZENMUX_MODEL_API_KEY=
```

Do not commit `.env`, `.env.local`, Firebase service-account files, Stripe keys, API keys, or webhook secrets. The backend currently contains a service-account JSON file in the working tree; remove it from source control and rotate the credential if it has ever been exposed.

## Run locally

Use two terminals.

Terminal 1 — API:

```bash
cd backend
npm run dev
```

Terminal 2 — web app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Check the API:

```bash
curl http://localhost:5000/api/health
```

Expected response shape:

```json
{
  "status": "ok",
  "uptime": 12.34
}
```

### Database seed and synchronization

The API attempts to synchronize products and categories from the external provider when MongoDB is empty. To run the repository's seed utility explicitly:

```bash
cd backend
node seeder.js
```

Inspect the seed utility before using it against a production database. Product synchronization and checkout should ultimately use one authoritative catalog with stable IDs, prices, inventory, and product metadata.

## Scripts

### Web app

Run from the repository root:

```bash
npm run dev       # Start Next.js development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
npx tsc --noEmit  # Type-check without emitting files
```

### API

Run from `backend/`:

```bash
npm run dev       # Start Express with nodemon
npm start         # Start Express with Node.js
```

## API reference

The API is mounted under `/api`.

### System and catalog

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| GET | `/api` | API identification response | Public |
| GET | `/api/health` | Liveness check | Public |
| GET | `/api/products` | List products with filters and pagination | Public |
| GET | `/api/products/featured` | Featured products | Public |
| GET | `/api/products/top-rated` | Top-rated products | Public |
| GET | `/api/products/:slug` | Product detail | Public |
| GET | `/api/categories` | List categories | Public |

### Identity and account

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| GET | `/api/users/profile` | Read authenticated profile | Firebase token |
| PUT/PATCH | `/api/users/profile` | Update authenticated profile | Firebase token |
| GET | `/api/user/*` | Profile, addresses, preferences, and recently viewed resources | Firebase token |

### Commerce

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| GET/POST/PATCH/DELETE | `/api/cart/*` | Read and modify cart | Firebase token |
| POST | `/api/orders/quote` | Calculate a server-side quote | Authenticated |
| POST | `/api/orders` | Create an order using server-side pricing and stock validation | Authenticated |
| GET | `/api/orders/myorders` | List the current user's orders | Authenticated |
| GET | `/api/orders/:id` | Read an order | Authenticated or admin, depending on route policy |
| POST | `/api/stripe/checkout` | Create a Stripe Checkout session | Authenticated |
| POST | `/api/stripe/webhook` | Receive Stripe events | Stripe signature |

The client must not be trusted for subtotal, tax, shipping, discount, inventory, or total values. The API is responsible for recalculating those values from its catalog and current inventory.

### Engagement and support

| Method | Route prefix | Purpose |
| --- | --- | --- |
| `/api/products/*` | Products and reviews |
| `/api/wishlist/*` | Wishlist operations |
| `/api/recommendations/*` | Recommendation and tracking events |
| `/api/ai/*` | Catalog-grounded shopping assistant |
| `/api/contact/*` | Contact form and support messages |
| `/api/newsletter/*` | Newsletter subscription |
| `/api/email/*` | Email operations |
| `/api/upload/*` | Cloudinary uploads |

For exact request validation and authorization behavior, read the route and controller implementation in `backend/routes/` and `backend/controllers/`.

## AI shopping assistant

The API uses the official Anthropic SDK in `backend/services/claudeShoppingService.js` when `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` is configured. The current adapter:

- Uses the configured `ANTHROPIC_MODEL`, defaulting to `claude-opus-5`.
- Uses adaptive thinking for the Claude request.
- Keeps a bounded conversation history.
- Adds a stable catalog policy prefix suitable for prompt caching.
- Grounds recommendations in product IDs and validates returned recommendations against the catalog.
- Instructs the model not to invent prices, stock, delivery promises, product capabilities, reviews, dimensions, or checkout totals.
- Falls back to the existing OpenAI and Gemini adapters when Claude is not configured.

AI credentials belong in the backend environment, never in `NEXT_PUBLIC_*` variables and never in browser code. Configure rate limits, request logging, and provider spend monitoring before exposing the assistant to unrestricted production traffic.

## Deployment

### Web app on Vercel

The repository includes `vercel.json` with the required Next.js framework and build configuration.

```bash
npm install
npm run build
npx vercel deploy --prod --yes
```

Set the web environment variables in the Vercel project. In particular, verify that `NEXT_PUBLIC_API_URL` points to the live API and not to a local address.

After deployment, verify:

```bash
curl -I https://neoverse.sujit.top/
curl https://neoverse.sujit.top/api/categories
curl 'https://neoverse.sujit.top/api/products?limit=1'
```

### API on Render

`backend/render.yaml` defines a Node web service with:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

Create the Render service from the repository, configure the secret environment variables, and set `FRONTEND_URL` to the exact Vercel origin. Then verify:

```bash
curl https://<api-host>/api/health
```

The service must be healthy before setting `NEXT_PUBLIC_API_URL` to its `/api` base URL in Vercel.

### Stripe local webhook testing

Use the Stripe CLI to forward events to the API webhook route:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Use the webhook signing secret printed by the CLI as `STRIPE_WEBHOOK_SECRET`. Do not use a dashboard webhook secret for local CLI forwarding.

## Request and security boundaries

- The browser is an untrusted client. Recalculate prices, discounts, shipping, tax, and stock on the API.
- Keep Stripe webhook handling on the raw request body path so signature verification remains valid.
- Restrict CORS to the deployed web origin in production.
- Keep Firebase service-account credentials and all payment/provider secrets server-side.
- Apply idempotency to order creation and payment session creation before accepting duplicate-prone production traffic.
- Monitor failed database connections, webhook failures, rate-limit responses, AI provider errors, and order state transitions.
- Do not expose internal error details or provider credentials in API responses or logs.

## Known limitations and next production work

1. **Catalog consistency:** the web app currently uses the DummyJSON provider for its public catalog while the API is MongoDB-backed. Align these sources before enabling unrestricted checkout.
2. **API deployment verification:** the web app and API are deployed independently. Confirm the Render URL is healthy and configured in Vercel.
3. **Payment idempotency:** add and test an idempotency strategy covering quote expiry, duplicate requests, Stripe retries, and order creation.
4. **CORS policy:** production should fail closed for unknown origins.
5. **Credential hygiene:** remove and rotate any service-account credential that has been stored in the repository.
6. **Dependency maintenance:** review npm audit findings individually; do not apply `npm audit fix --force` without checking breaking changes.
7. **Automated regression coverage:** add integration tests for quote pricing, inventory reservation, Stripe webhooks, authentication, and catalog ID mapping.

## Design and architecture documentation

Read these documents before changing the product or system behavior:

- [`DESIGN.md`](./DESIGN.md) — visual language, interaction rules, accessibility, and design definition of done.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system boundaries and architectural direction.
- [`docs/PRD.md`](./docs/PRD.md) — product requirements and intended user value.
- [`docs/ARCHITECTURE_REVIEW.md`](./docs/ARCHITECTURE_REVIEW.md) — architecture risks and recommendations.
- [`docs/FRONTEND_CONTEXT_GOVERNANCE.md`](./docs/FRONTEND_CONTEXT_GOVERNANCE.md) — frontend context and change-management guidance.
- [`docs/FRONTEND_DESIGN_PLAN.md`](./docs/FRONTEND_DESIGN_PLAN.md) — frontend design implementation plan.

## License

No license file is currently included in the repository. Add an explicit license before distributing the project outside its owning organization.

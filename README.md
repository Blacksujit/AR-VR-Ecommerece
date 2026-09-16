# NeoVerse Store

## See the decision before you make it

NeoVerse is an inspection-first commerce experience for products that are difficult to judge from a flat image alone.

It helps people compare meaningful details, understand an object in context, inspect supported products in 3D or spatial interfaces, and reach checkout with fewer unanswered questions.

**Try the live experience:** [neoverse.sujit.top](https://neoverse.sujit.top/)

[Open the storefront](https://neoverse.sujit.top/) · [Read the documentation](https://neoverse.sujit.top/docs) · [Open the Vercel deployment](https://neoverse-store.vercel.app)

> NeoVerse is designed around one outcome: **more confidence before checkout**.

---

## Documentation first

The project now includes a dedicated Fumadocs documentation experience for readable, searchable, navigable technical and product guidance:

### [Open NeoVerse Docs →](https://neoverse.sujit.top/docs)

Use the docs for the canonical implementation guidance:

- [Getting started](https://neoverse.sujit.top/docs/getting-started) — local setup and validation commands.
- [Product architecture](https://neoverse.sujit.top/docs/product-architecture) — storefront, API, catalog, and service boundaries.
- [Frontend design guide](https://neoverse.sujit.top/docs/frontend-design) — visual direction, tokens, components, states, and accessibility.
- [Commerce API](https://neoverse.sujit.top/docs/commerce-api) — pricing, inventory, checkout, and payment trust boundaries.
- [Immersive inspection](https://neoverse.sujit.top/docs/immersive-inspection) — 3D, AR, VR, fallbacks, and capability states.
- [Security](https://neoverse.sujit.top/docs/security) — credentials, authentication, CORS, payments, and AI boundaries.
- [Deployment](https://neoverse.sujit.top/docs/deployment) — Vercel, Render, environment variables, and verification.
- [Contributing](https://neoverse.sujit.top/docs/contributing) — quality gates and change expectations.

The repository-level README explains the product and points to the docs. Fumadocs is the better place for information that needs structure, navigation, and ongoing maintenance.

---

## The problem

Online shopping gives people more products than ever, but often not enough confidence to choose one.

Before buying, customers still wonder:

- Will it fit the space, desk, room, or body it is meant for?
- Does the material, shape, or scale work outside a studio image?
- Which specifications actually matter for this decision?
- Is it available now?
- What will the final price be after shipping, tax, and discounts?
- Can alternatives be compared without opening ten more tabs?

These questions become expensive when the product is high-consideration. Uncertainty leads to hesitation, abandoned carts, avoidable returns, and a weaker relationship between customer and store.

NeoVerse brings useful evidence closer to the moment of choice.

---

## What NeoVerse does

### Browse with purpose

Search, filter, sort, and compare products while keeping the facts that matter visible: price, availability, ratings, specifications, and category context.

### Inspect before committing

Product pages provide closer inspection through imagery, structured evidence, and 3D or spatial tools where the product and device support them.

### Ask useful questions

The shopping assistant is catalog-grounded. It can compare products, explain differences, and narrow the catalog without inventing products, prices, stock, reviews, capabilities, or delivery promises.

### Check out with server-side validation

Pricing and inventory are recalculated by the API. The browser is not trusted for totals, discounts, shipping, tax, or stock availability.

---

## The experience in one loop

```mermaid
flowchart LR
    discover[Discover] --> compare[Compare the details]
    compare --> inspect[Inspect the object]
    inspect --> decide[Decide with context]
    decide --> quote[Get a verified quote]
    quote --> checkout[Checkout]
```

NeoVerse is not trying to make shopping more futuristic for its own sake. It is trying to make the decision less uncertain.

---

## Who it is for

NeoVerse is for people who research before they buy—especially when appearance, proportion, compatibility, or price makes the decision consequential.

It is relevant to shoppers exploring:

- Furniture and home objects
- Electronics and accessories
- Wearables and lifestyle products
- Beauty and personal products
- Design-led technology
- Any product where a flat image leaves important questions unanswered

It is also relevant to merchants who want better product information to create better-qualified purchases instead of relying only on promotions and more listings.

---

## Why this is different

Most commerce experiences optimize for more browsing and faster conversion. NeoVerse focuses on the moment before conversion: when a customer decides whether the product is right.

| Typical product page | NeoVerse direction |
| --- | --- |
| Product photo as the main evidence | Product evidence staged for inspection |
| Recommendations without enough context | Catalog-grounded comparison and guidance |
| Client-provided totals sent toward checkout | Server-calculated pricing and inventory |
| Immersive features as decoration | 3D and spatial tools tied to buying questions |
| More tabs to answer basic questions | One clearer path from discovery to decision |

---

## Product tour

1. **Start with the object** — begin with the product and the question the customer needs to answer.
2. **Inspect the evidence** — review specifications, availability, price, imagery, and supported spatial experiences.
3. **Get help without losing the catalog** — ask for a comparison grounded in products that actually exist.
4. **Confirm the transaction** — let the API recalculate the quote and validate inventory before checkout.

---

## Live product

### [Open NeoVerse →](https://neoverse.sujit.top/)

The current storefront includes:

- Product browsing and category discovery
- Search, filtering, and sorting
- Product detail and inspection surfaces
- Persistent cart and wishlist state
- Checkout quote integration
- Account and dashboard surfaces
- 3D, AR, and VR-related interfaces where supported
- Catalog-grounded shopping assistance
- A dedicated [Fumadocs documentation site](https://neoverse.sujit.top/docs)

### Transparent product status

The storefront is live and actively being hardened for production commerce.

The public web catalog currently reads from DummyJSON, while the Express commerce API uses MongoDB product records. These systems can expose different product identifiers, so the catalog and transaction source of truth still need to be unified before unrestricted checkout is enabled.

The production direction is clear: MongoDB should own the product identity, price, inventory, capabilities, quote, order, and Stripe checkout record used throughout the experience.

---

## Built as a real product system

```mermaid
flowchart TD
    shopper[Shopper] --> storefront[Next.js storefront]
    storefront -->|browse and inspect| catalog[Catalog provider]
    storefront -->|account, cart, quote, checkout, AI| api[Express API]

    subgraph web[Vercel]
        storefront
        state[Zustand cart and wishlist state]
        storefront --> state
    end

    subgraph backend[Render or Node host]
        api --> security[Auth, CORS, rate limits, request validation]
        security --> domain[Commerce and domain routes]
        domain --> services[Pricing, inventory, AI, media, email]
    end

    services --> database[(MongoDB)]
    security --> firebase[Firebase Auth]
    services --> stripe[Stripe Checkout and webhooks]
    services --> claude[Anthropic Claude]
    services --> providers[OpenAI or Gemini fallbacks]
    services --> cloudinary[Cloudinary]
    services --> resend[Resend]

    catalog -. development or sync source .-> dummyjson[(DummyJSON)]
```

### Technology

| Layer | Technology |
| --- | --- |
| Storefront | Next.js 16, React 19, TypeScript |
| Interface | Tailwind CSS v4, Space Grotesk, Inter |
| Product state | Zustand |
| Server state | TanStack Query |
| 3D and spatial UI | Three.js, React Three Fiber, Drei, model-viewer, WebXR |
| API | Node.js, Express, Mongoose |
| Database | MongoDB |
| Authentication | Firebase Authentication and Firebase Admin |
| Payments | Stripe Checkout and webhooks |
| Shopping assistant | Anthropic SDK with OpenAI/Gemini fallbacks |
| Media and email | Cloudinary and Resend |
| Hosting | Vercel and Render |
| Documentation | Fumadocs MDX |

---

## Design point of view

NeoVerse uses an **instrumented atelier** direction:

- The product object is the visual hero.
- Evidence comes before persuasion.
- Dimensions, price, stock, material, and capability states are interface content.
- Deep graphite, warm paper, mineral panels, electric blue, and sparse lime create hierarchy without decorative gradients.
- Motion explains an action; it does not exist to make every section move.
- Unsupported capabilities, missing media, loading, empty, and error states are shown honestly.

Read the implementation contract in the [Frontend design guide](https://neoverse.sujit.top/docs/frontend-design) or inspect [`neoverse-store/docs/FRONTEND_DESIGN_SYSTEM.md`](./neoverse-store/docs/FRONTEND_DESIGN_SYSTEM.md).

---

## Launch assets

### Demo link

[https://neoverse.sujit.top/](https://neoverse.sujit.top/)

### Suggested demo path

1. Open the storefront.
2. Go to **Products**.
3. Search or filter for a product category.
4. Open a product detail page.
5. Inspect the image, specifications, price, rating, and stock.
6. Try the supported product-viewing experience where available.
7. Add an item to the cart and review the quote flow.
8. Open the shopping assistant and ask for a catalog-grounded comparison.
9. Open **Docs** to show the product and engineering decisions behind the experience.

### Suggested launch video

For a short Product Hunt demo, show the problem before the technology:

1. Start with a product that is hard to judge from one image.
2. Show the relevant specifications and availability.
3. Open the inspection experience.
4. Compare it with a second product.
5. Ask the assistant to explain the trade-off.
6. Finish at the server-validated quote and checkout path.

Keep the opening focused on the customer decision—not framework logos, animated gradients, or infrastructure diagrams.

---

## Roadmap

The next work is focused on trust, not feature volume:

- Make MongoDB the production catalog source of truth.
- Unify product IDs across browsing, quotes, orders, inventory, and Stripe.
- Expand reliable product models and spatial assets.
- Improve inspection for categories where fit and proportion matter most.
- Add integration tests for pricing, inventory reservation, checkout, and webhooks.
- Add observability for catalog errors, AI requests, orders, and payment events.
- Measure whether product inspection improves decision confidence and reduces avoidable returns.

---

## Run it locally

For the complete setup, environment variables, API routes, deployment instructions, and operational notes, use the [Getting started documentation](https://neoverse.sujit.top/docs/getting-started).

### Requirements

- Node.js 20.9 or newer
- npm
- MongoDB for the API
- Firebase credentials for authenticated flows
- Stripe credentials for payment testing
- Provider credentials for optional integrations

### Install

```bash
cd neoverse-store
npm install --legacy-peer-deps

cd backend
npm install
```

### Start the API

```bash
cd neoverse-store/backend
npm run dev
```

### Start the storefront

In a second terminal:

```bash
cd neoverse-store
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and then visit [http://localhost:3000/docs](http://localhost:3000/docs).

The API health endpoint is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

## Repository map

```text
AR-VR-Assignment/
├── README.md                         # Product-facing launch page
└── neoverse-store/
    ├── src/                          # Next.js storefront and docs route
    ├── content/docs/                 # Fumadocs MDX content
    ├── backend/                      # Express and MongoDB API
    ├── public/                       # Static assets
    ├── docs/                         # Product and architecture documents
    ├── DESIGN.md                     # Frontend design rules
    ├── ARCHITECTURE.md               # System architecture
    ├── README.md                     # Detailed technical README
    ├── source.config.ts               # Fumadocs content configuration
    └── vercel.json                    # Vercel configuration
```

## Further reading

- [NeoVerse Docs](https://neoverse.sujit.top/docs) — canonical navigable documentation.
- [Getting started](https://neoverse.sujit.top/docs/getting-started) — local development and validation.
- [Product architecture](https://neoverse.sujit.top/docs/product-architecture) — system boundaries and data ownership.
- [Frontend design guide](https://neoverse.sujit.top/docs/frontend-design) — visual language, components, states, and accessibility.
- [Security](https://neoverse.sujit.top/docs/security) — trust boundaries and security practices.
- [`neoverse-store/README.md`](./neoverse-store/README.md) — detailed technical setup and operations.
- [`neoverse-store/docs/PRD.md`](./neoverse-store/docs/PRD.md) — product requirements and intended customer value.
- [`neoverse-store/docs/SECURITY_HARNESS.md`](./neoverse-store/docs/SECURITY_HARNESS.md) — deterministic security scanning workflow.

---

## Product principles

1. **Useful before impressive** — immersive technology must improve a buying decision.
2. **Grounded before generative** — assistance should use real catalog data.
3. **Server-authoritative commerce** — prices, stock, and totals belong to the API.
4. **Clarity before decoration** — the interface should help customers inspect and compare.
5. **Honest capability states** — unsupported features should be explicit.
6. **Confidence is the outcome** — the product exists to reduce uncertainty before checkout.

---

## Status

NeoVerse Store is an active product build.

The storefront is live. The next major milestone is aligning the public catalog and transaction system so every product shown to a customer is backed by the same authoritative identity, price, inventory, and checkout record.

## License

No license file is currently included. Add an explicit license before distributing the project outside its owning organization.

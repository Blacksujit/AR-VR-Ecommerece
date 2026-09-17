# NeoVerse Frontend Design System

**Status:** Implementation contract  
**Audience:** Product, design, and frontend engineering  
**Scope:** Customer-facing storefront surfaces  
**Primary outcome:** Reduce uncertainty before checkout

## 1. Product premise

NeoVerse is not a generic futuristic marketplace and not an AI showcase. It is a product-inspection experience for people buying physical objects online when a normal image leaves important questions unanswered.

Every visual decision should support one or more of these customer questions:

- Will it fit the intended space, desk, or body?
- What are the useful dimensions, materials, and specifications?
- Is it currently available?
- What will I pay after shipping, tax, and discounts?
- Can I compare it with a credible alternative?

The interface therefore behaves like an **instrumented atelier**: quiet enough to make the object legible, precise enough to expose evidence, and tactile enough to make inspection feel natural.

## 2. Experience principles

### Evidence before persuasion

Show the object, useful facts, price, stock, and next action before promotional copy. A product card should remain useful with hover and motion disabled.

### One surface, one job

Every route and component must have an observable job:

| Surface | Job |
| --- | --- |
| Home | Explain why inspection improves a purchase decision. |
| Catalog | Help customers compare real objects quickly. |
| Product detail | Resolve uncertainty and enable the next purchase action. |
| Cart | Verify selections and costs. |
| Checkout | Confirm a server-calculated quote and payment state. |
| Showroom | Support spatial inspection without becoming a game lobby. |
| Dashboard | Track saved objects, orders, and account information. |

### Material, not “tech”

Products are physical objects. Use visual language that suggests paper, graphite, mineral surfaces, measurement marks, and gallery labels—not cyberpunk, neon, or dashboard chrome.

### States are part of the design

Loading, empty, error, unavailable, unsupported, selected, saved, and confirmed states must be designed as first-class content. Never use decorative polish to hide missing data or unsupported capabilities.

### Motion answers an action

Use motion for opening, changing, loading, confirming, and transitioning. Do not animate every section into view or make content float continuously. Respect `prefers-reduced-motion`.

## 3. Visual direction

### Signature composition

The memorable visual should be the **product evidence stage**:

```text
┌──────────────────────────────────────────────────────────────┐
│ navigation                                                   │
├────────────────────────────────┬─────────────────────────────┤
│                                │ product identity            │
│       object / image / 3D      │ price and availability      │
│       inspection stage         │ purchase action             │
│                                │ dimensions and proof        │
├────────────────────────────────┴─────────────────────────────┤
│ related objects / comparison                                  │
└──────────────────────────────────────────────────────────────┘
```

Desktop uses an asymmetric 7/5 split: the product stage earns more space than the decision rail, while the rail remains visible and stable. Mobile becomes a single flow: identity, evidence, price, action, then supporting details.

### Alignment

- Left-align headings, product names, prices, facts, and explanatory copy.
- Center only short confirmations, empty states, or an isolated object stage.
- Keep a consistent content edge between sections.
- Use rules and spacing before shadows or color to establish hierarchy.
- Use asymmetry only when it improves inspection or scanning.

## 4. Tokens

### Color

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#080B12` | Page stage and deepest background |
| `ink-raised` | `#0D121A` | Navigation and overlays |
| `panel` | `#121922` | Cards and primary surfaces |
| `panel-soft` | `#19232E` | Inputs, secondary controls, selected areas |
| `paper` | `#F1EFE8` | Headings, prices, product facts |
| `muted` | `#A3ACB8` | Supporting copy and metadata |
| `faint` | `#6F7A88` | Tertiary copy only |
| `electric` | `#89A6FF` | Action, focus, links, active inspection tools |
| `electric-strong` | `#B3C4FF` | Action hover and active text |
| `accent` | `#C7ED70` | Available, confirmed, healthy |
| `warning` | `#F2BE70` | Pending or attention |
| `error` | `#FF8178` | Failed, unavailable, destructive |
| `line` | `rgba(241,239,232,0.14)` | Structural dividers |

Rules:

- No decorative gradients behind text.
- No React Bits or animated component is added for novelty. A component must improve product discovery, inspection, comparison, or feedback. The React Bits registry may be used for a restrained state transition or gallery interaction after the component is reviewed for bundle size, keyboard behavior, and reduced motion.
- Electric is reserved for things the customer can act on or focus.
- Lime is a confirmation signal, not a secondary brand color.
- Color never carries state alone; pair it with text, iconography, or structure.

### Typography

- **Space Grotesk:** wordmark, page titles, hero claims, and major object names.
- **Inter:** navigation, body copy, forms, buttons, metadata, prices, and operational screens. This is an intentional neutral interface choice for a trust-first commerce product, not decorative typography.
- Use sentence case.
- Do not use decorative monospace labels.
- Keep body line length between 45 and 78 characters.
- Let product names wrap; never hide the identifying name behind truncation.

### Geometry

| Element | Radius | Rule |
| --- | ---: | --- |
| Media and 3D stage | `20px` | Frame the object as a primary artifact |
| Cards and panels | `12px` | Quiet separation, no default shadow |
| Buttons and inputs | `10px` | Precise, touchable control |
| Status markers | `999px` | Status only, never the default component shape |

Use a 4px spacing base. Recommended page gutters are 20px mobile and 48–64px desktop. Content max width is 1240px.

## 5. Component contracts

### `Button`

Actions use sentence-case verbs that describe the result:

- `Explore products`
- `Add to bag`
- `Save address`
- `Try again`
- `Place in your room`

Primary actions use electric fill without a permanent glow. Secondary actions use a quiet panel and line. Ghost actions are reserved for low-priority navigation. Every button has a visible focus ring and a minimum 44px touch target.

### `Surface`

A surface provides structural separation, not decoration. Default surface: `panel` background, one-pixel `line` border, `surface` radius, no shadow. Elevation is reserved for drawers, menus, dialogs, and a purchase rail when necessary.

React Bits is configured as an optional component registry in `components.json`. Use it only when a reviewed component improves discovery, inspection, comparison, or feedback. Do not add animated backgrounds, decorative particles, or perpetual motion to transactional surfaces. Any adopted component must preserve keyboard access, reduced-motion behavior, the NeoVerse token palette, and the existing bundle budget.

### `EvidenceRow`

Use for compact product facts:

```text
[icon] Label                         Value
      optional supporting explanation
```

Evidence rows must support missing values explicitly. Do not render empty labels or invented values.

### `Status`

Use text plus an icon or marker:

- Available — accent
- Limited stock — warning
- Out of stock — error
- 3D available — electric
- AR unsupported — muted

A status marker is not a decorative badge. It communicates current product capability or commerce state.

### `ProductCard`

A card must expose, without hover:

1. Product image or an explicit media fallback.
2. Brand and full product name.
3. Current price and original price when discounted.
4. Rating when available.
5. Stock or availability state.
6. Supported 3D/AR capability when real data exists.
7. One clear action.

### `ProductStage`

The stage owns media, not marketing copy. It must support loading, failed media, image fallback, 3D controls, reduced motion, and unsupported-device states.

### `PurchaseRail`

The purchase rail owns identity, price, stock, quote state, quantity, and the primary action. It must not be buried below promotional content or compete with multiple equal CTAs.

## 6. Route composition

```text
App shell
├── navigation
├── route content
├── optional cart drawer
├── optional assistant surface
└── footer

Home
├── evidence-first hero
├── curated product rail
├── category navigation
├── practical inspection explanation
└── footer

Catalog
├── title, count, and search
├── quiet filter controls
└── product grid with explicit states

Product detail
├── breadcrumb
├── product stage
├── purchase rail
├── evidence and specifications
└── related products

Checkout
├── order summary
├── server quote state
├── shipping form
└── payment state
```

## 7. Accessibility and performance gates

- WCAG 2.2 AA contrast for text and state combinations.
- Keyboard navigation for navigation, filters, drawers, dialogs, galleries, and checkout.
- Visible `:focus-visible` treatment using electric.
- Minimum 44px touch targets.
- `aria-live` for cart quantity changes and payment/order status.
- Explicit `alt` text for product media; meaningful fallback for failed images.
- `prefers-reduced-motion` disables nonessential movement and autoplay.
- Lazy-load immersive components behind user intent when possible.
- Reserve image and model dimensions to prevent layout shift.
- Avoid loading Three.js on routes that do not need immersive media.
- Validate at 360px, 768px, and 1440px.

## 8. Review checklist

Before shipping a frontend change, ask:

- Does this reduce uncertainty or only add visual noise?
- Is the primary action obvious without hover?
- Are all claims supported by real product data?
- Are loading, empty, error, unavailable, and unsupported states visible?
- Does the component follow the token system?
- Does the layout preserve the product evidence hierarchy?
- Does it work with keyboard navigation and reduced motion?
- Does the component still make sense if imagery fails?
- Is the change reusable, or is it a one-off style workaround?

## 9. React Doctor inspection

React Doctor is installed as a development dependency and provides a deterministic inspection pass for React correctness, maintainability, performance, accessibility, and design patterns.

Run the general inspection:

```bash
npm run react-doctor
```

Run the design-focused inspection:

```bash
npm run react-doctor:design
```

Generate a local JSON report without score/telemetry output:

```bash
npm run react-doctor:json
```

The generated `react-doctor-*.json` files are local diagnostics and are ignored by Git. Treat warnings as review input, not automatic proof of a defect. Prioritize findings that affect mobile viewport behavior, accessible interaction, dynamic numeric alignment, product evidence hierarchy, or repeated component complexity.

## 10. Implementation sequence

1. Tokens and primitive behavior.
2. App shell and navigation hierarchy.
3. Product card and catalog grid.
4. Product stage and capability states.
5. Purchase rail and server quote states.
6. Cart and checkout.
7. Dashboard and admin data-density rules.
8. Homepage composition and launch surfaces.
9. Browser, accessibility, and visual regression checks.

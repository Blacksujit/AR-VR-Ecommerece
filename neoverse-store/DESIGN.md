# NeoVerse Store Frontend Design System

**Version:** 2.0  
**Status:** Working source of truth  
**Last updated:** 2026-09-16  
**Scope:** Product-facing frontend design, layout, typography, interaction, accessibility, and visual QA

---

## 1. Design position

NeoVerse is not an AI demo, a crypto interface, or a futuristic SaaS dashboard. It is a commerce tool for buying physical objects when a normal product photo is not enough evidence.

The interface must help a person decide:

- Will it fit my room, desk, or body?
- What are the material, dimensions, and real-world proportions?
- Is it available and what will I pay?
- Can I inspect it in 3D or place it in my space?
- Can I complete the purchase without surprises?

### Visual thesis: instrumented atelier

NeoVerse should feel like a contemporary object atelier with measurement instruments built into it:

- **Atelier:** quiet, tactile, editorial, material-aware.
- **Instrumented:** dimensions, stock, price, camera/model capabilities, and state are visible and useful.
- **Commerce-first:** every immersive feature earns its place by reducing uncertainty.

The product object is the visual hero. Effects, gradients, particles, and decorative chrome are supporting actors and should usually be absent.

### What makes the system recognizably NeoVerse

1. A deep graphite stage rather than a black technology canvas.
2. Warm paper text and mineral surfaces that make products feel physical.
3. A single electric-blue interaction signal and a sparse lime confirmation signal.
4. Product evidence arranged like a gallery label: brand, name, dimensions, material, price, stock.
5. Asymmetric editorial compositions: one dominant object, one decision rail, deliberate empty space.
6. Thin rules and alignment do more work than shadows, blur, or glow.

### Explicitly not NeoVerse

- Purple/blue gradient backgrounds.
- Glass cards repeated across every section.
- Floating badges or implementation labels.
- AI-style centered hero copy with decorative statistics.
- Equal three-column feature-card grids used as filler.
- Infinite floating animations.
- Fake metrics, testimonials, product imagery, AR claims, or brand logos.
- All-caps tracked eyebrows used as decoration.

---

## 2. Design principles

### 2.1 Evidence before persuasion

Show the object, its useful facts, availability, and next action before marketing language. A product card must remain useful with all hover effects disabled.

### 2.2 One surface, one job

Each route has a primary job:

| Surface | Primary job |
|---|---|
| Home | Establish the value of seeing an object before buying it. |
| Catalog | Compare real objects quickly. |
| Product detail | Resolve uncertainty and make a purchase decision. |
| Cart | Verify selections and cost. |
| Checkout | Enter shipping details and pay with confidence. |
| Showroom | Inspect objects spatially; do not turn it into a game lobby. |
| Dashboard | Track ownership, orders, and saved objects. |
| Admin | Operate the store with data density and clarity. |

### 2.3 Hierarchy comes from scale and alignment

Use typography, object scale, whitespace, and rules before using color or elevation. If everything is emphasized, nothing is emphasized.

### 2.4 Real state is part of the brand

Missing media, unsupported AR, out-of-stock inventory, loading, errors, and payment failures must be designed states. Never hide a limitation behind a polished placeholder.

### 2.5 Motion answers an action

Motion is permitted when it explains a transition: opening a drawer, changing quantity, loading a model, confirming a save, or moving between checkout steps. No motion should be added merely to make a screenshot feel alive.

### 2.6 Preserve product context

Before changing a surface, read the route, data contract, adjacent components, and this file. Do not import a visual trend from a reference site without translating it into NeoVerse's product job.

---

## 3. Color tokens

The palette is intentionally narrow. Do not create new one-off colors in components.

### 3.1 Core semantic tokens

| Token | CSS variable | Value | Meaning |
|---|---|---:|---|
| Ink | `--color-ink` | `#080B12` | Page stage and deepest background |
| Ink raised | `--color-ink-raised` | `#0D121A` | Header, overlays, quiet chrome |
| Panel | `--color-panel` | `#121922` | Primary surface and cards |
| Panel soft | `--color-panel-soft` | `#19232E` | Inputs, secondary controls, selected areas |
| Paper | `--color-paper` | `#F1EFE8` | Primary text and object facts |
| Muted | `--color-muted` | `#A3ACB8` | Supporting text and metadata |
| Faint | `--color-faint` | `#6F7A88` | Tertiary text only; never for essential content |
| Electric | `--color-electric` | `#89A6FF` | Links, focus, active tools, primary action |
| Electric strong | `--color-electric-strong` | `#B3C4FF` | Hover/active text on dark surfaces |
| Lime | `--color-accent` | `#C7ED70` | Available, confirmed, healthy, free shipping |
| Warning | `--color-warning` | `#F2BE70` | Pending or attention state |
| Error | `--color-error` | `#FF8178` | Failed, destructive, unavailable |
| Line | `--color-line` | `rgba(241, 239, 232, 0.14)` | Structural divider |
| Line strong | `--color-line-strong` | `rgba(241, 239, 232, 0.28)` | Hover/selected divider |

### 3.2 Color rules

- Use `paper` for facts, headings, prices, and primary controls.
- Use `muted` for metadata and supporting explanation.
- Use `electric` only where the user can act or focus: links, buttons, selected tabs, AR/3D tools, and focus rings.
- Use `accent` only for confirmed or available states. It is not a decorative secondary brand color.
- Use `error` for destructive actions and failed operations, never as a glow.
- Gradients are not part of the core product language. A gradient may only appear inside a real product image/model environment and must not carry text.
- Do not use color as the only way to communicate state. Pair it with text or an icon.

### 3.3 Surface rules

Default surface:

```text
background: panel
border: 1px solid line
radius: radius.surface
shadow: none
```

Use elevation only for:

- drawers and dialogs;
- menus that must float above content;
- a primary purchase panel when the surrounding layout needs separation.

`backdrop-filter`, blur, and glass transparency are not default surface treatments. They are reserved for overlays where the content behind must remain visible.

---

## 4. Typography

### 4.1 Families

- **Display:** Space Grotesk. Use for the wordmark, page titles, hero claims, and major object names.
- **Interface/body:** Inter. Use for navigation, descriptions, forms, buttons, metadata, prices, and operational screens.
- **No decorative monospace:** Do not use monospace for labels merely to imply technology. Use tabular Inter numerals for measurements, prices, and counts.

### 4.2 Type scale

| Role | Size | Line height | Weight | Usage |
|---|---:|---:|---:|---|
| Display XL | `clamp(3rem, 7vw, 6.5rem)` | `0.94` | 500 | One hero statement only |
| Display L | `clamp(2.5rem, 5vw, 4.5rem)` | `0.98` | 500 | Landing/page title |
| Display M | `clamp(2rem, 4vw, 3.25rem)` | `1.02` | 500 | Section or product title |
| Heading L | `1.75rem` | `1.12` | 600 | Major panel heading |
| Heading M | `1.25rem` | `1.25` | 600 | Card and section heading |
| Body L | `1.125rem` | `1.6` | 400 | Lead explanation |
| Body | `1rem` | `1.55` | 400 | Default content |
| Body S | `0.875rem` | `1.45` | 400 | Metadata and help |
| Caption | `0.75rem` | `1.35` | 500 | Status and compact facts |

### 4.3 Type rules

- Sentence case is the default.
- Do not color one word in a heading for emphasis.
- Do not use all-caps labels as decoration.
- Keep body line length between 45 and 78 characters.
- Headings should be left-aligned unless the surface is a short confirmation or an object stage with no competing content.
- Product prices use `tabular-nums` and should not be smaller than the product name's supporting metadata.
- Product names are allowed to wrap. Never truncate the only identifying name without a title/accessible label.

---

## 5. Geometry, spacing, and layout

### 5.1 Shape tokens

| Token | Value | Usage |
|---|---:|---|
| `radius-media` | `20px` | Product photography, 3D stage, AR preview |
| `radius-surface` | `12px` | Cards, panels, drawers |
| `radius-control` | `10px` | Buttons, inputs, segmented controls |
| `radius-status` | `999px` | Stock, availability, compact status only |

Do not apply one radius to every element. Media should feel like an object frame; controls should feel precise; status should be compact.

### 5.2 Spacing tokens

Use a 4px base unit:

```text
space-1  = 4px
space-2  = 8px
space-3  = 12px
space-4  = 16px
space-5  = 20px
space-6  = 24px
space-8  = 32px
space-10 = 40px
space-12 = 48px
space-16 = 64px
space-20 = 80px
space-24 = 96px
```

Recommended layout values:

| Token | Mobile | Desktop |
|---|---:|---:|
| Page gutter | 20px | 48px–64px |
| Content max width | 100% | 1240px |
| Header height | 64px | 72px |
| Section gap | 64px | 96px–128px |
| Panel padding | 20px | 24px–32px |
| Grid gap | 16px | 24px |

### 5.3 Layout grammar

NeoVerse uses a 12-column editorial grid on desktop and a single-column flow on mobile.

- Copy starts at the left edge of its grid area.
- The largest visual object may cross grid columns to create depth.
- The purchase rail remains stable and readable; it should not be pushed below endless marketing content.
- Product media gets more area than product copy on desktop: generally 7 columns media / 5 columns decision rail.
- Use asymmetry when it improves product inspection, not as decoration.
- Keep a consistent content edge across sections. Misaligned section starts are a defect unless intentional.

### 5.4 Route composition

```text
App shell
├── fixed/anchored navigation
├── route content with top offset
├── optional cart drawer
├── optional assistant surface
└── footer
```

Home:

```text
[quiet navigation]
[one dominant product evidence stage + short value proposition]
[small curated product rail]
[category navigation with material/object imagery]
[one practical AR explanation]
[quiet footer]
```

Catalog:

```text
[page title + result count + search]
[filter rail or mobile filter drawer]
[product grid with consistent evidence rows]
[pagination / result boundary]
```

Product detail:

```text
[breadcrumbs]
[large media stage | decision rail]
[dimensions/materials/compatibility evidence]
[reviews and related products]
```

Checkout:

```text
[step indicator]
[shipping/review task | order summary]
[clear payment redirect and failure state]
```

---

## 6. Component contracts

### 6.1 Button

Button hierarchy:

1. **Primary:** one per decision surface; electric background, ink text.
2. **Secondary:** supporting action; panel-soft background, line border.
3. **Outline:** lower-emphasis action when the surface already has strong background separation.
4. **Ghost:** tertiary action, especially navigation and remove actions.

Requirements:

- Minimum 44px touch height.
- Sentence-case verb that describes the result: `Add to bag`, `Place in your room`, `Try again`.
- Visible keyboard focus.
- Loading keeps button width stable and announces busy state.
- Never use a button that only says `Learn more`, `Explore`, or `Submit` when a more precise verb is available.

### 6.2 Product card

A product card is a comparison unit, not a decorative tile. It must show without hover:

- real image or explicit missing-media state;
- product name and brand;
- price and discount if real;
- stock/availability;
- AR/3D capability only if the data supports it;
- one direct action.

The media frame may be large and quiet. Metadata should be aligned consistently across cards. Do not place every field inside a separate badge.

### 6.3 Product evidence stage

The evidence stage is NeoVerse's signature component. It may contain:

- image or loaded 3D model;
- model loading/error/unsupported state;
- dimensions or scale reference;
- `Place in your room` action when supported;
- alternate images and media controls;
- a small, factual capability status.

It must not contain fake environment metrics, decorative HUD elements, or implementation-oriented language.

### 6.4 Status

Use text plus icon where useful:

- `In stock` / `Low stock` / `Out of stock`;
- `AR available` / `3D available` / `AR not supported on this device`;
- `Payment pending` / `Payment confirmed` / `Payment failed`.

Status colors are semantic and sparse. Never use lime as a general accent.

### 6.5 Surface

Use the shared `Surface`/`Card` primitives. Do not create one-off `bg-white/5 backdrop-blur` combinations in feature components. If a new surface behavior is needed, add a named semantic variant to the primitive first.

### 6.6 Forms

- Labels are always visible.
- Errors appear next to the field and in a summary when multiple fields fail.
- Placeholder text is an example, not the label.
- Do not use uppercase field labels for visual style.
- On checkout, show the amount source and whether shipping/tax are estimated or server-confirmed.

---

## 7. Interaction and motion

### Allowed motion

- One opening transition on the home evidence stage.
- Drawer/dialog enter and exit.
- Product image/model state transitions.
- Quantity and saved-state confirmation.
- Checkout step transition.

### Disallowed by default

- Infinite floating content.
- Per-card entrance delays across a grid.
- Hover lift on every card.
- Animated gradient text.
- Decorative particle systems behind transactional content.
- Auto-rotating product models without a pause/interaction control.

### Reduced motion

Every motion implementation must respect `prefers-reduced-motion`. Product inspection must remain possible without animation.

---

## 8. Responsive and accessibility requirements

Validate at **360px**, **768px**, and **1440px**.

- No horizontal scrolling at any supported width.
- Touch targets at least 44px.
- Keyboard navigation works for nav, filters, galleries, drawers, dialogs, cart controls, and checkout.
- Focus ring uses electric and remains visible on media and panel surfaces.
- Text meets WCAG 2.2 AA contrast; muted text cannot carry essential meaning alone.
- Use semantic headings in route order.
- Every meaningful image has useful alt text; decorative images use empty alt text.
- Use `aria-live` for cart quantity, payment state, and async result messages.
- Reserve media dimensions to prevent layout shift.
- Do not load Three.js/model-viewer on routes that do not need immersive media.

---

## 9. Content voice

Write like a knowledgeable store associate, not a marketing generator.

- Plain verbs: `View details`, `Add to bag`, `Place in your room`.
- Concrete nouns: `dimensions`, `oak`, `stock`, `delivery`, `checkout`.
- No claims that cannot be verified.
- No fake social proof or invented statistics.
- Explain limitations directly: `AR is available on iOS Safari`, `3D model unavailable`, `Only 2 left`.
- Empty states explain what happened and offer one useful next action.
- Error states name the failed operation and recovery action.

---

## 10. Figma, MCP, and reference workflow

External tools are for evidence and verification, not for replacing product judgment.

### Before design

1. Read `README.md`, `docs/PRD.md`, `docs/FRONTEND_CONTEXT_GOVERNANCE.md`, this file, and the target route.
2. Define the route's user job and primary evidence element.
3. If a Figma file exists, inspect the specific frame/component with the Figma MCP. Do not ask for an entire file without a target.
4. Use 21st.dev or other component references only to inspect implementation patterns, not to copy a visual identity.
5. Record any new token or primitive before introducing it in feature code.

### During implementation

1. Reuse semantic tokens and primitives.
2. Keep real data and existing business behavior unchanged during visual passes.
3. Add all relevant states: loading, empty, error, disabled, success, unsupported.
4. Avoid broad blind replacements in JSX. Edit one route or component slice at a time.

### After implementation

1. Run diagnostics on every changed file.
2. Run lint, typecheck, and the relevant build/test command.
3. Use Playwright at 360/768/1440 for behavior and screenshots.
4. Use Chrome DevTools for console errors, layout shift, image/model loading, and long tasks.
5. Review screenshots using the anti-generic checklist below.

### Reference translation rule

Every external reference must answer this before adoption:

> What user problem does this pattern solve in NeoVerse, and which existing token/component expresses it?

If the answer is only “it looks modern,” do not use it.

---

## 11. Anti-generic visual review

Reject a surface and redesign it if three or more statements are true:

- It could be pasted into a different product by changing only the logo.
- The object is less visually legible than the background effect.
- The same radius is used for media, cards, buttons, and statuses.
- More than one decorative gradient is visible before the primary action.
- Every section uses centered heading + subtitle + equal cards.
- It uses floating labels that do not communicate stock, capability, or task state.
- It requires hover to reveal a primary action.
- It uses a fake metric, fake testimonial, or unverified capability.
- The design language is explained by words like “futuristic,” “AI-powered,” or “next-gen” instead of by the object and evidence.
- There is no explicit empty, error, unavailable, or unsupported state.

### Surface review record

Every substantial frontend change should record:

```text
Surface:
User job:
Visual thesis:
Primary evidence element:
Primary action:
Tokens used:
States implemented:
Motion purpose:
Responsive checks:
Accessibility checks:
Performance checks:
External references used:
Anti-generic risks rejected:
```

---

## 12. Frontend architecture map

Routes compose feature modules. Route files own data loading and route-level states; feature modules own product behavior; UI primitives own tokenized visual behavior.

```text
src/
├── app/                         # route composition and metadata
├── components/
│   ├── ui/                      # tokenized primitives only
│   ├── layout/                  # app shell and navigation
│   ├── landing/                 # home composition
│   ├── products/                # catalog and comparison
│   ├── product/                 # product evidence and purchase
│   ├── ar-vr/                   # immersive adapters and states
│   ├── cart/                    # bag and cart drawer
│   ├── auth/                    # authentication UI
│   └── dashboard/               # account operations
├── lib/                         # API adapters, formatting, pure helpers
├── store/                       # client state only; server remains source of truth
└── types/                       # shared contracts
```

Do not introduce a second design system. New primitives must solve a repeated interaction or state, not provide a new visual style.

---

## 13. Definition of done

A frontend surface is complete when:

- Its route job and visual thesis are explicit.
- Product evidence is more prominent than decoration.
- Tokens and shared primitives are used instead of one-off styles.
- All meaningful states are designed and accessible.
- It works at 360px, 768px, and 1440px.
- It works with keyboard navigation and reduced motion.
- It does not rely on hover for essential actions.
- It has no fake content or unsupported claims.
- Diagnostics are clean for changed files.
- Repository lint/typecheck/build results are recorded honestly.
- A screenshot or browser review has rejected generic visual drift.

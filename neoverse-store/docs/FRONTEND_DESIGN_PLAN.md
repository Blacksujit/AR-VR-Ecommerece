# NeoVerse Store Frontend Design Plan

## Direction: Precision showroom

NeoVerse should feel like a carefully lit product showroom for objects that happen to be browsable in space—not a generic futuristic SaaS dashboard.

The memorable element is the **product evidence stage**: a real object, its true dimensions, material cues, and an immediate action to place it in the room. Everything else should become quieter so the product earns attention.

### Audience

People buying furniture, home objects, electronics, and design-led technology who need confidence before purchasing. They are not shopping for “AI”; they are trying to answer: *Will this fit, look right, and be worth the money?*

### Primary job

Reduce uncertainty before purchase through visual proof:

- true-scale context
- useful product details
- transparent price and availability
- clear AR/3D actions
- low-friction checkout

## Design review: what changes from the current direction

The current design uses dark backgrounds, blue/cyan gradients, glass cards, particles, floating pills, and animated reveals across nearly every section. Those choices fit the immersive brief but overuse the same visual signal, so the interface loses hierarchy and begins to resemble generated “future tech” templates.

The revised system keeps the dark stage and blue accent because they are already part of the brand, but changes the hierarchy:

- **Keep:** deep navy-black stage, electric blue interaction color, product visualization, restrained motion.
- **Reduce:** persistent particle fields, gradient text, decorative floating labels, glow on every card, excessive pill-shaped controls.
- **Add:** warm material neutrals, measured dividers, editorial product metadata, stronger scale indicators, real product photography, explicit states.
- **Reserve:** blue glow only for active AR/3D state or the primary purchase action.

## Compact token system

### Color

| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#080B12` | primary page stage |
| `--color-panel` | `#101620` | elevated surface |
| `--color-panel-soft` | `#171E29` | secondary surface and controls |
| `--color-paper` | `#F2F0EA` | primary text and product facts |
| `--color-muted` | `#9CA6B5` | secondary text |
| `--color-electric` | `#7C9CFF` | focus, links, active immersive state |
| `--color-lime` | `#C6F06B` | sparse discovery/availability accent |
| `--color-line` | `rgba(242, 240, 234, 0.14)` | dividers and structure |
| `--color-danger` | `#FF786E` | destructive/error state |

The lime accent is intentionally scarce. It marks “available now”, “in stock”, or a confirmed state; it should not become a second gradient color.

### Typography

- Display: `Space Grotesk`, existing brand face, used only for major headings and wordmark.
- Body/UI: `Inter`, existing readable face.
- Numeric/product facts: `Inter` with tabular numerals, not a decorative monospace treatment.
- Sentence case throughout. Avoid all-caps section labels and “AI-generated” eyebrow copy.
- Hero copy should stay under 70 characters per line and make the shopping benefit explicit.

### Shape and elevation

- Primary product/media frames: `20px` radius.
- Commerce cards: `12px` radius.
- Inputs and buttons: `10px` radius.
- Pills only for statuses, filters, and device capability—not as the default shape for every component.
- Use one-pixel dividers before adding shadows. Elevation is reserved for drawers, dialogs, and floating controls.

### Spacing

Use a 4px base scale with a deliberate editorial rhythm:

- page gutter: `24px` mobile, `40px` tablet, `64px` desktop
- content max width: `1240px`
- section rhythm: `96px` desktop / `64px` mobile
- product detail split: `7fr 5fr`
- card internals: `20px` default, `24px` for purchase panels

## Layout concepts

### Home: the evidence-first landing page

```text
┌──────────────────────────────────────────────────────────┐
│ NeoVerse       Shop   Showroom   Journal       bag  sign in│
├──────────────────────────────────────────────────────────┤
│                                                          │
│  SEE IT IN YOUR SPACE                 ┌────────────────┐  │
│  Products with enough                 │                │  │
│  evidence to buy with confidence.    │   LIVE OBJECT  │  │
│                                      │   / 3D STAGE   │  │
│  [Explore products] [View showroom]  │                │  │
│                                      └────────────────┘  │
│  12,000+ objects · AR-ready catalog                     │
├──────────────────────────────────────────────────────────┤
│ Curated for your room                                  → │
│ [large product] [large product] [large product]          │
├──────────────────────────────────────────────────────────┤
│ HOW IT WORKS: choose → place → decide                    │
└──────────────────────────────────────────────────────────┘
```

Alignment: left-aligned copy and product facts; center only for the object stage or short confirmation states.

### Catalog: quiet tools, strong objects

```text
┌──────────────────────────────────────────────────────────┐
│ Products                         Search products...       │
│ 248 objects · sorted by relevance                        │
├───────────────┬──────────────────────────────────────────┤
│ FILTERS       │ [object] [object] [object]               │
│ category      │ [object] [object] [object]               │
│ price         │ [object] [object] [object]               │
│ compatibility │                                          │
└───────────────┴──────────────────────────────────────────┘
```

The grid should have varied media crops but consistent metadata. Avoid turning every card into a glass panel; use background separation only where it helps scanning.

### Product detail: proof before persuasion

```text
┌──────────────────────────────────────────────────────────┐
│ Home / Audio / Object name                               │
├──────────────────────────────┬───────────────────────────┤
│                              │ Brand                      │
│       product image /        │ Object name                │
│       3D / AR stage          │ price · stock              │
│                              │ one-line reason to care    │
│ [gallery] [3D] [AR]          │ [Add to bag]               │
│                              │ [Place in your room]       │
│                              │ dimensions · materials    │
└──────────────────────────────┴───────────────────────────┘
```

### Checkout: trust, not spectacle

Checkout should remove decorative motion and use a calm two-column layout. Every amount comes from the server quote; the UI should show price source, shipping, taxes, and payment state clearly.

## Component architecture

```text
src/components/ui/
  button.tsx              # action hierarchy and focus behavior
  input.tsx               # labels, errors, help text
  surface.tsx             # panel/frame variants; avoid ad hoc glass classes
  status.tsx              # stock, payment, AR capability states
  skeleton.tsx
  empty-state.tsx
  error-state.tsx

src/components/layout/
  Navbar.tsx
  Footer.tsx
  AppProviders.tsx
  PageFrame.tsx

src/modules/catalog/
  ProductCard.tsx
  ProductGrid.tsx
  CatalogToolbar.tsx
  FilterPanel.tsx
  ProductDetailView.tsx

src/modules/immersive/
  ProductMediaStage.tsx
  ProductViewer.tsx
  ARViewer.tsx
  VRShowroom.tsx
  CapabilityNotice.tsx

src/modules/shopping/
  AddToCartButton.tsx
  CartLineItem.tsx
  CartSummary.tsx
  WishlistButton.tsx
  CheckoutForm.tsx

src/modules/discovery/
  SearchBar.tsx
  VoiceSearch.tsx
  RecommendationRail.tsx

src/modules/account/
  AccountShell.tsx
  OrderList.tsx
  ProfileForm.tsx
```

Routes under `src/app` should compose these modules and own metadata/loading/error boundaries, not contain long domain workflows.

## Interaction rules

1. One primary action per surface. Product detail: `Add to bag`; AR is a product-evidence action, not a competing checkout CTA.
2. Motion responds to user intent. Use entrance motion once on the home hero; use transitions for drawers, quantity changes, and confirmed saves.
3. No infinite floating animation on content users must read.
4. Respect `prefers-reduced-motion`; 3D auto-rotation must be opt-in or pauseable.
5. Every button says what it does: `Add to bag`, `Save address`, `Try again`, `Place in your room`.
6. Errors name the failed operation and the next action.
7. Empty states point to one useful next step.
8. Product cards expose stock, price, AR/3D availability, and a real action without requiring hover.
9. Touch targets are at least 44px.
10. Focus rings use the electric token and remain visible on dark media.

## Accessibility and performance gates

- WCAG 2.2 AA contrast for all text and status combinations.
- Keyboard navigation for navigation, filters, drawers, dialogs, gallery, and checkout.
- `aria-live` for cart quantity changes and payment/order status.
- Lazy-load immersive components behind explicit user intent where possible.
- Pause particle/canvas effects when offscreen and disable them on reduced motion.
- Reserve image/model dimensions to prevent layout shift.
- Avoid loading Three.js on routes that do not need immersive media.
- Test mobile first at 360px, tablet at 768px, desktop at 1440px.

## Implementation sequence

1. Token and primitive audit: replace hardcoded colors and ad hoc glass styles with semantic tokens.
2. App shell: navigation hierarchy, focus behavior, mobile menu, cart/AI overlay stacking.
3. Catalog card/grid: make product evidence and actions consistent.
4. Product media stage: unify image, 3D, and AR states.
5. Product detail purchase panel: price, stock, dimensions, and actions.
6. Cart and checkout: calm layout and server quote states.
7. Dashboard/admin: data-dense surfaces using the same tokens, not a second visual language.
8. Home page: reduce decorative sections and make the evidence stage memorable.
9. Browser/device QA and visual regression screenshots.

## Definition of frontend done

- No generic gradient/pill/card repetition without an information purpose.
- No placeholder CTA, fake product, or decorative control.
- Every interactive state has loading, success, error, empty, disabled, and focus behavior.
- Layout is usable without hover and with reduced motion.
- Product media failure is explicit and recoverable.
- Lighthouse and accessibility checks are run against the deployed build.

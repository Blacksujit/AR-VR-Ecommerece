# Frontend Context Governance

## Purpose

This document is the durable context for AI-assisted frontend work on NeoVerse Store. Load it before designing or reshaping UI. It exists to prevent visual drift toward generic AI-generated interfaces while keeping implementation grounded in the actual product, routes, components, and data contracts.

## Product context

NeoVerse is an immersive commerce product for people buying objects that need visual confidence before purchase: furniture, home goods, electronics, and design-led technology.

The interface must help users answer:

- Will this fit?
- What does it look like in my space?
- What are the dimensions and materials?
- Is it available now?
- Can I inspect it in 3D or AR?
- Can I buy without surprises?

The product is not an AI demo. AI, AR, VR, and 3D are means to reduce purchase uncertainty.

## Visual thesis

**Precision showroom:** a carefully lit, editorial product environment where the object and evidence lead, commerce controls remain quiet, and immersive technology appears as useful instrumentation rather than decoration.

The memorable element is the product evidence stage:

- real image or model
- scale and material cues
- availability
- dimensions
- AR/3D affordance
- clear purchase action

## Context loading order

Before changing frontend UI, read in this order:

1. `README.md`
2. `docs/PRD.md`
3. `docs/FRONTEND_DESIGN_PLAN.md`
4. `docs/ARCHITECTURE_REVIEW.md`
5. `DESIGN.md`
6. The route and components being changed
7. Existing tokens and primitives in `src/app/globals.css` and `src/components/ui`

Code and current behavior outrank stale documentation. If they disagree, preserve working behavior, record the drift, and update the relevant documentation after the implementation.

## Design rules

### Do

- Start from the user's buying question and the route's single job.
- Choose one visual direction for the surface and name the reason.
- Use real product data, existing route contracts, and actual media states.
- Make the hero a thesis: product evidence, not a generic marketing slogan.
- Use semantic tokens from `globals.css` rather than arbitrary colors.
- Use the existing primitives before creating a new component.
- Make product image, model, stock, price, and actions legible without hover.
- Use asymmetry or editorial composition only when it improves hierarchy.
- Use motion to show a state change or establish one deliberate opening moment.
- Make mobile and keyboard behavior part of the first implementation.
- Show loading, empty, error, disabled, unsupported, and success states.
- Validate the result at 360px, 768px, and 1440px.

### Do not

- Do not use a centered hero with a gradient headline by default.
- Do not use purple/blue gradients as a substitute for a visual concept.
- Do not add floating pills, eyebrows, badges, or numbered labels unless they communicate real information.
- Do not wrap every element in the same rounded glass card.
- Do not use identical three-column feature cards without a real grouping reason.
- Do not use all-caps tracked labels as decoration.
- Do not add infinite floating animation to readable content.
- Do not add a second design system or one-off color vocabulary.
- Do not invent fake products, stats, testimonials, reviews, or capabilities.
- Do not make the UI look premium by hiding errors or unavailable media.
- Do not change interaction behavior during a visual-only refactor.
- Do not optimize for screenshot novelty at the expense of checkout clarity.

## Anti-slop review signals

A surface requires another design pass if three or more are true:

- The same radius is used for media, cards, buttons, and dialogs.
- More than one decorative gradient is visible before the primary action.
- Every section uses centered heading, subtitle, and equal cards.
- Motion is applied to every element instead of one meaningful moment.
- The section could be pasted into a different product without changing the copy.
- The product itself is smaller or less legible than the background treatment.
- A label explains the implementation rather than the user's task.
- The only differentiation is color, glow, or a different icon.
- The design needs hover to reveal its primary action.
- A component has no explicit empty, error, or unsupported state.

## Token contract

Use these semantic roles:

| Role | Token |
|---|---|
| page stage | `ink` / `background` |
| primary text | `paper` / `foreground` |
| secondary text | `muted` |
| primary surface | `panel` |
| secondary surface | `panel-soft` |
| active/focus | `electric` / `primary` |
| availability/confirmed | `accent` / `success` |
| divider | `line` / `border` |
| destructive | `error` |

Shape hierarchy:

- product media: `rounded-media`
- panels/cards: `rounded-surface`
- controls: `rounded-control`
- statuses: `rounded-full`

If a new token is needed, add it to the semantic theme before using it in a component.

## MCP and tool workflow

MCPs are for grounding and verification, not for outsourcing product judgment.

### Before implementation

1. Use repository files as the primary source of truth.
2. If a Figma source exists, use the Figma MCP `get_design_context` on the specific frame or node rather than a whole-file vague prompt.
3. Use the Claude documentation MCP for framework/API facts only.
4. Use the architecture skill for boundary and behavior decisions, not visual styling alone.
5. Record the intended surface direction in the task or a short design note.

### During implementation

1. Reuse existing UI primitives and tokens.
2. Prefer the smallest change that creates a coherent surface.
3. Keep content and API behavior unchanged during visual passes unless explicitly requested.
4. Use real asset states and real copy.
5. Keep provider-specific MCP or AI language out of product-facing UI.

### After implementation

1. Use Playwright MCP to check the route at mobile, tablet, and desktop widths.
2. Verify keyboard navigation, focus rings, modal/drawer focus, and touch target sizes.
3. Use Chrome DevTools MCP to inspect layout shift, long tasks, image/model loading, and console errors.
4. Compare screenshots against the surface's stated visual thesis, not against generic inspiration.
5. Run diagnostics, lint, typecheck, and the relevant build/test command.
6. Record unresolved visual or runtime gaps instead of hiding them.

## Review template

Every substantial frontend change should answer:

```text
Surface:
User job:
Visual thesis:
Existing context used:
Primary evidence element:
Primary action:
Semantic tokens used:
States implemented: loading / empty / error / disabled / success / unsupported
Motion purpose:
Responsive checks:
Accessibility checks:
Performance checks:
Anti-slop risks rejected:
```

## Current NeoVerse decisions

- Direction: precision showroom.
- Hero: live product evidence stage.
- Primary CTA language: `Explore products`, `Add to bag`, `Place in your room`, `Try again`.
- AR/3D are evidence tools, not decorative badges.
- Lime is reserved for availability and confirmed states.
- Blue is reserved for interaction and focus.
- Checkout is calmer than the homepage.
- Product cards show useful evidence without hover.
- The system prefers dividers and spacing before shadows and glows.

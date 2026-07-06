# NeoVerse Store — Implementation Audit

## Framework Versions

| Component | Version |
|-----------|---------|
| Next.js | 16.2.10 |
| React | 19.2.4 |
| Three.js | 0.185.1 |
| React Three Fiber | 9.6.1 |
| Drei | 10.7.7 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Node.js | 24.16.0 |
| Express | 4.21.0 |
| Mongoose | 8.6.0 |
| Stripe | 22.3.0 |
| Firebase Admin | 14.1.0 |

## Architecture

- **Frontend**: Next.js App Router, TanStack Query, Zustand (cart, wishlist, UI state), Firebase Auth
- **Backend**: Express REST API, MongoDB/Mongoose, Firebase Admin SDK, Stripe, Cloudinary, Resend
- **3D/AR/VR**: React Three Fiber + Drei (@react-three/fiber 9.x, drei 10.x), @google/model-viewer 4.x
- **Auth**: Firebase (migrated from Clerk - in progress)

---

## ISSUE REGISTER

### P0 — Blockers (Must Fix Before Anything Else)

#### I-01: `@google/model-viewer` web component never registered
- **File**: `src/components/ar-vr/ARViewer.tsx`
- **Root Cause**: `<model-viewer>` is used as a JSX element but the web component is never registered. The `@google/model-viewer` v4 package must be imported for side effects (`import '@google/model-viewer'`) before using the custom element.
- **Fix**: Add `import '@google/model-viewer'` at the top of `ARViewer.tsx`.

#### I-02: ProductViewer uses `require()` for useGLTF
- **File**: `src/components/product/ProductViewer.tsx:63`
- **Root Cause**: `const { scene } = require('@react-three/drei').useGLTF(url)` — runtime `require()` in a client component is not compatible with Turbopack/module-based bundling.
- **Fix**: Replace with `import { useGLTF } from '@react-three/drei'` at top level, then `const { scene } = useGLTF(url)` in the component.

#### I-03: No 3D model files in `public/models/`
- **Root Cause**: `public/models/` directory is empty. Products have `modelUrl` fields but there are no `.glb` or `.gltf` files to serve.
- **Fix**: Download or generate at least 3-5 GLB models for AR/VR-enabled products, or configure Cloudinary/remote model URLs.

#### I-04: Firebase `__session` cookie never set, middleware redirects break
- **Files**: `src/middleware.ts`, `src/components/auth/AuthContext.tsx`
- **Root Cause**: Middleware checks for `__session` cookie to protect `/dashboard`, `/wishlist`, `/checkout`. Firebase never sets this cookie — the AuthContext only manages in-memory token state.
- **Fix**: Set `__session` cookie with the Firebase ID token in `AuthContext` when auth state changes, and clear it on sign-out. Needs server-side cookie write.

#### I-05: Backend `FIREBASE_SERVICE_ACCOUNT_KEY` is empty
- **File**: `backend/.env`
- **Root Cause**: No service account key configured. The fallback `admin.applicationDefault()` requires GCP ADC configuration which may not be set up locally.
- **Fix**: Either generate a service account key and set `FIREBASE_SERVICE_ACCOUNT_KEY` as base64, or set `GOOGLE_APPLICATION_CREDENTIALS` env var.

#### I-06: `wishlist-store.ts` is local-only, never syncs with API
- **Files**: `src/store/wishlist-store.ts`, `src/app/wishlist/page.tsx`
- **Root Cause**: The Zustand wishlist store persists to localStorage, but doesn't call the backend API. The wishlist page fetches from API but the toggle button on product detail pages uses the store (local-only). Adding to wishlist won't survive refresh or appear on other devices.
- **Fix**: Wishlist store must sync with backend API (POST/DELETE) on toggle, with optimistic updates and rollback.

#### I-07: Cart is local-only, no backend persistence
- **Files**: `src/store/cart-store.ts`
- **Root Cause**: Cart stores in localStorage via Zustand persist middleware. No API calls to persist cart to MongoDB. Guest cart merge on login is not implemented.
- **Fix**: Implement cart API endpoints in backend, sync cart store with API for authenticated users.

---

### P1 — Functional Issues

#### I-08: VR Showroom uses hardcoded fake product data
- **File**: `src/components/ar-vr/VRShowroomScene.tsx:14-20`
- **Root Cause**: Products array is hardcoded with generic names and colors. Doesn't fetch from product API.
- **Fix**: Fetch VR-supported products from API, create real interactive product pedestals with actual product data, add cart/wishlist integration.

#### I-09: Auto-rotate toggle in ProductViewer doesn't work
- **File**: `src/components/product/ProductViewer.tsx`
- **Root Cause**: `autoRotate` state is set but never passed to the scene. The `ModelViewer` component always uses `useFrame` for rotation regardless of state.
- **Fix**: Pass `autoRotate` as prop to `ModelViewer`, conditionally apply rotation in `useFrame`.

#### I-10: Duplicate user profile routes
- **Files**: `backend/routes/authRoutes.js`, `backend/routes/userRoutes.js`
- **Root Cause**: `/api/users/profile` and `/api/user/profile` both exist with similar functionality. AuthContext uses `/users/profile` while userController has richer functionality.
- **Fix**: Consolidate to one route set, redirect `/api/users/profile` or just remove the duplicate.

#### I-11: Wishlist page uses API correctly, but product card buttons don't
- **File**: `src/app/wishlist/page.tsx` — Remove button calls `api.delete('/wishlist/${productId}')` ✅
- **But**: Store toggle `useWishlistStore.toggleItem()` only updates local state ❌
- **Fix**: Make `toggleItem` also call the API when user is authenticated.

#### I-12: `User.js` schema still has `clerkId` field
- **File**: `backend/models/User.js:19-23`
- **Root Cause**: Schema uses `clerkId` for Firebase UID storage. Works but confusing.
- **Fix**: Rename to `firebaseUid` after migration is verified.

#### I-13: `ProductDetailClient` AR button navigates away
- **File**: `src/app/products/[slug]/ProductDetailClient.tsx:301`
- **Root Cause**: "View in AR" button navigates to `?view=ar` query param instead of opening the inline AR viewer.
- **Fix**: Wire the AR button to open the `<ARViewer>` inline modal below the 3D viewer in the sidebar.

#### I-14: Authentication not enabled in Firebase Console
- **Root Cause**: Email/Password, Google, Phone providers need to be enabled manually in Firebase Console.
- **Fix**: User must go to Firebase Console > Authentication > Sign-in method and enable providers.

---

### P2 — Polish & Edge Cases

#### I-15: Voice search in ProductListingClient is inline code
- **File**: `src/app/products/ProductListingClient.tsx:244-257`
- **Root Cause**: Voice search is implemented inline in the search input button, while `VoiceSearch.tsx` component exists separately.
- **Fix**: Use the `VoiceSearch` component instead of the inline implementation.

#### I-16: SearchHistory, RecentlyViewed models exist but aren't called on product view
- **Files**: `backend/models/SearchHistory.js`, `backend/models/RecentlyViewed.js`
- **Root Cause**: When a user views a product, no API call is made to record this event for recommendations.
- **Fix**: Call `POST /user/recently-viewed` and `POST /user/search-history` on product page visits and searches.

#### I-17: `next.config.ts` is completely empty
- **File**: `next.config.ts`
- **Root Cause**: No image configuration, no redirects, no optimization settings.
- **Fix**: Add `images.remotePatterns` for any external image hosts (Cloudinary, etc.), add security headers, configure standalone output for deployment.

#### I-18: Checkout total calculated from localStorage prices
- **File**: `src/app/checkout/page.tsx`
- **Root Cause**: Subtotal, shipping, tax, total are all calculated client-side from localStorage cart data. Backend should recalculate and validate prices.
- **Fix**: Backend must recalculate totals from database prices during checkout.

#### I-19: StoreMap component imported but Google Maps API key missing
- **File**: `src/components/ui/StoreMap.tsx`
- **Root Cause**: The StoreMap component likely requires Google Maps API key. Also imported on contact page without checking.
- **Fix**: Either provide API key or replace with OpenStreetMap fallback.

#### I-20: No Cart API endpoints in backend
- **Root Cause**: Backend has no cart routes or controller. Cart is fully client-side.
- **Fix**: Create cart model, routes, controller for persistent authenticated cart.

---

## API Inventory

| Route | Method | Auth | Status | Notes |
|-------|--------|------|--------|-------|
| `/api/users/profile` | GET | Required | ✅ | AuthContext uses this |
| `/api/users/profile` | PUT | Required | ✅ | Update name/avatar |
| `/api/products` | GET | No | ✅ | Fully works with filters |
| `/api/products/featured` | GET | No | ✅ | Returns featured products |
| `/api/products/top` | GET | No | ✅ | Returns top-rated products |
| `/api/products/:slug` | GET | No | ✅ | By slug |
| `/api/products/:id` | PUT | Admin | ✅ | Update product |
| `/api/products/:id` | DELETE | Admin | ✅ | Delete product |
| `/api/wishlist` | GET | Required | ✅ | Seeded from user.wishlist |
| `/api/wishlist` | POST | Required | ✅ | Add product to wishlist |
| `/api/wishlist/:productId` | DELETE | Required | ✅ | Remove from wishlist |
| `/api/orders/myorders` | GET | Required | ✅ | User's orders |
| `/api/orders/:id` | GET | Required | ✅ | Order details |
| `/api/orders` | GET | Admin | ✅ | All orders |
| `/api/orders` | POST | Required | ✅ | Create order |
| `/api/orders/:id/pay` | PUT | Required | ✅ | Mark paid |
| `/api/recommendations` | GET | Optional | ✅ | Signal-based scoring |
| `/api/recommendations/track` | POST | Optional | ✅ | Track events |
| `/api/contact` | POST | No | ✅ | Submit inquiry |
| `/api/contact` | GET | Admin | ✅ | List inquiries |
| `/api/contact/:id/read` | PUT | Admin | ✅ | Mark read |
| `/api/user/profile` | GET | Required | ⚠️ | Duplicate of /users/profile |
| `/api/user/profile` | PUT | Required | ⚠️ | Duplicate |
| `/api/user/addresses` | GET/POST | Required | ✅ | Address management |
| `/api/user/addresses/:addressId` | PUT/DELETE | Required | ✅ | Address management |
| `/api/user/preferences` | GET/PUT | Required | ✅ | User preferences |
| `/api/user/recently-viewed` | GET/POST | Required | ✅ | Recently viewed |
| `/api/user/notifications` | GET | Required | ✅ | Notifications |
| `/api/user/search-history` | GET/DELETE | Required | ✅ | Search history |
| `/api/stripe/create-checkout-session` | POST | Required | ⚠️ | Needs verification |
| `/api/stripe/webhook` | POST | No (sig) | ⚠️ | Needs verification |
| `/api/categories` | GET | No | ✅ | Categories with counts |
| `/api/ai/chat` | POST | Optional | ⚠️ | AI assistant |

## Working Features (Do NOT Break)
- Product listing with search, filter, sort, pagination
- Featured products on homepage
- Contact form with email notification
- MongoDB connection and seed data
- User profile retrieval
- Category listing with product counts
- Recommendation engine (signal-based)
- Dashboard with loading/empty/error states
- Admin page with stats
- Cart local store with add/remove/quantity
- Product detail page with specs/reviews

## Missing Features
- [ ] Firebase Auth providers not enabled in Console
- [ ] Backend Firebase Admin SDK service account key
- [ ] No GLB models for 3D/AR viewer
- [ ] Cart API endpoints (persistent cart)
- [ ] Wishlist API sync from store
- [ ] `__session` cookie management
- [ ] Real data in VR showroom
- [ ] Product view event tracking
- [ ] Search history recording
- [ ] Stripe checkout flow (written but untested)
- [ ] Voice search integration (inline code vs component)
- [ ] Guest cart → authenticated cart merge

## Mock Features
- [ ] VR showroom uses hardcoded fake products
- [ ] ProductViewer GLTF loading uses broken `require()`
- [ ] `@google/model-viewer` web component never registered
- [ ] Auto-rotate toggle doesn't work

## Environment Variables Required
- `NEXT_PUBLIC_FIREBASE_*` — ✅ Present
- `FIREBASE_SERVICE_ACCOUNT_KEY` — ❌ Missing (empty in backend/.env)
- `STRIPE_SECRET_KEY` — ✅ Present
- `STRIPE_WEBHOOK_SECRET` — ✅ Present
- `RESEND_API_KEY` — ✅ Present
- `OPENAI_API_KEY` — ✅ Present
- `CLOUDINARY_*` — ✅ Present
- `MONGODB_URI` — ✅ Present

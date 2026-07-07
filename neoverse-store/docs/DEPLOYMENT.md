# NeoVerse Store - Deployment Guide

## Architecture

The NeoVerse Store is split into two parts:

| Component | Technology | Hosting |
|-----------|------------|---------|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS | Vercel |
| **Backend API** | Express.js, MongoDB, Firebase Admin SDK | Standalone server (Render / Fly.io / Local) |

### Frontend (Vercel)
- **URL:** https://neoverse-store.vercel.app
- **Stack:** Next.js 16, React 19, TypeScript, TailwindCSS
- **Auth:** Firebase Authentication (email/password + Google)
- **State:** Zustand (cart, wishlist, UI) + TanStack Query (API data)
- **3D:** Three.js, React Three Fiber, @google/model-viewer
- **AR:** WebXR / Scene Viewer / AR Quick Look

### Backend (Express)
- **Repository path:** `/backend`
- **Stack:** Express.js, Mongoose, Firebase Admin SDK, Stripe, Resend
- **Database:** MongoDB Atlas
- **Auth verification:** Firebase Admin SDK (token verification)

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account
- Firebase project
- Cloudinary account
- Stripe account (optional, for payments)
- Resend account (optional, for emails)

## Environment Variables

### Frontend (`./env.local`)

```env
NEXT_PUBLIC_API_URL=<backend-api-url>
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<firebase-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<firebase-app-id>
```

### Backend (`backend/.env`)

```env
MONGODB_URI=<mongodb-atlas-connection-string>
FIREBASE_SERVICE_ACCOUNT_PATH=<path-to-service-account-json>
FIREBASE_SERVICE_ACCOUNT_KEY=<base64-encoded-service-account>
FIREBASE_PROJECT_ID=<firebase-project-id>
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
RESEND_API_KEY=<resend-api-key>
```

## Local Development

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Start Frontend

```bash
# From root directory
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Vercel Deployment

### Automatic (CLI)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Manual (Vercel Dashboard)

1. Push repository to GitHub
2. Go to https://vercel.com/new
3. Import the GitHub repository
4. Framework: Next.js (auto-detected)
5. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
   - All `NEXT_PUBLIC_FIREBASE_*` variables
6. Deploy

### Build Settings

- **Framework preset:** Next.js
- **Build command:** `npm run build`
- **Output directory:** `.next`
- **Install command:** `npm install --legacy-peer-deps`

## Post-Deployment Configuration

### Firebase Authentication

1. Go to Firebase Console → Authentication → Settings
2. Add the Vercel domain to **Authorized domains**
3. Enable Email/Password and Google sign-in methods

### Backend Deployment

The backend is a standalone Express server. Deploy it to:

**Render (recommended):**
1. Create a new Web Service on https://render.com
2. Connect repository
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Set all backend environment variables
7. Deploy

**Fly.io:**
```bash
cd backend
fly launch
fly deploy
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Optional | List products |
| GET | `/api/products/featured` | No | Featured products |
| GET | `/api/products/:slug` | No | Product detail |
| GET | `/api/categories` | No | List categories |
| POST | `/api/users/profile` | Required | Get profile |
| PUT | `/api/users/profile` | Required | Update profile |
| GET | `/api/orders/myorders` | Required | User orders |
| POST | `/api/inquiries` | No | Contact form |

## Troubleshooting

### Firebase Admin Auth Fails
**Error:** `admin.auth is not a function`
**Fix:** The project uses `firebase-admin` v14 (modular API). Ensure imports:
```js
const { getAuth } = require('firebase-admin/auth');
const auth = getAuth();
```

### @google/model-viewer Build Error
**Error:** `ERESOLVE could not resolve` or `self is not defined`
**Fix:** Install with `--legacy-peer-deps` or use dynamic import with `ssr: false`.

### MongoDB Connection in Serverless
The backend uses a cached connection pattern that prevents `OverwriteModelError`. No additional configuration needed for serverless environments.

## AR/VR Browser Requirements

| Feature | Browser | Device |
|---------|---------|--------|
| AR (WebXR) | Chrome 81+ | Android ARCore-supported |
| AR (Scene Viewer) | Chrome/Android | Android |
| AR (Quick Look) | Safari | iOS 12+ |
| VR Showroom | Chrome/Firefox | Desktop (WebXR headset optional) |

## Known Limitations

- Backend requires a separate server (cannot be fully serverless due to long-running Express server)
- Stripe webhooks need the production webhook URL configured in the Stripe dashboard
- File uploads via Multer work on local/server deployment but not in serverless
- 3D model files (GLB) need to be hosted at publicly accessible URLs

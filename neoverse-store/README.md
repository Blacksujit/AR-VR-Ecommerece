# NeoVerse Store — AR/VR Powered AI E-Commerce Platform

> "The Future of Shopping Begins Here."

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-green)](https://docs.pmnd.rs/react-three-fiber)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/atlas)

NeoVerse Store is a production-grade AR/VR-powered e-commerce platform built with Next.js 16, featuring immersive 3D product visualization, AR try-on experiences, a virtual reality showroom, and AI-powered shopping assistance.

---

## Features

### 🛍️ Immersive Shopping
- **3D Product Viewer** — Interactive 360° product visualization using React Three Fiber
- **AR Try-On** — View products in your space using WebXR (`immersive-ar`)
- **VR Showroom** — Explore products in a virtual 3D showroom with floating displays

### 🤖 AI-Powered
- AI Shopping Assistant for product recommendations and comparisons
- Smart search with voice search UI
- Personalized recommendations based on browsing history

### 🎨 Premium Design
- Dark theme with glassmorphism aesthetic
- Smooth scroll-triggered animations (Framer Motion + GSAP)
- Particle effects, parallax, and micro-interactions
- Fully responsive across all devices

### 🔧 Full E-Commerce
- Product catalog with filters, sorting, and search
- Shopping cart with persistent storage (Zustand)
- Wishlist management
- User authentication (mock auth with Google/GitHub login)
- Admin dashboard with analytics (Recharts)
- Order management system

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **3D & AR/VR** | Three.js, React Three Fiber, Drei, WebXR |
| **Animations** | Framer Motion, GSAP, Lenis |
| **State** | Zustand (persisted), TanStack Query |
| **Backend** | Node.js, Express, MongoDB (Mongoose) |
| **Auth** | Firebase (mock with Google/GitHub) |
| **UI** | Lucide Icons, Recharts |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## Project Structure

```
neoverse-store/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── products/           # Product listing & detail
│   │   ├── categories/         # Category browsing
│   │   ├── vr-showroom/        # VR showroom
│   │   ├── dashboard/          # User dashboard
│   │   ├── admin/              # Admin panel
│   │   ├── checkout/           # Checkout flow
│   │   └── contact/            # Contact & FAQ
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives
│   │   ├── layout/             # Navbar, Footer, Providers
│   │   ├── landing/            # Landing page sections
│   │   ├── product/            # Product viewer & cards
│   │   ├── ar-vr/              # AR & VR components
│   │   ├── auth/               # Auth context & modals
│   │   └── cart/               # Cart sidebar
│   ├── store/                  # Zustand stores
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities, constants, API client
│   └── types/                  # TypeScript type definitions
├── backend/                    # Express + MongoDB API
│   ├── server.js               # Entry point
│   ├── models/                 # Mongoose schemas
│   ├── controllers/            # Route handlers
│   ├── routes/                 # Express routes
│   └── middleware/             # Auth & error handling
└── public/                     # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 20.9+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neoverse-store.git
cd neoverse-store

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Configure environment
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neoverse
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Run Development

```bash
# Start backend (from backend/)
npm run dev

# Start frontend (from root)
npm run dev

# Seed database with sample data
cd backend && node seeder.js
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| `demo@neoverse.com` | any password | User |
| `admin@neoverse.com` | any password | Admin |

---

## Deployment

### Frontend (Vercel)

```bash
npm run build
vercel --prod
```

### Backend (Render)

1. Create a new Web Service on Render
2. Set root directory to `backend/`
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `backend/.env`
6. Set up MongoDB Atlas for production database

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users` | Register user | No |
| POST | `/api/users/login` | Login | No |
| GET | `/api/users/profile` | Get profile | JWT |
| GET | `/api/products` | List products | No |
| GET | `/api/products/featured` | Featured products | No |
| GET | `/api/products/top` | Top rated | No |
| GET | `/api/products/:slug` | Product detail | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| POST | `/api/orders` | Create order | JWT |
| GET | `/api/orders/myorders` | My orders | JWT |
| GET | `/api/orders/:id` | Order detail | JWT |
| PUT | `/api/orders/:id/pay` | Pay order | JWT |
| PUT | `/api/orders/:id/deliver` | Deliver order | Admin |

---

## Architecture

### Design Decisions

- **Feature-based architecture** for scalable code organization
- **Zustand** over Redux for lightweight state management with persistence
- **React Three Fiber** for declarative 3D rendering
- **WebXR API** for AR capabilities (no external SDKs)
- **Mock auth** to demonstrate the flow without Firebase configuration
- **Turbopack** as default bundler for faster dev builds

### Key Patterns

- Server Components for SEO-critical pages, Client Components for interactive features
- Dynamic imports with `lazy()` for Three.js components (reduces bundle size)
- `Suspense` boundaries around 3D content
- Zustand persist middleware for cart/wishlist across sessions
- Debounced search with 300ms delay

---

## License

MIT

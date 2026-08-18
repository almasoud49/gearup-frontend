# 🏕️ GearUp — Gear Rental Frontend

A modern gear-rental marketplace built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. This is the official client for the GearUp backend API — it covers the complete customer → provider → admin journey: browsing the catalog, booking gear with real **Stripe** checkout, tracking rental orders, leaving reviews, and managing the platform from role-specific dashboards.

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

---

## 📋 Table of Contents

- [Live Links](#live-links)
- [Demo Credentials](#-demo-credentials)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Payment Flow](#-payment-flow)
- [API Integration](#-api-integration)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Assignment Notes (B7A5)](#assignment-notes-b7a5)

---

## Live Links

| App | URL |
| --- | --- |
| **Frontend (deployed)** | `http://localhost:3000` *(deploy this repo to Vercel for a live URL)* |
| **Backend API** | `https://gear-up-pied.vercel.app/api` |
| **API Integration Map** | [`API_INTEGRATION.md`](./API_INTEGRATION.md) |

---

## 🔑 Demo Credentials

| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@gearup.com` | `admin123` |
| **Provider** | `test.prov.status@example.com` | `Password123` |
| **Customer** | `test.cust.lifecycle@example.com` | `Password123` |

> The register API only allows `CUSTOMER` / `PROVIDER` roles, so the admin account is seeded on the deployed backend. You can also create your own accounts at `/register`.

---

## ✨ Features

### Public
- **Catalog** — responsive gear grid with search, category / brand / price filters, and sorting (`pricePerDay`, `createdAt`).
- **Gear detail** — image gallery, specs, provider info, average rating, and verified customer reviews.
- **Rental booking** — date-range pickers → live price calculation → checkout.
- **Stripe checkout** — real Stripe **PaymentIntent** flow with `/payment/success` and `/payment/cancel` pages.

### Authentication
- Login / register with validation, role selection (**CUSTOMER** / **PROVIDER**).
- **httpOnly JWT session cookies** (`accessToken` + `refreshToken`) with automatic token rotation.
- Route guards via `proxy.ts` (Next 16 middleware replacement) — wrong-role redirects to the user's own dashboard.

### Customer Dashboard (`/customer`)
- Overview stats: total rentals, active orders, **total spent** (completed payments only).
- Orders with status badges + actions (Pay Now, Confirm, Leave Review).
- Payment history table, reviews (create / edit / delete), and profile management.

### Provider Dashboard (`/provider`)
- Overview stats (earnings, active listings, pending orders).
- Full **gear CRUD** (add / edit / delete listings with images, specs, availability).
- Order management — Confirm / Mark Picked Up / Returned via status transitions.

### Admin Dashboard (`/admin`)
- Platform overview stats (users, gear, rentals, revenue).
- **User management** — suspend / activate any account.
- Gear & rental moderation, category management.

### UX
- Loading skeletons, `error.tsx` error boundaries, toast notifications, inline form errors.
- **Dark mode** (class-based, persisted, no flash on load).
- Scroll-reveal animations, parallax hero, marquee, gradient effects — all CSS-first.

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js **16** (App Router), React **19** |
| Language | TypeScript |
| Styling | Tailwind CSS **v4** (CSS-first theme), shadcn/ui |
| State | Zustand (auth mirror) + TanStack Query (server state) |
| Forms | React 19 `useActionState` + uncontrolled server-action forms |
| Payments | Stripe Elements (`@stripe/stripe-js`, `@stripe/react-stripe-js`) |
| Icons | `@hugeicons/core-free-icons` (tokens) + `lucide-react` |
| Animations | CSS utilities in `globals.css` + custom `Reveal` / `Parallax` components |
| Auth | `jsonwebtoken` (cookie verification in `proxy.ts`) |

---

## Getting Started

### Prerequisites

- Node.js **20+**
- npm
- A running backend (see [`API_INTEGRATION.md`](./API_INTEGRATION.md)) — or use the deployed one

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/almasoud49/gearup-frontend.git
cd gearup-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
#   NEXT_PUBLIC_API_URL — backend base URL
#   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe test publishable key
#   JWT_ACCESS_SECRET / JWT_REFRESH_SECRET — for proxy.ts cookie verification

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
gearup-frontend/
├── app/                          # App Router (no src/)
│   ├── (auth)/                   # Login, Register + group-scoped actions/components
│   ├── (public)/                 # Home, gear, gear/[id], checkout, payment, about, contact
│   ├── (dashboard)/              # customer/ · provider/ · admin/ dashboards
│   │   ├── _actions/             # Server actions (gear, rentals, reviews, users)
│   │   ├── _components/          # DashboardShell, StatCard, GearForm, ReviewModal, hooks
│   │   └── _config/              # Per-role sidebar menu items
│   ├── layout.tsx                # Root layout (fonts, theme script, providers, footer)
│   └── globals.css               # Tailwind v4 theme + animation utilities
├── components/                   # shadcn/ui, AuthSync, Footer
├── lib/                          # auth store, types, images, gear payload, order store
├── service/                      # Session helpers (getMe, logout, refreshToken)
├── utils/                        # JWT helpers (proxy.ts)
├── proxy.ts                      # Next 16 route guards (middleware replacement)
├── API_INTEGRATION.md            # Component → endpoint mapping
└── next.config.ts                # Next config (remote image hosts allowed)
```

---

## Routes

### Public
| Route | Description |
| --- | --- |
| `/` | Homepage (hero, featured gear, testimonials) |
| `/gear` | Catalog with filters + sorting |
| `/gear/[id]` | Gear detail + reviews |
| `/checkout` | Rental date picker + order summary |
| `/payment/[rentalId]` | Stripe payment page |
| `/payment/success` `/payment/cancel` | Payment result pages |
| `/about` `/contact` | Info pages |

### Auth
| Route | Description |
| --- | --- |
| `/login` | Login (redirects authed users to their role home) |
| `/register` | Register with role selection |

### Dashboards
| Route | Description |
| --- | --- |
| `/customer` | Overview + orders, payments, reviews, profile |
| `/customer/orders/[id]/pay` | Pay a specific order |
| `/provider` | Overview + gear CRUD, order management |
| `/admin` | Overview + users, gear, orders, rentals |

All dashboard sub-routes are guarded by `proxy.ts` (`startsWith`), so a customer visiting `/provider/...` is redirected to their own home.

---

## 💳 Payment Flow

1. Customer books gear at `/checkout` → `POST /rentals` creates a `PLACED` order.
2. Order moves to `/payment/[rentalId]` → `POST /payments/create` returns a Stripe **PaymentIntent** `clientSecret`.
3. Stripe Elements mounts with the publishable key; `stripe.confirmPayment` runs with `return_url`.
4. Success → `/payment/success` · Cancel → `/payment/cancel`.

> Payment is **real** Stripe (test mode) — no "Pay Later" simulation.

---

## 🔌 API Integration

Every backend endpoint consumed by this app is documented in **[`API_INTEGRATION.md`](./API_INTEGRATION.md)**, mapped to the server action and UI component that calls it. Highlights:

- **Auth:** `POST /auth/login`, `POST /users/register`, `GET /users/me`, `PATCH /users/me`
- **Catalog:** `GET /gear`, `GET /gear/:id`, `GET /categories`
- **Rentals:** `POST /rentals`, `GET /rentals`, `GET /rentals/:id`, `PATCH /rentals/:id/status`
- **Payments:** `GET /payments`, `POST /payments/create`
- **Reviews:** `GET /reviews`, `POST /reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id`
- **Admin:** `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `GET /admin/stats`
- **Stats:** `GET /rentals/stats/overview`, `GET /provider/stats`

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend base URL (e.g. `https://gear-up-pied.vercel.app/api`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe test publishable key (starts with `pk_test_`) |
| `JWT_ACCESS_SECRET` | ✅ | Server-side JWT secret used by `proxy.ts` to verify cookies |
| `JWT_REFRESH_SECRET` | ✅ | Server-side JWT secret for the refresh token |

> `NEXT_PUBLIC_*` variables must be inlined at build time. The remaining variables in the backend `.env` (`DATABASE_URL`, `STRIPE_SECRET_KEY`, etc.) belong to the backend service and are **not** used by this app.

---

## Available Scripts

```bash
npm run dev       # Start the dev server (port 3000)
npm run build     # Production build
npm run start     # Serve the production build
npm run lint      # ESLint 9 (flat config — no `next lint`)
npx tsc --noEmit  # Typecheck
```

---


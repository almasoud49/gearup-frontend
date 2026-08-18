# GearUp Frontend — API Integration Map

Mapping of every backend endpoint consumed by this frontend to the server actions / pages that use it.

- Base URL (server): `NEXT_PUBLIC_API_URL` (`https://gear-up-pied.vercel.app/api` in production, falls back to `http://localhost:5000/api`).
- Auth: server actions read the session from **httpOnly cookies** (`accessToken` / `refreshToken`) set by `app/(auth)/_actions/authActions.ts` and send `Authorization: Bearer <accessToken>` to the backend. `service/refreshToken.ts` `getAccessToken()` refreshes an expired access token by posting to `/auth/refresh-token` with the `Cookie: refreshToken=...` header (the backend reads it from request cookies) and re-sets the httpOnly cookie.
- Response envelope (success): `{ success, statusCode, message, data, meta? }`
- Response envelope (error): `{ success: false, message, errorDetails: { statusCode, message, issues? } }`
- All backend calls live in `"use server"` modules, split by route group:
  - `app/(public)/_actions/` — public **read/flow** actions (catalog, reviews, rental creation, payment intent).
  - `app/(dashboard)/_actions/` — authenticated **write/mutation** actions (gear save/delete, rental status, reviews, admin users, profile).
  - `service/` — session/auth helpers.
  - Client components never touch the backend directly — TanStack Query `queryFn`s call server actions, and mutations call action functions.

## Auth & Users

| Endpoint | Server action | Consumers | Notes |
| --- | --- | --- | --- |
| `POST /auth/login` | `app/(auth)/_actions/authActions.ts` `loginAction` | `app/(auth)/_components/LoginForm.tsx` | `data.data = { accessToken, refreshToken, user }`; sets httpOnly cookies, decodes `role` from JWT, `redirect()`s to role home or `redirectTo` |
| `POST /users/register` | `authActions.registerAction` | `app/(auth)/_components/RegisterForm.tsx` | Roles `CUSTOMER`/`PROVIDER` only; ADMIN rejected by the API |
| `GET /users/me` | `service/getMe.ts` `getMe` | `components/AuthSync.tsx` (rehydrates zustand store on mount) | `data.profile = user` |
| `PATCH /users/me` | `app/(dashboard)/_actions/userActions.ts` `updateProfileAction` | `app/(dashboard)/customer/profile/page.tsx` | Edits `name`/`email`; `useActionState` in the profile page |
| `GET /admin/users` | `userActions.getAdminUsers` | `admin/users/page.tsx` (via `useAdminData`) | Supports `role`/`searchTerm`/`isSuspended`/`page`/`limit` query params. `useAdminData` calls it **twice in parallel** (`role=CUSTOMER` + `role=PROVIDER`) and merges — the Users tab never sees ADMIN rows. Returns `_count` (`gearItems`/`rentalOrders`/`reviews`) per user |
| `PATCH /admin/users/:id/suspend` | `userActions.updateUserStatusAction` | `admin/users/page.tsx` (Actions → Suspend/Activate) | Body `{ isSuspended }`; ADMIN users are protected server-side |
| `PATCH /admin/users/:id/role` | `userActions.updateUserRoleAction` | `admin/users/page.tsx` (Actions → Make Customer/Provider) | Body `{ role }` (`CUSTOMER`/`PROVIDER`); ADMIN users are protected |
| `DELETE /admin/users/:id` | `userActions.deleteUserAction` | `admin/users/page.tsx` (Actions → Delete user, `window.confirm`) | Fails if the user has active (non-returned/cancelled) rentals; ADMIN users are protected |

## Gear Catalog

| Endpoint | Server action | Consumers | Notes |
| --- | --- | --- | --- |
| `GET /gear` | `app/(public)/_actions/gearActions.ts` `getAllGear` | `app/(public)/page.tsx` (featured), `app/(public)/gear/page.tsx` (list + filters/sort), `app/(public)/about/page.tsx`, `admin/page.tsx` (Gear tab), `provider/page.tsx` (My Gear) | Query params: `page`, `limit`, `searchTerm`, `brand`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`, `availability`. **`categoryId` is ignored server-side** — category chips filter client-side |
| `GET /gear/:id` | `gearActions.getGearById` | `app/(public)/gear/[id]/page.tsx`, `app/(public)/checkout/page.tsx`, `app/(dashboard)/provider/gear/[id]/edit/page.tsx` | Full detail incl. `provider`, `category`, `reviews`, `averageRating`, `_count` |
| `GET /categories` | `gearActions.getCategories` | `app/(public)/gear/page.tsx` filters, `app/(dashboard)/_components/gear/GearForm.tsx` (provider form) | Used for chip UI + form dropdown |
| `POST /gear` | `app/(dashboard)/_actions/gearActions.ts` `saveGearAction` | `app/(dashboard)/provider/gear/new/page.tsx` (via `GearForm`) | Provider-only; body from `lib/gear.ts` `GearPayload`/`DEFAULT_GEAR_PAYLOAD` |
| `PUT /gear/:id` | `saveGearAction` | `app/(dashboard)/provider/gear/[id]/edit/page.tsx` (via `GearForm`) | Note: **PATCH** `:id` returns 404; PUT works |
| `DELETE /gear/:id` | `gearActions.deleteGearAction` | `app/(dashboard)/provider/gear/page.tsx` (Delete gear) | Provider-only |

## Rentals & Payments

| Endpoint | Server action | Consumers | Notes |
| --- | --- | --- | --- |
| `POST /rentals` | `app/(public)/_actions/rentalActions.ts` `createRentalAction` | `app/(public)/checkout/page.tsx`, `app/(public)/cart/page.tsx` (place-all flow) | Requires **ISO datetime strings** (`2026-09-01T00:00:00.000Z`); success also recorded in `lib/orderStore.ts`. Backend rejects overlapping dates for the gear (`CONFLICT`) — the frontend mirrors this with own-booking date blocking on the gear detail page |
| `GET /rentals/my-rentals` | `app/(public)/_actions/rentalActions.ts` `getMyRentals` | `app/(public)/gear/[id]/page.tsx` (booking-date blocking) | Customer-only; used to block the logged-in user's own booked date ranges for a gear (PLACED/CONFIRMED/PAID/PICKED_UP) |
| `PATCH /rentals/:id/cancel` | `app/(dashboard)/_actions/rentalActions.ts` `cancelRentalAction` | `app/(dashboard)/customer/orders/page.tsx` (Cancel Order, two-step confirm) | Customer-only; backend only allows cancel while status is **PLACED** (anything else → `400`), and it restores the gear stock. **Shipped in the backend repo but must be redeployed** — until then a 404 is surfaced as a friendly toast |
| `GET /rentals` | `app/(dashboard)/_actions/rentalActions.ts` `getRentals` | `provider/page.tsx` (Orders tab), `admin/page.tsx` (Orders tab), `admin/rentals/page.tsx` | Provider/ADMIN only; customers get 403 |
| `GET /rentals/:id` | `app/(public)/_actions/rentalActions.ts` `getRentalById` | `app/(public)/payment/[rentalId]/page.tsx`, `app/(dashboard)/customer/orders/[id]/pay/page.tsx`, `app/(dashboard)/_components/useDashboardData.ts` (local-order backfill via `lib/orderStore.ts`) | Customer sees own orders only |
| `PATCH /rentals/:id/status` | `app/(dashboard)/_actions/rentalActions.ts` `updateRentalStatusAction` | `app/(dashboard)/provider/orders/page.tsx` (Confirm / Picked Up / Returned) | Provider/ADMIN only; transition-guarded server-side (PLACED→CONFIRMED, PAID→PICKED_UP, PICKED_UP→RETURNED); **shipped in the backend repo but must be redeployed** — until then a 404 is surfaced as a friendly toast |
| `GET /payments` | `rentalActions.getMyPayments` | `customer/page.tsx`, `customer/orders/page.tsx`, `customer/payments/page.tsx`, `customer/reviews/page.tsx` | Customer-only; each payment **embeds the full `rentalOrder`** (incl. `gearItem`) — primary source for "My Orders" + payment history + totals |
| `POST /payments/create` | `app/(public)/_actions/rentalActions.ts` `createPaymentIntent` | `app/(public)/payment/[rentalId]/page.tsx` | Body `{ rentalOrderId }` → `data = { clientSecret, transactionId, amount, status }` (Stripe **PaymentIntent**, not Checkout session); consumed by Stripe Elements |
| `POST /payments/confirm` | `rentalActions.confirmPaymentAction` | `app/(public)/payment/success/page.tsx` | Body `{ paymentIntentId }` (from the `payment_intent` query param); marks the payment **COMPLETED** and the rental order **PAID**, then invalidates the customer `payments`/`rentals` query cache so the dashboard reflects PAID |
| `GET /reviews` | `app/(public)/_actions/rentalActions.ts` `getReviews` | `app/(public)/_components/reviews/Testimonials.tsx` | Public reviews feed for the homepage |
| `GET /reviews?customerId=` | `app/(dashboard)/_actions/rentalActions.ts` `getMyReviews` | `customer/reviews/page.tsx` | Sources the "Your Reviews" list (payments embed the rentalOrder but NOT its review, so this list comes from `/reviews`) |
| `POST /reviews` | `app/(dashboard)/_actions/rentalActions.ts` `createReviewAction` | `app/(dashboard)/_components/reviews/ReviewModal.tsx` (Leave Review modal), used by `customer/{page,orders,reviews}` | Body `{ gearItemId, rating, comment }`; rejects unless the gear was rented and returned |
| `PUT /reviews/:id` | `rentalActions.updateReviewAction` | `customer/reviews/page.tsx` (Edit) via `ReviewModal.tsx` edit mode | Body `{ rating, comment }`; CUSTOMER/ADMIN only |
| `DELETE /reviews/:id` | `rentalActions.deleteReviewAction` | `customer/reviews/page.tsx` (Delete, two-step confirm) | CUSTOMER/ADMIN only |

## Stats endpoints

| Endpoint | Server action | Consumers | Notes |
| --- | --- | --- | --- |
| `GET /rentals/stats/overview` | `app/(public)/_actions/rentalActions.ts` `getRentalStatsOverview` | `customer/page.tsx` (Overview) via `useDashboardData` | Customer-only; returns `{ total, placed, confirmed, paid, pickedUp, returned, cancelled }` |
| `GET /provider/stats` | `app/(dashboard)/_actions/rentalActions.ts` `getProviderStats` | `provider/page.tsx` (Overview) via `useDashboardData` | Provider-only |
| `GET /admin/stats` | `app/(dashboard)/_actions/userActions.ts` `getAdminStats` | `admin/page.tsx` (Overview) via `useDashboardData` | ADMIN only |

## Stripe flow (no direct API calls)

`app/(public)/payment/[rentalId]/page.tsx` → `POST /payments/create` → mounts Stripe Elements (`app/(public)/_components/payment/CheckoutForm.tsx`) → `stripe.confirmPayment({ return_url: '/payment/success' })` → redirects to `/payment/success` (success) or `/payment/cancel` (cancel). Requires a real `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`; without it the page shows a configuration warning instead of Stripe. The multi-item cart (`app/(public)/cart/page.tsx`) creates **one rental order per item** and lists each with its own "Pay now" link to `/payment/:id` (payments are per-order).

## Client-side stores (no API calls)

| Store | Module | Purpose |
| --- | --- | --- |
| `gearup:wishlist` | `lib/wishlistStore.ts` (`useWishlistStore`, zustand + persist) | Saved gear ids; hearts on `GearCard` / gear detail, rendered in `app/(dashboard)/customer/wishlist/page.tsx` |
| `gearup:cart` | `lib/cartStore.ts` (`useCartStore`, zustand + persist) | Multi-item cart `{ gearId, startDate, endDate }`; badge in `Header`, rendered in `app/(public)/cart/page.tsx` |
| `gearup:orders` | `lib/orderStore.ts` | Unpaid order ids created locally, backfilled via `GET /rentals/:id` |

## Route guards (no API calls)

`proxy.ts` (Next 16 middleware replacement) verifies the `accessToken`/`refreshToken` httpOnly cookies with `jsonwebtoken` (`utils/jwt.ts`), rotates an expired access token, and guards `/login`, `/register`, `/checkout`, `/payment/:path*`, and the three role dashboards. Requires `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` in the server env (deployed on Vercel). Role-home map `lib/auth.ts` `ROLE_HOME` (`/customer`, `/provider`, `/admin`) is duplicated in `proxy.ts` on purpose (proxy must not import shared client modules). `/cart` is public (matcher-exempt); placing cart orders redirects unauthenticated users to `/login?redirectTo=/cart`. The wishlist sub-page `/customer/wishlist` is covered by the `/customer/:path*` matcher.

## Known backend gaps surfaced in the UI

1. **Token refresh** — `POST /auth/refresh-token` must read the `refreshToken` cookie; if the deployed backend does not, `service/refreshToken.ts` and `proxy.ts` fall back to clearing the session and redirecting to `/login`.
2. **Admin user-update endpoint** — previously called `PATCH /admin/users/:id` (404). The backend actually ships `PATCH /admin/users/:id/suspend`; the frontend now targets the correct path, so Suspend/Reactivate works against the deployed API.
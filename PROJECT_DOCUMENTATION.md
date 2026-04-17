# स्त्रीरत्न (StriRatna) — Project Documentation

> **Premium 1gm art jewellery e-commerce** · Powered by Maaax · Pune, Maharashtra
> Live at **[striratna.vercel.app](https://striratna.vercel.app)**

A single-tenant, production-ready Angular 19 storefront with a Supabase backend, Cashfree online payments, a WhatsApp order channel, and a signed-in admin console.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Customer-Facing Features](#3-customer-facing-features)
4. [Admin Console](#4-admin-console)
5. [Architecture](#5-architecture)
6. [Backend (Supabase)](#6-backend-supabase)
7. [Payment Integration — Cashfree (step-by-step)](#7-payment-integration--cashfree-step-by-step)
8. [Authentication](#8-authentication)
9. [Environment Configuration](#9-environment-configuration)
10. [Local Development](#10-local-development)
11. [Deployment](#11-deployment)
12. [Testing with Seed Data](#12-testing-with-seed-data)
13. [File Reference](#13-file-reference)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Angular 19 (standalone components, signals, new `@if` / `@for` control flow) |
| **Change Detection** | `OnPush` everywhere |
| **Styling** | Tailwind CSS v4 (utility-first) + a small SCSS layer for component-scoped styles |
| **Typography** | Playfair Display (headings), Inter + Noto Sans Devanagari (body) |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions + Row-Level Security) |
| **Payments** | Cashfree Payments (Drop-In SDK, Edge Function server-side, webhook) |
| **Secondary channel** | WhatsApp Business link (`wa.me`) for inquiries + confirmation |
| **Persistence** | Cart + Wishlist in `localStorage`; orders + products + categories in Supabase |
| **Hosting** | Vercel (SPA, rewrite-to-index for client-side routing) |

### Brand identity
- **Name**: स्त्रीरत्न (StriRatna) — "Jewel of Women"
- **Tagline**: साज महाराष्ट्राचा — "The Adornment of Maharashtra"
- **Positioning**: Premium 1gm gold-look art jewellery — luxury feel, accessible price
- **Origin**: Born from a small Instagram page that grew to 1,000+ unanswered messages/day — this website is the "proper home" the brand built

### Key dependencies
| Package | Purpose |
|---|---|
| `@supabase/supabase-js` ^2.103 | Database, Auth, Edge Function invocation |
| `tailwindcss` ^4.2 + `@tailwindcss/postcss` | Styling engine |
| `supabase` (CLI) | Local dev, migrations, function deploy |

---

## 2. Project Structure

```
d:/maxx/
├── src/
│   ├── index.html                    # SPA shell, fonts, meta
│   ├── styles.scss                   # Global styles, theme tokens, responsive safety, animations
│   ├── main.ts                       # bootstrap
│   └── app/
│       ├── app.component.{ts,html}   # Root — wraps navbar + router-outlet + footer + FAB + toasts
│       ├── app.routes.ts             # Route table (lazy-loaded)
│       ├── app.config.ts             # Providers
│       │
│       ├── core/                     # Cross-cutting logic
│       │   ├── guards/auth.guard.ts
│       │   ├── models/{product,category,order}.model.ts
│       │   └── services/
│       │       ├── supabase.service.ts
│       │       ├── auth.service.ts
│       │       ├── product.service.ts
│       │       ├── category.service.ts
│       │       ├── order.service.ts
│       │       ├── cart.service.ts
│       │       ├── wishlist.service.ts
│       │       ├── payment.service.ts
│       │       └── whatsapp.service.ts
│       │
│       ├── shared/                   # Reusable UI
│       │   ├── components/
│       │   │   ├── navbar/
│       │   │   ├── footer/
│       │   │   ├── product-card/
│       │   │   ├── skeleton-loader/
│       │   │   ├── whatsapp-fab/
│       │   │   └── toast/toast-container.component
│       │   └── pipes/currency-inr.pipe.ts
│       │
│       ├── pages/                    # Customer-facing routes
│       │   ├── home/
│       │   ├── shop/
│       │   ├── product-detail/
│       │   ├── cart/
│       │   ├── checkout/
│       │   ├── favourites/
│       │   ├── about/
│       │   └── contact/
│       │
│       ├── admin/                    # Auth-guarded routes
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── manage-orders/
│       │   ├── manage-products/
│       │   └── manage-categories/
│       │
│       └── environments/
│           ├── environment.ts        # dev (sandbox)
│           └── environment.prod.ts   # prod (production)
│
├── supabase/
│   ├── migrations/
│   │   └── 20260417_add_payment_fields.sql
│   ├── functions/
│   │   ├── _shared/cors.ts
│   │   ├── cashfree-create-order/index.ts
│   │   └── cashfree-webhook/index.ts
│   └── seed-dummy-orders.sql
│
├── supabase-schema.sql              # One-shot initial schema
├── vercel.json                      # SPA rewrites for Vercel
├── angular.json                     # CLI config
├── CASHFREE_SETUP.md                # Payment-only operational guide
└── PROJECT_DOCUMENTATION.md         # This file
```

---

## 3. Customer-Facing Features

| Route | Component | What it does |
|---|---|---|
| `/` | `HomeComponent` | Hero, value-prop strip, featured + bestseller grids, occasions, why-choose-us, steps, testimonials, Instagram tiles, newsletter |
| `/shop` | `ShopComponent` | Category pills, search, sort, view toggle (grid/list), filter summary chips, reactive `computed()` filter pipeline |
| `/product/:id` | `ProductDetailComponent` | Large image with hover-to-zoom, thumbnail strip, price + discount, material variant card, quantity stepper, delivery info, collapsible price breakup, gold-accordion details, Add-to-Cart + WhatsApp CTAs, share (Web Share API + clipboard fallback), wishlist toggle, trust-badge row, **mobile sticky CTA bar** |
| `/cart` | `CartComponent` | Item cards with inline qty, live subtotal, free-delivery nudge, mobile sticky checkout bar, animated empty state |
| `/favourites` | `FavouritesComponent` | Grid of saved products, remove, Move-to-Cart, Clear all, animated empty state |
| `/checkout` | `CheckoutComponent` | Floating-label form (inline validation, autofill-safe), three payment methods (**Cashfree online**, COD, WhatsApp), live order summary, success states for each path, error recovery |
| `/about` | `AboutComponent` | Brand story (1,000+ messages origin), stats strip, Mission & Vision, Why-choose-us grid, Values row, CTA |
| `/contact` | `ContactComponent` | Contact info, WhatsApp CTA, business hours, floating-label message form that opens WhatsApp with a prefilled body |

### Shared UI primitives

| Component | Role |
|---|---|
| `NavbarComponent` | Sticky nav, logo badge, wishlist + cart icons with count badges, mobile drawer |
| `FooterComponent` | Brand, social (WhatsApp + Instagram), shop links, categories, contact, trust-row |
| `ProductCardComponent` | Used on home, shop, favourites — image, badges (New / Bestseller / % OFF), wishlist heart, category eyebrow, price + savings. **No in-card Add-to-Cart** (by design — commits happen on product page). |
| `SkeletonLoaderComponent` | 3 variants: `product-card`, `product-detail`, `text` |
| `WhatsappFabComponent` | Floating bottom-right WhatsApp chat button |
| `ToastContainerComponent` | Global toast outlet (success / error toasts auto-dismiss) |

### Pipe

| Pipe | Purpose |
|---|---|
| `CurrencyInrPipe` (`\| inr`) | Formats numbers as `₹1,00,000` using Indian locale |

---

## 4. Admin Console

All admin routes are protected by `authGuard`. On hard refresh, the guard **awaits** Supabase session hydration before deciding, so authenticated admins stay signed in (see [§8](#8-authentication)).

| Route | Component | What it does |
|---|---|---|
| `/admin/login` | `LoginComponent` | Email + password, show/hide password toggle, error display |
| `/admin/dashboard` | `DashboardComponent` | Collapsible sidebar, sticky scroll, KPI tiles (Total Orders, Revenue, Products, Pending Orders), today-vs-lifetime compact formatter (`₹1.2L`, `₹5.0k`), Recent Orders table, Quick Actions card |
| `/admin/dashboard/orders` | `ManageOrdersComponent` | Stat tiles, search + status + payment-status + sort filters, quick-pick chips, expandable order rows, inline status updates, toast feedback |
| `/admin/dashboard/products` | `ManageProductsComponent` | Stat tiles (total, in-stock, out-of-stock, featured), filters (category, stock, tag, sort, search), create/edit modal with all Product fields, stock toggle, delete confirm |
| `/admin/dashboard/categories` | `ManageCategoriesComponent` | Grid and list view modes, status filter, search, sort, create/edit modal with Marathi name + image + order + active toggle, delete |

### Admin UI system

Built on a component-scoped SCSS system (no global admin classes leak to the public site). Prefixes:

- `.admin-*` — dashboard shell, sidebar, topbar, cards, tables
- `.prod-*` — products page
- `.cat-*` — categories page
- `.ord-*` — orders page

Each pattern includes: toolbar with stats, search + selects, grid/list toggle, empty states with icons, modals, toasts.

---

## 5. Architecture

### State management — Angular Signals

No NgRx, no RxJS `BehaviorSubject` gymnastics. Every service exposes:
- **Writable signals** for private internal state
- **`computed()` derivations** as public read-only signals (e.g. `itemCount`, `totalAmount`, `isEmpty`)
- **Persistence via `effect()`** that writes to `localStorage` whenever the signal changes

Example (`CartService`):
```ts
private cartItems = signal<CartItem[]>(load());
readonly items       = this.cartItems.asReadonly();
readonly itemCount   = computed(() => /* sum qty */);
readonly totalAmount = computed(() => /* sum qty*price */);
readonly isEmpty     = computed(() => this.cartItems().length === 0);

constructor() {
  effect(() => localStorage.setItem(KEY, JSON.stringify(this.cartItems())));
}
```

Components subscribe by **calling the signal in the template** (`{{ itemCount() }}`). Angular tracks dependencies automatically; `OnPush` + signals = zero manual `ChangeDetectorRef.markForCheck()` calls.

### Routing

- Lazy-loaded standalone components via `loadComponent: () => import(...)` — each page is a separate chunk
- Admin routes nested under a single `/admin/dashboard` layout with child routes (orders / products / categories)
- `authGuard` applied only on `/admin/dashboard` (login is intentionally public)
- Client-side routing rewritten to `index.html` via `vercel.json` for direct-URL access to deep pages

### Styling layers

1. **Theme tokens** in `styles.scss` → `@theme { --color-gold, --color-maroon, ... }` → exposed as Tailwind utilities (`text-gold`, `bg-maroon`)
2. **Global base** — typography, scroll behaviour, iOS input zoom fix, image max-width guard, focus ring, button cursors, horizontal-overflow safety
3. **Component-scoped SCSS** only for the admin console (where utility classes would be too verbose)
4. **Shared animation keyframes** — `float`, `fadeInUp`, `scaleIn`, `slideDown`, `gentleFloat`, `ringPulse`, `sparkleTwinkle`
5. **Reusable patterns** — `.floating-field` (floating-label inputs), `.empty-bag` (animated empty state), `.stagger-fade` (staggered section entrance)

---

## 6. Backend (Supabase)

### Tables

#### `categories`
```
id              uuid PK (uuid_generate_v4)
name            text NOT NULL
name_marathi    text
description     text
image           text             -- URL
display_order   int  default 0
active          bool default true
created_at      timestamptz
updated_at      timestamptz
```

#### `products`
```
id              uuid PK
name            text NOT NULL
name_marathi    text
description     text NOT NULL default ''
price           numeric NOT NULL
original_price  numeric          -- for "strike-through" savings
images          text[]           -- array of image URLs
category_id     uuid FK → categories(id) ON DELETE SET NULL
tags            text[]
in_stock        bool default true
featured        bool default false
best_seller     bool default false
new_arrival     bool default false
weight          text
material        text
dimensions      text
created_at      timestamptz
updated_at      timestamptz
```

#### `orders`
```
id                    uuid PK
items                 jsonb NOT NULL        -- OrderItem[]
total_amount          numeric NOT NULL
customer_name         text NOT NULL
customer_phone        text NOT NULL
customer_email        text
shipping_address      text NOT NULL
city, pincode         text NOT NULL
status                text ('pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled')
payment_method        text ('cod' | 'cashfree' | 'whatsapp')
payment_status        text ('pending' | 'paid' | 'failed' | 'refunded')    -- added by migration
payment_provider      text                                                  -- added by migration
cashfree_order_id     text                                                  -- added by migration
payment_session_id    text                                                  -- added by migration
cashfree_payment_id   text                                                  -- added by migration
payment_error         text                                                  -- added by migration
paid_at               timestamptz                                           -- added by migration
notes                 text
created_at, updated_at
```

### Row-Level Security (RLS)

| Table | Policy | Role |
|---|---|---|
| `categories` | SELECT | anyone |
| `categories` | ALL | `authenticated` |
| `products` | SELECT | anyone |
| `products` | ALL | `authenticated` |
| `orders` | INSERT | anyone (customers place orders without login) |
| `orders` | SELECT | anyone (but clients only know their own order ID from checkout) |
| `orders` | UPDATE | `authenticated` only |

### Edge Functions

Deployed to `https://rybelswnfgrtashimtty.functions.supabase.co/…`.

| Function | Purpose |
|---|---|
| `cashfree-create-order` | Receives `{ orderId, amount, customer }` from the Angular client. Looks up the order row, **re-validates the amount** (prevents client tampering), calls Cashfree `POST /orders` server-side, stores `cashfree_order_id` + `payment_session_id`, returns the session ID to the client for the Drop-In SDK to open. |
| `cashfree-webhook` | Receives async status updates from Cashfree. **Verifies HMAC-SHA256 signature** using `CASHFREE_SECRET_KEY`. Updates `orders.payment_status` + `paid_at` + `cashfree_payment_id`. Also promotes `status` to `'confirmed'` on successful payment. |
| `_shared/cors.ts` | Shared CORS header helper used by both functions. |

### Migrations

| File | Purpose |
|---|---|
| `supabase-schema.sql` | One-shot initial schema (run once when bootstrapping a new environment) |
| `supabase/migrations/20260417_add_payment_fields.sql` | Adds all 7 payment-tracking columns + indexes + RLS policy update. Idempotent (`if not exists`). |

---

## 7. Payment Integration — Cashfree (step-by-step)

> This section summarises the full operational guide at [CASHFREE_SETUP.md](CASHFREE_SETUP.md). Read that file for the per-step commands.

### Why Cashfree?
- UPI + Cards + Netbanking + Wallets in a single Drop-In modal
- Webhook-based async settlement (no client-side race conditions)
- Sandbox mode with test UPI handles (`testsuccess@gocash`) and test cards
- India-first pricing & KYC

### The flow

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                         ANGULAR CLIENT                           │
  │  (1) Customer clicks "Pay Online" on /checkout                   │
  │      → CheckoutComponent.placeOrder()                            │
  │          creates order in `orders` (status=pending,              │
  │          payment_status=pending, payment_provider=cashfree)      │
  │      → PaymentService.payOnline({orderId, amount, customer})     │
  └─────────────────────────┬────────────────────────────────────────┘
                            │ (2) POST { orderId, amount, customer }
                            ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │              EDGE FN: cashfree-create-order                      │
  │  • Uses service-role key to read order                           │
  │  • Re-validates amount vs DB total (tamper check)                │
  │  • Calls Cashfree POST /orders with secret key                   │
  │  • Writes cashfree_order_id + payment_session_id to orders       │
  │  • Returns { paymentSessionId, cashfreeOrderId } to client       │
  └─────────────────────────┬────────────────────────────────────────┘
                            │ (3) paymentSessionId
                            ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │                  CASHFREE DROP-IN SDK (client)                   │
  │  • Loaded dynamically by PaymentService                          │
  │  • Opens modal with UPI / card / netbanking / wallet             │
  │  • Customer pays                                                 │
  │  • SDK resolves with success / failure / user-dropped            │
  └─────────────────────────┬───────────────────┬────────────────────┘
                            │                   │ (parallel)
               (4a) local   │                   │ (4b) async
                  resolve   │                   ▼
                            │    ┌─────────────────────────────────┐
                            │    │  CASHFREE SERVERS               │
                            │    │  POST webhook with signed body  │
                            │    └──────────────┬──────────────────┘
                            │                   │
                            ▼                   ▼
  ┌──────────────────────────────────┐  ┌────────────────────────────┐
  │  Client polls orders.payment_    │  │  EDGE FN: cashfree-webhook │
  │  status for 20s → shows "Paid" / │  │  • Verifies HMAC signature │
  │  "Pending…" / "Failed" screen    │  │  • UPDATE orders SET       │
  └──────────────────────────────────┘  │      payment_status='paid',│
                                        │      paid_at=now(),         │
                                        │      cashfree_payment_id=..│
                                        │  • Promotes status to      │
                                        │      'confirmed'            │
                                        └────────────────────────────┘
```

The server is the authoritative source of payment truth. The client UI polls and reflects server state — it never self-declares success.

### What's in the codebase

**Frontend:**
- [`src/app/core/services/payment.service.ts`](src/app/core/services/payment.service.ts) — `payOnline(input)` method. Loads Cashfree SDK on demand, calls the `cashfree-create-order` function, opens the Drop-In, then polls `orders.payment_status` for up to 20s.
- [`src/app/pages/checkout/checkout.component.ts`](src/app/pages/checkout/checkout.component.ts) — `placeOrder()` orchestrates: validate form → create order → route to `cashfree` / `cod` / `whatsapp`.
- [`src/app/pages/checkout/checkout.component.html`](src/app/pages/checkout/checkout.component.html) — three payment radios, success states for each (`successMode()` signal: `paid` | `pending` | `cod` | `whatsapp`), inline error display.
- [`src/app/environments/environment.ts`](src/app/environments/environment.ts) — `cashfree.mode: 'sandbox' | 'production'`, `cashfree.createOrderFunction: 'cashfree-create-order'`.

**Backend:**
- [`supabase/functions/cashfree-create-order/index.ts`](supabase/functions/cashfree-create-order/index.ts) — server order creation + amount validation.
- [`supabase/functions/cashfree-webhook/index.ts`](supabase/functions/cashfree-webhook/index.ts) — signed webhook handler.
- [`supabase/functions/_shared/cors.ts`](supabase/functions/_shared/cors.ts) — CORS helper.
- [`supabase/migrations/20260417_add_payment_fields.sql`](supabase/migrations/20260417_add_payment_fields.sql) — schema changes.

### One-time setup (TL;DR — full detail in [CASHFREE_SETUP.md](CASHFREE_SETUP.md))

**Step 1 — Cashfree account**
- Sign up at https://merchant.cashfree.com/merchants/signup
- Complete KYC (PAN, bank account, GST if applicable)
- Toggle **Test Mode** (top-right) while setting up

**Step 2 — Get API keys**
- Dashboard → Developers → API Keys → Generate New Key
- Copy **App ID** + **Secret Key** (both sandbox and production)

**Step 3 — Apply the DB migration**
- Supabase Dashboard → SQL Editor → paste contents of `supabase/migrations/20260417_add_payment_fields.sql` → Run
- Or via CLI: `supabase db push`

**Step 4 — Deploy Edge Functions + set secrets**
```bash
supabase link --project-ref rybelswnfgrtashimtty
supabase secrets set \
  CASHFREE_APP_ID="YOUR_TEST_APP_ID" \
  CASHFREE_SECRET_KEY="YOUR_TEST_SECRET_KEY" \
  CASHFREE_MODE="sandbox" \
  CASHFREE_RETURN_URL="http://localhost:4200/checkout?cf_order_id={order_id}"

supabase functions deploy cashfree-create-order --no-verify-jwt
supabase functions deploy cashfree-webhook      --no-verify-jwt
```
`--no-verify-jwt` is required — the webhook has no Supabase auth token, and `create-order` is called by anonymous checkout users.

**Step 5 — Register the webhook in Cashfree**
- Dashboard → Developers → Webhooks → Add Webhook
- URL: `https://rybelswnfgrtashimtty.functions.supabase.co/cashfree-webhook`
- Events: `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `PAYMENT_USER_DROPPED_WEBHOOK`
- Click **Test** → should return `200 OK`

**Step 6 — Verify Angular environment**
- `src/app/environments/environment.ts` → `cashfree.mode: 'sandbox'` for dev
- `src/app/environments/environment.prod.ts` → `cashfree.mode: 'production'`

**Step 7 — Test in sandbox**
- Run `npm start` → go through checkout → pick **Pay Online**
- Test UPI: `testsuccess@gocash`
- Test card: `4111 1111 1111 1111` · any CVV · any future date · OTP `111000`
- Verify order row in Supabase: `payment_status='paid'`, `paid_at` populated, `status='confirmed'`
- Verify transaction visible in Cashfree dashboard → Orders

**Step 8 — Going to production**
- ✅ Cashfree KYC approved
- ✅ Re-run step 4 with production keys + `CASHFREE_MODE=production` + production return URL
- ✅ Re-register webhook in production mode
- ✅ `npm run build` (uses `environment.prod.ts`)
- ✅ Deploy to Vercel
- ✅ Place a ₹1 real order end-to-end

### Security guarantees
- `CASHFREE_SECRET_KEY` lives only as a Supabase secret — never shipped to the browser
- Amount re-validated server-side before hitting Cashfree (blocks DevTools price tampering)
- Webhook verifies HMAC-SHA256 on every call (blocks forged "payment successful" callbacks)
- Client never updates `payment_status` directly — only RLS-protected admin + the webhook can

### Common issues
| Symptom | Cause / fix |
|---|---|
| Modal opens then fails immediately | `CASHFREE_MODE` mismatch between Edge Fn and Angular env — both must match |
| Webhook returns 401 "invalid signature" | Wrong `CASHFREE_SECRET_KEY` — re-run `supabase secrets set` |
| Order stays `pending` forever after payment | Webhook not firing — check Cashfree Dashboard → Webhooks → delivery logs |
| Edge Function 500 on create-order | `supabase functions logs cashfree-create-order` — usually missing env vars |
| "Amount mismatch" error | Client-sent amount ≠ DB order total — verify delivery charge calc |

---

## 8. Authentication

Supabase Auth with email + password for a single admin role. No self-signup — admins are seeded manually in the Supabase Dashboard.

### Session persistence (fixed bug)

On hard refresh, there was a race: the `authGuard` ran synchronously before Supabase's async `getSession()` hydrated from `localStorage`, bouncing the admin to `/login` every reload.

**Fix**:
- [`SupabaseService`](src/app/core/services/supabase.service.ts) — explicit auth config (`persistSession: true`, `autoRefreshToken: true`, `storageKey: 'sb-striratna-auth'`, `flowType: 'pkce'`), plus a **no-op Web Locks lock** to kill `NavigatorLockAcquireTimeoutError` on refresh.
- [`AuthService`](src/app/core/services/auth.service.ts) — exposes a `ready: Promise<void>` that resolves after `getSession()` completes hydration.
- [`authGuard`](src/app/core/guards/auth.guard.ts) — now `async` and `await`s `authService.ready` before checking `isLoggedIn()`. Refresh anywhere in the admin section and the session stays.

### Logging in
```
/admin/login  →  email + password  →  authService.login()
            →  session stored in localStorage under 'sb-striratna-auth'
            →  onAuthStateChange fires → currentUser signal updates
            →  router.navigate(['/admin/dashboard'])
```

---

## 9. Environment Configuration

[`src/app/environments/environment.ts`](src/app/environments/environment.ts) — dev:
```ts
export const environment = {
  production: false,
  supabase: {
    url: 'https://rybelswnfgrtashimtty.supabase.co',
    anonKey: 'sb_publishable_…',        // publishable, safe to expose (RLS enforces access)
  },
  cashfree: {
    mode: 'sandbox',                     // 'sandbox' | 'production'
    createOrderFunction: 'cashfree-create-order',
  },
  whatsappNumber: '918275469466',
  brandName: 'स्त्रीरत्न',
  tagline: 'साज महाराष्ट्राचा',
};
```

[`environment.prod.ts`](src/app/environments/environment.prod.ts) is identical except `production: true` and `cashfree.mode: 'production'`.

**Secrets live on Supabase**, not in the Angular bundle: `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_MODE`, `CASHFREE_RETURN_URL`.

---

## 10. Local Development

```bash
# Install deps
npm install

# Start dev server
npm start           # → http://localhost:4200

# Type-check + production build
npm run build       # → dist/striratna/browser

# Dev build (skip optimisation, faster)
npx ng build --configuration development
```

### Adding a product / category locally
Use `/admin/dashboard/products` (after signing in at `/admin/login`). CRUD persists to Supabase.

---

## 11. Deployment

Vercel, via the dashboard's GitHub integration (auto-deploys on push to `main`) or CLI:

```bash
npx vercel --prod --yes
```

`vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/striratna/browser",
  "framework": null,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The rewrite is critical — without it, direct-linking to `/product/xyz` would 404.

### CSS budgets
`angular.json` sets `anyComponentStyle` budgets to `12kB (warn) / 20kB (error)` — enough room for the rich admin SCSS files.

### Live URL
`https://striratna.vercel.app` (alias) → latest production deployment.

---

## 12. Testing with Seed Data

[`supabase/seed-dummy-orders.sql`](supabase/seed-dummy-orders.sql) inserts **5 dummy orders** covering every status / payment combination:

| # | Status | Payment | Provider | Purpose |
|---|---|---|---|---|
| 1 | `pending` | `pending` | `cashfree` | Online payment in-flight |
| 2 | `confirmed` | `pending` | `cod` | COD, multi-item |
| 3 | `processing` | `paid` | `cashfree` | High-value paid bridal order |
| 4 | `shipped` | `paid` | `whatsapp` | WhatsApp-channel delivery |
| 5 | `delivered` | `paid` | `cashfree` | Completed successful order |

**Usage**: paste into Supabase SQL Editor → Run. All dummies use a `DUMMY-` phone prefix so they're easy to purge:
```sql
DELETE FROM orders WHERE customer_phone LIKE 'DUMMY-%';
```

The script is **idempotent** — it deletes prior dummies before inserting, so you can re-run safely.

---

## 13. File Reference

### Customer pages
| File | Purpose |
|---|---|
| [home.component.{ts,html,scss}](src/app/pages/home/) | Landing — hero, featured collection, testimonials |
| [shop.component.{ts,html}](src/app/pages/shop/) | Browse + filter catalogue |
| [product-detail.component.{ts,html}](src/app/pages/product-detail/) | Full product view with zoom + CTAs |
| [cart.component.{ts,html}](src/app/pages/cart/) | Cart page + mobile sticky bar |
| [checkout.component.{ts,html}](src/app/pages/checkout/) | Form + payment method + success flow |
| [favourites.component.{ts,html}](src/app/pages/favourites/) | Wishlist page |
| [about.component.{ts,html}](src/app/pages/about/) | Brand story |
| [contact.component.{ts,html}](src/app/pages/contact/) | Contact form |

### Admin pages
| File | Purpose |
|---|---|
| [login.component.{ts,html}](src/app/admin/login/) | Sign-in |
| [dashboard.component.{ts,html,scss}](src/app/admin/dashboard/) | Shell + sidebar + overview |
| [manage-orders.component.{ts,html,scss}](src/app/admin/manage-orders/) | Order list + status updates |
| [manage-products.component.{ts,html,scss}](src/app/admin/manage-products/) | Product CRUD |
| [manage-categories.component.{ts,html,scss}](src/app/admin/manage-categories/) | Category CRUD |

### Core
| File | Purpose |
|---|---|
| [app.routes.ts](src/app/app.routes.ts) | Route table |
| [core/guards/auth.guard.ts](src/app/core/guards/auth.guard.ts) | Admin route guard (async, awaits session hydration) |
| [core/models/product.model.ts](src/app/core/models/product.model.ts) | `Product` interface |
| [core/models/category.model.ts](src/app/core/models/category.model.ts) | `Category` interface |
| [core/models/order.model.ts](src/app/core/models/order.model.ts) | `Order`, `OrderItem`, status/provider unions + label/color maps |
| [core/services/supabase.service.ts](src/app/core/services/supabase.service.ts) | Supabase client singleton |
| [core/services/auth.service.ts](src/app/core/services/auth.service.ts) | Login/logout + `ready` promise |
| [core/services/product.service.ts](src/app/core/services/product.service.ts) | Product CRUD + featured/bestseller filters |
| [core/services/category.service.ts](src/app/core/services/category.service.ts) | Category CRUD |
| [core/services/order.service.ts](src/app/core/services/order.service.ts) | Order CRUD + status/payment-status filters |
| [core/services/cart.service.ts](src/app/core/services/cart.service.ts) | Signal-based cart, localStorage-backed |
| [core/services/wishlist.service.ts](src/app/core/services/wishlist.service.ts) | Signal-based wishlist, localStorage-backed |
| [core/services/payment.service.ts](src/app/core/services/payment.service.ts) | Cashfree SDK loader + pay flow + polling |
| [core/services/whatsapp.service.ts](src/app/core/services/whatsapp.service.ts) | wa.me link builders for inquiries + orders |

### Shared
| File | Purpose |
|---|---|
| [shared/components/navbar/](src/app/shared/components/navbar/) | Top nav with cart/wishlist badges |
| [shared/components/footer/](src/app/shared/components/footer/) | Global footer |
| [shared/components/product-card/](src/app/shared/components/product-card/) | Reusable product tile (no in-card add-to-cart) |
| [shared/components/skeleton-loader/](src/app/shared/components/skeleton-loader/) | Loading placeholders |
| [shared/components/whatsapp-fab/](src/app/shared/components/whatsapp-fab/) | WhatsApp floating button |
| [shared/components/toast/](src/app/shared/components/toast/) | Global toast notifications |
| [shared/pipes/currency-inr.pipe.ts](src/app/shared/pipes/currency-inr.pipe.ts) | Indian rupee formatter |

### Backend
| File | Purpose |
|---|---|
| [supabase-schema.sql](supabase-schema.sql) | Initial DB schema (run once) |
| [supabase/migrations/20260417_add_payment_fields.sql](supabase/migrations/20260417_add_payment_fields.sql) | Payment columns migration |
| [supabase/functions/_shared/cors.ts](supabase/functions/_shared/cors.ts) | CORS helper |
| [supabase/functions/cashfree-create-order/index.ts](supabase/functions/cashfree-create-order/index.ts) | Server-side order creation |
| [supabase/functions/cashfree-webhook/index.ts](supabase/functions/cashfree-webhook/index.ts) | Signed payment webhook |
| [supabase/seed-dummy-orders.sql](supabase/seed-dummy-orders.sql) | 5 test orders |

### Config
| File | Purpose |
|---|---|
| [angular.json](angular.json) | Angular CLI config (build, budgets) |
| [vercel.json](vercel.json) | SPA rewrites + build command |
| [src/styles.scss](src/styles.scss) | Theme tokens, base styles, responsive safety, animations |
| [src/index.html](src/index.html) | App shell, viewport meta, font preconnect |

---

## Brand system (quick reference)

| Token | Value |
|---|---|
| `--color-gold` | `#D4AF37` |
| `--color-gold-light` | `#E8CC6E` |
| `--color-gold-dark` | `#B8960F` |
| `--color-maroon` | `#800020` |
| `--color-maroon-light` | `#A0334D` |
| `--color-maroon-dark` | `#600018` |
| `--color-cream` | `#FFF8E7` |
| `--color-cream-dark` | `#F5EDD6` |
| `--font-heading` | Playfair Display |
| `--font-body` | Inter + Noto Sans Devanagari |

All available as Tailwind utilities: `text-gold`, `bg-maroon`, `border-gold-dark`, etc.

---

## Known limitations / future work

- Admin is single-user — no role hierarchy. Add a `users` table + role column to support multiple admins.
- Wishlist + Cart are `localStorage` only (per-device). A signed-in-customer flow would persist them to Supabase.
- No product reviews / ratings table yet.
- Cashfree refunds are manual via their dashboard — not automated through the app.
- No analytics integration (Google Analytics / Plausible) wired up yet.

---

_Last updated: 2026-04-17 · Live: [striratna.vercel.app](https://striratna.vercel.app) · Repo: [github.com/Rutik2401/striratna-poweredby-maaax](https://github.com/Rutik2401/striratna-poweredby-maaax)_

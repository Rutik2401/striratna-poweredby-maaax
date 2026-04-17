# स्त्रीरत्न (StriRatna) — Powered by Maaax

> **Premium 1gm art jewellery e-commerce** — साज महाराष्ट्राचा
> Live at **[striratna.vercel.app](https://striratna.vercel.app)**

An Angular 19 + Supabase storefront with Cashfree online payments, a WhatsApp order channel, and a signed-in admin console.

## Quick start

```bash
# Install dependencies
npm install

# Run the dev server
npm start                    # → http://localhost:4200

# Production build
npm run build                # → dist/striratna/browser
```

## Full documentation

| Doc | What's in it |
|---|---|
| [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) | **Main reference** — tech stack, architecture, features, backend, file layout, brand system |
| [CASHFREE_SETUP.md](CASHFREE_SETUP.md) | Step-by-step payment integration setup (Cashfree keys, Edge Functions, webhook, testing) |
| [supabase/seed-dummy-orders.sql](supabase/seed-dummy-orders.sql) | 5 dummy orders for UI testing |
| [supabase-schema.sql](supabase-schema.sql) | Initial database schema |

## Tech at a glance

- **Frontend** — Angular 19 (standalone components, signals, OnPush), Tailwind CSS v4
- **Backend** — Supabase (PostgreSQL + Auth + Edge Functions + RLS)
- **Payments** — Cashfree Drop-In SDK + server-side Edge Function + signed webhook
- **Hosting** — Vercel

## Repo map

```
src/app/
├── core/          services, models, guards
├── shared/        reusable UI components + pipes
├── pages/         customer-facing routes (home, shop, product, cart, checkout, favourites, about, contact)
├── admin/         protected admin console (dashboard, orders, products, categories)
└── environments/  dev + prod config

supabase/
├── functions/     Edge Functions (cashfree-create-order, cashfree-webhook)
└── migrations/    DB schema migrations
```

## Deploy

Push to `main` on GitHub — Vercel auto-deploys. Manual:

```bash
npx vercel --prod --yes
```

## License

Private / all rights reserved — स्त्रीरत्न brand, Maaax.

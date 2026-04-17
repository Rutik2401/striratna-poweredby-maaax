# Cashfree Payment Integration — Setup Guide

Everything in code is written. Follow these one-time setup steps to go live.

---

## 1. Create a Cashfree account

1. Sign up at https://merchant.cashfree.com/merchants/signup
2. Complete KYC (PAN, bank account, GST if applicable)
3. In the dashboard, switch to **Test Mode** (toggle top-right) while you're setting up

## 2. Get your API keys

Dashboard → **Developers → API Keys** → click **Generate New Key**

Copy these two values — you'll need them in step 4:

- `App ID` (public-ish, but still keep it server-side)
- `Secret Key` (NEVER commit this anywhere)

You'll have two sets: **Test** and **Production**. Start with Test.

---

## 3. Apply the database migration

Option A — via Supabase Dashboard (simplest):

1. Open https://supabase.com/dashboard → your project → **SQL Editor**
2. Paste the contents of [`supabase/migrations/20260417_add_payment_fields.sql`](supabase/migrations/20260417_add_payment_fields.sql)
3. Click **Run**

Option B — via Supabase CLI:

```bash
supabase db push
```

This adds the following columns to `orders`:
`payment_status`, `payment_provider`, `cashfree_order_id`, `payment_session_id`, `cashfree_payment_id`, `payment_error`, `paid_at`.

---

## 4. Deploy the Edge Functions

Install the Supabase CLI if you don't have it:

```bash
npm install -g supabase
supabase login
```

Link the project (run from `d:/maxx`):

```bash
supabase link --project-ref rybelswnfgrtashimtty
```

Set the secrets (never commit these):

```bash
supabase secrets set \
  CASHFREE_APP_ID="YOUR_TEST_APP_ID" \
  CASHFREE_SECRET_KEY="YOUR_TEST_SECRET_KEY" \
  CASHFREE_MODE="sandbox" \
  CASHFREE_RETURN_URL="http://localhost:4200/checkout?cf_order_id={order_id}"
```

> For production, use the production keys and set `CASHFREE_MODE=production` and the real domain in `CASHFREE_RETURN_URL` (e.g. `https://striratna.in/checkout?cf_order_id={order_id}`). The `{order_id}` placeholder is replaced by Cashfree automatically.

Deploy both functions:

```bash
supabase functions deploy cashfree-create-order --no-verify-jwt
supabase functions deploy cashfree-webhook --no-verify-jwt
```

`--no-verify-jwt` is required because the webhook is called by Cashfree's servers (no Supabase auth token), and the create-order function is called by anonymous checkout users.

After deploy, your function URLs will be:

- `https://rybelswnfgrtashimtty.functions.supabase.co/cashfree-create-order`
- `https://rybelswnfgrtashimtty.functions.supabase.co/cashfree-webhook`

---

## 5. Register the webhook in Cashfree

1. Dashboard → **Developers → Webhooks** → **Add Webhook**
2. URL: `https://rybelswnfgrtashimtty.functions.supabase.co/cashfree-webhook`
3. Events to subscribe to (select all payment events):
   - `PAYMENT_SUCCESS_WEBHOOK`
   - `PAYMENT_FAILED_WEBHOOK`
   - `PAYMENT_USER_DROPPED_WEBHOOK`
4. Click **Test** → Cashfree sends a sample payload. Status should be `200 OK`.

---

## 6. Update Angular environment (if needed)

Check [src/app/environments/environment.ts](src/app/environments/environment.ts):

```ts
cashfree: {
  mode: 'sandbox',             // change to 'production' when going live
  createOrderFunction: 'cashfree-create-order',
}
```

`environment.prod.ts` is already set to `production`.

---

## 7. Test the flow (sandbox)

1. Run `npm start` → open `http://localhost:4200`
2. Add a product to cart → checkout
3. Choose **Pay Online** → click the pay button
4. Cashfree modal opens. Use these **test credentials**:
   - Test UPI: `testsuccess@gocash`
   - Test card: `4111 1111 1111 1111` · any CVV · any future date · OTP: `111000`
5. After success:
   - Checkout should show "Payment Successful!"
   - Supabase `orders` row should have `payment_status='paid'`, `paid_at` populated, `status='confirmed'`
   - Cashfree dashboard → **Orders** shows the transaction

### Other test scenarios

- **Failure**: Test card `4111 1111 1111 1112` — should land on "Payment was not successful" with retry option
- **User drops**: Close the modal without paying — order stays `payment_status='pending'`; webhook will eventually mark it `failed`

---

## 8. Going to production

Checklist:

- [ ] Cashfree KYC approved (dashboard will show "Live" once approved)
- [ ] Re-run step 4 with **production** App ID + Secret, `CASHFREE_MODE=production`, and production return URL
- [ ] Re-register webhook with the **production** mode selected in Cashfree dashboard
- [ ] Build Angular for prod: `npm run build` (uses `environment.prod.ts`)
- [ ] Deploy Angular (Vercel, Netlify, etc.)
- [ ] Place a ₹1 real order to verify end-to-end

---

## Troubleshooting

**Modal opens but payment fails immediately** → Usually a mismatch between `CASHFREE_MODE` in Edge Function vs Angular environment. Both must be `sandbox` or both `production`.

**Webhook returns 401 "invalid signature"** → `CASHFREE_SECRET_KEY` env var is wrong. Re-run `supabase secrets set`.

**Order stays "pending" forever after successful payment** → Webhook isn't firing. Check Cashfree dashboard → Webhooks → delivery logs. Ensure URL is correct and webhook is "Active".

**Edge Function 500 error on create-order** → Check logs: `supabase functions logs cashfree-create-order`. Most often missing env vars or Supabase service role key not auto-provided (it is, but worth checking).

**Amount mismatch error** → The client-sent amount doesn't match the DB order total. This is a security check — it prevents tampering. Verify the cart subtotal + delivery calculation matches between client and what gets stored in `orders.total_amount`.

---

## Security notes

- `CASHFREE_SECRET_KEY` is stored only as a Supabase secret — it's never shipped to the browser
- The `cashfree-create-order` function re-validates the amount against the DB row before calling Cashfree (prevents price tampering via DevTools)
- The webhook verifies HMAC-SHA256 signature on every request, so attackers can't forge "payment successful" callbacks
- The server (Edge Function + webhook) is the authoritative source of payment truth — the client UI only polls and displays

---

## Files touched by this integration

```
supabase/
  migrations/20260417_add_payment_fields.sql
  functions/
    _shared/cors.ts
    cashfree-create-order/index.ts
    cashfree-webhook/index.ts

src/app/
  core/
    models/order.model.ts               (+ payment fields, PaymentStatus/Provider)
    services/order.service.ts           (+ getPaymentStatus, payment_provider handling)
    services/payment.service.ts         (NEW — SDK loader, pay flow, polling)
  environments/
    environment.ts                      (+ cashfree.mode, cashfree.createOrderFunction)
    environment.prod.ts                 (same, mode=production)
  pages/checkout/
    checkout.component.ts               (+ Cashfree path, error/pending/paid states)
    checkout.component.html             (+ Pay Online option, error UI, payment-pending button)
```

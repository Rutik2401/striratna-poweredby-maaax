// Supabase Edge Function: cashfree-create-order
// Creates a Cashfree payment order server-side (secret stays here) and
// returns a payment_session_id that the Angular client opens in Drop-In mode.
//
// POST body (JSON):
//   { orderId: string, amount: number, customer: { name, phone, email? } }
//
// Response (JSON):
//   { paymentSessionId: string, cashfreeOrderId: string }
//
// Required env (set via Supabase dashboard):
//   CASHFREE_APP_ID
//   CASHFREE_SECRET_KEY
//   CASHFREE_MODE           sandbox | production   (default: sandbox)
//   CASHFREE_RETURN_URL     e.g. https://striratna.in/checkout?cf_order_id={order_id}
//   SUPABASE_URL            (auto-provided)
//   SUPABASE_SERVICE_ROLE_KEY (auto-provided)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders } from '../_shared/cors.ts';

interface CreateOrderBody {
  orderId: string;
  amount: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
}

const CASHFREE_APP_ID = Deno.env.get('CASHFREE_APP_ID') ?? '';
const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY') ?? '';
const CASHFREE_MODE = (Deno.env.get('CASHFREE_MODE') ?? 'sandbox').toLowerCase();
const CASHFREE_RETURN_URL =
  Deno.env.get('CASHFREE_RETURN_URL') ??
  'http://localhost:4200/checkout?cf_order_id={order_id}';

const CASHFREE_BASE_URL =
  CASHFREE_MODE === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const CASHFREE_API_VERSION = '2023-08-01';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    return json({ error: 'Cashfree credentials not configured' }, 500);
  }

  let body: CreateOrderBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { orderId, amount, customer } = body ?? {};
  if (!orderId || !amount || !customer?.name || !customer?.phone) {
    return json({ error: 'Missing required fields' }, 400);
  }

  if (amount <= 0) {
    return json({ error: 'Amount must be positive' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Verify order exists and total matches (prevents client tampering)
  const { data: dbOrder, error: dbErr } = await supabase
    .from('orders')
    .select('id, total_amount, payment_status')
    .eq('id', orderId)
    .single();

  if (dbErr || !dbOrder) {
    return json({ error: 'Order not found' }, 404);
  }

  if (Number(dbOrder.total_amount) !== Number(amount)) {
    return json({ error: 'Amount mismatch' }, 400);
  }

  if (dbOrder.payment_status === 'paid') {
    return json({ error: 'Order already paid' }, 409);
  }

  // Cashfree order_id must be unique — prefix with env suffix to avoid collisions across modes
  const cashfreeOrderId = `${CASHFREE_MODE}_${orderId}`;

  const cashfreeRes = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': CASHFREE_API_VERSION,
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
    },
    body: JSON.stringify({
      order_id: cashfreeOrderId,
      order_amount: Number(amount),
      order_currency: 'INR',
      customer_details: {
        customer_id: `cust_${orderId.slice(0, 12)}`,
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email || 'no-email@striratna.in',
      },
      order_meta: {
        return_url: CASHFREE_RETURN_URL,
      },
      order_note: `Order ${orderId} · स्त्रीरत्न`,
    }),
  });

  const payload = await cashfreeRes.json().catch(() => ({}));

  if (!cashfreeRes.ok) {
    console.error('Cashfree create order failed:', payload);
    return json(
      {
        error: 'Failed to create Cashfree order',
        detail: payload?.message ?? payload,
      },
      502
    );
  }

  const paymentSessionId: string | undefined = payload.payment_session_id;
  if (!paymentSessionId) {
    return json({ error: 'No payment session returned' }, 502);
  }

  // Persist so webhook + UI can reconcile
  await supabase
    .from('orders')
    .update({
      payment_provider: 'cashfree',
      payment_status: 'pending',
      cashfree_order_id: cashfreeOrderId,
      payment_session_id: paymentSessionId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  return json({
    paymentSessionId,
    cashfreeOrderId,
  });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Supabase Edge Function: cashfree-webhook
// Receives server-to-server notifications from Cashfree, verifies signature,
// and updates the corresponding order's payment status.
//
// Cashfree signs each webhook using HMAC-SHA256 over `timestamp + rawBody` with
// your CASHFREE_SECRET_KEY, base64-encoded. Signature arrives in header
// `x-webhook-signature`; timestamp in `x-webhook-timestamp`.
//
// Register webhook URL in Cashfree dashboard:
//   https://<project-ref>.functions.supabase.co/cashfree-webhook

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY') ?? '';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  if (!CASHFREE_SECRET_KEY) {
    console.error('CASHFREE_SECRET_KEY not configured');
    return new Response('server misconfigured', { status: 500 });
  }

  const signature = req.headers.get('x-webhook-signature') ?? '';
  const timestamp = req.headers.get('x-webhook-timestamp') ?? '';
  const rawBody = await req.text();

  if (!signature || !timestamp) {
    return new Response('missing signature', { status: 400 });
  }

  const valid = await verifyCashfreeSignature(
    CASHFREE_SECRET_KEY,
    timestamp,
    rawBody,
    signature
  );

  if (!valid) {
    console.warn('Invalid Cashfree webhook signature');
    return new Response('invalid signature', { status: 401 });
  }

  let event: CashfreeWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const cashfreeOrderId = event?.data?.order?.order_id;
  const paymentStatus = event?.data?.payment?.payment_status;
  const cfPaymentId = event?.data?.payment?.cf_payment_id;
  const errorDetails = event?.data?.error_details?.error_description;

  if (!cashfreeOrderId) {
    return new Response('no order id', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const mapped = mapPaymentStatus(paymentStatus);

  const update: Record<string, unknown> = {
    payment_status: mapped.paymentStatus,
    updated_at: new Date().toISOString(),
  };

  if (cfPaymentId) {
    update.cashfree_payment_id = String(cfPaymentId);
  }

  if (mapped.paymentStatus === 'paid') {
    update.paid_at = new Date().toISOString();
    update.status = 'confirmed';
  } else if (mapped.paymentStatus === 'failed') {
    update.payment_error = errorDetails ?? 'Payment failed';
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update(update)
    .eq('cashfree_order_id', cashfreeOrderId);

  if (updateErr) {
    console.error('Failed to update order:', updateErr);
    return new Response('db update failed', { status: 500 });
  }

  return new Response('ok', { status: 200 });
});

interface CashfreeWebhookEvent {
  type?: string;
  data?: {
    order?: { order_id?: string; order_amount?: number };
    payment?: {
      cf_payment_id?: string | number;
      payment_status?: string;
      payment_amount?: number;
    };
    error_details?: {
      error_code?: string;
      error_description?: string;
    };
  };
}

function mapPaymentStatus(cfStatus?: string): { paymentStatus: string } {
  switch ((cfStatus ?? '').toUpperCase()) {
    case 'SUCCESS':
      return { paymentStatus: 'paid' };
    case 'FAILED':
    case 'USER_DROPPED':
    case 'CANCELLED':
      return { paymentStatus: 'failed' };
    default:
      return { paymentStatus: 'pending' };
  }
}

async function verifyCashfreeSignature(
  secret: string,
  timestamp: string,
  rawBody: string,
  provided: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(timestamp + rawBody)
  );
  const expected = bufferToBase64(signatureBytes);
  return timingSafeEqual(expected, provided);
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

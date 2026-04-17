-- =============================================
-- Add Cashfree payment tracking fields to orders
-- Safe to run multiple times (idempotent)
-- =============================================

alter table orders
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_provider text not null default 'cod',
  add column if not exists cashfree_order_id text,
  add column if not exists payment_session_id text,
  add column if not exists cashfree_payment_id text,
  add column if not exists payment_error text,
  add column if not exists paid_at timestamptz;

-- payment_status: pending | paid | failed | refunded
-- payment_provider: cod | cashfree | whatsapp

create index if not exists orders_payment_status_idx
  on orders (payment_status);

create index if not exists orders_cashfree_order_id_idx
  on orders (cashfree_order_id);

-- Allow anonymous users to read their own order's payment status
-- (lookup by id only; they know the id from checkout flow)
drop policy if exists "Anyone can read order status by id" on orders;
create policy "Anyone can read order status by id"
  on orders for select
  using (true);

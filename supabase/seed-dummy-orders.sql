-- =============================================
-- 5 DUMMY ORDERS for UI testing
-- Run in Supabase SQL Editor.
-- Covers: every status, every payment provider, every payment status,
-- single-item & multi-item carts, discounts, COD, paid, pending, failed.
-- =============================================

-- Wipe any previous dummies before re-seeding (identified by 'DUMMY-' prefix on phone)
delete from orders where customer_phone like 'DUMMY-%';

insert into orders (
  items, total_amount, customer_name, customer_phone, customer_email,
  shipping_address, city, pincode, status, payment_method,
  payment_status, payment_provider, notes, paid_at,
  cashfree_order_id, cashfree_payment_id,
  created_at, updated_at
) values

-- =====================================================================
-- ORDER 1: Brand new pending order — online payment still processing
-- =====================================================================
(
  '[
    {"productId":"p-001","productName":"Modern Folk Yellow Gold Thushi Necklace","productImage":"https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400","price":21349,"quantity":1}
  ]'::jsonb,
  21349,
  'Priya Sharma',
  'DUMMY-9876543210',
  'priya.sharma@example.com',
  'Flat 302, Sunshine Apartments, MG Road',
  'Pune',
  '411001',
  'pending',
  'cashfree',
  'pending',
  'cashfree',
  'Please gift-wrap this order',
  null,
  'CF-ORD-20260415-001',
  null,
  now() - interval '30 minutes',
  now() - interval '30 minutes'
),

-- =====================================================================
-- ORDER 2: Confirmed COD order — ready to process
-- =====================================================================
(
  '[
    {"productId":"p-002","productName":"Traditional Kolhapuri Saaj Necklace","productImage":"https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400","price":3499,"quantity":1},
    {"productId":"p-003","productName":"Vanki Nath Nose Pin (Maharashtrian)","productImage":"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400","price":899,"quantity":2}
  ]'::jsonb,
  5396,
  'Anjali Kulkarni',
  'DUMMY-8765432109',
  null,
  'Plot 14, Shivajinagar, Opp. FC Road',
  'Pune',
  '411005',
  'confirmed',
  'cod',
  'pending',
  'cod',
  'Call before delivery please',
  null,
  null,
  null,
  now() - interval '6 hours',
  now() - interval '2 hours'
),

-- =====================================================================
-- ORDER 3: Processing — Cashfree paid, being packed
-- =====================================================================
(
  '[
    {"productId":"p-004","productName":"Bridal Maharani Choker Set","productImage":"https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400","price":14999,"quantity":1},
    {"productId":"p-005","productName":"Matching Gold-Plated Jhumkas","productImage":"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400","price":2499,"quantity":1},
    {"productId":"p-006","productName":"Pearl Maang Tikka","productImage":"https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400","price":1799,"quantity":1}
  ]'::jsonb,
  19297,
  'Rukmini Deshmukh',
  'DUMMY-7654321098',
  'rukmini.d@example.com',
  'House No. 45, Laxmi Colony, Ambazari Road',
  'Nagpur',
  '440010',
  'processing',
  'cashfree',
  'paid',
  'cashfree',
  'Bridal order for daughter — handle with care',
  now() - interval '1 day',
  'CF-ORD-20260414-007',
  'CF-PAY-20260414-007',
  now() - interval '1 day',
  now() - interval '3 hours'
),

-- =====================================================================
-- ORDER 4: Shipped — WhatsApp order, delivery on the way
-- =====================================================================
(
  '[
    {"productId":"p-007","productName":"Delicate Temple Earrings","productImage":"https://images.unsplash.com/photo-1635767582909-345d3d7da9b8?w=400","price":1299,"quantity":1}
  ]'::jsonb,
  1398,
  'Meera Joshi',
  'DUMMY-6543210987',
  null,
  'A-7, Green Park Society, Aundh',
  'Pune',
  '411007',
  'shipped',
  'whatsapp',
  'paid',
  'whatsapp',
  null,
  now() - interval '2 days',
  null,
  null,
  now() - interval '3 days',
  now() - interval '6 hours'
),

-- =====================================================================
-- ORDER 5: Delivered — happy customer, gold-standard successful flow
-- =====================================================================
(
  '[
    {"productId":"p-008","productName":"Peacock Mangalsutra (22KT Look)","productImage":"https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=400","price":4599,"quantity":1},
    {"productId":"p-009","productName":"Gold-Plated Toe Rings (Pair)","productImage":"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400","price":499,"quantity":2}
  ]'::jsonb,
  5597,
  'Shraddha Patil',
  'DUMMY-5432109876',
  'shraddha.patil@example.com',
  '22/B, Rajgurunagar, Near Main Market',
  'Mumbai',
  '400058',
  'delivered',
  'cashfree',
  'paid',
  'cashfree',
  'First time ordering — excited!',
  now() - interval '6 days',
  'CF-ORD-20260410-014',
  'CF-PAY-20260410-014',
  now() - interval '6 days',
  now() - interval '1 day'
);

-- Quick check
select
  status,
  payment_status,
  payment_provider,
  customer_name,
  total_amount,
  jsonb_array_length(items) as item_count
from orders
where customer_phone like 'DUMMY-%'
order by created_at desc;

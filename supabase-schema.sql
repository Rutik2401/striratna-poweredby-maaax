-- =============================================
-- StriRatna Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- CATEGORIES TABLE
-- =============================================
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  name_marathi text,
  description text,
  image text,
  display_order integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  name_marathi text,
  description text not null default '',
  price numeric not null,
  original_price numeric,
  images text[] default '{}',
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  in_stock boolean default true,
  featured boolean default false,
  best_seller boolean default false,
  new_arrival boolean default false,
  weight text,
  material text,
  dimensions text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
create table orders (
  id uuid default uuid_generate_v4() primary key,
  items jsonb not null default '[]',
  total_amount numeric not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address text not null,
  city text not null,
  pincode text not null,
  status text not null default 'pending',
  payment_method text not null default 'whatsapp',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Categories: anyone can read active categories
create policy "Anyone can read categories"
  on categories for select
  using (true);

-- Categories: only authenticated users can manage
create policy "Authenticated users can manage categories"
  on categories for all
  using (auth.role() = 'authenticated');

-- Products: anyone can read products
create policy "Anyone can read products"
  on products for select
  using (true);

-- Products: only authenticated users can manage
create policy "Authenticated users can manage products"
  on products for all
  using (auth.role() = 'authenticated');

-- Orders: anyone can create orders
create policy "Anyone can create orders"
  on orders for insert
  with check (true);

-- Orders: only authenticated users can read/update orders
create policy "Authenticated users can read orders"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update orders"
  on orders for update
  using (auth.role() = 'authenticated');

-- =============================================
-- SAMPLE DATA - Categories
-- =============================================
insert into categories (name, name_marathi, description, display_order, active) values
  ('Necklace Sets', 'नेकलेस सेट', 'Premium 1gm gold necklace sets', 1, true),
  ('Mangalsutra', 'मंगळसूत्र', 'Traditional and modern mangalsutra designs', 2, true),
  ('Earrings', 'कानातले', 'Elegant earrings for every occasion', 3, true),
  ('Bangles', 'बांगड्या', 'Beautiful bangles and bracelets', 4, true),
  ('Rings', 'अंगठ्या', 'Stunning rings collection', 5, true),
  ('Nose Pins', 'नथ', 'Traditional nose pins and naths', 6, true);

-- =============================================
-- SAMPLE DATA - Products
-- =============================================
insert into products (name, name_marathi, description, price, original_price, images, category_id, in_stock, featured, best_seller, new_arrival, material, weight) values
  (
    'Royal Maharani Necklace Set',
    'रॉयल महाराणी नेकलेस सेट',
    'Exquisite 1gm gold necklace set with matching earrings. Perfect for weddings and special occasions. Traditional Maharashtrian design with modern elegance.',
    2499, 3999,
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
    (select id from categories where name = 'Necklace Sets'),
    true, true, true, false,
    '1gm Gold Polish', '45g'
  ),
  (
    'Classic Pearl Mangalsutra',
    'क्लासिक पर्ल मंगळसूत्र',
    'Beautiful pearl mangalsutra with gold-plated pendant. Lightweight and comfortable for daily wear.',
    899, 1499,
    ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'],
    (select id from categories where name = 'Mangalsutra'),
    true, true, true, false,
    '1gm Gold Polish with Pearls', '15g'
  ),
  (
    'Temple Jhumka Earrings',
    'टेम्पल झुमका',
    'Gorgeous temple-style jhumka earrings with intricate detailing. A must-have for every Maharashtrian woman.',
    699, 999,
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'],
    (select id from categories where name = 'Earrings'),
    true, true, false, true,
    '1gm Gold Polish', '20g'
  ),
  (
    'Antique Gold Bangles Set',
    'अँटिक गोल्ड बांगड्या सेट',
    'Set of 4 antique gold-finish bangles. Rich traditional design that complements any outfit.',
    1299, 1999,
    ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600'],
    (select id from categories where name = 'Bangles'),
    true, false, true, false,
    '1gm Gold Polish', '60g'
  ),
  (
    'Kundan Bridal Necklace Set',
    'कुंदन ब्राइडल नेकलेस सेट',
    'Stunning kundan bridal necklace set with earrings and maangtika. Make your special day even more special.',
    3499, 5999,
    ARRAY['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600'],
    (select id from categories where name = 'Necklace Sets'),
    true, true, false, true,
    'Kundan with 1gm Gold Polish', '85g'
  ),
  (
    'Diamond Look Nose Pin',
    'डायमंड लुक नथ',
    'Elegant diamond-look nose pin with gold finish. Adds grace to your everyday look.',
    399, 599,
    ARRAY['https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600'],
    (select id from categories where name = 'Nose Pins'),
    true, false, false, true,
    '1gm Gold Polish with AD stones', '5g'
  ),
  (
    'Peacock Design Finger Ring',
    'मोर डिझाइन अंगठी',
    'Beautiful peacock-design adjustable ring. Traditional Maharashtrian motif with modern styling.',
    499, 799,
    ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'],
    (select id from categories where name = 'Rings'),
    true, false, true, false,
    '1gm Gold Polish', '8g'
  ),
  (
    'Choker Pearl Necklace',
    'चोकर पर्ल नेकलेस',
    'Trendy choker-style pearl necklace. Perfect blend of tradition and modern fashion.',
    1799, 2499,
    ARRAY['https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=600'],
    (select id from categories where name = 'Necklace Sets'),
    true, true, false, true,
    '1gm Gold Polish with Pearls', '35g'
  );

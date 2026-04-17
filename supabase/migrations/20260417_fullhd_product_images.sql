-- =============================================
-- Upgrade seed products to Full-HD multi-image galleries
-- Safe to run multiple times — matches by product name, skips anything unknown.
-- Images are served by Unsplash with auto-format (WebP/AVIF),
-- 1600px wide, 85% quality — looks crisp on all devices.
-- =============================================

-- Shared URL builder for Unsplash full-HD renders
-- Example: https://images.unsplash.com/photo-ID?auto=format&fit=crop&w=1600&q=85

-- ========== NECKLACE SETS ==========

update products set images = array[
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Royal Maharani Necklace Set';

update products set images = array[
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Kundan Bridal Necklace Set';

update products set images = array[
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Choker Pearl Necklace';

-- ========== MANGALSUTRA ==========

update products set images = array[
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1602751584554-86e5e4e30dc4?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Classic Pearl Mangalsutra';

-- ========== EARRINGS ==========

update products set images = array[
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1635767582909-345c2c3d4d8e?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Temple Jhumka Earrings';

-- ========== BANGLES ==========

update products set images = array[
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Antique Gold Bangles Set';

-- ========== RINGS ==========

update products set images = array[
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1591024102671-98c29c39c4f3?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Peacock Design Finger Ring';

-- ========== NOSE PINS ==========

update products set images = array[
  'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=85'
]
where name = 'Diamond Look Nose Pin';

-- ========== CATEGORY COVER IMAGES (for the Shop-by-Category tiles) ==========

update categories set image = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85'
where name = 'Necklace Sets' and (image is null or image = '');

update categories set image = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1600&q=85'
where name = 'Mangalsutra' and (image is null or image = '');

update categories set image = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85'
where name = 'Earrings' and (image is null or image = '');

update categories set image = 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1600&q=85'
where name = 'Bangles' and (image is null or image = '');

update categories set image = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85'
where name = 'Rings' and (image is null or image = '');

update categories set image = 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1600&q=85'
where name = 'Nose Pins' and (image is null or image = '');

-- Optional: if you want EVERY existing product (incl. user-added ones) to pick
-- up the higher-resolution variant of Unsplash URLs, uncomment the block below.
-- It simply rewrites any ?w=<small> URLs to full HD params. Safe on production
-- if you only use Unsplash CDN URLs.
--
-- update products
-- set images = array(
--   select case
--     when u like 'https://images.unsplash.com/%'
--       then regexp_replace(u, '\?.*$', '?auto=format&fit=crop&w=1600&q=85')
--     else u
--   end
--   from unnest(images) as u
-- )
-- where exists (
--   select 1 from unnest(images) as u
--   where u like 'https://images.unsplash.com/%'
-- );

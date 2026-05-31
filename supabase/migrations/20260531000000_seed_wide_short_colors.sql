-- Seed Wide Short (شورت واسع) colors with male-version images.
-- Images stored in product-media bucket under products/wide-short-oversized/

DO $$
DECLARE
  base CONSTANT text := 'https://wjzkhgizatmovwudqwgf.supabase.co/storage/v1/object/public/product-media/products';
BEGIN

DELETE FROM public.product_colors WHERE product_id = 'wide-short-oversized';

INSERT INTO public.product_colors (product_id, name, hex, image_url, image_urls) VALUES
('wide-short-oversized', 'بيج',         '#ab9f8b', base || '/wide-short-oversized/wide_short-beige-ab9f8b-m.jpg',  ARRAY[base || '/wide-short-oversized/wide_short-beige-ab9f8b-m.jpg']),
('wide-short-oversized', 'أسود',        '#000000', base || '/wide-short-oversized/wide_short-noir-000000-m.jpg',   ARRAY[base || '/wide-short-oversized/wide_short-noir-000000-m.jpg']),
('wide-short-oversized', 'أزرق ليلي',   '#17213a', base || '/wide-short-oversized/wide_short-bleu_nuit-17213a-m.jpg', ARRAY[base || '/wide-short-oversized/wide_short-bleu_nuit-17213a-m.jpg']),
('wide-short-oversized', 'أزرق بترولي', '#2b485e', base || '/wide-short-oversized/wide_short-bleu_petrole-2b485e-m.png', ARRAY[base || '/wide-short-oversized/wide_short-bleu_petrole-2b485e-m.png']),
('wide-short-oversized', 'بني',         '#262328', base || '/wide-short-oversized/wide_short-marron-262328-m.jpg', ARRAY[base || '/wide-short-oversized/wide_short-marron-262328-m.jpg']),
('wide-short-oversized', 'رمادي',       '#c4d5e0', base || '/wide-short-oversized/wide_short-gris-c4d5e0-m.jpg',   ARRAY[base || '/wide-short-oversized/wide_short-gris-c4d5e0-m.jpg']),
('wide-short-oversized', 'أبيض',        '#ffffff', base || '/wide-short-oversized/wide_short-blanc-ffffff-m.jpg',   ARRAY[base || '/wide-short-oversized/wide_short-blanc-ffffff-m.jpg']),
('wide-short-oversized', 'أخضر',        '#3a473f', base || '/wide-short-oversized/wide_short-green-3a473f-m.JPG',   ARRAY[base || '/wide-short-oversized/wide_short-green-3a473f-m.JPG']),
('wide-short-oversized', 'أزرق سماوي',  '#b6c8db', base || '/wide-short-oversized/wide_short-sky_bleu-b6c8db-m.png', ARRAY[base || '/wide-short-oversized/wide_short-sky_bleu-b6c8db-m.png']);

END $$;

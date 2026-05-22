-- Seed all remaining catalogue products with color images.
-- Images are stored in the product-media bucket.

DO $$
DECLARE
  base CONSTANT text := 'https://wjzkhgizatmovwudqwgf.supabase.co/storage/v1/object/public/product-media/products';
BEGIN

-- ──────────────────────────────────────────────
-- T-shirt Oversized Basic
-- ──────────────────────────────────────────────
DELETE FROM public.product_colors WHERE product_id = 'tshirt-oversized';

INSERT INTO public.product_colors (product_id, name, hex, image_url, image_urls) VALUES
('tshirt-oversized', 'بيج',  '#b1b2a8', base || '/tshirt-oversized/tshirt_oversize-beige-b1b2a8-f.JPG',
  ARRAY[
    base || '/tshirt-oversized/tshirt_oversize-beige-b1b2a8-f.JPG',
    base || '/tshirt-oversized/tshirt_oversize-beige-b1b2a8-m.JPG'
  ]),
('tshirt-oversized', 'أخضر', '#32533f', base || '/tshirt-oversized/tshirt_oversize-vert_32533f-f.JPG',
  ARRAY[
    base || '/tshirt-oversized/tshirt_oversize-vert_32533f-f.JPG',
    base || '/tshirt-oversized/tshirt_oversize-vert_32533f-m.JPG'
  ]),
('tshirt-oversized', 'أبيض', '#ffffff', base || '/tshirt-oversized/tshirt_oversize-white-ffffff-f.JPG',
  ARRAY[
    base || '/tshirt-oversized/tshirt_oversize-white-ffffff-f.JPG',
    base || '/tshirt-oversized/tshirt_oversize-white-ffffff-m.JPG'
  ]);

-- ──────────────────────────────────────────────
-- Sacoche
-- ──────────────────────────────────────────────
DELETE FROM public.product_colors WHERE product_id = 'sacoche-regular';

INSERT INTO public.product_colors (product_id, name, hex, image_url, image_urls) VALUES
('sacoche-regular', 'أسود', '#000000', base || '/sacoche-regular/sacoche-noir-000000-with-model.jpg',
  ARRAY[
    base || '/sacoche-regular/sacoche-noir-000000-no-model.jpg',
    base || '/sacoche-regular/sacoche-noir-000000-with-model.jpg'
  ]);

-- ──────────────────────────────────────────────
-- Short Regular
-- ──────────────────────────────────────────────
DELETE FROM public.product_colors WHERE product_id = 'short-regular';

INSERT INTO public.product_colors (product_id, name, hex, image_url, image_urls) VALUES
('short-regular', 'بيج',      '#776b5d', base || '/short-regular/short-beige-776b5d-m.jpg',       ARRAY[base || '/short-regular/short-beige-776b5d-m.jpg']),
('short-regular', 'أزرق ليلي','#09111f', base || '/short-regular/short-bleu_nuit-09111f-m.jpg',    ARRAY[base || '/short-regular/short-bleu_nuit-09111f-m.jpg']),
('short-regular', 'أزرق مخضر','#0569b9', base || '/short-regular/short-bleu_vert-569b9-m.jpg',     ARRAY[base || '/short-regular/short-bleu_vert-569b9-m.jpg']),
('short-regular', 'رمادي',    '#09111f', base || '/short-regular/short-gris-09111f-m.jpg',         ARRAY[base || '/short-regular/short-gris-09111f-m.jpg']),
('short-regular', 'بني',      '#221f21', base || '/short-regular/short-marron-221f21-m.jpg',       ARRAY[base || '/short-regular/short-marron-221f21-m.jpg']),
('short-regular', 'أسود',     '#000000', base || '/short-regular/short-noir-000000-m.jpg',         ARRAY[base || '/short-regular/short-noir-000000-m.jpg']),
('short-regular', 'أخضر',     '#26322a', base || '/short-regular/short-vert-26322a-m.jpg',         ARRAY[base || '/short-regular/short-vert-26322a-m.jpg']),
('short-regular', 'أبيض',     '#ffffff', base || '/short-regular/short-white-ffffff-m.jpg',        ARRAY[base || '/short-regular/short-white-ffffff-m.jpg']);

-- ──────────────────────────────────────────────
-- Polo Demi-Manches
-- ──────────────────────────────────────────────
DELETE FROM public.product_colors WHERE product_id = 'polo-demi-manche-regular';

INSERT INTO public.product_colors (product_id, name, hex, image_url, image_urls) VALUES
('polo-demi-manche-regular', 'أوبرجين',   '#5a243e', base || '/polo-demi-manche-regular/polo_demi_manche-aubergine-5a243e-f.jpg',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-aubergine-5a243e-f.jpg',
    base || '/polo-demi-manche-regular/polo_demi_manche-aubergine-5a243e-m.png'
  ]),
('polo-demi-manche-regular', 'بيج',       '#c7c6bf', base || '/polo-demi-manche-regular/polo_demi_manche-beige-c7c6bf-f.jpg',
  ARRAY[base || '/polo-demi-manche-regular/polo_demi_manche-beige-c7c6bf-f.jpg']),
('polo-demi-manche-regular', 'أبيض',      '#ffffff', base || '/polo-demi-manche-regular/polo_demi_manche-blanc-ffffff-f.jpg',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-blanc-ffffff-f.jpg',
    base || '/polo-demi-manche-regular/polo_demi_manche-blanc-ffffff-m.png'
  ]),
('polo-demi-manche-regular', 'أزرق سماوي','#98c8e7', base || '/polo-demi-manche-regular/polo_demi_manche-bleu_ciel-98c8e7-f.jpg',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_ciel-98c8e7-f.jpg',
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_ciel-98c8e7-m.png'
  ]),
('polo-demi-manche-regular', 'أزرق فاتح', '#5266ab', base || '/polo-demi-manche-regular/polo_demi_manche-bleu_clair-5266ab-f.jpg',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_clair-5266ab-f.jpg',
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_clair-5266ab-m.png'
  ]),
('polo-demi-manche-regular', 'أزرق ليلي', '#1d2134', base || '/polo-demi-manche-regular/polo_demi_manche-bleu_nuit-1d2134-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_nuit-1d2134-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_nuit-1d2134-m.png'
  ]),
('polo-demi-manche-regular', 'أزرق ملكي فاتح', '#293e7e', base || '/polo-demi-manche-regular/polo_demi_manche-bleu_roi_clair-293e7e-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_roi_clair-293e7e-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_roi_clair-293e7e-m.png'
  ]),
('polo-demi-manche-regular', 'أزرق ملكي غامق', '#222f84', base || '/polo-demi-manche-regular/polo_demi_manche-bleu_roi_fonce-222f84-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_roi_fonce-222f84-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_roi_fonce-222f84-m.png'
  ]),
('polo-demi-manche-regular', 'أزرق مخضر', '#73b0a3', base || '/polo-demi-manche-regular/polo_demi_manche-bleu_vert-73b0a3-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_vert-73b0a3-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-bleu_vert-73b0a3-m.png'
  ]),
('polo-demi-manche-regular', 'رمادي',     '#797875', base || '/polo-demi-manche-regular/polo_demi_manche-gris-797875-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-gris-797875-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-gris-797875-m.png'
  ]),
('polo-demi-manche-regular', 'أصفر فاتح', '#e3e3a1', base || '/polo-demi-manche-regular/polo_demi_manche-jaune_clair-e3e3a1-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-jaune_clair-e3e3a1-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-jaune_clair-e3e3a1-m.png'
  ]),
('polo-demi-manche-regular', 'أصفر تكنو', '#dbbe28', base || '/polo-demi-manche-regular/polo_demi_manche-jaune_techno-dbbe28-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-jaune_techno-dbbe28-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-jaune_techno-dbbe28-m.png'
  ]),
('polo-demi-manche-regular', 'ليلك',      '#ad9ec7', base || '/polo-demi-manche-regular/polo_demi_manche-lilas-ad9ec7-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-lilas-ad9ec7-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-lilas-ad9ec7-m.png'
  ]),
('polo-demi-manche-regular', 'بني كراميل', '#7f512e', base || '/polo-demi-manche-regular/polo_demi_manche-marron_caramel-7f512e-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-marron_caramel-7f512e-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-marron_caramel-7f512e-m.png'
  ]),
('polo-demi-manche-regular', 'أسود',      '#000000', base || '/polo-demi-manche-regular/polo_demi_manche-noir-000000-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-noir-000000-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-noir-000000-m.png'
  ]),
('polo-demi-manche-regular', 'برتقالي',   '#e1762d', base || '/polo-demi-manche-regular/polo_demi_manche-orange-e1762d-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-orange-e1762d-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-orange-e1762d-m.png'
  ]),
('polo-demi-manche-regular', 'وردي فاتح', '#cba5a0', base || '/polo-demi-manche-regular/polo_demi_manche-rose_clair-cba5a0-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-rose_clair-cba5a0-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-rose_clair-cba5a0-m.png'
  ]),
('polo-demi-manche-regular', 'وردي فوشيا','#a72450', base || '/polo-demi-manche-regular/polo_demi_manche-rose_fuchsia-a72450-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-rose_fuchsia-a72450-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-rose_fuchsia-a72450-m.png'
  ]),
('polo-demi-manche-regular', 'أحمر',      '#871320', base || '/polo-demi-manche-regular/polo_demi_manche-rouge-871320-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-rouge-871320-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-rouge-871320-m.png'
  ]),
('polo-demi-manche-regular', 'أحمر طوبي', '#a65033', base || '/polo-demi-manche-regular/polo_demi_manche-rouge_brique-a65033-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-rouge_brique-a65033-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-rouge_brique-a65033-m.png'
  ]),
('polo-demi-manche-regular', 'سلمون',     '#e2c59e', base || '/polo-demi-manche-regular/polo_demi_manche-saumon-e2c59e-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-saumon-e2c59e-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-saumon-e2c59e-m.png'
  ]),
('polo-demi-manche-regular', 'أخضر كاكتوس','#2d7151', base || '/polo-demi-manche-regular/polo_demi_manche-vert_cactus-2d7151-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-vert_cactus-2d7151-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-vert_cactus-2d7151-m.png'
  ]),
('polo-demi-manche-regular', 'أخضر زيتوني','#81835c', base || '/polo-demi-manche-regular/polo_demi_manche-vert_olive-81835c-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-vert_olive-81835c-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-vert_olive-81835c-m.png'
  ]),
('polo-demi-manche-regular', 'أخضر باسبورت','#304832', base || '/polo-demi-manche-regular/polo_demi_manche-vert_passport-304832-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-vert_passport-304832-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-vert_passport-304832-m.png'
  ]),
('polo-demi-manche-regular', 'بنفسجي',    '#412d6e', base || '/polo-demi-manche-regular/polo_demi_manche-violet-412d6e-f.png',
  ARRAY[
    base || '/polo-demi-manche-regular/polo_demi_manche-violet-412d6e-f.png',
    base || '/polo-demi-manche-regular/polo_demi_manche-violet-412d6e-m.png'
  ]);

END $$;

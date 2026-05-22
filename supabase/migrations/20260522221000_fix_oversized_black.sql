-- Fix T-shirt Oversized: the white-000000 images are actually the black product.
-- Add Black color and keep White (#ffffff) as-is.

DO $$
DECLARE
  base CONSTANT text := 'https://wjzkhgizatmovwudqwgf.supabase.co/storage/v1/object/public/product-media/products/tshirt-oversized';
BEGIN

INSERT INTO public.product_colors (product_id, name, hex, image_url, image_urls) VALUES
('tshirt-oversized', 'أسود', '#000000', base || '/tshirt_oversize-white-000000-f.JPG',
  ARRAY[
    base || '/tshirt_oversize-white-000000-f.JPG',
    base || '/tshirt_oversize-white-000000-m.JPG'
  ]);

END $$;

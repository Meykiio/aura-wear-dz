-- Create public bucket for product/pack media
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true) ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "Public can view product media" ON storage.objects;
CREATE POLICY "Public can view product media"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-media');

-- Admin manage
DROP POLICY IF EXISTS "Admins can upload product media" ON storage.objects;
CREATE POLICY "Admins can upload product media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update product media" ON storage.objects;
CREATE POLICY "Admins can update product media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete product media" ON storage.objects;
CREATE POLICY "Admins can delete product media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'));
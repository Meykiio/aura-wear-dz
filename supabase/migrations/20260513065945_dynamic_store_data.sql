-- 1. Tables Creation

CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  has_size boolean NOT NULL DEFAULT true,
  sizes text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL, -- Arabic name
  hex text NOT NULL,
  image_url text, -- For the preview feature
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.packs (
  id text PRIMARY KEY,
  name text NOT NULL,
  price int NOT NULL,
  positioning text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of {product: id, qty: number, free: boolean}
  media_url text, -- URL for pack image or video
  media_type text DEFAULT 'image', -- 'image' or 'video'
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. RLS Configuration

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Select policies (Public)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view colors" ON public.product_colors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view packs" ON public.packs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (is_approved = true OR public.has_role(auth.uid(), 'admin'));

-- Admin policies (Restricted)
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage colors" ON public.product_colors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage packs" ON public.packs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Initial Seeding

INSERT INTO public.products (id, name, category, has_size, sizes) VALUES
('polo-demi-manche-regular', 'بولو ريغولار', 'polo', true, '{"S", "M", "L", "XL", "XXL"}'),
('tshirt-regular', 'تيشيرت ريغولار', 'tshirt', true, '{"S", "M", "L", "XL", "XXL"}'),
('jogging-demi-saison-regular', 'جوغينغ نص موسم', 'jogging', true, '{"S", "M", "L", "XL", "XXL", "XXXL"}'),
('tshirt-oversized', 'تيشيرت أوفرسايز', 'tshirt', true, '{"S", "M", "L", "XL", "XXL"}'),
('wide-short-oversized', 'شورت واسع', 'short', true, '{"S", "M", "L", "XL", "XXL"}'),
('sacoche-regular', 'ساكوش', 'accessory', true, '{"M", "L", "XL", "14 ans"}'),
('short-regular', 'شورت ريغولار', 'short', true, '{"S", "M", "L", "XL", "XXL"}');

-- Seeding colors for a few products (to demonstrate the feature)
INSERT INTO public.product_colors (product_id, name, hex) VALUES
('tshirt-regular', 'أبيض', '#ffffff'),
('tshirt-regular', 'أسود', '#000000'),
('short-regular', 'بيج', '#f5f5dc'),
('sacoche-regular', 'أسود', '#000000');

INSERT INTO public.packs (id, name, price, positioning, items) VALUES
('regular', 'PACK " REGULAR "', 5500, 'ستايل بسيط + مناسب للجامعة والخروج', '[{"product": "tshirt-regular", "qty": 1}, {"product": "short-regular", "qty": 1}, {"product": "sacoche-regular", "qty": 1, "free": true}]'),
('oversize', 'PACK " OVERSIZE "', 5900, 'ستايل شبابي عصري + قماش مريح', '[{"product": "tshirt-oversized", "qty": 1}, {"product": "wide-short-oversized", "qty": 1}, {"product": "sacoche-regular", "qty": 1, "free": true}]'),
('chic', 'PACK " CHIC "', 5900, 'ستايل أنيق + جودة عالية + راحة في اللبس', '[{"product": "polo-demi-manche-regular", "qty": 1}, {"product": "jogging-demi-saison-regular", "qty": 1}, {"product": "sacoche-regular", "qty": 1, "free": true}]'),
('double', 'PACK " DOUBLE "', 8900, 'باك عائلي قوي + قماش عالي الجودة', '[{"product": "polo-demi-manche-regular", "qty": 2}, {"product": "tshirt-regular", "qty": 2}, {"product": "jogging-demi-saison-regular", "qty": 2}]'),
('mix', 'PACK " MIX "', 10900, 'أقوى عرض كامل + أكثر من لوك في نفس الباك', '[{"product": "polo-demi-manche-regular", "qty": 1}, {"product": "tshirt-regular", "qty": 1}, {"product": "tshirt-oversized", "qty": 1}, {"product": "short-regular", "qty": 1}, {"product": "wide-short-oversized", "qty": 1}, {"product": "jogging-demi-saison-regular", "qty": 1}, {"product": "sacoche-regular", "qty": 1, "free": true}]');

-- Export baseline: captures DB objects applied live but not previously committed.
-- Fully idempotent so it is safe to re-run.

-- 1. Order validation trigger -------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_order()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(trim(coalesce(NEW.customer_name,''))) < 2 OR length(NEW.customer_name) > 120 THEN
    RAISE EXCEPTION 'Invalid customer_name';
  END IF;
  IF NEW.phone !~ '^[0-9+\s\-]{8,20}$' THEN
    RAISE EXCEPTION 'Invalid phone';
  END IF;
  IF length(trim(coalesce(NEW.wilaya,''))) < 2 OR length(NEW.wilaya) > 80 THEN
    RAISE EXCEPTION 'Invalid wilaya';
  END IF;
  IF length(trim(coalesce(NEW.address,''))) < 5 OR length(NEW.address) > 500 THEN
    RAISE EXCEPTION 'Invalid address';
  END IF;
  IF length(trim(coalesce(NEW.pack_name,''))) < 1 OR length(NEW.pack_name) > 200 THEN
    RAISE EXCEPTION 'Invalid pack_name';
  END IF;
  IF NEW.pack_quantity IS NULL OR NEW.pack_quantity < 1 OR NEW.pack_quantity > 100 THEN
    RAISE EXCEPTION 'Invalid pack_quantity';
  END IF;
  IF NEW.pack_price IS NULL OR NEW.pack_price < 0 OR NEW.pack_price > 100000000 THEN
    RAISE EXCEPTION 'Invalid pack_price';
  END IF;
  IF NEW.total_price IS NULL OR NEW.total_price < 0 OR NEW.total_price > 100000000 THEN
    RAISE EXCEPTION 'Invalid total_price';
  END IF;
  IF NEW.note IS NOT NULL AND length(NEW.note) > 1000 THEN
    RAISE EXCEPTION 'Note too long';
  END IF;
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_order_trigger ON public.orders;
CREATE TRIGGER validate_order_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.validate_order();

-- 2. Review validation trigger -----------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(trim(coalesce(NEW.customer_name,''))) < 2 OR length(NEW.customer_name) > 120 THEN
    RAISE EXCEPTION 'Invalid customer_name';
  END IF;
  IF length(trim(coalesce(NEW.comment,''))) < 3 OR length(NEW.comment) > 2000 THEN
    RAISE EXCEPTION 'Invalid comment';
  END IF;
  IF NEW.rating IS NULL OR NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'Invalid rating';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    NEW.is_approved := false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_review_trigger ON public.reviews;
CREATE TRIGGER validate_review_trigger
BEFORE INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_review();

-- 3. Orders policies ----------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can insert an order" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert valid order" ON public.orders;

CREATE POLICY "Anyone can insert valid order"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND length(trim(customer_name)) BETWEEN 2 AND 120
    AND length(trim(address)) BETWEEN 5 AND 500
    AND length(trim(wilaya)) BETWEEN 2 AND 80
    AND length(trim(pack_name)) BETWEEN 1 AND 200
    AND pack_quantity BETWEEN 1 AND 100
    AND pack_price >= 0
    AND total_price >= 0
  );

-- 4. Reviews policies ---------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;

CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT TO anon, authenticated
  USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews"
  ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (is_approved = false);

-- 5. Storage: drop broad public listing policy --------------------------------
DROP POLICY IF EXISTS "Public can view product media" ON storage.objects;
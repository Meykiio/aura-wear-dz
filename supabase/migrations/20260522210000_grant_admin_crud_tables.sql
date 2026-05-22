-- Grant INSERT/UPDATE/DELETE on admin-managed tables to authenticated role.
-- RLS policies gate these via has_role(auth.uid(), 'admin'), but PostgREST
-- requires the base GRANT before policies can be evaluated.

GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_colors TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.packs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

-- Storage: grant the authenticated role base access to storage.objects
-- so the "Admins can upload product media" RLS policy is reachable.
GRANT ALL ON storage.objects TO authenticated;

-- Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated;

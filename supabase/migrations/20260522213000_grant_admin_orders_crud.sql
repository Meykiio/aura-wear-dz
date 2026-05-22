-- Grant INSERT/UPDATE/DELETE on orders to authenticated role.
-- This was missing from the initial admin CRUD migration (20260522210000),
-- which means admins could SELECT orders but not UPDATE status.

GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;

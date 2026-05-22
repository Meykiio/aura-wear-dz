-- Grant schema usage + SELECT on all public tables to anon and authenticated roles.
-- Required by PostgREST so that RLS policies actually get a chance to run.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.reviews TO anon, authenticated;

-- Ensure future tables are covered automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT ON TABLES TO anon, authenticated;

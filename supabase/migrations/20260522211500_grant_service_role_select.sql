-- Grant SELECT on all tables to service_role so the server-side admin
-- client (supabaseAdmin) can bypass RLS when needed.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;

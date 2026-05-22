# Setup — from zero to running locally

## Prerequisites
- [Bun](https://bun.sh) (or Node 20+ with npm/pnpm)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
- A free [Supabase](https://supabase.com) account
- (Later) A free [Vercel](https://vercel.com) account

## 1. Clone and install

```bash
git clone <your-repo-url> aura-wear
cd aura-wear
bun install
```

## 2. Create your Supabase project
1. Go to https://supabase.com/dashboard and click **New project**.
2. Pick a region close to your users, set a strong DB password, save the project ref (the subdomain in your project URL, e.g. `abcdef` from `abcdef.supabase.co`).
3. From **Project Settings → API**, copy:
   - Project URL
   - `anon` / publishable key
   - `service_role` key (treat as a secret)

## 3. Link the Supabase CLI to your project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

## 4. Run the migrations

```bash
supabase db push
```

This applies every file in `supabase/migrations/` in order. End state:
- Tables: `orders`, `products`, `product_colors`, `packs`, `reviews`, `user_roles`
- Storage bucket: `product-media` (public read, admin write)
- Validation triggers + RLS policies + seed catalog data

> The `supabase/migrations/` folder is the **single source of truth**. The export baseline migration (`20260519000000_export_baseline_security.sql`) folds in every change that had been applied directly to the previous live database, so a fresh push reproduces the live schema exactly. If you ever ran ad-hoc SQL in the old dashboard that isn't in the migrations folder, it's either harmless (already there) or you need to add it as a new migration.

## 5. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and paste:
- `VITE_SUPABASE_URL` and `SUPABASE_URL` → your Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_PUBLISHABLE_KEY` → your anon key
- `VITE_SUPABASE_PROJECT_ID` → your project ref
- `SUPABASE_SERVICE_ROLE_KEY` → your service_role key (server-only, never expose)

See `docs/ENVIRONMENT.md` for the full reference.

## 6. Regenerate TypeScript types (optional but recommended)

```bash
supabase gen types typescript --project-id <your-project-ref> > src/integrations/supabase/types.ts
```

## 7. Create your first admin user

The schema does not create any user automatically. You'll create one through the Supabase Auth UI, then promote it to admin via SQL.

1. Run the app once (`bun dev`) and open `/admin`. Use the signup form, or in **Supabase Dashboard → Authentication → Users → Add user**, create your email/password.
2. Copy the user's UUID from the Auth Users table.
3. In **Supabase Dashboard → SQL Editor**, run:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<paste-your-user-uuid-here>', 'admin');
```

4. Refresh `/admin`. You should now see the admin dashboard. The Orders dashboard lives at `/dashboard`.

> Want to bake an admin into the migrations? Don't — `auth.users` IDs only exist after a real signup, so promoting in SQL after the fact is the cleanest path. Do this once per environment.

## 8. Run the app

```bash
bun dev
```

Open http://localhost:8080.

## 9. Add catalog content
Sign in as admin → `/admin` → manage products, packs, colors, and reviews. Media files are uploaded to the `product-media` bucket through the in-app uploader.

## Troubleshooting

- **`Missing Supabase environment variable(s)`** — `.env` is missing or you didn't restart `bun dev` after editing it.
- **Login succeeds but `/admin` shows nothing** — you haven't inserted the row into `user_roles` yet, or the UUID is wrong.
- **`new row violates row-level security policy`** — you're trying a mutation as a non-admin. Check `user_roles` and the policy in `docs/DATABASE.md`.
- **`supabase db push` says migrations already applied** — they were applied before; safe to ignore. To start from a clean DB, recreate the project.

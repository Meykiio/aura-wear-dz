# SSOT — Single source of truth

If you only read one file, read this one. It tells you where every concern lives.

## What this app does
Arabic-language e-commerce landing page for AuraWear, a clothing brand. Visitors browse packs (bundles of products) on the home page, customize sizes/colors, submit an order, and submit reviews. An admin signs in to `/admin` to manage products / packs / colors / reviews and to `/dashboard` to manage orders.

## Stack at a glance
- TanStack Start v1 (React 19) + Vite 7 — SSR + file-based routing
- Tailwind CSS v4 + shadcn UI + Radix primitives
- Supabase (Postgres + Auth + Storage) — no edge functions, no cron
- Hosted on Vercel

## "If X breaks, look here"

| Concern | Source of truth |
|---|---|
| Routes / pages | `src/routes/*` |
| Landing-page sections | `src/components/aura/*` |
| Order flow (customize → shipping → summary → success) | `src/components/aura/order/*` + `OrderModal.tsx` |
| Admin product/pack/review/order CRUD | `src/components/admin/*` |
| Reusable UI primitives | `src/components/ui/*` (shadcn) |
| Read API for products/packs/reviews + media upload | `src/lib/store-service.ts` |
| Auth context + isAdmin check | `src/lib/auth-context.tsx` |
| Static UI copy / catalog text | `src/lib/aura-data.ts` |
| DB schema, RLS, triggers, storage | `supabase/migrations/*` (see `docs/DATABASE.md`) |
| Browser Supabase client | `src/integrations/supabase/client.ts` |
| Server (admin / RLS-bypass) Supabase client | `src/integrations/supabase/client.server.ts` |
| Server-fn auth middleware | `src/integrations/supabase/auth-middleware.ts` |
| Bearer-token attacher for protected server fns | `src/integrations/supabase/auth-attacher.ts` (wired in `src/start.ts`) |
| Generated DB types | `src/integrations/supabase/types.ts` (regenerate via `supabase gen types`) |
| Theme tokens / Tailwind | `src/styles.css` |
| Env vars | `.env.example` + `docs/ENVIRONMENT.md` |

## Data ownership rules
- **Customer never authenticates.** Order + review submissions go straight to Postgres via the anon key. RLS policies + BEFORE INSERT triggers (`validate_order`, `validate_review`) are the only thing standing between the public and the database — never weaken them.
- **Admin = `user_roles` row with `role='admin'`.** Roles are never stored on the user object directly. Check via the `has_role(uuid, app_role)` SECURITY DEFINER function from RLS policies.
- **Service role key never reaches the browser.** It lives only in `process.env.SUPABASE_SERVICE_ROLE_KEY` and is consumed only by `client.server.ts`. Never import that file from anything outside server functions.

## Conventions
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`, etc.) from `src/styles.css`. Don't hardcode hex in components.
- DB types: regenerate `src/integrations/supabase/types.ts` after every migration, don't hand-edit.
- Migrations are append-only. Never edit a migration that has been applied; write a new one.
- Money values are integers in DZD (Algerian Dinar).

## Deployment lifecycle
1. Edit code → commit → push.
2. Vercel deploys automatically (`main` → production, branches → previews).
3. Schema changes: write a new migration, `supabase db push`, then commit it. Regenerate types.

## See also
- `docs/ARCHITECTURE.md` — how the system works
- `docs/DATABASE.md` — schema + RLS reference
- `docs/SETUP.md` — local setup steps
- `docs/DEPLOYMENT.md` — Vercel deployment steps
- `docs/ENVIRONMENT.md` — env-var reference

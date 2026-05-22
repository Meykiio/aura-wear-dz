# AuraWear — AGENTS.md

## Stack

- **Framework:** TanStack Start v1 (React 19) — file-based routes, SSR, server functions
- **Build:** Vite 7 + `@tailwindcss/vite` plugin
- **UI:** Radix primitives + shadcn/ui (new-york style) in `src/components/ui/`
- **CSS:** Tailwind CSS v4 (CSS-based config in `src/styles.css`, **no `tailwind.config.js`**)
- **Data:** TanStack Query + Supabase JS SDK
- **Backend:** Supabase (Postgres + RLS + Auth + Storage)
- **Package manager:** `bun` (lockfile: `bun.lock`)

## Commands

| Command | Purpose |
|---|---|
| `bun dev` | Dev server on port 8080 |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier — write |
| `supabase db push` | Apply migrations to linked Supabase |
| `supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts` | Regenerate DB types |

No test command exists.

## Key conventions

- **Path alias:** `@/` → `./src/`
- **Design tokens:** Custom `--aura-*` CSS variables in `src/styles.css`; mapped to `@theme inline` for Tailwind v4
- **Dark-only theme:** No light mode, full dark palette with violet accent (`--aura-violet: #7B5CF0`)
- **RTL:** Arabic-first (`html lang="ar"`), `.rtl` utility class
- **Fonts:** Bebas Neue (display), Tajawal (body), Inter (UI)
- **shadcn components** live in `src/components/ui/`; `src/lib/utils.ts` has `cn()` helper
- **Icons:** Lucide React
- **ESLint:** `server-only` imports are forbidden — use `@tanstack/react-start/server-only` instead

## Architecture

- **Routes** (`src/routes/`): `index.tsx` (landing), `review.tsx` (public review), `dashboard.tsx` (admin orders), `admin.tsx` (login + product/pack/review managers)
- `src/routeTree.gen.ts` is **auto-generated** by `@tanstack/router-plugin` — do not edit
- **Auth flow:** Supabase email/password. `useAuth()` context checks `user_roles` table for `isAdmin`
- **Admin gate:** Routes gate on `isAdmin` from `AuthContext`
- **Public reads:** Browser client uses Supabase anon key; RLS permits anonymous SELECT on products/packs/approved reviews
- **Orders:** Inserted from browser via RLS + trigger validation; customers never authenticate
- **Media:** `product-media` Storage bucket is public-read; admin-only upload via RLS

## Supabase clients

| Client | File | When to use |
|---|---|---|
| `supabase` (browser) | `src/integrations/supabase/client.ts` | Components, hooks, order flow, admin |
| `supabaseAdmin` (server) | `src/integrations/supabase/client.server.ts` | Server-only — bypasses RLS (service role) |
| `requireSupabaseAuth` middleware | `src/integrations/supabase/auth-middleware.ts` | Server functions acting as signed-in user |

## Environment

- `.env` is gitignored; `.env.example` is the reference
- `VITE_*` = client-bundled; unprefixed = server-only
- Required vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Restart `bun dev` after changing `.env`

## First-time setup

```bash
bun install
cp .env.example .env   # fill in Supabase keys
bun dev
```

## Gotchas

- TanStack Start dev server runs on **port 8080**, not 5173 or 3000
- Supabase local dev (`supabase start`) uses ports 54321 (API), 54322 (DB), 54323 (Studio)
- No `"server-only"` package — use file naming convention or `@tanstack/react-start/server-only` for server-only code
- Router entry point is `router.tsx` (configured in `vite.config.ts`)

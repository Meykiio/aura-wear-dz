# Environment Variables

Two environments, six variables. Every variable lives in `.env` for local dev and in your Vercel project settings for deployments. `.env.example` is the canonical template — keep it up to date when you add a variable.

## Variable reference

### Required

| Name | Scope | Where to find | Purpose |
|---|---|---|---|
| `VITE_SUPABASE_URL` | client | Supabase → Project Settings → API → Project URL | Browser Supabase client base URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | client | Supabase → Project Settings → API → `anon` key | Browser auth + anon DB calls (RLS enforced) |
| `VITE_SUPABASE_PROJECT_ID` | client | The subdomain in your Project URL | Used by tooling and a few UI helpers |
| `SUPABASE_URL` | server | Same value as `VITE_SUPABASE_URL` | SSR / server functions |
| `SUPABASE_PUBLISHABLE_KEY` | server | Same value as `VITE_SUPABASE_PUBLISHABLE_KEY` | SSR / `requireSupabaseAuth` middleware |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Supabase → Project Settings → API → `service_role` key | **Secret.** Admin client (`supabaseAdmin`); bypasses RLS. Server-only. |

### Optional

| Name | Scope | Purpose |
|---|---|---|
| `VITE_HERO_VIDEO_URL` | client | Override the landing-page hero video. Falls back to a default CDN URL. |

## Rules

1. **`VITE_` prefix = client-bundled.** Anything with this prefix is replaced at build time and ends up in the browser. Never put a secret here.
2. **No prefix = server-only.** `process.env.X` works inside server functions and SSR. Never read these at module top-level in shared files — that leaks them into the client bundle.
3. **Never commit `.env`.** `.gitignore` already excludes it; `.env.example` is the published reference.
4. **Mirror values.** `SUPABASE_URL` and `VITE_SUPABASE_URL` must be the same; same for the publishable key pair. The duplication exists because the browser client and the server-side middleware read from different env sources.
5. **Rotating the service role key** — generate a new one in Supabase, update `SUPABASE_SERVICE_ROLE_KEY` in Vercel, redeploy. No code change needed.

## Per-environment notes

- **Local dev:** `.env` at the project root. Restart `bun dev` after editing.
- **Vercel preview & production:** set every variable in **Project → Settings → Environment Variables** for `Production`, `Preview`, and `Development` scopes. See `docs/DEPLOYMENT.md`.

## Removed / abandoned

| Name | Status |
|---|---|
| `RESEND_API_KEY` | Removed. Email sending was never wired up. Add back only if/when you implement it. |

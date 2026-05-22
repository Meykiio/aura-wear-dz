# Architecture

## Stack
- **Framework:** TanStack Start v1 (React 19) — file-based routing, SSR, isomorphic loaders, server functions.
- **Build:** Vite 7. Tailwind CSS v4 via `@tailwindcss/vite`.
- **UI:** Radix primitives + shadcn-style components in `src/components/ui/`. Tailwind tokens in `src/styles.css`.
- **Data:** TanStack Query for client cache. Supabase JS SDK for DB/Auth/Storage.
- **Backend:** Supabase (PostgreSQL + Row Level Security + Auth + Storage). No edge functions, no cron.
- **Hosting:** Vercel (Node SSR build emitted by Vite).

## Code map
```
src/
  routes/                  TanStack file-based routes
    __root.tsx             HTML shell + providers
    index.tsx              Landing page
    review.tsx             Public review submission
    dashboard.tsx          Admin orders dashboard
    admin.tsx              Admin login + product/pack/review managers
  components/
    aura/                  Landing-page sections (Hero, PackCard, OrderModal, ...)
    aura/order/            Multi-step order flow (customize → shipping → summary → success)
    admin/                 ProductManager, PackManager, ReviewManager, OrderList, MediaUploader
    ui/                    shadcn primitives
  lib/
    store-service.ts       Read API for products / packs / approved reviews, media upload helper
    auth-context.tsx       Browser auth provider + isAdmin role check
    aura-data.ts           Static UI copy
    error-page.ts          Branded SSR error fallback HTML
  integrations/supabase/
    client.ts              Browser Supabase client (anon key, session persisted)
    client.server.ts       Server-only admin client (service role key, bypasses RLS)
    auth-middleware.ts     `requireSupabaseAuth` server-fn middleware
    auth-attacher.ts       Client middleware that attaches the bearer token to server-fn RPCs
    types.ts               Generated Postgres types (regenerate via supabase CLI)
  router.tsx, start.ts     TanStack Start router + middleware bootstrap
```

## Data flow

### Public reads
Landing page (`/`) calls `storeService.getProducts()`, `getPacks()`, `getApprovedReviews()` directly from the browser using the anon key. RLS allows anonymous SELECT on `products`, `product_colors`, `packs`, and approved `reviews`.

### Order submission
`OrderModal` posts to `public.orders` from the browser. The `Anyone can insert valid order` RLS policy + `validate_order()` BEFORE INSERT trigger enforce field lengths, phone format, prices, and force `status='pending'`. The customer never authenticates.

### Review submission
`/review` posts to `public.reviews`. RLS allows anon INSERT only when `is_approved=false`; the `validate_review()` trigger blocks self-approval and validates content.

### Admin
Email/password login (Supabase Auth). The `useAuth` context reads `user_roles` to compute `isAdmin`. Admin routes (`/admin`, `/dashboard`) gate on `isAdmin`. All product / pack / review / order mutations happen from the authenticated browser client; RLS `Admins can manage X` policies authorize them via `has_role(auth.uid(), 'admin')`.

### Media
The `product-media` Supabase Storage bucket is public-read (direct URLs resolve without auth). Only admins can upload/update/delete via RLS policies on `storage.objects`.

## Trust boundaries

| Client | When to use | RLS |
|---|---|---|
| `supabase` (browser) | Components, hooks, the order flow, admin dashboard | Respected (acts as anon or signed-in user) |
| `requireSupabaseAuth` middleware | Server functions that must act as the signed-in user | Respected (uses the request's bearer token) |
| `supabaseAdmin` (server-only) | Trusted server jobs that must bypass RLS | Bypassed — service role |

The project does not currently use any server functions — all data access goes through the browser client. The middleware and admin client are in place if you add server-side workflows later.

## Auth model
- Supabase Auth (email/password). No social providers configured by default.
- Role is stored in `public.user_roles` (separate from `auth.users`) and checked via the `has_role(uuid, app_role)` SECURITY DEFINER function. RLS policies call this function to gate admin-only operations.
- First admin is created manually after the first signup — see `SETUP.md`.

## Server / SSR
TanStack Start renders pages on the server, then hydrates on the client. Loaders run in both environments. There are no protected server functions, so no token-attachment is required at the moment — but `auth-attacher.ts` is wired in `start.ts` so any future `requireSupabaseAuth`-protected server fn will work out of the box.

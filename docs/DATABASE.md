# Database

PostgreSQL on Supabase. RLS is enabled on every table. Schema is defined entirely in `supabase/migrations/` — running `supabase db push` on a fresh project reproduces the exact live state.

## Migration order

| # | File | What it does |
|---|------|---|
| 1 | `20260512174621_*.sql` | Creates `orders` + initial permissive policies + indexes. |
| 2 | `20260512174646_*.sql` | Creates `app_role` enum, `user_roles` table, `has_role()` function, replaces permissive order policies with admin-gated ones. |
| 3 | `20260512174708_*.sql` | Revokes `has_role` EXECUTE from PUBLIC/anon, grants to authenticated. |
| 4 | `20260513065945_dynamic_store_data.sql` | Creates `products`, `product_colors`, `packs`, `reviews` + their RLS policies + seed catalog data. |
| 5 | `20260513145008_*.sql` | Creates `product-media` storage bucket + admin-only write policies. |
| 6 | `20260513150000_add_image_url_to_reviews.sql` | Adds `reviews.image_url`. |
| 7 | `20260514020529_*.sql` | Re-grants `has_role` EXECUTE to anon + authenticated (RLS policies need it). |
| 8 | `20260519000000_export_baseline_security.sql` | **Export baseline.** Adds `validate_order()` + `validate_review()` triggers, tightens `orders` INSERT policy, replaces `reviews` SELECT/INSERT policies with explicit ones, removes the broad public listing policy on `storage.objects`. Idempotent. |
| 9 | `20260522193000_grant_anon_public_access.sql` | Grants `USAGE ON SCHEMA public` + `SELECT ON ALL TABLES` to `anon` and `authenticated` roles. Required for PostgREST to reach RLS policies. |
| 10 | `20260522210000_grant_admin_crud_tables.sql` | Grants `INSERT, UPDATE, DELETE` on `products`, `product_colors`, `packs`, `reviews` to `authenticated` role. Grants `ALL ON storage.objects` to `authenticated`. Adds `ALTER DEFAULT PRIVILEGES` for future tables. |
| 11 | `20260522211000_seed_reviews.sql` | Seeds 8 approved reviews (Arabic testimonials) with `ON CONFLICT` upsert. |
| 12 | `20260522211500_grant_service_role_select.sql` | Grants `SELECT ON ALL TABLES` to `service_role` so the server-side admin client can bypass RLS. |
| 13 | `20260522212000_fix_reviews_approved.sql` | Fixes reviews seed (trigger forced `is_approved=false`). Drops trigger, updates/inserts rows with `is_approved=true`, re-creates trigger. |
| 14 | `20260522213000_grant_admin_orders_crud.sql` | Grants `INSERT, UPDATE, DELETE` on `orders` to `authenticated`. Was missing from the initial admin CRUD migration — caused 401 on status update. |
| 15 | `20260522214000_add_image_urls_array.sql` | Adds `image_urls text[] DEFAULT '{}'` to `product_colors` for storing multiple variant images per color (e.g. male + female). |
| 16 | `20260522214500_seed_tshirt_regular_colors.sql` | Seeds 21 colors with images for the T-shirt Regular product from the catalogue. |
| 17 | `20260522220000_seed_catalogue.sql` | Seeds Polo Demi-Manches (25 colors, male+female), T-shirt Oversized (3 colors, male+female), Sacoche (1 color, 2 variants), and Short Regular (8 colors, male). |
| 18 | `20260522221000_fix_oversized_black.sql` | Adds Black (#000000) color to T-shirt Oversized — the `white-000000` images were actually the black product. Oversized now has 4 colors: beige, green, white, black. |

## Tables

### `public.orders`
Customer orders + customization choices.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | default `gen_random_uuid()` |
| created_at | timestamptz | default `now()` |
| customer_name | text | 2-120 chars (validated by trigger) |
| phone | text | matches `^[0-9+\s\-]{8,20}$` |
| wilaya | text | 2-80 chars |
| address | text | 5-500 chars |
| note | text | nullable, ≤1000 chars |
| pack_name | text | 1-200 chars |
| pack_quantity | int | 1-100, default 1 |
| pack_price | int | ≥ 0 (DZD) |
| total_price | int | ≥ 0 (DZD) |
| customizations | jsonb | default `'[]'` — array of `{unitId, productId, size, color}` |
| status | text | default `'pending'`. Trigger force-sets to `'pending'` on insert. |

Indexes: `orders_created_at_idx (DESC)`, `orders_status_idx`.

### `public.products`
Catalog items.

| Column | Type | Notes |
|---|---|---|
| id | text PK | slug, e.g. `tshirt-regular` |
| name | text | Arabic display name |
| category | text | tshirt / polo / short / jogging / accessory / other |
| has_size | bool | default true |
| sizes | text[] | default `'{}'` |
| created_at | timestamptz | default `now()` |

### `public.product_colors`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| product_id | text | FK → `products(id)` ON DELETE CASCADE |
| name | text | Arabic name |
| hex | text | display swatch |
| image_url | text | nullable primary preview image |
| image_urls | text[] | default `'{}'`. All variant images for this color (male, female, etc.). Cycle displayed in the tooltip. |

### `public.packs`
| Column | Type | Notes |
|---|---|---|
| id | text PK | pack slug |
| name | text | |
| price | int | DZD |
| positioning | text | marketing subtitle |
| items | jsonb | array of `{product, qty, free?}` |
| media_url | text | image/video URL |
| media_type | text | `'image'` or `'video'` |

### `public.reviews`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| customer_name | text | 2-120 chars |
| rating | int | 1-5 (CHECK + trigger) |
| comment | text | 3-2000 chars |
| image_url | text | nullable |
| is_approved | bool | default false. Trigger forces false for non-admins. |

### `public.user_roles`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | FK → `auth.users(id)` ON DELETE CASCADE |
| role | app_role enum | currently only `'admin'` |
| UNIQUE | (user_id, role) | |

## RLS policies (plain English)

**products / product_colors / packs**
- Anyone (logged-in or not) can read.
- Only admins can insert, update, or delete.

**orders**
- Anyone can submit a new order, but only if it's in pending status with sane field lengths and non-negative prices. The `validate_order()` trigger re-checks before the row hits the table.
- Only admins can view, update, or delete orders.

**reviews**
- Anyone can submit a review; the row always lands as `is_approved=false` (trigger enforces this for non-admins).
- The public only sees `is_approved=true` rows.
- Admins can view, approve, edit, or delete any review.

**user_roles**
- A signed-in user can see their own row. Inserts / updates / deletes must be done through the SQL editor or a privileged server-side script — there is no public mutation path. This prevents role escalation.

**Storage (`product-media` bucket)**
- Bucket is public, so direct file URLs work without auth.
- API-level listing of objects is closed (no public SELECT policy on `storage.objects`).
- Only admins can upload, update, or delete objects.

## Security model

### PostgREST requires base GRANTs
RLS policies alone are **not enough**. PostgREST requires the requesting role to have a base `GRANT` on the table (SELECT/INSERT/etc.), even if RLS is enabled. If the base GRANT is missing, PostgREST returns `401 Unauthorized` before RLS is ever evaluated.

**Required base GRANTs (by migration):**

| Table(s) | Role | Operations | Migration |
|---|---|---|---|
| All public tables | `anon` | SELECT | `20260522193000` |
| All public tables | `authenticated` | SELECT | `20260522193000` |
| `products`, `product_colors`, `packs`, `reviews` | `authenticated` | INSERT, UPDATE, DELETE | `20260522210000` |
| `orders` | `authenticated` | INSERT, UPDATE, DELETE | `20260522213000` |
| `storage.objects` | `authenticated` | ALL | `20260522210000` |
| All public tables | `service_role` | SELECT | `20260522211500` |

Default privileges (`ALTER DEFAULT PRIVILEGES`) are also set so future tables automatically get the same grants.

## Functions

### `public.has_role(_user_id uuid, _role app_role) → bool`
SECURITY DEFINER, STABLE, `search_path=public`. Returns whether the user has the given role. Called from every admin RLS policy. EXECUTE granted to anon + authenticated (required because policies on anon-readable tables reference it).

### `public.validate_order()`
BEFORE INSERT trigger on `orders`. Validates lengths, phone regex, quantity / price ranges, force-sets `status='pending'`.

### `public.validate_review()`
BEFORE INSERT trigger on `reviews`. Validates content, force-sets `is_approved=false` unless the inserter is admin.

## Regenerating TypeScript types
After any schema change, regenerate `src/integrations/supabase/types.ts`:

```bash
supabase gen types typescript --project-id <your-project-ref> > src/integrations/supabase/types.ts
```

## Notes
- Deleting a product or pack does NOT cascade-delete its uploaded media files from Storage. Clean those up manually when needed.
- The `customizations` JSON shape is a contract between the order flow components and the admin dashboard; if you change it, update both sides.
- When seeding data via migration (bypassing the application layer), the `validate_review` trigger sets `is_approved=false` because `auth.uid()` is null. Either set `is_approved=true` in a follow-up migration after dropping/re-creating the trigger, or update rows directly while the trigger is disabled.

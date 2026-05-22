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
| image_url | text | nullable preview image |

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

# Deployment — Vercel

The project is a TanStack Start app built with Vite + Nitro (`vercel` preset). The build outputs to `.vercel/output/` using the Build Output API — Vercel detects this automatically.

## 1. Push to GitHub
```bash
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

## 2. Import into Vercel
1. https://vercel.com/new → **Import Git Repository** → pick the repo.
2. **Framework Preset:** Vite (or leave auto-detect — Nitro's Vercel output is recognized automatically).
3. **Build command:** `npm run build`.
4. **Output directory:** leave default — Nitro writes to `.vercel/output/`.
5. **Install command:** `npm install`.

## 3. Environment variables
Add **all** of these in **Project → Settings → Environment Variables**, for the `Production`, `Preview`, and `Development` environments:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | your Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | your Supabase project ref |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service_role key (**secret**) |

Optional:
- `VITE_HERO_VIDEO_URL` — override the hero video.

See `docs/ENVIRONMENT.md` for what each one does.

## 4. Deploy
Click **Deploy**. First build takes 1-2 minutes. Subsequent pushes to `main` auto-deploy. Pull requests get preview URLs.

## 5. Configure Supabase Auth for your domain
In **Supabase Dashboard → Authentication → URL Configuration**:
- **Site URL:** your Vercel production URL (e.g. `https://aura-wear.vercel.app`)
- **Redirect URLs:** add both the production URL and any preview pattern, e.g.
  - `https://aura-wear.vercel.app/**`
  - `https://aura-wear-*.vercel.app/**`
  - `http://localhost:8080/**` (for local dev)

If you skip this, email confirmation and password reset links bounce to the wrong place.

## 6. Custom domain
Vercel → **Project → Settings → Domains** → add your domain, follow the DNS instructions. Once it resolves, add it to Supabase Auth URL Configuration too.

## 7. Logs and observability
- **Build logs:** Vercel project → **Deployments** → click any deployment.
- **Runtime logs:** Vercel project → **Logs** tab (SSR function + edge requests).
- **DB queries / Auth events:** Supabase Dashboard → Logs.

## Troubleshooting
- **Blank page in prod, works in dev** — env vars missing. Check the Production environment list and redeploy after adding any new var.
- **Auth redirects to localhost** — Site URL still points to localhost. Fix step 5.
- **`Missing Supabase environment variable(s)` in Vercel logs** — Vercel didn't pick up the server vars. Check they exist for the Production env (not just Preview) and trigger a redeploy.
- **RLS policy errors** — the user isn't in `user_roles`, or you're calling a mutation as anon when it requires admin.

## Alternative hosts
The build output is plain Vite + a Node SSR entry, so any Node-capable host (Render, Fly, Railway, a VPS) works the same way. Drop the `vite build` output, run the SSR entry on Node ≥ 20, set the same env vars.

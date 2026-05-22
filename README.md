# AuraWear

Arabic-language e-commerce landing page for the AuraWear clothing brand. Built on TanStack Start + Supabase, deployed on Vercel.

## Quick start

```bash
bun install
cp .env.example .env   # then fill in your Supabase keys
bun dev
```

Open http://localhost:8080.

## Documentation

- **[docs/SSOT.md](docs/SSOT.md)** — single source of truth, start here
- **[docs/SETUP.md](docs/SETUP.md)** — zero-to-running setup (clone, Supabase, env, admin user)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how the system fits together
- **[docs/DATABASE.md](docs/DATABASE.md)** — schema, RLS, triggers, storage
- **[docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)** — env-var reference
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Vercel deployment

## Stack

- TanStack Start v1 (React 19) + Vite 7
- Tailwind CSS v4 + shadcn/Radix UI
- Supabase (Postgres + Auth + Storage)
- Vercel

## Scripts

| Command | What it does |
|---|---|
| `bun dev` | Run the dev server on port 8080 |
| `bun run build` | Production build (client + SSR) |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | ESLint |
| `bun run format` | Prettier |
| `supabase db push` | Apply migrations to your linked Supabase project |
| `supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts` | Regenerate DB types |

## License

Private project. All rights reserved.

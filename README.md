# Brilliant Learning Platform

Local VPS monorepo for a Brilliant-style interactive learning platform.

- `apps/web` learner-facing Next.js app
- `apps/authoring` authoring/review studio shell
- `packages/ui` Lumio-inspired shadcn-style shared UI
- `packages/schema` typed Zod schemas
- `packages/engine` deterministic Gridworld runtime + validator
- `packages/db` Prisma domain model
- `services/api` API route/service shell
- `services/pipeline` AI generation -> validation -> review queue simulation
- `infra/docker-compose.yml` Postgres, Redis, MinIO

## Run

```bash
npm install
npm test
npm run build
npm run start:web -- -p 3002
```

## Deploy to Vercel

This repository includes a root `vercel.json` configured for the learner-facing Next.js app in `apps/web`.

Recommended Vercel import settings:

- Framework Preset: `Next.js`
- Root Directory: repository root
- Install Command: `npm install`
- Build Command: `npm run vercel-build`
- Output Directory: `apps/web/.next`
- Node.js Version: `22.x` from `package.json#engines`

If the Vercel dashboard has old build overrides, reset them so the checked-in `vercel.json` is used.

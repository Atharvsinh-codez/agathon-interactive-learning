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

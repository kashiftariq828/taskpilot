# TaskPilot

A modern project and task management platform for individuals and small teams, built with Next.js, TypeScript, Prisma, and Tailwind CSS.

This repository currently contains the application **foundation**: layout shell, dashboard, database schema, and design system. Project/task CRUD flows are not implemented yet.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, React Server Components)
- [TypeScript](https://www.typescriptlang.org) (strict mode)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Prisma ORM 7](https://www.prisma.io) with SQLite
- [shadcn/ui](https://ui.shadcn.com) (Base UI + Lucide icons)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for future forms
- [Lucide React](https://lucide.dev) icons

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

The default `DATABASE_URL` points to a local SQLite file (`./dev.db`) and works out of the box.

### 3. Generate the Prisma client, run migrations, and seed the database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | Description                                      |
| -------------------- | ------------------------------------------------- |
| `npm run dev`         | Start the Next.js dev server (Turbopack)          |
| `npm run build`       | Production build                                   |
| `npm run start`       | Start the production server                        |
| `npm run lint`        | Run ESLint                                         |
| `npm run db:generate` | Regenerate the Prisma client                       |
| `npm run db:migrate`  | Create and apply a new migration (dev)             |
| `npm run db:seed`     | Seed the database with sample projects/tasks       |
| `npm run db:studio`   | Open Prisma Studio                                 |

## Project Structure

```
prisma/
  schema.prisma        # Data model (Project, Task, Status, Priority)
  migrations/           # Generated SQL migrations
  seed.ts                # Seed script
prisma.config.ts         # Prisma CLI configuration (datasource URL, migrations, seed)
src/
  app/
    layout.tsx            # Root layout, wraps pages in the app shell
    page.tsx               # Dashboard (stats, recent projects/tasks)
    projects/page.tsx      # Projects list / empty state
    tasks/page.tsx          # Tasks list / empty state
  components/
    layout/                 # Sidebar, header, mobile nav, app shell
    shared/                  # Page header, empty state, status/priority badges
    ui/                       # shadcn/ui primitives
  generated/prisma/            # Generated Prisma client (not committed)
  lib/
    prisma.ts                  # Prisma client singleton (SQLite driver adapter)
    utils.ts                    # `cn()` class helper
```

## Data Model

**Project**: `id`, `name`, `description`, `createdAt`, `updatedAt`, has many `tasks`.

**Task**: `id`, `title`, `description`, `status`, `priority`, `dueDate`, `projectId`, `createdAt`, `updatedAt`, belongs to a `Project`. Deleting a project cascades to its tasks.

```prisma
enum Status {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## Notes on Prisma 7

This project uses Prisma ORM 7, which changed how the client is configured:

- The `datasource` block in `schema.prisma` no longer takes a `url`. Connection details for the CLI (migrate, studio, seed) live in `prisma.config.ts`.
- At runtime, `PrismaClient` requires an explicit driver adapter rather than reading `DATABASE_URL` implicitly. This project uses [`@prisma/adapter-better-sqlite3`](https://www.npmjs.com/package/@prisma/adapter-better-sqlite3), wired up in `src/lib/prisma.ts`.
- The client generator (`provider = "prisma-client"`) outputs to `src/generated/prisma` (via `src/generated/prisma/client`) instead of `node_modules/@prisma/client`. This directory is generated and gitignored — run `npm run db:generate` after cloning.

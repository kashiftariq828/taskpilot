# TaskPilot — Design System

Document-and-conform record of the system that already ships. Values below are the
source of truth in `src/app/globals.css` and `src/components/ui`. Extend these; do not
fork. New token/component → record it here in the same commit.

## Identity

- **Direction:** calm, monochrome productivity tool. Neutral grayscale surfaces, a
  near-black primary — deliberately NOT the default indigo/violet.
- **Font:** Geist (sans) + Geist Mono, loaded via `next/font/google` in
  `src/app/layout.tsx` (`--font-geist-sans`, `--font-geist-mono`). Body is `font-sans`.
- **Theming:** light + dark via `next-themes` (`attribute="class"`, `defaultTheme="system"`).
  Colors are authored in OKLCH.
- **Radius:** base `--radius: 0.625rem`, scaled into `--radius-sm/md/lg/xl/…`.

## Tokens (`src/app/globals.css`) — light `:root`

All color/radius come from these CSS custom properties (mapped into Tailwind via
`@theme inline`). Never hard-code hex or one-off sizes outside this file.

- **Neutrals:** `--background: oklch(1 0 0)`, `--foreground: oklch(0.145 0 0)`,
  `--muted: oklch(0.97 0 0)`, `--muted-foreground: oklch(0.556 0 0)`,
  `--border`/`--input: oklch(0.922 0 0)`, `--ring: oklch(0.708 0 0)`.
- **Accent / actions:** `--primary: oklch(0.205 0 0)` on `--primary-foreground: oklch(0.985 0 0)`;
  `--secondary`/`--accent: oklch(0.97 0 0)`. Surfaces: `--card`/`--popover: oklch(1 0 0)`.
- **Semantic:** `--destructive: oklch(0.577 0.245 27.325)` (the one chromatic token; red).
- **Sidebar & chart** tokens (`--sidebar-*`, `--chart-1..5`) exist for the shell and
  data viz; grayscale in both themes. Dark overrides live under `.dark`.

## Layout — app shell + page pattern

- **Shell** (`src/components/layout/app-shell.tsx`): `flex h-dvh overflow-hidden` with a
  fixed `<Sidebar>` + a column of `<Header>` and scrollable `<main>`. Content is centered:
  `mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8`.
- **Sidebar** (`sidebar.tsx`): `hidden w-60 shrink-0 border-r bg-sidebar md:flex md:flex-col`;
  collapses to a `Sheet` drawer on mobile (`mobile-sidebar.tsx`). Brand + `SidebarNav` inside.
- **Header** (`header.tsx`): `flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6`.
- Pages are left-aligned in the shell; content max-width `max-w-6xl`.

## Component set (`src/components/ui`, Base-UI + CVA)

Reuse these before writing anything new; extend via a variant prop, not a fork.

- **Button** — variants `default | outline | secondary | ghost | destructive | link`;
  sizes `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`.
- **Badge** — variants `default | secondary | destructive | outline | ghost | link`
  (tinted status/enum labels, not raw strings).
- **Card** (Header/Title/Description/Action/Content/Footer), **Dialog**, **Sheet**,
  **Popover**, **DropdownMenu**, **Select** — overlay/surface primitives.
- **Input**, **Textarea**, **Label**, **Form** (React-Hook-Form + Zod resolver) — forms;
  label sits above the control, field errors inline in the destructive color.
- **Skeleton** (loading states), **Avatar**, **Sonner** `<Toaster>` (feedback).

## Bans already followed (keep following)

- **Icons:** `lucide-react` only (16–20px, `currentColor`) — never emoji.
- **Accent:** neutral monochrome + near-black primary — never default indigo/violet.
- **Surfaces:** opaque `bg-card` with 1px `border` for separation — no glassmorphism,
  no heavy shadow + big-radius on ordinary cards.
- **States:** every data view ships designed empty / loading (Skeleton) / error states.
- **Tokens:** single-sourced in `globals.css`; no raw hex or one-off sizes elsewhere.

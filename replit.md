# Romantic Birthday Surprise Website

## Overview

This is a single-page romantic birthday surprise website built as a full-stack application. The frontend is a React SPA with animated sections (hero, music player, photo gallery, virtual cake, love letter, and message board). The backend is an Express server that handles API requests for a simple message/guestbook feature. The project uses a PostgreSQL database to store birthday messages from visitors.

The site features a romantic theme with soft pink, red, white, and gold colors, floating heart animations, confetti effects, and an embedded YouTube music player. It is designed to be mobile-responsive and emotionally appealing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router) — single page at `/`, with a 404 fallback
- **Styling**: Tailwind CSS with CSS variables for theming. The romantic color palette (soft pink, red, gold) is defined in `client/src/index.css` using HSL CSS custom properties
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives. Components live in `client/src/components/ui/`
- **Animations**: Framer Motion for scroll-triggered section reveals and floating hearts
- **Confetti**: canvas-confetti library for birthday celebration effects
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Data Fetching**: TanStack React Query for server state management
- **Fonts**: Google Fonts — "Architects Daughter" (handwritten) and "DM Sans" (body text)
- **Build Tool**: Vite with React plugin. Output goes to `dist/public/`
- **Path Aliases**: `@/*` maps to `client/src/*`, `@shared/*` maps to `shared/*`

### Backend
- **Framework**: Express.js running on Node with TypeScript (tsx)
- **Entry Point**: `server/index.ts` creates an HTTP server
- **API Routes**: Defined in `server/routes.ts` — simple REST endpoints for messages
- **Development**: Vite dev server is used as middleware (HMR via `server/vite.ts`)
- **Production**: Static files served from `dist/public/` with SPA fallback (`server/static.ts`)
- **Build**: Custom build script (`script/build.ts`) uses Vite for client and esbuild for server, outputting to `dist/`

### Shared Code
- **Schema**: `shared/schema.ts` defines database tables using Drizzle ORM and Zod validation schemas
- **Routes**: `shared/routes.ts` defines a typed API contract with input/output schemas, shared between client and server

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: `server/db.ts` uses `pg.Pool` with `DATABASE_URL` environment variable
- **Schema**: Single `messages` table with `id` (serial), `content` (text), and `createdAt` (timestamp)
- **Migrations**: Drizzle Kit configured in `drizzle.config.ts`, migrations output to `./migrations/`
- **Push Command**: `npm run db:push` to sync schema to database

### API Structure
- `POST /api/messages` — Create a new birthday message (validated with Zod)
- `GET /api/messages` — List all birthday messages

### Key Configuration
- The birthday website is personalized through the `CONFIG` object in `client/src/pages/Home.tsx` (name, YouTube song ID, birthday date)
- The project uses ES modules (`"type": "module"` in package.json)

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection via `DATABASE_URL` environment variable. Used for storing visitor messages/guestbook entries
- **YouTube**: Embedded iframe player for the birthday song (no API key needed, just a video ID)
- **Google Fonts**: CDN-loaded fonts (Architects Daughter, DM Sans)

### Key NPM Packages
- `drizzle-orm` + `drizzle-kit` + `drizzle-zod` — Database ORM and schema management
- `express` + `connect-pg-simple` — Server framework and session store
- `framer-motion` — Animation library
- `canvas-confetti` — Confetti effects
- `@tanstack/react-query` — Server state management
- `react-hook-form` + `zod` — Form handling and validation
- `wouter` — Client-side routing
- shadcn/ui component library (multiple `@radix-ui/*` packages)
- `date-fns` — Date utilities

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)
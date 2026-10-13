# Secure Cloud Storage System

Monorepo with a NestJS API and a Next.js web app.

## Structure

```
apps/
  backend/   # NestJS API (default: http://localhost:3001)
  frontend/  # Next.js app (default: http://localhost:3000)
```

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
```

## Development

```bash
# API only
npm run dev:backend

# Web app only
npm run dev:frontend
```

Run each in a separate terminal.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev:backend` | Start NestJS in watch mode |
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run build` | Build all workspaces |
| `npm run build:backend` | Build NestJS |
| `npm run build:frontend` | Build Next.js |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Test all workspaces |

## Ports

- Frontend: `3000`
- Backend: `3001` (configured to avoid clashing with Next.js)

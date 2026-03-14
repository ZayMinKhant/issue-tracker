# Viatick Issue Tracker

Viatick Issue Tracker is a full-stack issue reporting system built as a `pnpm` workspace monorepo. It includes a NestJS API, a Next.js web app, and a React Native mobile app, with shared domain types, validation helpers, and test config across the workspace.

## Project Overview

The project is centered around a single issue workflow:

- create, list, filter, update, and delete issues
- persist issues in PostgreSQL through Prisma
- share issue contracts across API, web, and mobile
- broadcast issue changes over Socket.IO for realtime client updates
- keep form validation consistent with shared `zod`-based utilities

The current issue model includes:

- `title`
- `description`
- optional `submitterName`
- `category`
- `status`
- optional `attachmentName`
- timestamps

Supported statuses:

- `REPORTED`
- `IN_PROGRESS`
- `SOLVED`

Supported categories:

- `GENERAL`
- `MAINTENANCE`
- `SECURITY`
- `CLEANING`
- `NOISE`
- `PARKING`

## How It Was Built

This repo is organized as a monorepo so each app can move independently without duplicating shared logic.

- `apps/api`
  - NestJS API
  - Prisma ORM with PostgreSQL
  - Socket.IO gateway for realtime issue events
  - global `nestjs-zod` validation pipe
- `apps/web`
  - Next.js App Router app
  - React Query for server state
  - React Hook Form with shared `zod` validation
- `apps/mobile`
  - React Native app
  - React Navigation + React Query
  - Socket.IO client for realtime issue syncing
  - branded native launch screen and in-app startup screen
- `packages/types`
  - shared issue types, enums, and socket event contracts
- `packages/utils`
  - shared validation schemas, API helpers, and formatting utilities
- `packages/config`
  - shared workspace config, including Vitest config

## Workspace Layout

```text
.
|-- apps
|   |-- api
|   |-- mobile
|   `-- web
|-- packages
|   |-- config
|   |-- types
|   `-- utils
|-- pnpm-workspace.yaml
`-- turbo.json
```

## Requirements

- Node.js `22.11+`
- `pnpm`
- PostgreSQL
- Android Studio if you want to run Android locally
- Xcode + CocoaPods if you want to run iOS locally

## Before You Start

This repo includes a root workspace entrypoint, so the main developer commands can now be run from the repo root.

Install all workspace dependencies from the repo root:

```bash
pnpm install
```

## Environment Setup

### API

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/issue_tracker
PORT=3001
```

Apply the Prisma migration:

```bash
pnpm --dir apps/api exec prisma migrate dev
```

Common Prisma commands:

```bash
pnpm --dir apps/api exec prisma generate
pnpm --dir apps/api exec prisma migrate dev
pnpm --dir apps/api exec prisma migrate deploy
pnpm --dir apps/api exec prisma studio
```

### Web

The web app defaults to `http://localhost:3001` for the API, but you can override it with `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Mobile

The mobile app can use these environment variables:

- `REACT_NATIVE_API_URL` or `API_URL`
- `REACT_NATIVE_SOCKET_URL` or `SOCKET_URL`

If none are set, the app falls back automatically:

- iOS simulator: `http://localhost:3001`
- Android emulator: `http://10.0.2.2:3001`
- physical device / LAN Metro host: derived from the Metro server host when possible

## Running The Project

### 1. Start the web + API dev stack

From the repo root:

```bash
pnpm dev
```

This starts:

- the NestJS API watcher
- the Next.js web app

### 2. Start mobile separately when needed

Start Metro in another terminal:

```bash
pnpm dev:mobile
```

Then launch the native app:

```bash
pnpm android
```

or:

```bash
pnpm ios
```

### 3. Start apps individually if needed

You can still run each app separately.

### API

```bash
pnpm --dir apps/api start:dev
```

The API listens on `http://localhost:3001` by default.

### Web

```bash
pnpm --dir apps/web dev
```

Open `http://localhost:3000`.

### Mobile

Start Metro in one terminal:

```bash
pnpm --dir apps/mobile start
```

Then run a platform target in another terminal:

```bash
pnpm --dir apps/mobile android
```

or:

```bash
pnpm --dir apps/mobile ios
```

For first-time iOS setup on macOS:

```bash
cd apps/mobile
bundle install
cd ios
bundle exec pod install
```

## Useful Commands

### Root

```bash
pnpm dev
pnpm dev:mobile
pnpm android
pnpm ios
pnpm test
pnpm build
pnpm lint
```

Scope:

- `pnpm dev` starts API and web only
- `pnpm dev:mobile` starts the React Native Metro bundler
- `pnpm android` and `pnpm ios` launch the native mobile target
- `pnpm test` runs API, web, and mobile tests
- `pnpm build` builds API and web
- `pnpm lint` runs the currently defined web and mobile lint scripts

### API

```bash
pnpm --dir apps/api dev
pnpm --dir apps/api start:dev
pnpm --dir apps/api build
pnpm --dir apps/api test
pnpm --dir apps/api exec prisma generate
pnpm --dir apps/api exec prisma migrate dev
pnpm --dir apps/api exec prisma migrate deploy
pnpm --dir apps/api exec prisma studio
```

### Web

```bash
pnpm --dir apps/web dev
pnpm --dir apps/web build
pnpm --dir apps/web test
pnpm --dir apps/web lint
```

### Mobile

```bash
pnpm --dir apps/mobile dev
pnpm --dir apps/mobile start
pnpm --dir apps/mobile android
pnpm --dir apps/mobile ios
pnpm --dir apps/mobile test
pnpm --dir apps/mobile exec tsc --noEmit
pnpm --dir apps/mobile lint
```

## API Notes

The API exposes issue CRUD endpoints under `/issues`:

- `GET /issues`
- `GET /issues/:id`
- `POST /issues`
- `PATCH /issues/:id`
- `DELETE /issues/:id`

Issue changes are also broadcast over Socket.IO with:

- `issue.created`
- `issue.updated`
- `issue.deleted`

## Shared Package Notes

The main reason for the monorepo structure is to avoid drift between clients and server:

- `@issue-tracker/types` keeps issue data contracts aligned
- `@issue-tracker/utils` keeps validation rules and helpers aligned
- `@issue-tracker/config` keeps shared test config aligned

That means changes to issue fields, enums, or socket event payloads can be made once and reused everywhere.

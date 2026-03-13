# Issue Tracker

Monorepo for an issue reporting system with a shared API, web app, and mobile app.

## Stack

- `apps/api`: NestJS, Prisma, PostgreSQL, Socket.IO
- `apps/web`: Next.js
- `apps/mobile`: React Native
- `packages/types`: shared domain types
- `packages/utils`: shared validation and helper utilities

## Requirements

- Node.js `22.11+`
- `pnpm`
- PostgreSQL
- Android Studio and/or Xcode if you want to run the mobile app natively

## Setup

Install workspace dependencies from the repo root:

```bash
pnpm install
```

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/issue_tracker
```

Apply the database migrations:

```bash
cd apps/api
pnpm prisma migrate dev
```

## Run

Start the API:

```bash
cd apps/api
pnpm start:dev
```

Start the web app:

```bash
cd apps/web
pnpm dev
```

Start Metro for mobile:

```bash
cd apps/mobile
pnpm start
```

Then run a native target in another terminal:

```bash
cd apps/mobile
pnpm android
# or
pnpm ios
```

## Environment

- Web uses `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:3001`
- Mobile supports:
  - `REACT_NATIVE_API_URL` or `API_URL`
  - `REACT_NATIVE_SOCKET_URL` or `SOCKET_URL`
- Mobile defaults to:
  - iOS simulator: `http://localhost:3001`
  - Android emulator: `http://10.0.2.2:3001`

## Checks

API:

```bash
cd apps/api
pnpm test
pnpm build
```

Web:

```bash
cd apps/web
pnpm test
pnpm build
```

Mobile:

```bash
cd apps/mobile
pnpm test
npx tsc --noEmit
```

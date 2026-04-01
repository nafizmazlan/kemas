# KEMAS

KEMAS is a house cleaning tracker built with Next.js. It shows an interactive two-floor house plan, colors each room by cleaning status, and lets users log completed cleaning work room by room.

## What the app does

- Displays Floor 1 and Floor 2 as clickable SVG floor plans.
- Loads room definitions and cleaning history from Supabase.
- Calculates each room status from the latest cleaning log and the room's cleaning interval.
- Opens a bottom sheet when a room is selected so users can log a new cleaning entry.
- Shows a simple house summary: clean, due soon, overdue, and never logged.

## How status works

Room status is derived in `lib/utils.ts` from the latest log for each room:

- `never`: the room has no cleaning log.
- `clean`: days since last clean is less than or equal to `clean_interval_days`.
- `due`: days since last clean is more than `clean_interval_days` and less than or equal to `clean_interval_days * 2`.
- `overdue`: days since last clean is greater than `clean_interval_days * 2`.

Status colors are defined in `lib/constants.ts`:

- Green: clean
- Yellow: due soon
- Red: overdue
- Gray: never logged

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (`@supabase/supabase-js`)

## Project structure

```text
app/
  api/
    logs/route.ts        GET and POST cleaning logs
    rooms/route.ts       GET rooms
  globals.css            Global styles for the dashboard and floor plan
  layout.tsx             Root layout and metadata
  page.tsx               Home page entry
components/
  Floor1.tsx             Floor 1 SVG map
  Floor2.tsx             Floor 2 SVG map
  FloorPlan.tsx          Main dashboard container and data loading
  LogSheet.tsx           Bottom sheet for creating a cleaning log
  RoomStatus.tsx         Reusable room status indicator
lib/
  constants.ts           Cleaning type list, labels, and colors
  supabase-server.ts     Server-side Supabase client creation
  supabase.ts            Client-side Supabase client creation
  utils.ts               Status and date helpers
types/
  index.ts               Shared TypeScript types
```

## User flow

1. The home page renders `FloorPlan`.
2. `FloorPlan` fetches `/api/rooms` and `/api/logs` in parallel.
3. The app joins rooms with their latest cleaning log using `attachLatestLogs`.
4. Users switch between floors and select a room.
5. `LogSheet` submits a `POST /api/logs` request.
6. After saving, the dashboard reloads rooms and logs so statuses update immediately.

## API endpoints

### `GET /api/rooms`

Returns all rooms ordered by floor and name.

### `GET /api/logs`

Returns all cleaning logs ordered by `cleaned_at` descending.

### `POST /api/logs`

Creates a new cleaning log.

Expected request body:

```json
{
  "room_id": "room-uuid",
  "cleaning_type": "General",
  "notes": "Optional note"
}
```

Allowed cleaning types come from `lib/constants.ts`:

- `Sweep`
- `Mop`
- `Wipe`
- `Deep clean`
- `Vacuum`
- `Dust`
- `General`

## Data model

The database schema is not documented elsewhere in the repo, but the code expects these Supabase tables and fields.

### `rooms`

- `id: string`
- `name: string`
- `floor: 1 | 2`
- `clean_interval_days: number`
- `created_at?: string`

### `cleaning_logs`

- `id: string`
- `room_id: string`
- `cleaned_at: string`
- `cleaning_type: "Sweep" | "Mop" | "Wipe" | "Deep clean" | "Vacuum" | "Dust" | "General"`
- `notes?: string | null`
- `created_at?: string`

## Rooms currently mapped in the UI

### Floor 1

- Kitchen
- Laundry Room
- Dining Room
- Toilet
- Prayer Room
- Store 2
- Living Room
- Store 1
- Porch

### Floor 2

- Room 2
- Shared Toilet
- Room 1
- Living Room 2F
- Master Bedroom
- Master Toilet

These names must match the `rooms.name` values stored in Supabase, because the SVG floor plan matches room records by exact name.

## Environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Notes:

- Both API routes currently use the public anon key through `createServerSupabaseClient`.
- There is no service-role usage in this codebase.
- There is no authentication layer in the current implementation.

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build and lint

```bash
npm run build
npm run lint
```

## Current implementation notes

- The app is a single-page dashboard at `app/page.tsx`.
- Data fetching on the main screen happens client-side in `components/FloorPlan.tsx`.
- Clicking a room opens a mobile-style bottom sheet, even on desktop.
- `lib/supabase.ts` exists for client-side Supabase usage, but the current UI fetches through the local API routes instead.
- There are no automated tests in the repository at this time.

## Known constraints

- Room matching depends on exact room names between the SVG definitions and database rows.
- The dashboard currently fetches all logs, then calculates the latest log per room in memory.
- Error handling is minimal and uses browser alerts in the client.
- `components/RoomStatus.tsx` and `components/LogSheet.tsx` contain mojibake in the bullet separator text and should be cleaned up in a future pass.

## Suggested next improvements

- Add authentication and user-level access control if multiple households or users will use the app.
- Move status aggregation closer to the database if the log volume grows.
- Add seed data or SQL migrations so setup is reproducible.
- Add tests for status calculation and API routes.
- Replace alert-based errors with inline UI feedback.

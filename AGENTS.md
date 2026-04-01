<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# KEMAS codebase guide

## Project purpose

KEMAS is a house cleaning tracker for a single house. The UI presents an interactive two-floor SVG floor plan, shows each room's cleaning status, and lets users add cleaning logs for each room.

## Main architecture

- `app/page.tsx` is the only page and renders the dashboard.
- `components/FloorPlan.tsx` is the main client component. It fetches room and log data from the local API routes, computes room status, and coordinates the selected room state.
- `components/Floor1.tsx` and `components/Floor2.tsx` render hard-coded SVG room layouts. Room records are matched by exact `name`.
- `components/LogSheet.tsx` is the room action sheet used to create a cleaning log.
- `app/api/rooms/route.ts` reads rooms from Supabase.
- `app/api/logs/route.ts` reads logs and inserts new logs into Supabase.
- `lib/utils.ts` contains the status logic. Preserve this behavior unless the user explicitly asks to change business rules.

## Data model expected by the app

The current code assumes Supabase has at least these tables and columns.

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

## Business rules

- Room status is derived from the latest log only.
- Status thresholds in `lib/utils.ts` are:
  - `never`: no logs
  - `clean`: `daysSince <= clean_interval_days`
  - `due`: `daysSince <= clean_interval_days * 2`
  - `overdue`: anything beyond that
- Do not change these thresholds silently.
- The UI room names in the SVG components must exactly match `rooms.name` values in the database.

## Current room map

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

If an agent adds, removes, or renames rooms in the UI, it must keep the floor plan definitions, Supabase data, and documentation aligned.

## Environment assumptions

- Required env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `lib/supabase-server.ts` currently creates a server-side client with the public anon key.
- There is no authentication or user isolation in the current implementation.

## Implementation notes for agents

- Prefer understanding `components/FloorPlan.tsx`, `lib/utils.ts`, and both API routes before changing behavior.
- This is a small app with client-side dashboard fetching. Avoid adding unnecessary abstraction unless the user asks for a larger refactor.
- If changing status logic, room naming, or API payloads, also update `README.md`.
- If changing floor plan geometry, keep SVG labels readable and click targets intact.
- The codebase currently has no automated tests. If behavior changes, add focused tests if the surrounding setup supports it, or clearly note the lack of coverage.
- There is existing mojibake text in `components/RoomStatus.tsx` and `components/LogSheet.tsx`. Do not copy that encoding issue into new files.

## Safe change patterns

- UI-only changes usually belong in `components/` and `app/globals.css`.
- Data contract changes usually require coordinated edits in `types/index.ts`, `app/api/`, and the relevant UI components.
- Supabase changes should be reflected in docs and any setup instructions.

## Definition of done for future agents

Before finishing, verify:

- the app still builds or the reason it was not verified is stated clearly,
- `README.md` and `AGENTS.md` remain consistent with the current code,
- any changed room names or business rules are updated everywhere they are referenced.

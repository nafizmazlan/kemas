import FloorPlan from "@/components/FloorPlan";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              KEMAS
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              House Cleaning Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">
              Tap a room, choose a cleaning type, and keep track of what was
              cleaned and when.
            </p>
          </div>
        </header>

        <FloorPlan />
      </div>
    </main>
  );
}
"use client";

import { CLEANING_TYPES } from "@/lib/constants";
import { formatRelativeDays } from "@/lib/utils";
import { RoomWithLastLog } from "@/types";
import { useState } from "react";

interface LogSheetProps {
  room: RoomWithLastLog | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function LogSheet({
  room,
  open,
  onClose,
  onSaved,
}: LogSheetProps) {
  const [cleaningType, setCleaningType] = useState("General");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open || !room) return null;

  async function handleSubmit() {
    try {
      setSubmitting(true);

      const res = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: room.id,
          cleaning_type: cleaningType,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save log");
      }

      setNotes("");
      setCleaningType("General");
      onSaved();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/30">
      <button
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-300" />

        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Log cleaning
          </p>
          <h2 className="text-2xl font-semibold">{room.name}</h2>
          <p className="mt-1 text-sm text-neutral-600">
            {formatRelativeDays(room.daysSince)}
            {room.lastLog ? ` - Last type: ${room.lastLog.cleaning_type}` : ""}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Cleaning type
            </label>
            <div className="flex flex-wrap gap-2">
              {CLEANING_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCleaningType(type)}
                  className={`rounded-full border px-3 py-2 text-sm ${
                    cleaningType === type
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-2xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              placeholder="Anything to note?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-neutral-300 px-4 py-3 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-2xl bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Mark as cleaned"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

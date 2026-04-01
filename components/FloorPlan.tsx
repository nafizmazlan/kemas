"use client";

import Floor1 from "@/components/Floor1";
import Floor2 from "@/components/Floor2";
import LogSheet from "@/components/LogSheet";
import RoomStatus from "@/components/RoomStatus";
import { attachLatestLogs } from "@/lib/utils";
import { CleaningLog, Room, RoomWithLastLog } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function FloorPlan() {
  const [floor, setFloor] = useState<1 | 2>(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [logs, setLogs] = useState<CleaningLog[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomWithLastLog | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const [roomsRes, logsRes] = await Promise.all([
        fetch("/api/rooms"),
        fetch("/api/logs"),
      ]);

      if (!roomsRes.ok || !logsRes.ok) {
        throw new Error("Failed to load data");
      }

      const roomsData = await roomsRes.json();
      const logsData = await logsRes.json();

      setRooms(roomsData);
      setLogs(logsData);
    } catch (error) {
      console.error(error);
      alert("Failed to load room data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const roomsWithLogs = useMemo(() => attachLatestLogs(rooms, logs), [rooms, logs]);
  const visibleRooms = roomsWithLogs.filter((room) => room.floor === floor);

  const counts = useMemo(() => {
    return roomsWithLogs.reduce(
      (acc, room) => {
        acc[room.status]++;
        return acc;
      },
      { clean: 0, due: 0, overdue: 0, never: 0 }
    );
  }, [roomsWithLogs]);

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Interactive Floor Plan</h2>
              <p className="text-sm text-neutral-500">
                Tap any room to log cleaning
              </p>
            </div>

            <div className="inline-flex rounded-2xl border border-neutral-200 bg-neutral-50 p-1">
              <button
                onClick={() => setFloor(1)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  floor === 1 ? "bg-neutral-900 text-white" : "text-neutral-700"
                }`}
              >
                Floor 1
              </button>
              <button
                onClick={() => setFloor(2)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  floor === 2 ? "bg-neutral-900 text-white" : "text-neutral-700"
                }`}
              >
                Floor 2
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[500px] items-center justify-center text-neutral-500">
              Loading floor plan...
            </div>
          ) : floor === 1 ? (
            <Floor1 rooms={visibleRooms} onRoomClick={setSelectedRoom} />
          ) : (
            <Floor2 rooms={visibleRooms} onRoomClick={setSelectedRoom} />
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">House status</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <RoomStatus status="clean" daysSince={0} />
                <span className="text-sm font-medium">{counts.clean}</span>
              </div>
              <div className="flex items-center justify-between">
                <RoomStatus status="due" daysSince={2} />
                <span className="text-sm font-medium">{counts.due}</span>
              </div>
              <div className="flex items-center justify-between">
                <RoomStatus status="overdue" daysSince={5} />
                <span className="text-sm font-medium">{counts.overdue}</span>
              </div>
              <div className="flex items-center justify-between">
                <RoomStatus status="never" daysSince={null} />
                <span className="text-sm font-medium">{counts.never}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Current floor rooms</h3>
            <div className="mt-4 space-y-3">
              {visibleRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3 text-left hover:bg-neutral-50"
                >
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-neutral-500">
                      Every {room.clean_interval_days} day
                      {room.clean_interval_days > 1 ? "s" : ""}
                    </p>
                  </div>
                  <RoomStatus status={room.status} daysSince={room.daysSince} />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <LogSheet
        room={selectedRoom}
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onSaved={loadData}
      />
    </>
  );
}
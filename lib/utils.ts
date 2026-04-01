import { CleaningLog, Room, RoomStatus, RoomWithLastLog } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getDaysSince(cleanedAt: string) {
  const diff = Date.now() - new Date(cleanedAt).getTime();
  return Math.floor(diff / 86400000);
}

export function getStatus(
  room: Room,
  lastLog: CleaningLog | null
): RoomStatus {
  if (!lastLog) return "never";

  const daysSince = getDaysSince(lastLog.cleaned_at);

  if (daysSince <= room.clean_interval_days) return "clean";
  if (daysSince <= room.clean_interval_days * 2) return "due";
  return "overdue";
}

export function attachLatestLogs(
  rooms: Room[],
  logs: CleaningLog[]
): RoomWithLastLog[] {
  return rooms.map((room) => {
    const roomLogs = logs
      .filter((log) => log.room_id === room.id)
      .sort(
        (a, b) =>
          new Date(b.cleaned_at).getTime() - new Date(a.cleaned_at).getTime()
      );

    const lastLog = roomLogs[0] ?? null;

    return {
      ...room,
      lastLog,
      status: getStatus(room, lastLog),
      daysSince: lastLog ? getDaysSince(lastLog.cleaned_at) : null,
    };
  });
}

export function formatRelativeDays(days: number | null) {
  if (days === null) return "Never cleaned";
  if (days === 0) return "Cleaned today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
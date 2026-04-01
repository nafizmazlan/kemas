import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { RoomStatus as RoomStatusType } from "@/types";

interface RoomStatusProps {
  status: RoomStatusType;
  daysSince: number | null;
}

export default function RoomStatus({ status, daysSince }: RoomStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-600">
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
      <span>
        {STATUS_LABELS[status]}
        {daysSince !== null
          ? ` - ${daysSince} day${daysSince === 1 ? "" : "s"} ago`
          : ""}
      </span>
    </div>
  );
}

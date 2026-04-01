"use client";

import { STATUS_COLORS } from "@/lib/constants";
import { RoomWithLastLog } from "@/types";

interface FloorProps {
  rooms: RoomWithLastLog[];
  onRoomClick: (room: RoomWithLastLog) => void;
}

export default function Floor1({ rooms, onRoomClick }: FloorProps) {
  const getRoom = (name: string) => rooms.find((room) => room.name === name);

  const roomDefs = [
    { name: "Kitchen", x: 40, y: 40, w: 320, h: 120 },
    { name: "Laundry Room", x: 360, y: 40, w: 180, h: 120 },
    { name: "Dining Room", x: 40, y: 160, w: 280, h: 200 },
    { name: "Toilet", x: 320, y: 180, w: 70, h: 100 },
    { name: "Prayer Room", x: 390, y: 160, w: 150, h: 120 },
    { name: "Store 2", x: 390, y: 280, w: 150, h: 80 },
    { name: "Living Room", x: 40, y: 360, w: 320, h: 180 },
    { name: "Store 1", x: 470, y: 360, w: 70, h: 120 },
    { name: "Porch", x: 40, y: 540, w: 500, h: 140 },
  ];

  return (
    <svg viewBox="0 0 580 720" className="h-auto w-full rounded-3xl bg-white">
      <rect x="20" y="20" width="540" height="680" className="wall-outer" />

      {roomDefs.map((shape) => {
        const room = getRoom(shape.name);
        if (!room) return null;

        return (
          <g key={shape.name} onClick={() => onRoomClick(room)}>
            <rect
              x={shape.x}
              y={shape.y}
              width={shape.w}
              height={shape.h}
              fill={STATUS_COLORS[room.status]}
              className="room-shape"
              stroke="#1f2937"
              strokeWidth="2"
              rx="2"
            />
            <text
              x={shape.x + shape.w / 2}
              y={shape.y + shape.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-neutral-900 text-[14px] font-medium"
            >
              {shape.name}
            </text>
          </g>
        );
      })}

      <line x1="360" y1="360" x2="540" y2="360" className="wall-inner" />
      <line x1="360" y1="360" x2="360" y2="540" className="wall-inner" />
      <line x1="430" y1="360" x2="430" y2="540" className="arch-line" />
      <text x="400" y="455" textAnchor="middle" className="fill-neutral-500 text-[12px]">
        Stair
      </text>
    </svg>
  );
}